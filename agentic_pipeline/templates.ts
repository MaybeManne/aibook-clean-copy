// LESSON TEMPLATES.
//
// A template is pure presentation: colors, fonts, layout, slide chrome. It only
// affects the final HTML that assembleLesson() emits. Nothing here touches the
// state machine, the acts, or any of the visual logic. Swap or tweak a template
// and the same lesson data renders differently; the lesson itself is unchanged.
//
// LAYOUT is a clean two-column slide: visual on the left, text/explanation on
// the right, 50/50. A teacher or agent can flip it:
//
//   lesson.setTemplate("default");
//   lesson.customizeTemplate({ layout: { visualPosition: "right" } }); // text left, visual right
//
// Adding a new look is one entry in PRESETS below; nothing else changes.

// which side the visual (graph/diagram) column sits on. "left" is the default
// two-column reading order; "right" flips it (text left, visual right).
export type VisualPosition = "left" | "right";

export interface LessonTemplate {
  name: string;
  colors: {
    background: string;      // page background
    text: string;            // body text color
    accent: string;          // act labels / accent lines
    slideBackground: string; // background of each act "slide"
    divider: string;         // subtle line between slides
  };
  fonts: {
    title: string;           // font-family for the lesson title
    body: string;            // font-family for body text
    size: string;            // base body font-size, e.g. "16px"
  };
  layout: {
    visualPosition: VisualPosition; // "left" (default) or "right"
    padding: string;                // padding inside each slide, e.g. "24px"
    gap: string;                    // gap between the two columns, e.g. "16px"
  };
  slide: {
    titleSize: string;       // lesson title font-size, e.g. "1.7rem"
    titleColor: string;      // lesson title color
    showDividers: boolean;   // draw a divider between slides?
  };
}

// a deep-partial of LessonTemplate so customizeTemplate() can override just a few
// nested fields, e.g. { colors: { background: "#f00" }, layout: { visualPosition: "right" } }.
export type TemplateOverrides = {
  name?: string;
  colors?: Partial<LessonTemplate["colors"]>;
  fonts?: Partial<LessonTemplate["fonts"]>;
  layout?: Partial<LessonTemplate["layout"]>;
  slide?: Partial<LessonTemplate["slide"]>;
};

// the shape a template module must export: the preset lookup/merge/render helpers
// plus the PRESETS map. formalizes what this file (templates.ts) provides so an
// alternative template module could be swapped in against the same contract.
export interface ITemplate {
  name: string;
  getPreset(name: string): LessonTemplate;
  mergeTemplate(base: LessonTemplate, overrides: TemplateOverrides): LessonTemplate;
  templateToCss(t: LessonTemplate): string;
  PRESETS: Record<string, LessonTemplate>;
}


