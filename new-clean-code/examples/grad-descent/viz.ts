// The `grad-descent` visualization: a 2.5D loss surface the learner plays on.
// Registered via registerViz (canvas — browser only). Borrows the dark, glowing
// perspective aesthetic of bbycroft/llm-viz.
//
// Seams it exercises (see docs/VISION.md):
//   • INBOUND props  — lr / x0 / y0 / surface arrive from the blackboard (sliders +
//     defaults), redraw the surface + rerun gradient descent live.
//   • OUTBOUND VizApi.send —
//       – dragging the start point commits `demo.set {x0}` / `demo.set {y0}` on
//         pointer-UP (once per drag, so it never floods history);
//       – driving α past the stability edge emits `signal.viz.diverged` ONCE
//         (edge-triggered) — the tutor's real-time observation hook.
//   • SEMANTIC vs EPHEMERAL — lr/start/outcome go to the session; the rolling-ball
//     animation phase lives only here and is never sent.
import { registerViz, type VizApi, type VizHandle, type VizProps } from "@lessonkit/render-web";

// Palette mirrors defaultTheme (a registered viz gets no Theme — a "viz theme" is
// future work, part of templating the visual language).
const C = {
  bg: "#0b0e1a", fg: "#eef0ff", muted: "#9aa0bf", grid: "#2a3155",
  low: "#818cf8", high: "#f59e0b", path: "#34d399", diverge: "#f87171",
};

const D = 3.6; // domain half-width: x,y ∈ [-D, D]
const THETA = Math.PI / 6; // iso pitch (30°)
const COS = Math.cos(THETA), SIN = Math.sin(THETA);

type Surface = (x: number, y: number) => number;
const SURFACES: Record<string, Surface> = {
  // Elliptical bowl: gentle in x, steep in y → GD in y diverges once α·(2·1.0) > 2,
  // i.e. α > 1.0. That stability edge sits inside the slider range [0.05, 1.6].
  bowl: (x, y) => 0.18 * x * x + 1.0 * y * y,
  // Curved ravine: a wavy valley floor — steep across, gentle along. One global α
  // is a poor fit (the challenge beat).
  ravine: (x, y) => {
    const floor = 0.9 * Math.sin(0.8 * x);
    return 0.05 * x * x + 1.4 * (y - floor) * (y - floor);
  },
};

function numGrad(f: Surface, x: number, y: number): [number, number] {
  const h = 1e-3;
  return [(f(x + h, y) - f(x - h, y)) / (2 * h), (f(x, y + h) - f(x, y - h)) / (2 * h)];
}

interface Run { pts: Array<[number, number]>; diverged: boolean; }
function descend(f: Surface, x0: number, y0: number, lr: number): Run {
  const pts: Array<[number, number]> = [[x0, y0]];
  let x = x0, y = y0, diverged = false;
  for (let i = 0; i < 90; i++) {
    const [gx, gy] = numGrad(f, x, y);
    x -= lr * gx; y -= lr * gy;
    if (!Number.isFinite(x) || !Number.isFinite(y) || Math.abs(x) > 3 * D || Math.abs(y) > 3 * D) {
      diverged = true; break;
    }
    pts.push([x, y]);
  }
  return { pts, diverged };
}

function lerpHex(a: string, b: string, p: number): string {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ar = (pa >> 16) & 255, ag = (pa >> 8) & 255, ab = pa & 255;
  const br = (pb >> 16) & 255, bg = (pb >> 8) & 255, bb = pb & 255;
  const r = Math.round(ar + (br - ar) * p), g = Math.round(ag + (bg - ag) * p), bl = Math.round(ab + (bb - ab) * p);
  return `rgb(${r},${g},${bl})`;
}

