import { DIRECTOR_OPS, type DirectorCommand, type DirectorOp } from "../lesson/direction/protocol.js";
import { needsReview, permits, type Capabilities } from "../lesson/direction/capabilities.js";
import { beatSchemas, type BeatSchemas } from "../lesson/direction/schemas.js";
import { defaultBeatRegistry, type BeatRegistry } from "../lesson/beats/index.js";

/** The wire shape of one tool, as the Messages API takes it. Provider-shaped on purpose:
 *  this object is passed straight through, so there is no schema dialect of our own. */
export interface ToolSpec {
  name: string;
  description: string;
  input_schema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
}

/** The pseudo-tool for "no commands this turn". Never becomes a `DirectorCommand`. */
export const DONE_TOOL = "done";

const POINT = {
  type: "array",
  items: { type: "number" },
  minItems: 2,
  maxItems: 2,
  description: "[x,y] in NORMALIZED stage coordinates: 0..1, origin top-left.",
} as const;

const RECT = {
  type: "object",
  properties: {
    x: { type: "number" },
    y: { type: "number" },
    w: { type: "number" },
    h: { type: "number" },
  },
  required: ["x", "y", "w", "h"],
  description: "A window on the stage in normalized 0..1 coordinates, origin top-left.",
} as const;

const ANNOTATION = {
  type: "object",
  description:
    "One mark drawn over the stage. `kind` selects the shape: " +
    'arrow{from,to}, circle{at,r}, rect{rect}, label{at,text}, ink{points}. All coordinates normalized 0..1.',
  properties: {
    kind: { type: "string", enum: ["arrow", "circle", "rect", "label", "ink"] },
    from: POINT,
    to: POINT,
    at: POINT,
    r: { type: "number", description: "circle radius, normalized" },
    rect: RECT,
    points: { type: "array", items: POINT, description: "ink stroke" },
    text: { type: "string", description: "label text" },
    label: { type: "string", description: "caption on an arrow/circle/rect" },
    color: { type: "string", description: "CSS color; omit for the default accent" },
  },
  required: ["kind"],
} as const;

/**
 * The `addBeat` payload schema, built from the beat registry rather than written out.
 *
 * The old version said `params: {type: "object"}` and named three types in prose, which is a schema
 * that technically permits every beat and teaches none of them. Now `type` carries a real enum and
 * `params` carries a per-type description with a worked example, both projected from
 * `BeatDef.paramsSchema` — so registering a beat type is all it takes to make it authorable.
 */
function beatSpecSchema(schemas?: BeatSchemas): Record<string, unknown> {
  const base =
    "A beat in the lesson IR: {id, type, params, next?}. `next` is the beat id Continue goes to, " +
    "or null to end. PURE JSON — no functions; guards/actions by name only.";
  if (!schemas || !schemas.types.some((t) => t.schema)) {
    return {
      type: "object",
      description: `${base} \`type\` is a registered beat type (explain, mcq, explorable, scene, …).`,
      properties: { id: { type: "string" }, type: { type: "string" }, params: { type: "object" }, next: { type: ["string", "null"] } },
      required: ["id", "type"],
    };
  }
  const documented = schemas.types.filter((t) => t.schema);
  const lines = documented.map((t) => {
    const req: string[] = [];
    const opt: string[] = [];
    for (const [name, doc] of Object.entries(t.schema!.params)) {
      (name.startsWith("?") ? opt : req).push(`${name.replace(/^\?/, "")} (${doc})`);
    }
    const optPart = opt.length ? `; optional: ${opt.join("; ")}` : "";
    return `${t.type}: ${t.schema!.doc} REQUIRED: ${req.join("; ")}${optPart}. Example params: ${JSON.stringify(t.schema!.example)}`;
  });
  return {
    type: "object",
    description: base,
    properties: {
      id: { type: "string", description: "A new, unique beat id. Kebab-case; do not reuse an existing one." },
      type: { type: "string", enum: documented.map((t) => t.type), description: "Which kind of beat to author." },
      params: {
        type: "object",
        description: `The params for the chosen \`type\`.\n\n${lines.join("\n\n")}`,
      },
      next: { type: ["string", "null"] },
    },
    required: ["id", "type", "params"],
  };
}

const ANY_JSON = { description: "Any JSON value (number, string, boolean, array, object)." } as const;

function obj(properties: Record<string, unknown>, required: string[] = []): ToolSpec["input_schema"] {
  return required.length ? { type: "object", properties, required } : { type: "object", properties };
}

interface ToolEntry {
  description: string;
  input_schema: ToolSpec["input_schema"];
}

