// LAYER 3: Lesson (teacher-facing lesson builder).
// Now extends the Layer 0 StateMachine base (the state graph gets rebuilt in run() later).
//
// This is the nicest layer a teacher touches. you make a Lesson, add acts to it,
// and use the prebuilt visual methods (fractionBar, multipleChoice, slider, table,
// latex, graph). you never hand-write jsCall / jsArgs / rawHtml.
//
// HOW THE LAYERS STACK (top = what the teacher sees):
//   1. teacher        ->  lesson.fractionBar(1, 4, "a quarter")
//   2. Lesson method  ->  returns an ActOutput that NAMES a vizLib function (jsCall)
//   3. vizLib         ->  the real draw function (showFractionBar) in layer2Assembler.ts
//   4. assembler      ->  drops ONE line of JS into the page that calls that vizLib fn
// for latex and graph there's no vizLib function, so those Lesson methods hand back
// rawHtml (a small embed/snippet) instead. either way the teacher never sees the
// plumbing underneath.
//
// NO `extra` junk-drawer. Shaden asked for it gone. data goes in through method
// arguments directly, and the lesson context only ever carries problemText (and
// narrative, if you set one). nothing else rides along.

import type { LessonContext, ActOutput, ActFn, RegistryEntry, ActResult } from "./actRegistry.ts";
import { StateMachine } from "./stateMachine.ts";
import { type LessonTemplate, type TemplateOverrides, getPreset, mergeTemplate } from "./templates.ts";


// tiny HTML escaper for the rawHtml methods (so a stray < or & can't break the page).
function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}


// ---- visualize() arg guards + registry ----
// small type guards so each registry entry's validate() stays one line.
const isNum = (v: any) => typeof v === "number" && !Number.isNaN(v);
const isStr = (v: any) => typeof v === "string";
const isArr = (v: any) => Array.isArray(v);
const isStrArr = (v: any) => isArr(v) && v.every(isStr);
// require(condition, message): throw the descriptive error if the check fails.
const need = (ok: boolean, msg: string) => { if (!ok) throw new Error(msg); };

// one entry per prebuilt visual: how to validate its args, the error to throw if
// they're wrong, and how to call the matching Lesson method. visualize() just looks
// the type up here, so adding a visual is a registry entry, not a switch case.
interface VisualEntry {
  validate: (args: Record<string, any>) => boolean;
  message: string;
  call: (lesson: Lesson, args: Record<string, any>) => ActOutput;
}

