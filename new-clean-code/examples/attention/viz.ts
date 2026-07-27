// The `attention` visualization (canvas, browser-only via registerViz). A bipartite
// beam diagram in the BertViz / transformer-explainer idiom with the llm-viz glow:
// the focused QUERY token (bottom row) sends a glowing beam up to every KEY token
// (top row); beam width + opacity = the softmax attention weight. The learner clicks
// a query, drags the temperature, flips the head — and feels focus sharpen or blur.
//
// Seams (docs/VISION.md): INBOUND props (focus/temperature/positional) drive the
// beams; OUTBOUND VizApi.send — clicking a query commits `demo.set {focus}`, and
// blurring attention past a threshold emits `signal.viz.uniform` once (the tutor's
// real-time observation hook). Camera/animation phase stay ephemeral, in the viz.
import { registerViz, type VizApi, type VizHandle, type VizProps } from "@lessonkit/render-web";
import { attentionRow, headOf, peakedness, sentenceTokens, SENTENCES } from "./model.js";

const C = {
  bg: "#0b0e1a", fg: "#eef0ff", muted: "#9aa0bf", pill: "#161b30", pillBorder: "#2a3155",
  beam: "#818cf8", beamHot: "#c4b5fd", focusRing: "#34d399", warn: "#f59e0b",
  agent: "#fbbf24", // the tutor's pointer/annotation colour — distinct from learner green + beam violet
};

