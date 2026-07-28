// A coordinate frame — the linchpin of the figure vocabulary (ManimCE's Axes.coords_to_point).
// Data coords → stage pixels. Manim's scene space is y-UP (math convention); our renderer emits
// SVG, whose y grows DOWN — so c2p flips y (`yMax - dy`). That flip is the whole Manim→SVG
// translation: authors think in y-up math space, the frame maps it to y-down pixel space.
// plot/area/riemannRectangles/dots all route through this. Pure data — no DOM, no clock.

export interface FrameSpec {
  /** Top-left of the frame's box on the stage (default 0,0). */
  x?: number;
  y?: number;
  width: number;
  height: number;
  xRange: [number, number];
  yRange: [number, number];
}

export interface Frame {
  x: number;
  y: number;
  width: number;
  height: number;
  xRange: [number, number];
  yRange: [number, number];
  sx: number; // px per x-unit
  sy: number; // px per y-unit
  /** data (x,y) → stage pixel (px,py). Y is flipped. */
  c2p(x: number, y: number): { x: number; y: number };
  /** stage pixel → data coords (inverse of c2p). */
  p2c(px: number, py: number): { x: number; y: number };
}

export function makeFrame(spec: FrameSpec): Frame {
  const x = spec.x ?? 0;
  const y = spec.y ?? 0;
  const { width, height } = spec;
  const [xMin, xMax] = spec.xRange;
  const [yMin, yMax] = spec.yRange;
  const sx = width / (xMax - xMin);
  const sy = height / (yMax - yMin);
  return {
    x,
    y,
    width,
    height,
    xRange: spec.xRange,
    yRange: spec.yRange,
    sx,
    sy,
    c2p(dx, dy) {
      return { x: x + (dx - xMin) * sx, y: y + (yMax - dy) * sy };
    },
    p2c(px, py) {
      return { x: (px - x) / sx + xMin, y: yMax - (py - y) / sy };
    },
  };
}