const VISUAL_REGISTRY: Record<string, VisualEntry> = {
  fractionBar: {
    validate: (a) => isNum(a.numerator) && isNum(a.denominator),
    message: `visualize("fractionBar") requires args.numerator and args.denominator to be numbers.`,
    call: (l, a) => l.fractionBar(a.numerator, a.denominator, a.label),
  },
  multipleChoice: {
    validate: (a) => isStr(a.question) && isArr(a.options) && isNum(a.correctIndex),
    message: `visualize("multipleChoice") requires args.question to be a string, args.options to be an array, and args.correctIndex to be a number.`,
    call: (l, a) => l.multipleChoice(a.question, a.options, a.correctIndex),
  },
  slider: {
    validate: (a) => isStr(a.label) && isNum(a.min) && isNum(a.max) && isNum(a.step) && isNum(a.defaultValue),
    message: `visualize("slider") requires args.label to be a string and args.min, args.max, args.step, args.defaultValue to be numbers.`,
    call: (l, a) => l.slider(a.label, a.min, a.max, a.step, a.defaultValue),
  },
  table: {
    validate: (a) => isStrArr(a.headers) && isArr(a.rows) && a.rows.every(isArr),
    message: `visualize("table") requires args.headers to be an array of strings and args.rows to be an array of arrays.`,
    call: (l, a) => l.table(a.headers, a.rows),
  },
  numberLine: {
    validate: (a) => isNum(a.min) && isNum(a.max),
    message: `visualize("numberLine") requires args.min and args.max to be numbers.`,
    call: (l, a) => l.numberLine(a.min, a.max, a.points, a.labels),
  },
  coordinatePlane: {
    validate: (a) =>
      isArr(a.xRange) && a.xRange.length === 2 && a.xRange.every(isNum) &&
      isArr(a.yRange) && a.yRange.length === 2 && a.yRange.every(isNum),
    message: `visualize("coordinatePlane") requires args.xRange and args.yRange to each be a [number, number] array.`,
    call: (l, a) => l.coordinatePlane(a.xRange, a.yRange, a.points, a.lines),
  },
  highlight: {
    validate: (a) => isStr(a.text),
    message: `visualize("highlight") requires args.text to be a string.`,
    call: (l, a) => l.highlight(a.text, a.color),
  },
  stepList: {
    validate: (a) => isStrArr(a.steps) && a.steps.length > 0,
    message: `visualize("stepList") requires args.steps to be a non-empty array of strings.`,
    call: (l, a) => l.stepList(a.steps),
  },
  barChart: {
    validate: (a) =>
      isStrArr(a.labels) && isArr(a.values) && a.values.every(isNum) &&
      a.labels.length === a.values.length,
    message: `visualize("barChart") requires args.labels to be an array of strings and args.values to be an array of numbers of the same length.`,
    call: (l, a) => l.barChart(a.labels, a.values, a.title),
  },
  vennDiagram: {
    validate: (a) =>
      (isNum(a.setA) || isStr(a.setA)) && (isNum(a.setB) || isStr(a.setB)) &&
      (isNum(a.intersection) || isStr(a.intersection)),
    message: `visualize("vennDiagram") requires args.setA, args.setB, and args.intersection to each be a number or string.`,
    call: (l, a) => l.vennDiagram(a.setA, a.setB, a.intersection, a.labels),
  },
  pieChart: {
    validate: (a) =>
      isArr(a.slices) && a.slices.length > 0 &&
      a.slices.every((s: any) => s && isStr(s.label) && isNum(s.value)),
    message: `visualize("pieChart") requires args.slices to be a non-empty array of { label: string, value: number } objects.`,
    call: (l, a) => l.pieChart(a.slices),
  },
  boxPlot: {
    validate: (a) => isNum(a.min) && isNum(a.q1) && isNum(a.median) && isNum(a.q3) && isNum(a.max),
    message: `visualize("boxPlot") requires args.min, args.q1, args.median, args.q3, and args.max to be numbers.`,
    call: (l, a) => l.boxPlot(a.min, a.q1, a.median, a.q3, a.max, a.label),
  },
  callout: {
    validate: (a) => isStr(a.text),
    message: `visualize("callout") requires args.text to be a string.`,
    call: (l, a) => l.callout(a.text, a.style),
  },
  latex: {
    validate: (a) => isStr(a.expression),
    message: `visualize("latex") requires args.expression to be a string.`,
    call: (l, a) => l.latex(a.expression),
  },
  graph: {
    validate: (a) => isStrArr(a.equations) && a.equations.length > 0,
    message: `visualize("graph") requires args.equations to be a non-empty array of strings.`,
    call: (l, a) => l.graph(a.equations, a.options ?? {}),
  },
};


// the bookend states for a Lesson run (the act states come from the registry).
// SM contants
const IDLE = "IDLE";
const DONE = "DONE";
const ERROR = "ERROR";

// build the linear transition table: IDLE -> act0 -> ... -> actN -> DONE, plus a
// "fail" edge to ERROR on each act. (moved here from lessonStateMachine.ts.)
function buildLinearTransitions(actNames: string[]): Record<string, Record<string, string>> {
  const chain = [IDLE, ...actNames, DONE];
  const transitions: Record<string, Record<string, string>> = {};
  for (let i = 0; i < chain.length - 1; i++) {
    transitions[chain[i]] = { next: chain[i + 1] };
  }
  for (const name of actNames) {
    transitions[name].fail = ERROR;
  }
  transitions[DONE] = {};
  transitions[ERROR] = {};
  return transitions;
}


export class Lesson extends StateMachine {
  title: string;
  problemText: string;
  narrative?: string;

  // the acts a teacher adds, in order. kept private so getRegistry() is the only
  // way out (it hands back the same shape runAllActs() already understands).
  private _registry: RegistryEntry[];
  // counter so each graph embed gets its own DOM id even if a lesson has several.
  private _graphCount: number;