// ---- the presets ----
// add a new look by adding one entry here. nothing else changes.
//
// the full set and who each one is for:
//   default      — general-purpose dark, the primary look
//   dark         — near-black variant of default
//   minimal      — light, low-chrome, distraction-free
//   duolingo     — playful + gamified, for young kids (ages 6-10)
//   technical    — dark, ultra-minimal, for technical / developer audiences
//   notion       — warm minimalism, document-like, for calm focused reading
//   ocean        — deep navy/teal, calm, for long study sessions
//   chalk        — chalkboard classroom aesthetic, nostalgic and warm
//   sunrise      — warm light mode, inviting, for morning focus sessions
//   highcontrast — WCAG AAA accessibility first, for visual impairments
//   kids         — bold primary colors, for very young children (ages 4-7)
export const PRESETS: Record<string, LessonTemplate> = {
  // dark, clean, two-column. the primary look.
  default: {
    name: "default",
    colors: { background: "#0f1117", text: "#e8e8e8", accent: "#6366f1", slideBackground: "#151822", divider: "#2a2a3a" },
    fonts: { title: "Inter, -apple-system, sans-serif", body: "Inter, -apple-system, sans-serif", size: "16px" },
    layout: { visualPosition: "left", padding: "24px", gap: "16px" },
    slide: { titleSize: "1.7rem", titleColor: "#ffffff", showDividers: true },
  },
  // near-black variant.
  dark: {
    name: "dark",
    colors: { background: "#000000", text: "#e2e8f0", accent: "#818cf8", slideBackground: "#0a0a0a", divider: "#1f1f2a" },
    fonts: { title: "Inter, -apple-system, sans-serif", body: "Inter, -apple-system, sans-serif", size: "16px" },
    layout: { visualPosition: "left", padding: "24px", gap: "16px" },
    slide: { titleSize: "1.7rem", titleColor: "#ffffff", showDividers: true },
  },
  // light, low-chrome.
  minimal: {
    name: "minimal",
    colors: { background: "#ffffff", text: "#222222", accent: "#6366f1", slideBackground: "#ffffff", divider: "#e5e5ef" },
    fonts: { title: "Inter, -apple-system, sans-serif", body: "Inter, -apple-system, sans-serif", size: "15px" },
    layout: { visualPosition: "left", padding: "24px", gap: "16px" },
    slide: { titleSize: "1.5rem", titleColor: "#111111", showDividers: false },
  },
  // playful + gamified, big friendly type — for young kids (ages 6-10).
  duolingo: {
    name: "duolingo",
    colors: { background: "#ffffff", text: "#3c3c3c", accent: "#58cc02", slideBackground: "#f7f7f7", divider: "#e5e5e5" },
    fonts: { title: "Nunito, Comic Sans MS, cursive", body: "Nunito, Comic Sans MS, cursive", size: "18px" },
    layout: { visualPosition: "left", padding: "24px", gap: "16px" },
    slide: { titleSize: "2rem", titleColor: "#3c3c3c", showDividers: false },
  },
  // dark, ultra-minimal, tight type — for technical / developer audiences.
  technical: {
    name: "technical",
    colors: { background: "#0a0a0f", text: "#e2e8f0", accent: "#7c3aed", slideBackground: "#0f0f17", divider: "#1e1e2e" },
    fonts: { title: "Inter, -apple-system, sans-serif", body: "Inter, -apple-system, sans-serif", size: "15px" },
    layout: { visualPosition: "left", padding: "24px", gap: "16px" },
    slide: { titleSize: "1.5rem", titleColor: "#ffffff", showDividers: true },
  },
  // warm minimalism, serif title — document-like, for calm focused reading.
  notion: {
    name: "notion",
    colors: { background: "#f7f6f3", text: "#1a1a1a", accent: "#e9a84c", slideBackground: "#ffffff", divider: "#e5e0d8" },
    fonts: { title: "Georgia, 'Times New Roman', serif", body: "Inter, sans-serif", size: "16px" },
    layout: { visualPosition: "left", padding: "24px", gap: "16px" },
    slide: { titleSize: "1.6rem", titleColor: "#1a1a1a", showDividers: false },
  },
  // deep navy/teal, calm and focused — for long study sessions.
  ocean: {
    name: "ocean",
    colors: { background: "#0d1b2a", text: "#e0f7ff", accent: "#06b6d4", slideBackground: "#112336", divider: "#1e3a5f" },
    fonts: { title: "Inter, sans-serif", body: "Inter, sans-serif", size: "16px" },
    layout: { visualPosition: "left", padding: "24px", gap: "16px" },
    slide: { titleSize: "1.7rem", titleColor: "#ffffff", showDividers: true },
  },
  // chalkboard classroom aesthetic, handwritten type — nostalgic and warm.
  chalk: {
    name: "chalk",
    colors: { background: "#1a2e1a", text: "#f5f0e8", accent: "#ffd700", slideBackground: "#1f351f", divider: "#2d4a2d" },
    fonts: { title: "'Patrick Hand', 'Comic Sans MS', cursive", body: "'Patrick Hand', 'Comic Sans MS', cursive", size: "16px" },
    layout: { visualPosition: "left", padding: "24px", gap: "16px" },
    slide: { titleSize: "1.8rem", titleColor: "#ffd700", showDividers: true },
  },
  // warm light mode, inviting — for morning focus sessions.
  sunrise: {
    name: "sunrise",
    colors: { background: "#fffbf5", text: "#2d1f0e", accent: "#f59e0b", slideBackground: "#fff8ef", divider: "#fde8c8" },
    fonts: { title: "Inter, sans-serif", body: "Inter, sans-serif", size: "16px" },
    layout: { visualPosition: "left", padding: "24px", gap: "16px" },
    slide: { titleSize: "1.7rem", titleColor: "#1a0f00", showDividers: false },
  },
  // WCAG AAA accessibility first, large type — for visual impairments.
  highcontrast: {
    name: "highcontrast",
    colors: { background: "#000000", text: "#ffffff", accent: "#00d4ff", slideBackground: "#0a0a0a", divider: "#333333" },
    fonts: { title: "Arial, Helvetica, sans-serif", body: "Arial, Helvetica, sans-serif", size: "18px" },
    layout: { visualPosition: "left", padding: "24px", gap: "16px" },
    slide: { titleSize: "2rem", titleColor: "#ffffff", showDividers: true },
  },
  // bold primary colors, extra-large friendly type — for very young children (ages 4-7).
  kids: {
    name: "kids",
    colors: { background: "#ffffff", text: "#1a1a1a", accent: "#ff3b3b", slideBackground: "#fff9f0", divider: "#ffeb99" },
    fonts: { title: "Nunito, Comic Sans MS, cursive", body: "Nunito, Comic Sans MS, cursive", size: "20px" },
    layout: { visualPosition: "left", padding: "24px", gap: "16px" },
    slide: { titleSize: "2.2rem", titleColor: "#2563eb", showDividers: false },
  },
} satisfies ITemplate["PRESETS"];