const TABLE: Record<DirectorOp, ToolEntry> = {
  say: {
    description:
      "Answer in your own voice. Adds a new explain beat, entered NOW; Continue returns the learner " +
      "to where they were. This is the default move for a question. Omit `resume` to come back to " +
      "the beat they are on; omit `show` to keep the visual they are looking at.",
    input_schema: obj(
      {
        text: { type: "string", description: "Markdown + $math$. 1–3 sentences; you are speaking, not writing a chapter." },
        narrate: { type: "string", description: "Spoken variant. Omit for silence — TeX read aloud is worse than nothing." },
        resume: { type: ["string", "null"], description: "Beat id Continue returns to; null ends the lesson." },
        exits: {
          description:
            'How the answer ends. "both" offers two buttons — back to where they were, or on to ' +
            "what follows it — so the detour is a fork, not a rewind. A list gives exact buttons.",
          oneOf: [
            { type: "string", enum: ["both"] },
            {
              type: "array",
              items: obj({ label: { type: "string" }, to: { type: ["string", "null"] } }, ["label", "to"]),
            },
          ],
        },
        show: {
          type: "object",
          description: "Reuse a visual: {like:<beatId>} borrows that beat's stage, or {name, props} names one.",
          properties: { like: { type: "string" }, name: { type: "string" }, props: { type: "object" }, persistent: { type: "boolean" } },
        },
      },
      ["text"],
    ),
  },
  revisit: {
    description:
      "Show an existing beat again WITHOUT moving the learner: a clone of it is entered now, posed " +
      "with their current control values, and Continue brings them back. Reach for this instead of " +
      "`goto` whenever you want to re-show a figure — their place is never lost.",
    input_schema: obj(
      {
        beatId: { type: "string" },
        note: { type: "string", description: "One line of your own framing, shown with the clone." },
        resume: { type: ["string", "null"] },
      },
      ["beatId"],
    ),
  },
  goto: {
    description:
      "Move the learner to an existing beat now, changing no edges. The bluntest move in the " +
      "protocol: they LOSE their place. Prefer `revisit` unless you mean to change where they are.",
    input_schema: obj({ beatId: { type: "string" } }, ["beatId"]),
  },
  addBeat: {
    description:
      "Add a beat to the live lesson. `enter` (default true) jumps into it; pass false to add it for " +
      "later and wire it with `setNext`. Use this when you want a real interaction — an mcq, an " +
      "explorable — rather than prose (that is `say`).",
    input_schema: obj({ spec: beatSpecSchema(), enter: { type: "boolean" } }, ["spec"]),
  },
  patchBeat: {
    description:
      "Re-author an EXISTING beat's params in place (shallow merge): reword an explain, re-pose its " +
      "figure. The beat is re-validated, and its advance edge survives.",
    input_schema: obj({ beatId: { type: "string" }, params: { type: "object" } }, ["beatId", "params"]),
  },
  setNext: {
    description: "Point a beat's Continue at a different beat (or null to end the lesson there).",
    input_schema: obj({ beatId: { type: "string" }, target: { type: ["string", "null"] } }, ["beatId", "target"]),
  },
  rerouteBeat: {
    description:
      "Rewrite one named edge of a beat — use this for a non-advance edge (a gate's wrong-answer " +
      "detour). For the ordinary Continue edge, `setNext` is the same thing, shorter.",
    input_schema: obj(
      {
        beatId: { type: "string" },
        edge: {
          type: "object",
          properties: { on: { type: "string", description: 'Event key of the edge. Default "next".' }, target: { type: ["string", "null"] } },
          required: ["target"],
        },
      },
      ["beatId", "edge"],
    ),
  },
  setControl: {
    description:
      "Set one control on the visual the learner is looking at — the same channel their own slider " +
      'writes, so a guided goal releases exactly as if they had dragged it. "Watch what happens at v=13."',
    input_schema: obj({ key: { type: "string" }, value: ANY_JSON, beatId: { type: "string" } }, ["key", "value"]),
  },
  setControls: {
    description: "Set several controls as ONE gesture (load a preset, pose a figure).",
    input_schema: obj({ values: { type: "object" }, beatId: { type: "string" } }, ["values"]),
  },
  workspace: {
    description:
      "Patch the visual's own props — highlight, camera, overlay: anything that is not a learner " +
      "control. `label` is the phrase the transcript shows for what you did.",
    input_schema: obj({ props: { type: "object" }, label: { type: "string" }, beatId: { type: "string" } }, ["props"]),
  },
  focus: {
    description:
      'Zoom the stage. Either `at`+`scale` ("3× on the hole") or an explicit `rect`; `clear:true` ' +
      "returns to the whole stage. Works on EVERY visual — it is a transform on the stage, not a " +
      "camera the viz has to offer.",
    input_schema: obj({ at: POINT, scale: { type: "number" }, rect: RECT, label: { type: "string" }, clear: { type: "boolean" } }),
  },
  annotate: {
    description:
      "Draw over the stage. `shapes` REPLACES the current marks (drawing is a statement, not an " +
      "accumulation); `clear:true` erases. Point at the thing you are talking about.",
    input_schema: obj({ shapes: { type: "array", items: ANNOTATION }, clear: { type: "boolean" } }),
  },
  hold: {
    description:
      "Stop the learner advancing while you set something up; they are shown your reason. Always " +
      "`release` afterwards — a forgotten hold is a stuck lesson.",
    input_schema: obj({ reason: { type: "string" } }),
  },
  release: {
    description: "Release a hold and let the learner continue.",
    input_schema: obj({}),
  },
};

