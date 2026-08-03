import { formatBindings, formatSceneVocabulary } from "../../timeline/index.js";
import type { BeatParamsSchema, BeatRegistry } from "../beats/types.js";

/**
 * WHAT A DIRECTOR MAY AUTHOR, projected off the live beat registry.
 *
 * `addBeat` was always able to install any registered beat type as pure JSON — the whole IR is
 * data, which is what makes replay work. What was missing was any way for a model to LEARN the
 * param shapes: the only description lived in TypeScript interfaces. So the capability existed and
 * went unused, and a director fell back to prose in `say` for every question.
 *
 * This module is the disclosure, and deliberately a PROJECTION rather than a second list: the tool
 * schema in `forge/tools.ts` and the help text in `format.ts` are two renderings of whatever is in
 * the registry the host actually compiled with, so a host-registered beat type documents itself and
 * nothing can drift.
 */

/** One beat type as a director is shown it. */
export interface BeatTypeCard {
  type: string;
  /** Advisory outcome event names, from `BeatDef.outcomes`. */
  outcomes: string[];
  /** Absent when the type ships no `paramsSchema` — see `BeatSchemas.undocumented`. */
  schema?: BeatParamsSchema;
}

export interface BeatSchemas {
  /** Documented types first (a director should reach for those), then the rest. */
  types: BeatTypeCard[];
  /** Registered types with no `paramsSchema`. A model cannot be expected to author these, so they
   *  are named but not offered — surfaced here so a host notices its own omission. */
  undocumented: string[];
}

/**
 * Project a beat registry into the director-facing schema list. Pure, cheap.
 *
 * REGISTRATION order, not alphabetical: it is deterministic either way, but the registry is
 * ordered plainest-first (`explain`, `mcq`, …) whereas sorting would open the list with `branch` —
 * the one type a director mostly cannot use. A reader who stops after the first entry should have
 * read the most useful one.
 */
export function beatSchemas(beats: BeatRegistry): BeatSchemas {
  const cards: BeatTypeCard[] = Object.keys(beats).map((type) => {
    const def = beats[type]!;
    const card: BeatTypeCard = { type, outcomes: def.outcomes ?? [] };
    if (def.paramsSchema) card.schema = def.paramsSchema;
    return card;
  });
  return {
    types: [...cards.filter((c) => c.schema), ...cards.filter((c) => !c.schema)],
    undocumented: cards.filter((c) => !c.schema).map((c) => c.type),
  };
}

/** The type names a director may pass as `spec.type`, documented ones first. */
export function beatTypeNames(s: BeatSchemas): string[] {
  return s.types.map((t) => t.type);
}

/**
 * A visual's ACCEPTED props, as the host declares them.
 *
 * `catalog()` can only report the props a beat happens to pass, which tells a director what the
 * lesson already does and not what the visual can do — the difference between "u, v are settable"
 * and "u, v, rays, image, labels, spin are settable". A registered visual is code, and code lives
 * outside `lesson/`, so the schema is passed IN by the host rather than looked up here.
 */
export interface VisualSchema {
  /** Prop name → one line on what it does, exactly as in `BeatParamsSchema.params`. */
  props: Record<string, string>;
  /**
   * One line: what it draws, and — the part that matters — anything it deliberately does NOT
   * model. A director that knows the apparatus has no aperture can build a figure that does;
   * one that has to infer it from the absence of a prop name usually guesses instead.
   */
  doc?: string;
}

/**
 * The BEAT TYPES help block: one paragraph per type, with a worked example.
 *
 * Rendered as text rather than JSON Schema because it goes into a system prompt beside
 * `COMMAND_HELP`, and there a compact example teaches more per token than a validator would. The
 * tool schema in `forge/` carries the machine-readable half.
 */
export function formatBeatTypes(s: BeatSchemas): string {
  const L: string[] = ['## BEAT TYPES (the `type` + `params` of an `addBeat` spec)'];
  for (const t of s.types) {
    if (!t.schema) continue;
    L.push(`  ${t.type}`);
    L.push(`    ${t.schema.doc}`);
    for (const [name, doc] of Object.entries(t.schema.params)) {
      const optional = name.startsWith("?");
      const key = optional ? name.slice(1) : name;
      L.push(`    ${optional ? " " : "*"} ${key.padEnd(16)} ${doc}`);
    }
    L.push(`      e.g. ${JSON.stringify(t.schema.example)}`);
  }
  L.push("  (* = required)");
  if (s.undocumented.length) {
    L.push(`  registered but undocumented, do not author: ${s.undocumented.join(" ")}`);
  }
  return L.join("\n");
}

/** The VISUALS help block: the reuse menu, with each visual's accepted props. */
export function formatVisuals(visuals: Record<string, VisualSchema>): string {
  const names = Object.keys(visuals).sort();
  const L: string[] = ["## VISUALS (registered by name — reuse with `say {show:{name}}` or a beat's `viz`)"];
  for (const name of names) {
    const v = visuals[name]!;
    L.push(`  ${name}`);
    if (v.doc) L.push(`    ${v.doc}`);
    for (const [prop, doc] of Object.entries(v.props)) L.push(`      ${prop.padEnd(12)} ${doc}`);
  }
  return L.join("\n");
}

/**
 * Everything a director needs to author a beat: the type schemas, the drawing vocabulary a `scene`
 * or a declarative `explorable` is written in, and the visuals it may reuse. One function so a host
 * cannot disclose half of it.
 */
export function formatAuthoring(beats: BeatRegistry, visuals?: Record<string, VisualSchema>): string {
  const parts = [formatBeatTypes(beatSchemas(beats)), formatSceneVocabulary(), formatBindings()];
  if (visuals && Object.keys(visuals).length) parts.push(formatVisuals(visuals));
  return parts.join("\n\n");
}
