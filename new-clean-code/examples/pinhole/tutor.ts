import type { Json } from "@lessonstudio/state-machine";
import type { BeatSpec, DirectorCommand } from "@lessonstudio/lesson";
import type { Director, DirectorRequest } from "@lessonstudio/forge";
import { SYMBOL_COLOR, tex, type SymbolName } from "./palette.js";
import { PINHOLE_VIZ, type PinholeProps } from "./pinhole3d.js";
import { lessonSpec } from "./lesson.js";

const BEATS = new Map<string, BeatSpec>(lessonSpec.flow.map((b) => [b.id, b]));

const FALLBACK = { u: 7, v: 7 };

function apparatusOf(req: DirectorRequest): { u: number; v: number } {
  const anchor = req.observation.anchor;
  const params = (BEATS.get(anchor)?.params ?? {}) as {
    viz?: { props?: Record<string, unknown> };
    defaults?: Record<string, unknown>;
  };
  const sources: Array<Record<string, unknown>> = [
    req.observation.stage.values,
    params.defaults ?? {},
    params.viz?.props ?? {},
  ];
  const pick = (key: "u" | "v"): number => {
    for (const src of sources) {
      const n = Number(src[key]);
      if (Number.isFinite(n)) return n;
    }
    return FALLBACK[key];
  };
  return { u: pick("u"), v: pick("v") };
}

const MASK = "\u0000";
const SYMBOL_OF: Record<string, SymbolName> = { "h'": "hp", h: "h", u: "u", v: "v", m: "m" };

function colorSpan(body: string): string {
  const held: string[] = [];
  const hold = (m: string): string => `${MASK}${held.push(m) - 1}${MASK}`;
  const masked = body
    // Already-tagged symbols are held aside so they are not wrapped a second time. Both shapes:
    // `\textcolor` is what a model might write, `\htmlClass` is what this lesson's own `tex()` emits.
    .replace(/\\(?:textcolor|htmlClass)\{[^}]*\}\{[^}]*\}/g, hold)
    .replace(/\\text\{[^}]*\}/g, hold);
  const painted = masked.replace(/(?<![\\A-Za-z])(h'|h|u|v|m)(?![A-Za-z'])/g, (t) => tex(SYMBOL_OF[t]!));
  return painted.replace(new RegExp(`${MASK}(\\d+)${MASK}`, "g"), (_all, i: string) => held[Number(i)] ?? "");
}

/** Colour every math span in a prose string, leaving the words alone. */
export function colorizeMath(src: string): string {
  return src.replace(/\$\$([^$]+)\$\$|\$([^$]+)\$/g, (_all, display: string | undefined, inline: string | undefined) =>
    display != null ? `$$${colorSpan(display)}$$` : `$${colorSpan(inline!)}$`,
  );
}

const PHYSICS = [
  "The apparatus is an object at distance u in front of a barrier with one small hole, and a screen at distance v behind it.",
  "Rays cross AT the hole, so the image on the screen is inverted (upside-down).",
  "The ray bundles form two similar triangles meeting at the hole, so h'/h = v/u, i.e. h' = h*v/u.",
  "Magnification m = v/u; it is written m = -v/u when the minus sign is used to record the inversion.",
  "A matte (Lambertian) wall reflects an average of the light arriving from every direction, so it forms no image.",
  "The integral the lesson displays for the matte wall is that averaging written formally: it sums the incoming light L_i(w_i) over every direction w_i in the hemisphere, each weighted by the cosine (w_i . n) because light striking obliquely spreads over more surface, and rho/pi is the fraction a matte surface re-emits. The one number that comes out keeps no record of WHICH direction anything arrived from — which is exactly why the wall cannot form an image. Understanding the lesson needs only that reading; it does not need to evaluate the integral.",
  "Each screen point receives light from exactly ONE direction, so no blur circle can form: a pinhole needs no focusing and has infinite depth of field.",
  "A smaller hole is sharper but dimmer. This lesson treats the hole as ideal and does not model diffraction.",
].join("\n");

/**
 * Appended to `directorSystem()`'s general teaching brief — the SUBJECT-MATTER half. How to
 * teach (when to speak, when to point, when to say nothing) is the director's own brief.
 */
export const PINHOLE_BRIEF = [
  "THIS LESSON: the pinhole camera.",
  "",
  "These facts are already established by the lesson. Do not contradict them, and introduce no",
  "numbers beyond the ones the observation gives you:",
  PHYSICS,
  "",
  "Rules for this lesson:",
  "- Plain prose in `say` for a question the apparatus already answers. No headings, no bullet",
  "  lists, no preamble like 'Great question'.",
  "- WHEN THE APPARATUS CANNOT SHOW IT, BUILD SOMETHING THAT CAN. The 3-D apparatus is geometry",
  "  only: it has u, v, rays, image, labels and a camera, and no hole size, brightness or blur.",
  "  So a question like 'what if the hole were wider?' has no slider to reach for — and prose",
  "  about a figure the learner cannot see is the weakest answer available. Instead `addBeat`:",
  "    · `scene` for a diagram that plays once — two ray bundles, a widening gap, a spreading spot;",
  "    · `explorable` with a `declarative` viz for something they can DRAG, when the point is the",
  "      trade-off rather than one picture (wider hole: brighter and blurrier, both at once).",
  "  Draw it in stage units with the DRAWING vocabulary, keep it to a handful of nodes, and set",
  "  `next` back to the beat they asked from so they land where they were. Say one sentence about",
  "  what to look at; the figure carries the rest.",
  "- Inline LaTeX between single dollar signs is fine ($v/u$). Never write \\textcolor yourself —",
  "  the lesson colours the symbols for you, and a hex you invent will be the wrong one.",
  "- The apparatus is on screen beside your words. Point at it rather than re-describing it:",
  "  `focus` the hole or the screen, `annotate` the two similar triangles, `setControl` u or v to",
  "  make a comparison happen instead of asserting it.",
  "- The observation shows you the text the learner is currently reading. ANYTHING IT PUTS ON",
  "  SCREEN IS IN SCOPE — if the lesson displays a formula, a learner asking what it means is",
  "  asking about this lesson, and 'that is out of scope' is the wrong answer. Say what the",
  "  notation MEANS in words and what it is there to show. You never need to evaluate it.",
  "- Genuinely unrelated questions (which camera to buy, lens optics, diffraction) are the only",
  "  out-of-scope case: say so in one sentence and point back to what the apparatus does show.",
  "  Never invent an answer in order to look helpful.",
].join("\n");

