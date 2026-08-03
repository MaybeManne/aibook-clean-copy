/**
 * WCAG contrast, as a pure function — no DOM, so the headless check and a dev-time warning can
 * share one implementation. A theme that ships unreadable text is a bug like any other; this is
 * the module that makes it assertable.
 */
import { ON_MARK_ROLES, palette, STRUCTURAL_ROLES, type PaletteColor } from "./palette.js";
import type { Theme } from "./theme.js";

/** #rgb / #rrggbb / rgba(r,g,b,a) → sRGB triple. Alpha is composited later, never guessed here. */
function parse(color: string): { r: number; g: number; b: number; a: number } | null {
  const s = color.trim().toLowerCase();
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/.exec(s);
  if (hex) {
    const h = hex[1]!;
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const n = parseInt(full, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255, a: 1 };
  }
  const fn = /^rgba?\(([^)]+)\)$/.exec(s);
  if (fn) {
    const parts = fn[1]!.split(/[,/\s]+/).filter(Boolean).map(Number);
    const [r, g, b, a] = parts;
    if (r === undefined || g === undefined || b === undefined) return null;
    if ([r, g, b].some((v) => !Number.isFinite(v))) return null;
    return { r, g, b, a: a === undefined || !Number.isFinite(a) ? 1 : a };
  }
  return null;
}

/** Composite a possibly-translucent colour over an opaque backdrop. */
function over(fg: string, bg: string): { r: number; g: number; b: number } | null {
  const f = parse(fg);
  const b = parse(bg);
  if (!f || !b) return null;
  const a = Math.max(0, Math.min(1, f.a));
  return { r: f.r * a + b.r * (1 - a), g: f.g * a + b.g * (1 - a), b: f.b * a + b.b * (1 - a) };
}

