import { easings } from "@lessonstudio/timeline";
import { registerViz, type VizApi, type VizHandle, type VizProps } from "@lessonstudio/web";
import { KERNELS, convolve2d, matchPreset, pixelArtSprite, type Kernel } from "./kernels.js";

export const CONV2D_VIZ = "conv2d";

const PHOTOS = ["/img/einstein.jpg", "/img/city.jpg", "/img/coffee.jpg"];
const MAXDIM = 200;

export interface Conv2dProps {
  image?: number;
  filter?: number;
  zoom?: number;
  mode?: "closeup" | "compare";
  sweep?: number;
  showKernel?: boolean;
  kx?: number;
  ky?: number;
  kdiv?: number;
  k0?: number; k1?: number; k2?: number; k3?: number; k4?: number;
  k5?: number; k6?: number; k7?: number; k8?: number;
}
type Resolved = {
  image: number; filter: number; zoom: number; mode: "closeup" | "compare"; sweep: number;
  showKernel: boolean; custom: boolean; weights: number[]; div: number; kx: number; ky: number;
};

const DEFAULTS: Resolved = {
  image: 0, filter: 0, zoom: 1, mode: "compare", sweep: 1, showKernel: false,
  custom: false, weights: [], div: 1, kx: NaN, ky: NaN,
};

function resolve(props: VizProps): Resolved {
  const num = (k: keyof Conv2dProps, d: number): number => {
    const n = Number(props[k as string]);
    return Number.isFinite(n) ? n : d;
  };
  const image = Math.max(0, Math.min(PHOTOS.length, Math.round(num("image", DEFAULTS.image))));
  const filter = Math.max(0, Math.min(KERNELS.length - 1, Math.round(num("filter", DEFAULTS.filter))));
  const zoom = Math.max(1, Math.min(8, num("zoom", DEFAULTS.zoom)));
  const mode = props.mode === "closeup" ? "closeup" : "compare";
  let s = num("sweep", DEFAULTS.sweep);
  if (s > 1) s /= 100;
  const sweep = Math.max(0, Math.min(1, s));
  const showKernel = props.showKernel === undefined ? mode === "closeup" : !!props.showKernel;
  const custom = Number.isFinite(Number(props.k0));
  const weights = custom ? Array.from({ length: 9 }, (_, i) => num(("k" + i) as keyof Conv2dProps, 0)) : [];
  const kdiv = num("kdiv", 1);
  const div = custom && kdiv !== 0 ? kdiv : 1;
  const kx = num("kx", DEFAULTS.kx);
  const ky = num("ky", DEFAULTS.ky);
  return { image, filter, zoom, mode, sweep, showKernel, custom, weights, div, kx, ky };
}

const COL = {
  bg: "#0f0e17", panel: "#1a1930", text: "#e5e7eb", muted: "#8b93a7",
  accent: "#fbbf24", grid: "rgba(255,255,255,0.10)", kfill: "rgba(251,191,36,0.16)",
};
const SANS = "ui-sans-serif, system-ui, sans-serif";
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";
const EASE = easings.smooth;
const TWEEN_MS = 900;

function scalar(initial: number): { set(to: number, now: number): void; at(now: number): number } {
  let from = initial, to = initial, start = -1;
  return {
    set(next, now) {
      if (next === to) return;
      from = this.at(now);
      to = next;
      start = now;
    },
    at(now) {
      if (start < 0 || now >= start + TWEEN_MS) return to;
      return from + (to - from) * EASE((now - start) / TWEEN_MS);
    },
  };
}

interface Src { w: number; h: number; pixels: Uint8ClampedArray }

function weightLabel(k: Kernel, i: number): string {
  const w = k.weights[i] ?? 0;
  return k.div > 1 ? `${w}/${k.div}` : `${w}`;
}

function buildCustom(r: Resolved): Kernel {
  return { name: "custom", label: matchPreset(r.weights, r.div), size: 3, weights: r.weights, div: r.div };
}

function toImageData(px: Uint8ClampedArray, w: number, h: number): ImageData {
  const id = new ImageData(w, h);
  id.data.set(px);
  return id;
}