  // if a run hits ERROR, these say what broke.
  failedAct: string | null = null;
  error: string | null = null;
  // collected act results from the last run(), in act order.
  private _results: ActResult[] = [];

  // the look/layout applied when this lesson is rendered to HTML. starts on the
  // "default" preset; setTemplate()/customizeTemplate() change it. presentation
  // only — it never affects the acts or the state machine.
  private _template: LessonTemplate;

  constructor(title: string, problemText: string) {
    super([], {}, "IDLE");
    this.title = title;
    this.problemText = problemText;
    this._registry = [];
    this._graphCount = 0;
    this._template = getPreset("default");
  }

  // ---- templates (presentation only) ----

  // start from a named preset ("default" / "dark" / "minimal"). throws on a typo.
  setTemplate(name: string): this {
    this._template = getPreset(name);
    return this;
  }

  // override specific fields on the current template, e.g.
  //   lesson.customizeTemplate({ colors: { background: "#ff0000" }, fonts: { title: "Georgia" } })
  //   lesson.customizeTemplate({ layout: { visualPosition: "right" } })  // flip the columns
  // partial nested groups are fine; anything not mentioned is kept.
  customizeTemplate(overrides: TemplateOverrides): this {
    this._template = mergeTemplate(this._template, overrides);
    return this;
  }

  // the resolved template to hand to assembleLesson(results, title, template).
  getTemplate(): LessonTemplate {
    return this._template;
  }

  // ---- building the lesson ----

  // add one act. fn is an ActFn (ctx in, ActOutput out) — same type the rest of the
  // pipeline uses. returns `this` so you can chain addAct(...).addAct(...).
  addAct(name: string, fn: ActFn): this {
    this._registry.push([name, fn]);
    return this;
  }

  // optional: attach a narrative (the worked solution / story).
  setNarrative(narrative: string): this {
    this.narrative = narrative;
    return this;
  }

  // hand back the acts as a RegistryEntry[] so you can feed it straight to
  // runAllActs(lesson.toContext(), lesson.getRegistry()).
  getRegistry(): RegistryEntry[] {
        return this._registry;
  }

  // the context every act receives. ONLY problemText (and narrative if set).
  // no extra field — that was the whole point.
  toContext(): LessonContext {
    const ctx: LessonContext = { problemText: this.problemText };
    if (this.narrative !== undefined) ctx.narrative = this.narrative;
    return ctx;
  }

  // ─────────────────────────────────────────────────────────────────
  // Running the lesson as a state machine (we inherit the Layer 0 base).
  //
  // run() rebuilds the state graph from the CURRENT registry at call time, then
  // steps through every act as a state. each act state's handler calls the ActFn
  // and stashes the result. getResults() hands back what was collected.
  // ─────────────────────────────────────────────────────────────────

  // rebuild the state graph from the acts added so far, then run to DONE/ERROR.
  // returns the final state; call getResults() afterward for the ActResult[].
  async run(): Promise<string> {
    const actNames = this._registry.map(([name]) => name);
    this.states = new Set([IDLE, ...actNames, DONE, ERROR]);
    this.transitions = buildLinearTransitions(actNames);
    this.state = IDLE;
    this.handlers = {};
    for (const [name, fn] of this._registry) {
      this.register(name, () => this._runAct(name, fn));
    }
    this._results = [];
    this.failedAct = null;
    this.error = null;
    return this._runToDone();
  }

  // the collected results from the last run(), in act order, ready for assembleLesson().
  getResults(): ActResult[] {
    return this._results;
  }

  // keep firing "next" until DONE; on a throwing act, fire "fail" -> ERROR.
  // async because the inherited trigger() is async.
  private async _runToDone(): Promise<string> {
    while (this.state !== DONE && this.state !== ERROR) {
      try {
        await this.trigger("next"); // move to the next act AND run its handler
      } catch (e: any) {
        this.failedAct = this.state;
        this.error = String(e?.message ?? e);
        await this.trigger("fail"); // -> ERROR
        console.log(`[Lesson] FAILED in ${this.failedAct}: ${e?.message ?? e}`);
        return this.state;
      }
    }
    if (this.state === DONE) console.log("[Lesson] Complete.");
    return this.state;
  }