// return a fresh copy of a preset by name. throws on an unknown name so a typo
// can't silently fall back to the wrong look.
export function getPreset(name: string): LessonTemplate {
  const preset = PRESETS[name];
  if (!preset) {
    throw new Error(`Unknown template: '${name}'. Expected one of: ${Object.keys(PRESETS).join(", ")}.`);
  }
  // deep clone so callers can mutate/override without touching the shared preset.
  return mergeTemplate(preset, {});
}
// enforce the module contract (see ITemplate above).
getPreset satisfies ITemplate["getPreset"];

// merge overrides onto a base template, one nested group at a time, so a partial
// override (just a color, just visualPosition) keeps every field it didn't mention.
export function mergeTemplate(base: LessonTemplate, overrides: TemplateOverrides): LessonTemplate {
  return {
    name: overrides.name ?? base.name,
    colors: { ...base.colors, ...(overrides.colors ?? {}) },
    fonts: { ...base.fonts, ...(overrides.fonts ?? {}) },
    layout: { ...base.layout, ...(overrides.layout ?? {}) },
    slide: { ...base.slide, ...(overrides.slide ?? {}) },
  };
}
mergeTemplate satisfies ITemplate["mergeTemplate"];


// ---- template -> CSS ----
// turn a resolved template into the <style> body assembleLesson() drops into the
// page. the output is a slideshow: every act is a full-viewport slide, only the
// active one visible, with a fixed nav bar at the bottom. each slide is a two
// column split (visual left, text right). the teacher never sees any CSS.
export function templateToCss(t: LessonTemplate): string {
  const { colors: c, fonts: f, slide: s, layout: l } = t;

  // visualPosition flips the column order. DOM order is [visual, text], so "row"
  // puts the visual on the left and "row-reverse" puts it on the right.
  const direction = l.visualPosition === "left" ? "row" : "row-reverse";
  // muted tone for the slide counter (no dedicated field; derived once here).
  const muted = "#8a8fa3";

  return `
  html, body { margin: 0; padding: 0; height: 100%; }
  html { background: ${c.background}; }
  body { background: ${c.background}; color: ${c.text};
         font-family: ${f.body}; font-size: ${f.size}; line-height: 1.6; }

  /* persistent lesson title, top-left across every slide. titleSize drives the
     visual hierarchy, so a kid-friendly or accessibility preset reads larger. */
  .lesson-title { position: fixed; top: 18px; left: 32px; z-index: 30;
                  font-family: ${f.title}; font-size: ${s.titleSize}; font-weight: 600;
                  letter-spacing: 0.5px; color: ${s.titleColor}; }

  /* slideshow: all slides stacked; only the active one is visible. using
     visibility (not display:none) so SVG/embeds keep real dimensions while hidden. */
  .slideshow { position: relative; width: 100%; height: 100vh; overflow: hidden; }
  .slide { position: absolute; inset: 0; visibility: hidden;
           display: flex; flex-direction: column; justify-content: center;
           box-sizing: border-box; padding: 64px 48px 88px;
           background: ${c.slideBackground}; }
  .slide.active { visibility: visible; }

  /* per-slide act label, top-right, accent */
  .act-label { position: absolute; top: 24px; right: 32px; text-transform: uppercase;
               color: ${c.accent}; font-size: 11px; letter-spacing: 2px; font-weight: 600; }

  /* top section: the visual/text two-column split. flexes to fill the slide above
     the bottom band (min-height:0 lets .act-text scroll instead of overflowing). */
  .act-columns { display: flex; flex-direction: ${direction}; gap: ${l.gap};
                 width: 100%; flex: 1 1 auto; min-height: 0; }
  /* left: visual, vertically centered on a darker panel */
  .act-visual { flex: 1; min-width: 0; display: flex; align-items: center;
                justify-content: center; background: ${c.background}; border-radius: 8px; }
  /* right: text/steps/math/highlights/mcq, scrolls if it overflows */
  .act-text { flex: 1; min-width: 0; overflow-y: auto; padding: 0 4px; }
  .act-text p { margin-top: 0; }

  /* SVG text defaults to black; make it readable on the dark panel. */
  .slide svg text { fill: ${c.text}; }
  .slide table th { color: #111827; }
  .slide table td { color: ${c.text}; }

  /* bottom band: questions (MCQ / slider) below the two columns. flows from the
     top when it's the only content (question-only act), else sits under the split. */
  .act-bottom { flex: 0 0 auto; width: 100%; margin-top: ${l.gap}; }

  /* MCQ block: capped width so buttons don't stretch across the wide bottom band;
     centered when it lives in the bottom band. */
  .act-mcq { margin-top: 20px; max-width: 520px; }
  .act-bottom .act-mcq { margin-left: auto; margin-right: auto; }
  .act-mcq .mcq-question { font-weight: 600; color: ${s.titleColor}; margin-bottom: 10px; }
  .act-mcq button { display: block; margin: 8px 0; padding: 10px 20px; font: inherit;
                    background: ${c.background}; color: ${c.text};
                    border: 1px solid ${c.divider}; border-radius: 6px; cursor: pointer; }
  .act-mcq button:hover { border-color: ${c.accent}; }

  /* bottom navigation bar: [Prev]  n / total  [Next] */
  .navbar { position: fixed; bottom: 0; left: 0; right: 0; height: 56px; z-index: 30;
            display: flex; align-items: center; justify-content: center; gap: 28px;
            background: ${c.slideBackground}; border-top: 1px solid ${c.divider}; }
  .navbar button { background: ${c.background}; color: ${c.text};
                   border: 1px solid ${c.divider}; border-radius: 6px;
                   padding: 8px 18px; font: inherit; font-size: 14px; cursor: pointer; }
  .navbar button:hover:not(:disabled) { border-color: ${c.accent}; color: ${s.titleColor}; }
  .navbar button:disabled { opacity: 0.4; cursor: default; }
  .counter { color: ${muted}; font-size: 13px; letter-spacing: 1px; }`;
}
templateToCss satisfies ITemplate["templateToCss"];