function conv2dFactory(el: HTMLElement, initial: VizProps, api: VizApi): VizHandle {
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "width:100%;height:100%;display:block;border-radius:12px";
  el.style.cssText = "width:100%;height:100%;min-height:340px";
  el.appendChild(canvas);
  const ctx = canvas.getContext("2d")!;
  const scratch = document.createElement("canvas");
  const sctx = scratch.getContext("2d")!;

  const sources = new Map<number, Src>();
  const loading = new Set<number>();
  const failed = new Set<number>();
  sources.set(0, pixelArtSprite());

  const loadPhoto = (index: number): void => {
    if (index === 0 || sources.has(index) || loading.has(index) || failed.has(index)) return;
    loading.add(index);
    const img = new Image();
    img.onload = (): void => {
      const scale = Math.min(1, MAXDIM / Math.max(img.width, img.height));
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      scratch.width = w;
      scratch.height = h;
      sctx.clearRect(0, 0, w, h);
      sctx.drawImage(img, 0, 0, w, h);
      sources.set(index, { w, h, pixels: sctx.getImageData(0, 0, w, h).data });
      loading.delete(index);
      outKey = "";
    };
    img.onerror = (): void => {
      loading.delete(index);
      failed.add(index);
    };
    img.src = PHOTOS[index - 1]!;
  };

  const sourceFor = (index: number): Src | null => {
    const s = sources.get(index);
    if (s) return s;
    loadPhoto(index);
    return null;
  };

  let outKey = "";
  let outData: ImageData | null = null;
  const ensureOutput = (image: number, k: Kernel, key: string): { src: Src; out: ImageData } | null => {
    const src = sourceFor(image);
    if (!src) return null;
    if (key !== outKey || !outData) {
      const px = convolve2d(src.pixels, src.w, src.h, k);
      outData = toImageData(px, src.w, src.h);
      outKey = key;
    }
    return { src, out: outData };
  };

  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  const blit = (img: ImageData, dx: number, dy: number, dw: number, dh: number, smooth: boolean): void => {
    scratch.width = img.width;
    scratch.height = img.height;
    sctx.putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = smooth;
    ctx.drawImage(scratch, dx, dy, dw, dh);
  };
  const text = (
    s: string, x: number, y: number,
    o: { size?: number; color?: string; align?: CanvasTextAlign; weight?: number; mono?: boolean } = {},
  ): void => {
    ctx.font = `${o.weight ?? 500} ${(o.size ?? 14) * dpr}px ${o.mono ? MONO : SANS}`;
    ctx.fillStyle = o.color ?? COL.text;
    ctx.textAlign = o.align ?? "left";
    ctx.textBaseline = "middle";
    ctx.fillText(s, x, y);
  };
  const fit = (iw: number, ih: number, bx: number, by: number, bw: number, bh: number, zoom: number) => {
    const s = Math.min(bw / iw, bh / ih) * zoom;
    const dw = iw * s, dh = ih * s;
    return { dx: bx + (bw - dw) / 2, dy: by + (bh - dh) / 2, dw, dh, s };
  };

  function drawMessage(msg: string): void {
    const W = canvas.width, H = canvas.height;
    ctx.fillStyle = COL.bg;
    ctx.fillRect(0, 0, W, H);
    text(msg, W / 2, H / 2, { color: COL.muted, align: "center", size: 15 });
  }

  function drawCompare(srcData: ImageData, out: ImageData, zoom: number, sweep: number, k: Kernel, image: number): void {
    const W = canvas.width, H = canvas.height;
    ctx.fillStyle = COL.bg;
    ctx.fillRect(0, 0, W, H);
    const pad = 14 * dpr;
    const gap = 16 * dpr;
    const top = 30 * dpr;
    const panelW = (W - pad * 2 - gap) / 2;
    const panelH = H - top - pad;
    const smooth = image !== 0;
    const draw = (data: ImageData, bx: number) => {
      const f = fit(data.width, data.height, bx, top, panelW, panelH, zoom);
      ctx.save();
      ctx.beginPath();
      ctx.rect(bx, top, panelW, panelH);
      ctx.clip();
      blit(data, f.dx, f.dy, f.dw, f.dh, smooth);
      ctx.restore();
      return f;
    };
    draw(srcData, pad);
    text("input", pad + 2 * dpr, top - 15 * dpr, { color: COL.muted, size: 12.5 });
    const rightX = pad + panelW + gap;
    draw(srcData, rightX);
    const revealW = panelW * sweep;
    if (revealW > 0.5) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(rightX, top, revealW, panelH);
      ctx.clip();
      const f = fit(out.width, out.height, rightX, top, panelW, panelH, zoom);
      blit(out, f.dx, f.dy, f.dw, f.dh, smooth);
      ctx.restore();
    }
    if (sweep > 0.001 && sweep < 0.999) {
      const lx = rightX + revealW;
      ctx.strokeStyle = COL.accent;
      ctx.lineWidth = 2 * dpr;
      ctx.beginPath();
      ctx.moveTo(lx, top);
      ctx.lineTo(lx, top + panelH);
      ctx.stroke();
    }
    text(k.label, rightX + 2 * dpr, top - 15 * dpr, { color: COL.accent, size: 12.5, weight: 600 });
  }

  function drawCloseup(srcData: ImageData, src: Src, out: ImageData, zoom: number, k: Kernel, now: number): void {
    const W = canvas.width, H = canvas.height;
    ctx.fillStyle = COL.bg;
    ctx.fillRect(0, 0, W, H);
    const pad = 16 * dpr;
    const gridW = W * 0.6;
    const gridH = H - pad * 2;
    const boxX = pad, boxY = pad, boxW = gridW - pad * 2, boxH = gridH;
    const sFit = Math.min(boxW / src.w, boxH / src.h);
    const ps = sFit * zoom;
    const ci = Number.isFinite(want.kx) ? Math.max(1, Math.min(src.w - 2, Math.round(want.kx))) : (src.w >> 1);
    const cj = Number.isFinite(want.ky) ? Math.max(1, Math.min(src.h - 2, Math.round(want.ky))) : (src.h >> 1);
    if (!cam) cam = { x: scalar(ci), y: scalar(cj) };
    if (!dragging) { cam.x.set(ci, now); cam.y.set(cj, now); }
    const camx = cam.x.at(now), camy = cam.y.at(now);
    const follow = zoom > 1.01;
    const ox = follow ? boxX + boxW / 2 - (camx + 0.5) * ps : boxX + (boxW - src.w * ps) / 2;
    const oy = follow ? boxY + boxH / 2 - (camy + 0.5) * ps : boxY + (boxH - src.h * ps) / 2;
    lastGeom = { ox, oy, ps, w: src.w, h: src.h };
    ctx.save();
    ctx.beginPath();
    ctx.rect(boxX, boxY, boxW, boxH);
    ctx.clip();
    blit(srcData, ox, oy, src.w * ps, src.h * ps, false);
    ctx.strokeStyle = COL.grid;
    ctx.lineWidth = 1;
    for (let i = 0; i <= src.w; i++) {
      const x = ox + i * ps;
      ctx.beginPath();
      ctx.moveTo(x, oy);
      ctx.lineTo(x, oy + src.h * ps);
      ctx.stroke();
    }
    for (let j = 0; j <= src.h; j++) {
      const y = oy + j * ps;
      ctx.beginPath();
      ctx.moveTo(ox, y);
      ctx.lineTo(ox + src.w * ps, y);
      ctx.stroke();
    }
    const kx = ox + (ci - 1) * ps;
    const ky = oy + (cj - 1) * ps;
    ctx.fillStyle = COL.kfill;
    ctx.fillRect(kx, ky, ps * 3, ps * 3);
    ctx.strokeStyle = COL.accent;
    ctx.lineWidth = 2.5 * dpr;
    ctx.strokeRect(kx, ky, ps * 3, ps * 3);
    if (ps > 22 * dpr) {
      for (let j = 0; j < 3; j++) {
        for (let i = 0; i < 3; i++) {
          text(weightLabel(k, j * 3 + i), kx + (i + 0.5) * ps, ky + (j + 0.5) * ps, {
            size: Math.min(15, ps / (3 * dpr)), color: COL.accent, align: "center", weight: 600, mono: true,
          });
        }
      }
    }
    ctx.restore();

    const rx = gridW + 8 * dpr;
    const rw = W - rx - pad;
    let ty = H * 0.28;
    text(k.label, rx, ty, { size: 16, weight: 700, color: COL.text });
    ty += 26 * dpr;
    text("weighted sum over", rx, ty, { size: 12.5, color: COL.muted });
    ty += 18 * dpr;
    text("the 3×3 neighbourhood", rx, ty, { size: 12.5, color: COL.muted });
    ty += 30 * dpr;
    const di = (cj * src.w + ci) * 4;
    const swatch = `rgb(${out.data[di]},${out.data[di + 1]},${out.data[di + 2]})`;
    const sw = Math.min(rw, 84 * dpr);
    ctx.fillStyle = swatch;
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 1.5 * dpr;
    ctx.fillRect(rx, ty, sw, sw);
    ctx.strokeRect(rx, ty, sw, sw);
    text("→ one output pixel", rx, ty + sw + 16 * dpr, { size: 12.5, color: COL.accent, weight: 600 });
  }

  const p0 = resolve(initial);
  const Z = { zoom: scalar(p0.zoom), sweep: scalar(p0.sweep) };
  let want: Resolved = p0;

  let lastGeom: { ox: number; oy: number; ps: number; w: number; h: number } | null = null;
  let dragging = false;
  let cam: { x: ReturnType<typeof scalar>; y: ReturnType<typeof scalar> } | null = null;

  function resize(): void {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = el.clientWidth || 480;
    const h = el.clientHeight || 360;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(el);

  const toCell = (clientX: number, clientY: number): { ci: number; cj: number } | null => {
    if (!lastGeom) return null;
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return null;
    const dx = (clientX - rect.left) * (canvas.width / rect.width);
    const dy = (clientY - rect.top) * (canvas.height / rect.height);
    const { ox, oy, ps, w, h } = lastGeom;
    const ci = Math.max(1, Math.min(w - 2, Math.floor((dx - ox) / ps)));
    const cj = Math.max(1, Math.min(h - 2, Math.floor((dy - oy) / ps)));
    return { ci, cj };
  };
  const place = (clientX: number, clientY: number): void => {
    const cell = toCell(clientX, clientY);
    if (!cell) return;
    if (cell.ci === Math.round(want.kx) && cell.cj === Math.round(want.ky)) return;
    api.send({ type: "demo.set", payload: { key: "kx", value: cell.ci } });
    api.send({ type: "demo.set", payload: { key: "ky", value: cell.cj } });
  };
  const onDown = (e: PointerEvent): void => {
    if (want.mode !== "closeup") return;
    dragging = true;
    try { canvas.setPointerCapture(e.pointerId); } catch { }
    place(e.clientX, e.clientY);
  };
  const onMove = (e: PointerEvent): void => {
    if (!dragging || want.mode !== "closeup") return;
    place(e.clientX, e.clientY);
  };
  const onUp = (e: PointerEvent): void => {
    dragging = false;
    try { canvas.releasePointerCapture(e.pointerId); } catch { }
  };
  const onWheel = (e: WheelEvent): void => {
    e.preventDefault();
    const now = performance.now();
    const next = Math.max(1, Math.min(8, Z.zoom.at(now) * (e.deltaY < 0 ? 1.15 : 1 / 1.15)));
    const rounded = Math.round(next * 100) / 100;
    Z.zoom.set(rounded, now);
    api.send({ type: "demo.set", payload: { key: "zoom", value: rounded } });
  };
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);
  canvas.addEventListener("wheel", onWheel, { passive: false });
  canvas.style.touchAction = "none";

  function frame(now: number): void {
    const k = want.custom ? buildCustom(want) : KERNELS[want.filter]!;
    const key = want.custom ? `${want.image}:c:${want.weights.join(",")}/${want.div}` : `${want.image}:${want.filter}`;
    const res = ensureOutput(want.image, k, key);
    if (!res) {
      drawMessage(failed.has(want.image) ? "image unavailable" : "loading image…");
    } else {
      const srcData = toImageData(res.src.pixels, res.src.w, res.src.h);
      const zoom = Z.zoom.at(now);
      const sweep = Z.sweep.at(now);
      if (want.mode === "closeup") drawCloseup(srcData, res.src, res.out, zoom, k, now);
      else drawCompare(srcData, res.out, zoom, sweep, k, want.image);
    }
    raf = requestAnimationFrame(frame);
  }
  let raf = requestAnimationFrame(frame);

  return {
    update(next: VizProps): void {
      const now = performance.now();
      const p = resolve(next);
      Z.zoom.set(p.zoom, now);
      Z.sweep.set(p.sweep, now);
      want = p;
    },
    poster(): string | null {
      try {
        return canvas.toDataURL("image/png");
      } catch {
        return null;
      }
    },
    destroy(): void {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("wheel", onWheel);
      el.innerHTML = "";
    },
  };
}

registerViz(CONV2D_VIZ, conv2dFactory);