  // run one act: call its ActFn with the lesson context, stash the result, log it.
  private _runAct(name: string, fn: ActFn): void {
    const out = fn(this.toContext());
    this._results.push({
      name,
      text: out.text,
      jsCall: out.jsCall ?? null,
      jsArgs: out.jsArgs ?? {},
      rawHtml: out.rawHtml ?? null,
    });
    console.log(`[Lesson] ran act: ${name}`);
  }

  // ─────────────────────────────────────────────────────────────────
  // Prebuilt visual methods (the teacher-facing layer).
  //
  // each returns a COMPLETE ActOutput. the teacher just calls the method; the
  // jsCall / jsArgs (or rawHtml) wiring is filled in here, one layer down.
  // ─────────────────────────────────────────────────────────────────

  // a fraction bar. layering: teacher -> here -> vizLib.showFractionBar.
  fractionBar(numerator: number, denominator: number, label?: string): ActOutput {
    return {
      text: "",
      jsCall: "showFractionBar",
      jsArgs: { numerator, denominator, label },
    };
  }

  // a multiple choice question. layering: teacher -> here -> vizLib.showMultipleChoice.
  // correctIndex is 0-based (0 = the first option).
  multipleChoice(question: string, options: string[], correctIndex: number): ActOutput {
    return {
      text: "",
      jsCall: "showMultipleChoice",
      jsArgs: { question, options, correctIndex },
    };
  }

  // a drag slider. layering: teacher -> here -> vizLib.showSlider.
  // note: vizLib's option is called `default`, so we map defaultValue onto it here.
  slider(label: string, min: number, max: number, step: number, defaultValue: number): ActOutput {
        return {
            text: "",
            jsCall: "showSlider",
            jsArgs: { label, min, max, step, default: defaultValue },
     };
}
  // a data table. layering: teacher -> here -> vizLib.showTable.
  // headers is one flat list, rows is a list of rows (each its own list of cells).
  table(headers: string[], rows: any[][]): ActOutput {
    return {
      text: "",
      jsCall: "showTable",
      jsArgs: { headers, rows },
    };
  }

  // inline math. there's no vizLib function for math, so this lays the expression
  // down as rawHtml: it renders with KaTeX if the page has it, otherwise it leaves a
  // <span class="katex"> holding the raw LaTeX for the assembler / page to style.
  // teacher -> here -> rawHtml (no jsCall).
  latex(expression: string): ActOutput {
    const exprJs = JSON.stringify(expression); // safely escapes backslashes/quotes for JS
    const raw =
      `<span class="katex">${escapeHtml(expression)}</span>\n` +
      `<script>(function(){var el=document.currentScript.previousElementSibling;` +
      `if(window.katex){try{window.katex.render(${exprJs}, el);}catch(e){}}})();</script>`;
    return { text: "", rawHtml: raw };
  }

  // a live graph. the teacher passes LaTeX equation strings only. the actual embed
  // lives in _desmosEmbed() below (not inline) so we can swap backends later without
  // touching act code: graphBackend defaults to "desmos" but accepts any string.
  // teacher -> here -> _desmosEmbed -> rawHtml.
  graph(equations: string[], options: { graphBackend?: string; [key: string]: any } = {}): ActOutput {
    const backend = options.graphBackend ?? "desmos";
    if (backend === "desmos") {
      return { text: "", rawHtml: this._desmosEmbed(equations, options) };
    }
    // other backends aren't wired up yet. the act code doesn't change when they are —
    // only this method does.
    throw new Error(`Unknown graph backend: '${backend}' (only 'desmos' is implemented so far).`);
  }

  // a horizontal number line with optional marked points.
  // teacher -> here -> vizLib.showNumberLine.
  numberLine(min: number, max: number, points?: number[], labels?: string[]): ActOutput {
    return {
      text: "",
      jsCall: "showNumberLine",
      jsArgs: { min, max, points, labels },
    };
  }

