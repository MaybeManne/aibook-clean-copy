// The parametric star of the flagship demo: a unit circle whose orbiting point
// traces a sine wave. Registered as a pure SVG figure (browser + mp4 export). One
// figure serves the narrated scenes (angle θ derived from the beat clock `t`) AND
// the interactive demo (θ from the slider prop). Side-effect import: registers on load.
import { registerFigure } from "@lessonkit/render-web";

const TAU = Math.PI * 2;

registerFigure("unit-circle-sine", (props, t, theme) => {
  const acc = theme.color.accent;
  const accL = theme.color.accentLight;
  const fg = theme.color.fg;
  const muted = theme.color.muted;
  const gold = "#ffce54";

  // θ: slider-driven if provided, else swept from the beat clock (~1 rev / 7s).
  const deg = props.theta != null ? Number(props.theta) : ((Number(t) || 0) / 7000) * 360;
  const th = ((deg % 360) + 360) % 360 * (Math.PI / 180);

  const cx = 210;
  const cy = 230;
  const R = 160;
  const ax0 = 440;
  const axW = 480;

  const Px = cx + R * Math.cos(th);
  const Py = cy - R * Math.sin(th);
  const curveX = ax0 + (Math.min(th, TAU) / TAU) * axW;
  const curveY = cy - R * Math.sin(th);

  const sine = (upto: number): string => {
    let d = "";
    const N = 180;
    for (let i = 0; i <= N; i++) {
      const a = upto * (i / N);
      const x = (ax0 + (a / TAU) * axW).toFixed(1);
      const y = (cy - R * Math.sin(a)).toFixed(1);
      d += i ? ` L${x} ${y}` : `M${x} ${y}`;
    }
    return d;
  };

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 460" style="width:100%;height:auto;display:block">
    <defs>
      <radialGradient id="ucs-pt" cx="42%" cy="38%" r="60%"><stop offset="0%" stop-color="${accL}"/><stop offset="100%" stop-color="${acc}"/></radialGradient>
      <radialGradient id="ucs-halo" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${gold}" stop-opacity="0.55"/><stop offset="100%" stop-color="${gold}" stop-opacity="0"/></radialGradient>
      <radialGradient id="ucs-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${acc}" stop-opacity="0.16"/><stop offset="100%" stop-color="${acc}" stop-opacity="0"/></radialGradient>
      <marker id="ucs-ah" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="${muted}"/></marker>
    </defs>
    <circle cx="${cx}" cy="${cy}" r="${R + 40}" fill="url(#ucs-glow)"/>
    <line x1="${cx - R - 16}" y1="${cy}" x2="${cx + R + 16}" y2="${cy}" stroke="${muted}" stroke-width="1.2" opacity="0.45"/>
    <line x1="${cx}" y1="${cy - R - 16}" x2="${cx}" y2="${cy + R + 16}" stroke="${muted}" stroke-width="1.2" opacity="0.45"/>
    <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="${muted}" stroke-width="2"/>
    <line x1="${Px.toFixed(1)}" y1="${cy}" x2="${Px.toFixed(1)}" y2="${Py.toFixed(1)}" stroke="${gold}" stroke-width="3.5" stroke-linecap="round"/>
    <line x1="${cx}" y1="${cy}" x2="${Px.toFixed(1)}" y2="${Py.toFixed(1)}" stroke="${accL}" stroke-width="3"/>
    <line x1="${Px.toFixed(1)}" y1="${Py.toFixed(1)}" x2="${curveX.toFixed(1)}" y2="${curveY.toFixed(1)}" stroke="${fg}" stroke-width="1.3" stroke-dasharray="5 6" opacity="0.5"/>
    <line x1="${ax0}" y1="${cy}" x2="${ax0 + axW + 20}" y2="${cy}" stroke="${muted}" stroke-width="1.5" marker-end="url(#ucs-ah)"/>
    <path d="${sine(TAU)}" fill="none" stroke="${muted}" stroke-width="2" opacity="0.26"/>
    <path d="${sine(Math.min(th, TAU))}" fill="none" stroke="${acc}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${curveX.toFixed(1)}" cy="${curveY.toFixed(1)}" r="15" fill="url(#ucs-halo)"/>
    <circle cx="${curveX.toFixed(1)}" cy="${curveY.toFixed(1)}" r="6" fill="${gold}"/>
    <circle cx="${Px.toFixed(1)}" cy="${Py.toFixed(1)}" r="19" fill="url(#ucs-halo)"/>
    <circle cx="${Px.toFixed(1)}" cy="${Py.toFixed(1)}" r="8" fill="url(#ucs-pt)"/>
    <text x="${cx}" y="${cy + R + 48}" text-anchor="middle" font-family="${theme.font.mono}" font-size="21" fill="${fg}">θ = ${Math.round(((deg % 360) + 360) % 360)}°</text>
    <text x="${ax0 + axW / 2}" y="${cy + R + 48}" text-anchor="middle" font-family="${theme.font.mono}" font-size="21" fill="${gold}">sin θ = ${Math.sin(th).toFixed(2)}</text>
  </svg>`;
});