/**
 * The offline answer: what a keyless run, a failed provider call and a silent model all show.
 * Deterministic, and true of every question this lesson invites.
 */
export const PINHOLE_FALLBACK =
  "Everything in this lesson follows from one rule: the hole lets exactly one ray direction " +
  "reach each point of the screen. That is why the image is organized rather than averaged, " +
  "why it arrives inverted, and why it stays sharp at any screen distance.";

/**
 * `onSilence` for this lesson: answer with the deterministic paragraph rather than the
 * director's generic acknowledgement. Runs through the same `polish()` as `nativeVoice`, so the
 * reply is colour-keyed and posed exactly like a live one.
 */
export function pinholeSilence(req: DirectorRequest): DirectorCommand[] {
  const from = req.observation.pending?.from;
  return polish(req, [{ op: "say", text: PINHOLE_FALLBACK, ...(from ? { resume: from } : {}) }]);
}

/**
 * Wrap ANY director so its prose looks like this lesson's prose. Two touches:
 *   1. colour-key the math, through the same palette as the figure labels;
 *   2. pose the apparatus at the learner's own current u and v with labels on, unless the turn
 *      already decided what the stage should show.
 *
 * (2) is conditional, and there is no (3). This function used to append a house footer stating the
 * live u, v and m — the idea being that an answer should be grounded in the learner's own
 * apparatus. It is not what grounding looks like. Asked what an integral sign means, the tutor
 * answered well and then added a sentence about magnification, which was true, on-topic for the
 * lesson, and about nothing the learner had asked; making it conditional only made it arrive less
 * often. Grounding is (2): the answer SHOWS the apparatus at the learner's own numbers, and the
 * observation the model reads already carries them, so it can quote them when they are the answer.
 */
export function nativeVoice(inner: Director): Director {
  return {
    async direct(req: DirectorRequest): Promise<DirectorCommand[]> {
      return polish(req, await inner.direct(req));
    },
  };
}

/** Commands that mean "the turn has its own idea about the stage" — so don't overwrite it. */
const STAGE_OPS = new Set(["setControl", "setControls", "workspace", "focus", "annotate", "revisit"]);

/**
 * The apparatus AFTER this turn lands. A turn is atomic — the prose and the slider move reach the
 * learner together — so posing from the observation alone would show the figure the learner had
 * before the turn, not the one the turn is about. "Where they have it now" has to mean *now*, which
 * is after the turn's own `setControl`.
 */
function posedBy(req: DirectorRequest, commands: DirectorCommand[]): { u: number; v: number } {
  const pose = apparatusOf(req);
  for (const c of commands) {
    const moves =
      c.op === "setControl" ? { [c.key]: c.value } : c.op === "setControls" ? c.values : undefined;
    for (const key of ["u", "v"] as const) {
      const n = Number(moves?.[key]);
      if (Number.isFinite(n)) pose[key] = n;
    }
  }
  return pose;
}

function polish(req: DirectorRequest, commands: DirectorCommand[]): DirectorCommand[] {
  const { u, v } = posedBy(req, commands);
  const props: PinholeProps = { u, v, rays: true, image: true, labels: true };
  // A turn that zooms, marks, re-poses or re-shows something has already answered "what should
  // they be looking at". Forcing the default apparatus over the top of it threw that away.
  const stages = commands.some((c) => STAGE_OPS.has(c.op) || (c.op === "say" && !!c.show));
  // Two ways out of the answer, on the one the learner actually lands on (the LAST `say` — earlier
  // ones chain behind it). A single Continue that only ever rewound made every answer a dead end,
  // while asking a question mid-lesson feels like a conversation: you should be able to pick up
  // where you left off OR carry on from here.
  const lastSay = commands.reduce((at, c, i) => (c.op === "say" ? i : at), -1);

  return commands.map((c, i) => {
    if (c.op !== "say") return c;
    const exits = i === lastSay && c.exits === undefined ? ({ exits: "both" } as const) : {};
    return {
      ...c,
      ...exits,
      text: colorizeMath(c.text.trim()),
      ...(c.show || stages ? {} : { show: { name: PINHOLE_VIZ, props: props as unknown as Record<string, Json>, persistent: true } }),
    };
  });
}

export { SYMBOL_COLOR };