  // a simple x/y grid with optional plotted points and line segments.
  // teacher -> here -> vizLib.showCoordinatePlane.
  coordinatePlane(
    xRange: [number, number],
    yRange: [number, number],
    points?: number[][],
    lines?: number[][][]
  ): ActOutput {
    return {
      text: "",
      jsCall: "showCoordinatePlane",
      jsArgs: { xRange, yRange, points, lines },
    };
  }

  // calls attention to a key step by boxing it in a colored highlight.
  // teacher -> here -> vizLib.showHighlight.
  highlight(text: string, color?: string): ActOutput {
    return {
      text: "",
      jsCall: "showHighlight",
      jsArgs: { text, color },
    };
  }

  // a numbered list of solution steps. teacher -> here -> vizLib.showStepList.
  stepList(steps: string[]): ActOutput {
    return {
      text: "",
      jsCall: "showStepList",
      jsArgs: { steps },
    };
  }

  // a simple bar chart. teacher -> here -> vizLib.showBarChart.
  barChart(labels: string[], values: number[], title?: string): ActOutput {
    return {
      text: "",
      jsCall: "showBarChart",
      jsArgs: { labels, values, title },
    };
  }

  // two overlapping circles with labels. teacher -> here -> vizLib.showVennDiagram.
  vennDiagram(
    setA: number | string,
    setB: number | string,
    intersection: number | string,
    labels?: string[]
  ): ActOutput {
    return {
      text: "",
      jsCall: "showVennDiagram",
      jsArgs: { setA, setB, intersection, labels },
    };
  }

  // a pie chart, useful for fraction / ratio problems.
  // teacher -> here -> vizLib.showPieChart.
  pieChart(slices: { label: string; value: number; color?: string }[]): ActOutput {
    return {
      text: "",
      jsCall: "showPieChart",
      jsArgs: { slices },
    };
  }

  // a box-and-whisker plot. teacher -> here -> vizLib.showBoxPlot.
  boxPlot(min: number, q1: number, median: number, q3: number, max: number, label?: string): ActOutput {
    return { text: "", jsCall: "showBoxPlot", jsArgs: { min, q1, median, q3, max, label } };
  }

  // a colored callout box. teacher -> here -> vizLib.showCallout.
  callout(text: string, style?: "info" | "warning" | "success"): ActOutput {
    return { text: "", jsCall: "showCallout", jsArgs: { text, style } };
  }

  // ---- generic dispatch ----

  /**
   * Generic entry point for the agent to trigger any prebuilt visual.
   * @param type - the visual type, e.g. "fractionBar", "barChart", "graph"
   * @param args - the args for that visual, e.g. { numerator: 3, denominator: 8 }
   * @returns ActOutput ready to pass into addAct()
   */
  visualize(type: string, args: Record<string, any>): ActOutput {
    const entry = VISUAL_REGISTRY[type];
    if (!entry) {
      throw new Error(
        `Unknown visual type: '${type}'. Expected one of: ${Object.keys(VISUAL_REGISTRY).join(", ")}.`
      );
    }
    need(entry.validate(args), entry.message);
    return entry.call(this, args);
  }

  // ---- private helpers (a teacher never calls these) ----

  // build a Desmos embed for the given LaTeX equations. returns rawHtml.
  // NOTE: the apiKey below is Desmos's public demo key. for real use, get your own
  // free key at https://www.desmos.com/api .
  private _desmosEmbed(equations: string[], _options: { [key: string]: any } = {}): string {
    const divId = `desmos-${this._graphCount++}`;
    const exprs = equations
      .map((latex, i) => `    calc.setExpression({ id: "eq${i}", latex: ${JSON.stringify(latex)} });`)
      .join("\n");
    return `<div id="${divId}" style="width: 600px; height: 400px; margin: 12px 0;"></div>
<script src="https://www.desmos.com/api/v1.12/calculator.js?apiKey=e2cc6f2eaa9a470288357616d5c75869"></script>
<script>
  (function () {
    var elt = document.getElementById("${divId}");
    var calc = Desmos.GraphingCalculator(elt, { expressionsCollapsed: true });
${exprs}
  })();
</script>`;
  }
}