registerViz("grad-descent", (el: HTMLElement, initial: VizProps, api: VizApi): VizHandle => {
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "width:100%;height:auto;display:block;cursor:grab;touch-action:none";
  el.appendChild(canvas);
  const ctx = canvas.getContext("2d")!;

  // ── live state (ephemeral) ────────────────────────────────────────────────
  let props: VizProps = { ...initial };
  let W = 560, H = 400, scale = 60, cx = 280, cy = 150;
  let run: Run = { pts: [[0, 0]], diverged: false };
  let surfName = "bowl", f: Surface = SURFACES.bowl!;
  let zmin = 0, zmax = 1;
  let dragging = false, dragged = false, phase = 0;
  let emittedFor: string | null = null; // divergence debounce key

  const num = (v: unknown, d: number): number => (typeof v === "number" && Number.isFinite(v) ? v : d);
  const configKey = () => `${surfName}|${num(props.lr, 0.3)}|${num(props.x0, 0)}|${num(props.y0, 0)}`;

  function resize(): void {
    W = Math.max(320, el.clientWidth || 560);
    H = Math.round(W * 0.72);
    const dpr = Math.min(2, (globalThis.devicePixelRatio as number) || 1);
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    scale = W / (2.4 * D); cx = W / 2; cy = H * 0.34;
    draw();
  }

  // world (x,y,z) → screen; z omitted (ground) for hit-testing.
  const project = (x: number, y: number, z = 0): [number, number] => [
    cx + (x - y) * COS * scale,
    cy + ((x + y) * SIN - z * 0.5) * scale,
  ];
  // inverse on the ground plane (z=0), for pointer → domain.
  function unproject(px: number, py: number): [number, number] {
    const u = (px - cx) / (COS * scale); // x - y
    const v = (py - cy) / (SIN * scale); // x + y
    return [Math.max(-D, Math.min(D, (u + v) / 2)), Math.max(-D, Math.min(D, (v - u) / 2))];
  }

  function recompute(): void {
    surfName = String(props.surface ?? "bowl");
    f = SURFACES[surfName] ?? SURFACES.bowl!;
    // height range over the grid, for shading
    zmin = Infinity; zmax = -Infinity;
    for (let x = -D; x <= D + 1e-9; x += D / 8) for (let y = -D; y <= D + 1e-9; y += D / 8) {
      const z = f(x, y); if (z < zmin) zmin = z; if (z > zmax) zmax = z;
    }
    run = descend(f, num(props.x0, -2.8), num(props.y0, 2.6), num(props.lr, 0.3));
    phase = 0;

    // Edge-triggered semantic signal: emit once per divergent config.
    const key = configKey();
    if (run.diverged && emittedFor !== key) {
      emittedFor = key;
      api.send({ type: "signal.viz.diverged", payload: { lr: num(props.lr, 0.3) } });
    }
    if (!run.diverged) emittedFor = null;
  }

  const N = 28; // mesh resolution
  function draw(): void {
    ctx.clearRect(0, 0, W, H);
    const step = (2 * D) / N;

    // Surface mesh, painter's order: far (small x+y) first, near (large) last.
    const cells: Array<{ d: number; i: number; j: number }> = [];
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
      const x = -D + (i + 0.5) * step, y = -D + (j + 0.5) * step;
      cells.push({ d: x + y, i, j });
    }
    cells.sort((a, b) => a.d - b.d);
    const span = Math.max(1e-6, zmax - zmin);
    for (const { i, j } of cells) {
      const x = -D + i * step, y = -D + j * step;
      const p00 = project(x, y, f(x, y));
      const p10 = project(x + step, y, f(x + step, y));
      const p11 = project(x + step, y + step, f(x + step, y + step));
      const p01 = project(x, y + step, f(x, y + step));
      const zc = (f(x, y) + f(x + step, y + step)) / 2;
      const t = Math.min(1, Math.max(0, (zc - zmin) / span));
      ctx.beginPath();
      ctx.moveTo(p00[0], p00[1]); ctx.lineTo(p10[0], p10[1]); ctx.lineTo(p11[0], p11[1]); ctx.lineTo(p01[0], p01[1]); ctx.closePath();
      ctx.fillStyle = lerpHex(C.low, C.high, t);
      ctx.globalAlpha = 0.32 + 0.5 * t;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = C.grid; ctx.lineWidth = 0.5; ctx.stroke();
    }

    // Descent trajectory (glowing polyline).
    const diverged = run.diverged;
    ctx.strokeStyle = diverged ? C.diverge : C.path;
    ctx.lineWidth = 2.5; ctx.shadowColor = ctx.strokeStyle; ctx.shadowBlur = 12;
    ctx.beginPath();
    run.pts.forEach(([x, y], k) => {
      const [px, py] = project(x, y, f(x, y) + 0.04);
      k === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    });
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Start marker.
    const s0 = run.pts[0]!;
    const [sx, sy] = project(s0[0], s0[1], f(s0[0], s0[1]) + 0.04);
    ctx.fillStyle = C.fg; ctx.beginPath(); ctx.arc(sx, sy, 4, 0, 7); ctx.fill();

    // The rolling ball (ephemeral animation phase).
    if (run.pts.length > 1) {
      const fp = Math.min(run.pts.length - 1.0001, phase);
      const i0 = Math.floor(fp), fr = fp - i0;
      const a = run.pts[i0]!, b = run.pts[Math.min(run.pts.length - 1, i0 + 1)]!;
      const wx = a[0] + (b[0] - a[0]) * fr, wy = a[1] + (b[1] - a[1]) * fr;
      const [bx, by] = project(wx, wy, f(wx, wy) + 0.06);
      ctx.fillStyle = diverged ? C.diverge : C.path;
      ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 16;
      ctx.beginPath(); ctx.arc(bx, by, 6, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
    }

    // HUD.
    ctx.fillStyle = C.muted; ctx.font = "13px ui-monospace, monospace"; ctx.textBaseline = "top";
    ctx.fillText(`α = ${num(props.lr, 0.3).toFixed(2)}`, 14, 12);
    if (diverged) { ctx.fillStyle = C.diverge; ctx.fillText("diverged ✗ — steps overshoot", 14, 30); }
    else { ctx.fillStyle = C.path; ctx.fillText(`converged ✓ in ${run.pts.length} steps`, 14, 30); }
    ctx.fillStyle = C.muted; ctx.font = "12px ui-sans-serif, system-ui";
    ctx.fillText("drag to set the start point", 14, H - 24);
  }

  // ── pointer: drag the start point ────────────────────────────────────────
  const toLocal = (e: PointerEvent): [number, number] => {
    const r = canvas.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H];
  };
  const onDown = (e: PointerEvent): void => {
    dragging = true; dragged = false; canvas.style.cursor = "grabbing";
    canvas.setPointerCapture(e.pointerId); onMove(e);
  };
  const onMove = (e: PointerEvent): void => {
    if (!dragging) return;
    dragged = true;
    const [lx, ly] = toLocal(e);
    const [x, y] = unproject(lx, ly);
    props = { ...props, x0: x, y0: y }; // ephemeral live preview
    recompute(); draw();
  };
  const onUp = (e: PointerEvent): void => {
    canvas.style.cursor = "grab";
    if (dragging && dragged) {
      // COMMIT to the blackboard once per drag (not per move) — replayable, and
      // avoids flooding session history.
      const x = Math.round(num(props.x0, 0) * 100) / 100, y = Math.round(num(props.y0, 0) * 100) / 100;
      api.send({ type: "demo.set", payload: { key: "x0", value: x } });
      api.send({ type: "demo.set", payload: { key: "y0", value: y } });
    }
    dragging = false;
    try { canvas.releasePointerCapture(e.pointerId); } catch { /* ignore */ }
  };
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);

  // ── animation loop (own rAF; the beat is untimed) ───────────────────────────
  let raf = 0;
  const tick = (): void => {
    phase += 0.5;
    if (phase >= run.pts.length) phase = 0;
    draw();
    raf = requestAnimationFrame(tick);
  };

  const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
  ro?.observe(el);
  recompute(); resize();
  raf = requestAnimationFrame(tick);

  return {
    update(next: VizProps): void {
      const before = configKey();
      props = { ...props, ...next };
      if (configKey() !== before) recompute();
      draw();
    },
    destroy(): void {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      el.innerHTML = "";
    },
  };
});