function channel(c: number): number {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function luminance(c: { r: number; g: number; b: number }): number {
  return 0.2126 * channel(c.r) + 0.7152 * channel(c.g) + 0.0722 * channel(c.b);
}

function toHex(c: { r: number; g: number; b: number }): string {
  const h = (v: number): string => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0");
  return `#${h(c.r)}${h(c.g)}${h(c.b)}`;
}

/**
 * Composite a translucent token down onto an opaque base and return the opaque result.
 *
 * Needed because several tokens are *both* a backdrop and translucent — `surface` is
 * `rgba(15,17,30,0.82)` sitting on `bg`, `cardBg` is a white wash over it. Measuring text against
 * the raw `rgba()` would report a ratio against a colour the browser never paints.
 */
export function flatten(color: string, base: string): string {
  const c = over(color, base);
  return c ? toHex(c) : base;
}

/**
 * WCAG 2.1 contrast ratio, 1..21. A translucent foreground is composited over `bg` first, which is
 * what the browser actually paints. `bg` itself must be opaque — use `flatten()` on it otherwise.
 *
 * Returns `NaN` for colours this module cannot parse (named CSS colours, `color-mix()`, gradients),
 * so callers can skip rather than silently pass.
 */
export function contrastRatio(fg: string, bg: string): number {
  const f = over(fg, bg);
  const b = parse(bg);
  if (!f || !b) return NaN;
  const lf = luminance(f);
  const lb = luminance({ r: b.r, g: b.g, b: b.b });
  return (Math.max(lf, lb) + 0.05) / (Math.min(lf, lb) + 0.05);
}

export interface ContrastRule {
  /** Human label used in the failure message. */
  what: string;
  fg: string;
  bg: string;
  min: number;
}

export interface ContrastViolation extends ContrastRule {
  ratio: number;
}

/**
 * Thresholds by ROLE, not one number for everything.
 *
 * Body ink is held to AAA (7:1) and secondary ink to AA (4.5:1). Data marks — a bar, a plotted
 * series, a highlight ring — are held to the 3:1 non-text bar, because a chart mark is identified by
 * position and shape as much as by luminance.
 *
 * Below that, two structural tiers, because "recedes" and "invisible" are different bugs:
 *
 *  • `STRUCTURE_MIN` — structure that carries information. An axis tells you where zero is; a choice
 *    border tells you where the button ends. You must be able to *find* it, so it needs a real floor.
 *    Holding it to 3:1 would force axes as loud as the data they frame, which is why it is not 3.
 *  • `HAIRLINE_MIN` — decoration whose only job is a whisper of separation (`borderSubtle`). Its sole
 *    failure mode is vanishing completely, so the floor is just above "identical to the background".
 *
 * Setting one number for all of these would either pass an invisible axis or fail every subtle
 * divider in the design, so the tiers are the point rather than an exemption list.
 */
export const AAA_TEXT = 7;
export const AA_TEXT = 4.5;
export const MARK_MIN = 3;
export const STRUCTURE_MIN = 1.4;
export const HAIRLINE_MIN = 1.12;

/** Every rule a theme must satisfy. Exported so the check can print the full grid, not just failures. */
export function contrastRules(theme: Theme): ContrastRule[] {
  const c = theme.color;
  const f = theme.figure;
  // The translucent tokens, resolved to what the browser actually paints them over.
  const surface = flatten(c.surface, c.bg);
  const cardBg = flatten(c.cardBg, c.bg);
  const cardBgActive = flatten(c.cardBgActive, c.bg);
  const calloutBg = flatten(c.calloutBg, c.bg);
  const rules: ContrastRule[] = [
    { what: "fg on bg", fg: c.fg, bg: c.bg, min: AAA_TEXT },
    { what: "fg on stage", fg: c.fg, bg: c.stage, min: AAA_TEXT },
    { what: "fg on surface", fg: c.fg, bg: surface, min: AAA_TEXT },
    { what: "fg on cardBg", fg: c.fg, bg: cardBg, min: AAA_TEXT },
    { what: "fg on cardBgActive", fg: c.fg, bg: cardBgActive, min: AAA_TEXT },
    { what: "muted on bg", fg: c.muted, bg: c.bg, min: AA_TEXT },
    { what: "muted on stage", fg: c.muted, bg: c.stage, min: AA_TEXT },
    { what: "muted on surface", fg: c.muted, bg: surface, min: AA_TEXT },
    { what: "onAccent on accent", fg: c.onAccent, bg: c.accent, min: AA_TEXT },
    { what: "accent on bg", fg: c.accent, bg: c.bg, min: MARK_MIN },
    { what: "accentLight on bg", fg: c.accentLight, bg: c.bg, min: MARK_MIN },
    { what: "alert on bg", fg: c.alert, bg: c.bg, min: MARK_MIN },
    { what: "correct on bg", fg: c.correct, bg: c.bg, min: MARK_MIN },
    { what: "wrong on bg", fg: c.wrong, bg: c.bg, min: MARK_MIN },
    { what: "success on bg", fg: c.success, bg: c.bg, min: MARK_MIN },
    { what: "warning on bg", fg: c.warning, bg: c.bg, min: MARK_MIN },
    { what: "error on bg", fg: c.error, bg: c.bg, min: MARK_MIN },
    { what: "fg on choiceBg", fg: c.fg, bg: c.choiceBg, min: AAA_TEXT },
    // choiceBorder outlines an interactive target — you must be able to find where the button ends.
    { what: "choiceBorder on choiceBg", fg: c.choiceBorder, bg: c.choiceBg, min: STRUCTURE_MIN },
    // stageBorder and borderSubtle are separators; the only bug is disappearing entirely.
    { what: "stageBorder on bg", fg: c.stageBorder, bg: c.bg, min: HAIRLINE_MIN },
    { what: "borderSubtle on bg", fg: c.borderSubtle, bg: c.bg, min: HAIRLINE_MIN },
    { what: "borderSubtle on surface", fg: c.borderSubtle, bg: surface, min: HAIRLINE_MIN },
    { what: "focusRing on bg", fg: c.focusRing, bg: c.bg, min: MARK_MIN },
    { what: "fg on calloutBg", fg: c.fg, bg: calloutBg, min: AAA_TEXT },
    { what: "callout.note on calloutBg", fg: c.callout.note, bg: calloutBg, min: MARK_MIN },
    { what: "callout.warning on calloutBg", fg: c.callout.warning, bg: calloutBg, min: MARK_MIN },
    { what: "callout.tip on calloutBg", fg: c.callout.tip, bg: calloutBg, min: MARK_MIN },
    // Figure roles are measured against the STAGE, which is what a figure is drawn on.
    { what: "figure.ink on stage", fg: f.ink, bg: c.stage, min: AAA_TEXT },
    { what: "figure.muted on stage", fg: f.muted, bg: c.stage, min: AA_TEXT },
    { what: "figure.highlight on stage", fg: f.highlight, bg: c.stage, min: MARK_MIN },
    { what: "figure.axis on stage", fg: f.axis, bg: c.stage, min: STRUCTURE_MIN },
  ];
  f.series.forEach((s, i) => rules.push({ what: `figure.series[${i}] on stage`, fg: s, bg: c.stage, min: MARK_MIN }));

  // onMark is glyphs on a filled mark, so it is measured against the fills it lands on — never
  // against the stage, where it is not supposed to be legible at all.
  const marks: [string, string][] = [
    ["highlight", f.highlight],
    ...f.series.map((s, i) => [`series[${i}]`, s] as [string, string]),
    // The named fills the shipped example figures actually put numbers inside.
    ...(["gold", "yellow", "green", "teal", "indigo", "blue", "red"] as PaletteColor[]).map(
      (role) => [`palette.${role}`, f.palette[role] ?? palette[role]] as [string, string],
    ),
  ];
  for (const [label, markColor] of marks) {
    rules.push({ what: `figure.onMark on ${label}`, fg: f.onMark, bg: markColor, min: AA_TEXT });
  }

  // The EFFECTIVE palette — canonical values merged with this theme's overrides — because what
  // matters is the colour the browser paints. Auditing only the overrides would leave a theme that
  // supplies none (the canonical dark studio) with its figure colours entirely unchecked.
  for (const role of Object.keys(palette) as PaletteColor[]) {
    if ((ON_MARK_ROLES as readonly PaletteColor[]).includes(role)) continue; // covered above
    const hex = f.palette[role] ?? palette[role];
    const structural = (STRUCTURAL_ROLES as readonly PaletteColor[]).includes(role);
    rules.push({ what: `figure.palette.${role} on stage`, fg: hex, bg: c.stage, min: structural ? STRUCTURE_MIN : MARK_MIN });
  }
  return rules;
}

/** Every rule the theme fails. Empty array → the theme is legible by construction. */
export function auditTheme(theme: Theme): ContrastViolation[] {
  const out: ContrastViolation[] = [];
  for (const rule of contrastRules(theme)) {
    const ratio = contrastRatio(rule.fg, rule.bg);
    if (!Number.isFinite(ratio) || ratio < rule.min) out.push({ ...rule, ratio });
  }
  return out;
}
