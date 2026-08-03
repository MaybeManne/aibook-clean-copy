import * as React from "react";
import type { Annotation, FocusState, StagePoint, StageRect } from "@lessonstudio/lesson";
import type { Theme } from "@lessonstudio/theme";

const EASE = "cubic-bezier(0.22, 0.61, 0.36, 1)";
const DURATION_MS = 420;

function useElementSize<T extends HTMLElement>(): [React.MutableRefObject<T | null>, { w: number; h: number } | null] {
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
    const RO = (globalThis as { ResizeObserver?: typeof ResizeObserver }).ResizeObserver;
    if (!RO) return;
    const ro = new RO(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size];
}

function focusTransform(rect: StageRect | undefined): { transform: string; scale: number } {
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
 * Wrap a stage panel's contents so a director can zoom them and draw on them. With no focus and
 * no marks this is one plain `div` with `transform: none`.
 *
 * The label (a teacher's caption for what we are looking at) is rendered OUTSIDE the transform,
 * pinned to the panel, because a caption that zooms is unreadable.
 */
export function FocusFrame({ focus, annotations, theme, children }: FocusFrameProps): React.ReactElement {
  const [ref, size] = useElementSize<HTMLDivElement>();
  const { transform, scale } = focusTransform(focus?.rect);
  return (
    <div ref={ref} style={{ position: "relative", width: "100%", height: "100%", minWidth: 0, minHeight: 0, overflow: "hidden" }}>
      <div
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

interface AnnotationLayerProps {
  annotations: Annotation[];
  size: { w: number; h: number };
  /** The enclosing focus scale, so strokes and text stay visually constant while zoomed. */
  scale: number;
  theme: Theme;
}

function AnnotationLayer({ annotations, size, scale, theme }: AnnotationLayerProps): React.ReactElement {
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
        <marker id={headId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse" markerUnits="strokeWidth">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="context-stroke" />
        </marker>
      </defs>
      {annotations.map((a, i) => {
        const color = ("color" in a && a.color) || accent;
        const halo = theme.color.textHalo;
        const common = { stroke: color, strokeWidth: stroke, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
        switch (a.kind) {
          case "arrow": {
            const [x1, y1] = px(a.from);
            const [x2, y2] = px(a.to);
            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} {...common} markerEnd={`url(#${headId})`} />
                {a.label ? <Caption x={x2} y={y2} text={a.label} color={color} font={font} halo={halo} /> : null}
              </g>
            );
          }
          case "circle": {
            const [cx, cy] = px(a.at);
            const r = a.r * Math.min(w, h);
            return (
              <g key={i}>
                <circle cx={cx} cy={cy} r={r} {...common} />
                {a.label ? <Caption x={cx} y={cy - r} text={a.label} color={color} font={font} halo={halo} anchor="middle" /> : null}
              </g>
            );
          }
          case "rect": {
            const r = a.rect;
            return (
              <g key={i}>
                <rect x={r.x * w} y={r.y * h} width={r.w * w} height={r.h * h} rx={Math.min(6 / scale, r.w * w * 0.2)} {...common} />
                {a.label ? <Caption x={r.x * w} y={r.y * h} text={a.label} color={color} font={font} halo={halo} /> : null}
              </g>
            );
          }
          case "label": {
            const [x, y] = px(a.at);
            return <Caption key={i} x={x} y={y} text={a.text} color={color} font={font} halo={halo} anchor="middle" />;
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

/**
 * A teacher's caption drawn OVER arbitrary figure content, so it cannot assume its backdrop. The
 * halo (a stroke painted under the glyphs via `paintOrder`) is what keeps it readable on top of a
 * dark apparatus or a white plot alike — which is why it comes from the theme rather than being a
 * fixed black scrim.
 */
function Caption({
  x,
  y,
  text,
  color,
  font,
  halo,
  anchor = "start",
}: {
  x: number;
  y: number;
  text: string;
  color: string;
  font: number;
  halo: string;
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
      stroke={halo}
      strokeWidth={font * 0.22}
      strokeLinejoin="round"
    >
      {text}
    </text>
  );
}
