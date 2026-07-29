// THE ATTENTION LAYER — how a director's "look here" and "see this" become pixels.
//
// The protocol side (`lesson/direction`) speaks NORMALIZED 0..1 stage coordinates, and this
// file is the reason that was the right call: one implementation zooms and draws over an
// SVG figure, a Canvas2D viz and the WebGL apparatus alike, because it operates on the
// stage PANEL rather than asking the visual to cooperate. A viz that exposes its own real
// camera (conv2d's `zoom`, pinhole3d's props) is still reachable through `workspace` — this
// is the floor that works everywhere, not a replacement for it.
//
// Two components, deliberately separate:
//   • `FocusFrame` — a CSS transform on the panel's contents, eased, so a zoom reads as a
//     camera move rather than a cut. Nothing inside it knows it is being zoomed.
//   • `AnnotationLayer` — an absolutely-positioned SVG over the SAME transformed box, so
//     marks track the zoom instead of sliding off whatever they were pointing at.
//
// Both resolve normalized coords against the MEASURED panel size and draw in pixels. The
// alternative (a `viewBox="0 0 1 1"` with `preserveAspectRatio="none"`) is fewer lines but
// stretches a circle into an ellipse and a 1px stroke into a smear on any non-square panel
// — and a teacher who says "circle that" means a circle.

import * as React from "react";
import type { Annotation, FocusState, StagePoint, StageRect } from "@lessonstudio/lesson";
import type { Theme } from "@lessonstudio/template";

/** Ease matching the rest of the studio's motion: quick out, settled landing. */
const EASE = "cubic-bezier(0.22, 0.61, 0.36, 1)";
const DURATION_MS = 420;

/** Live pixel size of an element, tracked across resizes. `null` until first measurement. */
export function useElementSize<T extends HTMLElement>(): [React.MutableRefObject<T | null>, { w: number; h: number } | null] {
  const ref = React.useRef<T | null>(null);
  const [size, setSize] = React.useState<{ w: number; h: number } | null>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = (): void => {
      const r = el.getBoundingClientRect();
      setSize((prev) => (prev && Math.abs(prev.w - r.width) < 0.5 && Math.abs(prev.h - r.height) < 0.5 ? prev : { w: r.width, h: r.height }));
    };
    measure();
    // ResizeObserver is universal in the browsers this renderer targets; guarded anyway so
    // a jsdom/headless host without it renders unzoomed rather than throwing.
    const RO = (globalThis as { ResizeObserver?: typeof ResizeObserver }).ResizeObserver;
    if (!RO) return;
    const ro = new RO(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size];
}

/**
 * The transform that makes `rect` fill the panel: scale UNIFORMLY by 1/max(w,h) — so the
 * requested window is fully visible rather than cropped to the panel's aspect — and translate
 * its centre to the panel's centre. `transform-origin: 0 0` keeps the algebra honest:
 * a point at fraction p maps to p·s + t, and we want p ↦ (p − c)·s + ½.
 */
export function focusTransform(rect: StageRect | undefined): { transform: string; scale: number } {
  if (!rect) return { transform: "none", scale: 1 };
  const s = 1 / Math.max(rect.w, rect.h, 0.02);
  const tx = (0.5 - (rect.x + rect.w / 2) * s) * 100;
  const ty = (0.5 - (rect.y + rect.h / 2) * s) * 100;
  return { transform: `translate(${tx.toFixed(3)}%, ${ty.toFixed(3)}%) scale(${s.toFixed(4)})`, scale: s };
}

export interface FocusFrameProps {
  focus: FocusState | null;
  annotations: Annotation[];
  theme: Theme;
  children: React.ReactNode;
}

/**
 * Wrap a stage panel's contents so a director can zoom them and draw on them. With no focus
 * and no marks this is one plain `div` with `transform: none` — the un-directed lesson pays
 * a wrapper element and nothing else.
 *
 * The label (a teacher's caption for what we are looking at) is rendered OUTSIDE the
 * transform, pinned to the panel, because a caption that zooms is unreadable.
 */
