// LAYER 2: modular acts (TypeScript port of act_registry.py).
//
// A lesson is just a list of small steps called "acts". Each act is one
// little chunk: an intro, an explanation, a picture, a wrap up. You edit two
// things: the act functions, and the actRegistry list at the bottom.
//
// An act can show a visual two ways:
//   - jsCall / jsArgs: call a ready made drawing function from vizLib. normal way.
//   - rawHtml: escape hatch for outside tools (Desmos, GeoGebra) that bring
//     their own script tags. only use this when vizLib can't do the job.


// What an act might need to know about the lesson.
// Put numbers your visuals depend on into `extra`.
export interface LessonContext {
  problemText: string;
  narrative?: string;
  plan?: Record<string, unknown>;
  extra?: Record<string, any>;
}

// What a single act hands back.
//   text:    the words shown to the student (required).
//   jsCall:  name of a vizLib function, like "showFractionBar". skip for text only.
//   jsArgs:  the options for that function, as an object.
//   rawHtml: literal HTML, only for outside embeds like Desmos.
export interface ActOutput {
  text: string;
  jsCall?: string;
  jsArgs?: Record<string, any>;
  rawHtml?: string;
}

// An act is just a function: ctx in, ActOutput out.
export type ActFn = (ctx: LessonContext) => ActOutput;

// One entry in a registry: a short name plus its function.
export type RegistryEntry = [string, ActFn];

// The plain shape run produces for the assembler.
export interface ActResult {
  name: string;
  text: string;
  jsCall: string | null;
  jsArgs: Record<string, any>;
  rawHtml: string | null;
}


// ---- EXAMPLE ACTS ----
// Copy any of these as a starting point. each is just ctx in, ActOutput out.

// A plain text opener. no visual.
export function introAct(ctx: LessonContext): ActOutput {
  return {
    text:
      "Let's work through this problem together:\n\n" +
      `${ctx.problemText}\n\n` +
      "Don't rush, we'll build the idea up one piece at a time.",
  };
}

// A plain text explanation of the plan. still no visual.
export function strategyAct(ctx: LessonContext): ActOutput {
  return {
    text:
      "Here's our strategy: instead of guessing, we'll break the shape into " +
      "pieces we already understand, measure each piece, and add them back up. " +
      "Small steps, no jumps.",
  };
}

// A visual act using the shared library (the normal way to draw).
// We name a vizLib function and hand it options. numbers come from ctx.extra.
export function fractionBarAct(ctx: LessonContext): ActOutput {
  const frac = ctx.extra?.fraction ?? { numerator: 1, denominator: 4 };
  return {
    text:
      `Picture ${frac.numerator} out of ${frac.denominator} of the whole. ` +
      "The shaded part of the bar below is exactly that fraction.",
    jsCall: "showFractionBar",
    jsArgs: {
      numerator: frac.numerator,
      denominator: frac.denominator,
      label: `${frac.numerator}/${frac.denominator} of the whole`,
    },
  };
}

// A visual act using the rawHtml escape hatch (an outside tool).
// Embeds a live Desmos calculator, which needs its own script tags, so vizLib
// can't do it. the circle equation is built from ctx.extra.
// NOTE: the apiKey below is Desmos's public demo key. for real use grab your
// own free key at https://www.desmos.com/api .
export function circleDesmosAct(ctx: LessonContext): ActOutput {
  const r = ctx.extra?.circleRadius ?? 5;
  const latex = `x^2 + y^2 = ${r}^2`;
  const divId = "desmos-circle";

  const raw = `<div id="${divId}" style="width: 600px; height: 400px; margin: 12px 0;"></div>
<script src="https://www.desmos.com/api/v1.11/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6"></script>
<script>
  (function () {
    var elt = document.getElementById("${divId}");
    var calc = Desmos.GraphingCalculator(elt, { expressionsCollapsed: true });
    calc.setExpression({ id: "circle", latex: "${latex}" });
  })();
</script>`;

  return {
    text:
      `Here is the circle x² + y² = ${r}² drawn live. Drag and zoom it to get ` +
      "a feel for how the radius controls the size.",
    rawHtml: raw,
  };
}

// A plain text closer. no visual.
export function wrapupAct(ctx: LessonContext): ActOutput {
  return {
    text:
      "And that's the whole idea. We broke the shape into pieces, measured each " +
      "one, and added them up, the same move works on much harder problems too. " +
      "Nice work.",
  };
}


// ---- EXTRA EXAMPLE ACTS (not in the running order by default) ----
// These aren't in actRegistry, so they don't run on their own. they're just
// ready made examples. wanna use one? copy its line into actRegistry below.
// demo.ts has a --preview mode that renders all three.

// A quick multiple choice check. buttons go green if right, red if wrong.
// You give it the question, the options, and which option is correct (0 = first).
export function multipleChoiceAct(ctx: LessonContext): ActOutput {
  return {
    text: "Quick gut check before we keep going.",
    jsCall: "showMultipleChoice",
    jsArgs: {
      question: "If the outer radius is 5, what's the area of the whole circle?",
      options: ["10π", "25π", "5π", "50π"],
      correctIndex: 1, // 25π is the right one
    },
  };
}

// An interactive slider the student can drag. value shows live next to the label.
// starting value comes from ctx.extra so it matches the lesson's data.
export function sliderAct(ctx: LessonContext): ActOutput {
  const r = ctx.extra?.circleRadius ?? 5;
  return {
    text: "Drag the slider and get a feel for how the radius changes things.",
    jsCall: "showSlider",
    jsArgs: { label: "radius", min: 1, max: 10, step: 1, default: r },
  };
}

// A plain data table, handy for organizing values or steps.
// headers is one flat list, rows is a list of lists. keep column counts lined up.
export function tableAct(ctx: LessonContext): ActOutput {
  return {
    text: "Let's drop the rings into a table so we don't lose track.",
    jsCall: "showTable",
    jsArgs: {
      headers: ["Ring", "Inner r", "Outer r", "Area"],
      rows: [
        [1, 0, 1, "π"],
        [2, 1, 2, "3π"],
        [3, 2, 3, "5π"],
      ],
    },
  };
}


// ---- THE PART A TEACHER EDITS ----
// The running order of the lesson. each entry is ["a short name", theFunction].
// reorder lines to reorder the lesson, delete a line to drop an act, add a line
// to add one. any number of acts is fine.
export const actRegistry: RegistryEntry[] = [
  ["intro", introAct],
  ["strategy", strategyAct],
  ["fraction_bar", fractionBarAct],
  ["circle", circleDesmosAct],
  ["wrapup", wrapupAct],
];


// ---- The runner. you normally don't change this. ----
// Walk the registry top to bottom, call each act, collect plain objects with
// keys name/text/jsCall/jsArgs/rawHtml. pass your own registry to preview a
// different order without editing actRegistry.
export function runAllActs(
  ctx: LessonContext,
  registry: RegistryEntry[] = actRegistry
): ActResult[] {
  const results: ActResult[] = [];
  for (const [name, fn] of registry) {
    const out = fn(ctx);
    results.push({
      name,
      text: out.text,
      jsCall: out.jsCall ?? null,
      jsArgs: out.jsArgs ?? {},
      rawHtml: out.rawHtml ?? null,
    });
  }
  return results;
}