registerViz("attention", (el: HTMLElement, initial: VizProps, api: VizApi): VizHandle => {
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "width:100%;height:auto;display:block;cursor:pointer;touch-action:manipulation";
  el.appendChild(canvas);
  const ctx = canvas.getContext("2d")!;

  let props: VizProps = { ...initial };
  let W = 640, H = 420;
  let phase = 0;
  let emittedUniform: string | null = null;
  let hitBoxes: Array<{ x: number; y: number; w: number; h: number; i: number }> = [];

  const num = (v: unknown, d: number): number => (typeof v === "number" && Number.isFinite(v) ? v : d);
  // Which sentence from the palette to render (default 0 = the lesson's original).
  // The agent can author a beat that sets `props.sentence` to show a different one.
  const sentence = () => Math.max(0, Math.min(SENTENCES.length - 1, Math.round(num(props.sentence, 0))));
  const toks = () => sentenceTokens(sentence());
  const query = () => Math.max(0, Math.min(toks().length - 1, Math.round(num(props.focus, 4))));
  const temp = () => num(props.temperature, 0.6);
  const head = () => headOf(!!props.positional);
  const cfgKey = () => `${sentence()}|${head()}|${query()}|${temp().toFixed(2)}`;
  const clampTok = (i: number) => Math.max(0, Math.min(toks().length - 1, Math.round(i)));

  // ── the AGENT's workspace props (written via `workspace.set`): point, write, zoom ──
  const highlightIndices = (): number[] => {
    const h = props.highlight;
    if (typeof h === "number" && Number.isFinite(h)) return [clampTok(h)];
    if (Array.isArray(h)) return h.filter((x): x is number => typeof x === "number" && Number.isFinite(x)).map(clampTok);
    return [];
  };
  const annotation = (): string => (typeof props.annotation === "string" ? props.annotation : "");
  /** Camera: a zoom `z` about the pivot token (`camera.focus`, else the query). */
  const cam = (): { z: number; px: number; py: number } => {
    const c = props.camera as { zoom?: number; focus?: number } | undefined;
    const z = c && typeof c.zoom === "number" && Number.isFinite(c.zoom) ? Math.max(0.5, Math.min(3, c.zoom)) : 1;
    const f = c && typeof c.focus === "number" ? clampTok(c.focus) : query();
    return { z, px: colX(f), py: (TOP_Y() + BOT_Y()) / 2 };
  };

  function resize(): void {
    W = Math.max(360, el.clientWidth || 640);
    H = Math.round(W * 0.62);
    const dpr = Math.min(2, (globalThis.devicePixelRatio as number) || 1);
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  const colX = (i: number): number => {
    const pad = W * 0.09;
    return pad + (i * (W - 2 * pad)) / (toks().length - 1);
  };
  const TOP_Y = () => H * 0.26;
  const BOT_Y = () => H * 0.74;

  function pill(x: number, y: number, label: string, opts: { focus?: boolean; hot?: number }): { w: number; h: number } {
    ctx.font = "600 15px ui-sans-serif, system-ui";
    const tw = ctx.measureText(label).width;
    const w = tw + 22, h = 30;
    const left = x - w / 2, top = y - h / 2;
    ctx.beginPath();
    if (typeof (ctx as { roundRect?: unknown }).roundRect === "function") ctx.roundRect(left, top, w, h, 9);
    else ctx.rect(left, top, w, h);
    ctx.fillStyle = C.pill;
    ctx.fill();
    ctx.lineWidth = opts.focus ? 2.5 : 1.5;
    ctx.strokeStyle = opts.focus ? C.focusRing : opts.hot ? C.beamHot : C.pillBorder;
    if (opts.hot) { ctx.shadowColor = C.beamHot; ctx.shadowBlur = 10 * opts.hot; }
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = opts.focus ? C.focusRing : C.fg;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(label, x, y + 1);
    return { w, h };
  }

  /** A pulsing ring the agent draws around a token it's pointing at (both rows). */
  function ring(x: number, y: number): void {
    const pulse = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(phase / 14));
    ctx.beginPath();
    ctx.ellipse(x, y, 32, 21, 0, 0, Math.PI * 2);
    ctx.strokeStyle = C.agent;
    ctx.lineWidth = 2.5;
    ctx.globalAlpha = pulse;
    ctx.shadowColor = C.agent; ctx.shadowBlur = 16;
    ctx.stroke();
    ctx.shadowBlur = 0; ctx.globalAlpha = 1;
  }

  /** A fixed callout (unzoomed overlay) — the tutor "writing on" the diagram. */
  function drawAnnotation(msg: string): void {
    ctx.font = "600 14px ui-sans-serif, system-ui";
    const label = `✎ ${msg}`;
    const w = Math.min(W - 32, ctx.measureText(label).width + 26), h = 30;
    const x = W / 2 - w / 2, y = H * 0.085;
    ctx.beginPath();
    if (typeof (ctx as { roundRect?: unknown }).roundRect === "function") ctx.roundRect(x, y, w, h, 8);
    else ctx.rect(x, y, w, h);
    ctx.fillStyle = "rgba(251,191,36,0.14)";
    ctx.fill();
    ctx.lineWidth = 1.5; ctx.strokeStyle = C.agent; ctx.stroke();
    ctx.fillStyle = C.agent;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(label, W / 2, y + h / 2 + 1, w - 18);
  }

  function draw(): void {
    ctx.clearRect(0, 0, W, H);
    const q = query();
    const s = sentence();
    const T = toks();
    const row = attentionRow(head(), q, temp(), s);
    const topY = TOP_Y(), botY = BOT_Y();
    const shimmer = 0.85 + 0.15 * Math.sin(phase / 22);

    // Camera: zoom the diagram content (beams + pills + rings) about the pivot token.
    // The HUD and annotation are drawn AFTER restore, so they stay fixed overlays.
    const { z, px, py } = cam();
    ctx.save();
    if (z !== 1) { ctx.translate(px, py); ctx.scale(z, z); ctx.translate(-px, -py); }

    // Beams (weakest first so the strongest render on top).
    const order = row.map((w, j) => ({ w, j })).sort((a, b) => a.w - b.w);
    for (const { w, j } of order) {
      if (j === q || w < 0.005) continue;
      const x0 = colX(q), y0 = botY - 16, x1 = colX(j), y1 = topY + 16;
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2 - 40;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.quadraticCurveTo(cx, cy, x1, y1);
      ctx.lineWidth = 1 + w * 16;
      ctx.strokeStyle = w > 0.4 ? C.beamHot : C.beam;
      ctx.globalAlpha = (0.1 + w * 0.85) * shimmer;
      if (w > 0.4) { ctx.shadowColor = C.beamHot; ctx.shadowBlur = 14; }
      ctx.stroke();
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    }

    // Key row (top) — hot-ness = weight.
    T.forEach((tok, j) => pill(colX(j), topY, tok, { hot: j === q ? 0 : row[j]! }));

    // Query row (bottom) — the focused one is ringed; record hit boxes.
    hitBoxes = [];
    T.forEach((tok, i) => {
      const size = pill(colX(i), botY, tok, { focus: i === q });
      hitBoxes.push({ x: colX(i) - size.w / 2, y: botY - size.h / 2, w: size.w, h: size.h, i });
    });

    // Agent's pointer: pulsing rings on the tokens it's calling attention to (both rows).
    for (const j of highlightIndices()) { ring(colX(j), topY); ring(colX(j), botY); }

    ctx.restore(); // end camera transform — HUD + annotation are fixed overlays below

    // HUD.
    const peak = peakedness(head(), q, temp(), s);
    ctx.textAlign = "left"; ctx.textBaseline = "top";
    ctx.font = "13px ui-monospace, monospace";
    ctx.fillStyle = C.muted;
    ctx.fillText(`head: ${head()}    τ = ${temp().toFixed(2)}`, 14, 12);
    const top = row.map((w, j) => ({ w, j })).filter((e) => e.j !== q).sort((a, b) => b.w - a.w)[0];
    if (top) {
      ctx.fillStyle = peak < 0.34 ? C.warn : C.beamHot;
      ctx.fillText(`“${T[q]}” → “${T[top.j]}”  ${top.w.toFixed(2)}${peak < 0.34 ? "   (attention is spreading out)" : ""}`, 14, 30);
    }
    ctx.fillStyle = C.muted; ctx.font = "12px ui-sans-serif, system-ui";
    ctx.textAlign = "center";
    ctx.fillText("click a token on the lower row to focus it", W / 2, H - 20);

    // Tutor's on-canvas note (fixed overlay).
    const note = annotation();
    if (note) drawAnnotation(note);
  }

  function recompute(): void {
    // Edge-triggered: emit once when the focused query's attention goes uniform.
    const key = cfgKey();
    if (peakedness(head(), query(), temp(), sentence()) < 0.3) {
      if (emittedUniform !== key) { emittedUniform = key; api.send({ type: "signal.viz.uniform", payload: { temperature: temp() } }); }
    } else {
      emittedUniform = null;
    }
  }

  const onDown = (e: PointerEvent): void => {
    const r = canvas.getBoundingClientRect();
    let x = ((e.clientX - r.left) / r.width) * W, y = ((e.clientY - r.top) / r.height) * H;
    // hitBoxes are in "world" space; invert the camera transform so clicks land right under zoom.
    const { z, px, py } = cam();
    if (z !== 1) { x = px + (x - px) / z; y = py + (y - py) / z; }
    const hit = hitBoxes.find((b) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h);
    if (hit && hit.i !== query()) {
      props = { ...props, focus: hit.i };
      recompute();
      api.send({ type: "demo.set", payload: { key: "focus", value: hit.i } }); // → blackboard, replayable
      draw();
    }
  };
  canvas.addEventListener("pointerdown", onDown);

  let raf = 0;
  const tick = (): void => { phase += 1; draw(); raf = requestAnimationFrame(tick); };
  const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
  ro?.observe(el);
  recompute(); resize();
  raf = requestAnimationFrame(tick);

  return {
    update(next: VizProps): void {
      const before = cfgKey();
      props = { ...props, ...next };
      if (cfgKey() !== before) recompute();
      draw();
    },
    destroy(): void {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      el.innerHTML = "";
    },
  };
});