export function FocusFrame({ focus, annotations, theme, children }: FocusFrameProps): React.ReactElement {
  const [ref, size] = useElementSize<HTMLDivElement>();
  const { transform, scale } = focusTransform(focus?.rect);
  return (
    <div ref={ref} style={{ position: "relative", width: "100%", height: "100%", minWidth: 0, minHeight: 0, overflow: "hidden" }}>
      <div
        // The director's camera state, readable from outside (the browser walk asserts a
        // teacher's zoom landed). Sniffing computed transforms across every div would work
        // today and break the first time the panel gains a wrapper.
        data-ls-focus={focus ? scale.toFixed(3) : "none"}
        data-ls-marks={annotations.length}
        style={{
          position: "absolute",
          inset: 0,
          transform,
          transformOrigin: "0 0",
          transition: `transform ${DURATION_MS}ms ${EASE}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
        {annotations.length && size ? <AnnotationLayer annotations={annotations} size={size} scale={scale} theme={theme} /> : null}
      </div>
      {focus?.label ? (
        <div
          style={{
            position: "absolute",
            left: theme.space(4),
            bottom: theme.space(4),
            padding: `${theme.space(1)} ${theme.space(3)}`,
            borderRadius: theme.radius,
            background: theme.color.surface,
            color: theme.color.accent,
            fontSize: theme.font.size.eyebrow,
            fontWeight: theme.font.weight.bold,
            letterSpacing: theme.font.letterSpacing,
            textTransform: "uppercase",
            pointerEvents: "none",
          }}
        >
          {focus.label}
        </div>
      ) : null}
    </div>
  );
}

export interface AnnotationLayerProps {
  annotations: Annotation[];
  size: { w: number; h: number };
  /** The enclosing focus scale, so strokes and text stay visually constant while zoomed. */
  scale: number;
  theme: Theme;
}

/**
 * Marks over the stage, in pixels resolved from normalized coords. `pointerEvents: none`
 * throughout — an annotation is something to look at, never something that eats a click on
 * the interactive visual underneath it.
 *
 * Stroke widths and font sizes are divided by the focus scale, so zooming 3× magnifies the
 * FIGURE without also tripling the thickness of the arrow pointing at it.
 */
export function AnnotationLayer({ annotations, size, scale, theme }: AnnotationLayerProps): React.ReactElement {
  const { w, h } = size;
  const px = (p: StagePoint): [number, number] => [p[0] * w, p[1] * h];
  const stroke = Math.max(0.75, 2 / scale);
  const font = Math.max(7, 13 / scale);
  const accent = theme.color.accent;
  const headId = "ls-annot-head";

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}
      aria-hidden="true"
    >
      <defs>
        {/* One marker, reused: `markerUnits="strokeWidth"` makes the head track the (already
            scale-corrected) stroke, so arrowheads stay proportionate at every zoom. */}
        <marker id={headId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse" markerUnits="strokeWidth">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke" />
        </marker>
      </defs>
      {annotations.map((a, i) => {
        const color = ("color" in a && a.color) || accent;
        const common = { stroke: color, strokeWidth: stroke, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
        switch (a.kind) {
          case "arrow": {
            const [x1, y1] = px(a.from);
            const [x2, y2] = px(a.to);
            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} {...common} markerEnd={`url(#${headId})`} />
                {a.label ? <Caption x={x2} y={y2} text={a.label} color={color} font={font} /> : null}
              </g>
            );
          }
          case "circle": {
            const [cx, cy] = px(a.at);
            // A radius in ONE normalized space over a rectangular panel has to pick an axis
            // or become an ellipse; the smaller dimension keeps a circle a circle and keeps
            // `r: 0.1` meaning "a tenth of the stage" in the direction that is scarcer.
            const r = a.r * Math.min(w, h);
            return (
              <g key={i}>
                <circle cx={cx} cy={cy} r={r} {...common} />
                {a.label ? <Caption x={cx} y={cy - r} text={a.label} color={color} font={font} anchor="middle" /> : null}
              </g>
            );
          }
          case "rect": {
            const r = a.rect;
            return (
              <g key={i}>
                <rect x={r.x * w} y={r.y * h} width={r.w * w} height={r.h * h} rx={Math.min(6 / scale, r.w * w * 0.2)} {...common} />
                {a.label ? <Caption x={r.x * w} y={r.y * h} text={a.label} color={color} font={font} /> : null}
              </g>
            );
          }
          case "label": {
            const [x, y] = px(a.at);
            return <Caption key={i} x={x} y={y} text={a.text} color={color} font={font} anchor="middle" />;
          }
          case "ink": {
            if (a.points.length < 2) return null;
            const d = a.points.map((p, j) => `${j === 0 ? "M" : "L"} ${(p[0] * w).toFixed(2)} ${(p[1] * h).toFixed(2)}`).join(" ");
            return <path key={i} d={d} {...common} />;
          }
          default:
            return null;
        }
      })}
    </svg>
  );
}

/** A mark's caption: a halo-stroked label, so it stays legible over a busy figure. */
function Caption({
  x,
  y,
  text,
  color,
  font,
  anchor = "start",
}: {
  x: number;
  y: number;
  text: string;
  color: string;
  font: number;
  anchor?: "start" | "middle";
}): React.ReactElement {
  return (
    <text
      x={x}
      y={y - font * 0.5}
      fill={color}
      fontSize={font}
      fontWeight={600}
      textAnchor={anchor}
      paintOrder="stroke"
      stroke="rgba(0,0,0,0.55)"
      strokeWidth={font * 0.22}
      strokeLinejoin="round"
    >
      {text}
    </text>
  );
}
