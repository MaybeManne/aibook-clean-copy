export interface Kernel {
  name: "identity" | "boxBlur" | "gaussian" | "sharpen" | "edges" | "custom";
  label: string;
  /** row-major size×size weights. For `edges` this is the Sobel-X pass (see `edges`). */
  weights: number[];
  size: number;
  /** normalizer the weighted sum is divided by (Σweights for an averaging kernel, else 1). */
  div: number;
  /** Sobel edge magnitude: run Sobel-X and Sobel-Y over luminance, output the gradient magnitude. */
  edges?: boolean;
}

export const SOBEL_X = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
export const SOBEL_Y = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

/** The five filters offered in the plug-and-try picker, in menu order (index === control value). */
export const KERNELS: Kernel[] = [
  { name: "identity", label: "Identity", size: 3, div: 1, weights: [0, 0, 0, 0, 1, 0, 0, 0, 0] },
  { name: "boxBlur", label: "Box blur", size: 3, div: 9, weights: [1, 1, 1, 1, 1, 1, 1, 1, 1] },
  { name: "gaussian", label: "Gaussian", size: 3, div: 16, weights: [1, 2, 1, 2, 4, 2, 1, 2, 1] },
  { name: "sharpen", label: "Sharpen", size: 3, div: 1, weights: [0, -1, 0, -1, 5, -1, 0, -1, 0] },
  { name: "edges", label: "Edges (Sobel)", size: 3, div: 1, weights: SOBEL_X, edges: true },
];

/** Sum of a kernel's weights divided by its normalizer — 1 for an averaging/identity/sharpen
 *  kernel (preserves brightness), 0 for a gradient (Sobel) kernel. Used by the headless check. */
export function kernelGain(k: Kernel): number {
  const s = k.weights.reduce((a, b) => a + b, 0);
  return s / k.div;
}

export interface EditorPreset {
  label: string;
  values: number[];
  div: number;
}

/** Presets offered in the image-filters kernel EDITOR (the `matrix` control), in menu order.
 *  Distinct from KERNELS: here Sobel-X is the DIRECTIONAL linear gradient (div 1, signed
 *  output), not the magnitude path `KERNELS[edges]` runs, so the editor stays a uniformly
 *  linear 3×3+divisor convolution. Shared by lesson.ts (the control's `presets`) and
 *  convolve2d.ts (the live custom kernel's label). */
export const EDITOR_PRESETS: EditorPreset[] = [
  { label: "Identity", values: [0, 0, 0, 0, 1, 0, 0, 0, 0], div: 1 },
  { label: "Box blur", values: [1, 1, 1, 1, 1, 1, 1, 1, 1], div: 9 },
  { label: "Gaussian", values: [1, 2, 1, 2, 4, 2, 1, 2, 1], div: 16 },
  { label: "Sharpen", values: [0, -1, 0, -1, 5, -1, 0, -1, 0], div: 1 },
  { label: "Sobel-X", values: SOBEL_X, div: 1 },
];

/** The preset label whose weights + divisor match exactly, else "Custom". This is the SAME
 *  exact-vector compare the matrix control uses (components/index.tsx), so the viz's canvas
 *  label and the control's status label stay in lockstep — loading "Gaussian" never reads
 *  "Custom" on the picture. */
export function matchPreset(weights: number[], div: number): string {
  const hit = EDITOR_PRESETS.find(
    (p) => p.div === div && p.values.length === weights.length && p.values.every((v, i) => v === weights[i]),
  );
  return hit ? hit.label : "Custom";
}

const clampByte = (v: number): number => (v < 0 ? 0 : v > 255 ? 255 : v);
const clampIdx = (v: number, hi: number): number => (v < 0 ? 0 : v > hi ? hi : v);
const lum = (r: number, g: number, b: number): number => 0.299 * r + 0.587 * g + 0.114 * b;

/**
 * Convolve an RGBA image with a kernel, edge-clamped (border pixels extend). Returns a NEW
 * buffer; the source is not mutated. Alpha is carried through opaque. For `edges` the image is
 * reduced to luminance and the Sobel gradient magnitude is written to R=G=B (bright edges on black).
 */
export function convolve2d(src: Uint8ClampedArray, w: number, h: number, k: Kernel): Uint8ClampedArray {
  const out = new Uint8ClampedArray(src.length);
  const off = (k.size - 1) >> 1;

  if (k.edges) {
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let gx = 0;
        let gy = 0;
        for (let ky = 0; ky < k.size; ky++) {
          for (let kx = 0; kx < k.size; kx++) {
            const sx = clampIdx(x + kx - off, w - 1);
            const sy = clampIdx(y + ky - off, h - 1);
            const si = (sy * w + sx) * 4;
            const L = lum(src[si]!, src[si + 1]!, src[si + 2]!);
            const wi = ky * k.size + kx;
            gx += SOBEL_X[wi]! * L;
            gy += SOBEL_Y[wi]! * L;
          }
        }
        const mag = clampByte(Math.hypot(gx, gy));
        const di = (y * w + x) * 4;
        out[di] = mag;
        out[di + 1] = mag;
        out[di + 2] = mag;
        out[di + 3] = 255;
      }
    }
    return out;
  }

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      for (let ky = 0; ky < k.size; ky++) {
        for (let kx = 0; kx < k.size; kx++) {
          const sx = clampIdx(x + kx - off, w - 1);
          const sy = clampIdx(y + ky - off, h - 1);
          const si = (sy * w + sx) * 4;
          const wt = k.weights[ky * k.size + kx]!;
          r += wt * src[si]!;
          g += wt * src[si + 1]!;
          b += wt * src[si + 2]!;
        }
      }
      const di = (y * w + x) * 4;
      out[di] = clampByte(r / k.div);
      out[di + 1] = clampByte(g / k.div);
      out[di + 2] = clampByte(b / k.div);
      out[di + 3] = src[di + 3]!;
    }
  }
  return out;
}

/**
 * A small hand-built pixel-art sprite (a smiley), generated in code so the lesson needs no image
 * asset. Light background, so blur softens the outline visibly and Sobel traces the ring.
 * Returns an RGBA buffer.
 */
export function pixelArtSprite(): { w: number; h: number; pixels: Uint8ClampedArray } {
  const S = 16;
  const px = new Uint8ClampedArray(S * S * 4);
  const bg: [number, number, number] = [232, 236, 242];
  const face: [number, number, number] = [250, 205, 60];
  const ink: [number, number, number] = [40, 40, 52];
  const set = (x: number, y: number, c: [number, number, number]): void => {
    const i = (y * S + x) * 4;
    px[i] = c[0];
    px[i + 1] = c[1];
    px[i + 2] = c[2];
    px[i + 3] = 255;
  };
  const cx = 7.5;
  const cy = 7.5;
  const r = 6.6;
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const d = Math.hypot(x - cx, y - cy);
      set(x, y, d <= r - 1 ? face : d <= r ? ink : bg);
    }
  }
  for (const [x, y] of [[5, 6], [6, 6], [9, 6], [10, 6]] as const) set(x, y, ink);
  for (const [x, y] of [[4, 9], [5, 10], [6, 11], [7, 11], [8, 11], [9, 11], [10, 10], [11, 9]] as const) set(x, y, ink);
  return { w: S, h: S, pixels: px };
}