const DONE_ENTRY: ToolEntry = {
  description:
    "Say nothing and change nothing this turn. The right answer whenever the learner is working " +
    "and does not need you: interrupting a learner who is thinking is a cost, not a neutral act.",
  input_schema: obj({ why: { type: "string", description: "One line, for the log. Optional." } }),
};

const EXTRA = Object.keys(TABLE).filter((k) => !(DIRECTOR_OPS as readonly string[]).includes(k));
if (EXTRA.length) throw new Error(`forge/tools.ts: tool(s) with no matching op: ${EXTRA.join(" ")}`);

/**
 * The tools a director may call under `caps`. Capabilities are applied here as well as in
 * `adjudicate`: adjudication is the enforcement, a withheld tool is the explanation — an
 * `OBSERVE_ONLY` director offered only `done` understands its regime immediately.
 */
export function directorTools(caps: Capabilities, opts: { done?: boolean; beats?: BeatRegistry } = {}): ToolSpec[] {
  const schemas = beatSchemas(opts.beats ?? defaultBeatRegistry());
  const tools: ToolSpec[] = [];
  for (const op of DIRECTOR_OPS) {
    if (!permits(caps, op) || needsReview(caps, op)) continue;
    const e = TABLE[op];
    if (op === "addBeat") {
      const authorable = schemas.types.filter((t) => t.schema).map((t) => t.type);
      tools.push({
        name: op,
        description: `${e.description} Types you may author: ${authorable.join(", ")}.`,
        input_schema: obj({ spec: beatSpecSchema(schemas), enter: { type: "boolean" } }, ["spec"]),
      });
      continue;
    }
    tools.push({ name: op, description: e.description, input_schema: e.input_schema });
  }
  if (opts.done !== false) tools.push({ name: DONE_TOOL, description: DONE_ENTRY.description, input_schema: DONE_ENTRY.input_schema });
  return tools;
}

/** Every tool, unrestricted — tier 3 as specified. Identical to `directorTools(FULL)`. */
export function allDirectorTools(beats?: BeatRegistry): ToolSpec[] {
  return directorTools({ name: "full", allow: "*" }, beats ? { beats } : {});
}

/** Is this tool name an op (as opposed to `done`, or something the model invented)? */
export function isDirectorOp(name: string): name is DirectorOp {
  return (DIRECTOR_OPS as readonly string[]).includes(name);
}

/** One tool call as the provider reports it. */
export interface ToolCall {
  id: string;
  name: string;
  input: Record<string, unknown>;
}

export interface ParsedTurn {
  /** The commands, in the order the model called them — ONE atomic director turn. */
  commands: DirectorCommand[];
  /** True if the model explicitly chose to do nothing. */
  done: boolean;
  /** Tool names that are neither an op nor `done`. Reported, not thrown: a hallucinated
   *  tool is feedback for the next prompt, and the valid calls in the same turn still stand. */
  unknown: string[];
}

/**
 * Turn tool calls into a director turn. The mapping is `{op: name, ...input}`. Does NOT
 * validate — `adjudicate` does that, and its verdict is what the model reads next.
 */
export function commandsFromCalls(calls: ToolCall[]): ParsedTurn {
  const commands: DirectorCommand[] = [];
  const unknown: string[] = [];
  let done = false;
  for (const c of calls) {
    if (c.name === DONE_TOOL) {
      done = true;
      continue;
    }
    if (!isDirectorOp(c.name)) {
      unknown.push(c.name);
      continue;
    }
    const { ...input } = c.input ?? {};
    delete (input as Record<string, unknown>).op;
    commands.push({ op: c.name, ...input } as unknown as DirectorCommand);
  }
  return { commands, done, unknown };
}
