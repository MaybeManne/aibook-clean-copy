// LAYER 3: Lesson (teacher-facing lesson builder).
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

import type { LessonContext, ActOutput, ActFn, RegistryEntry } from "./actRegistry.ts";


// tiny HTML escaper for the rawHtml methods (so a stray < or & can't break the page).
function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}


export class Lesson {
  title: string;
  problemText: string;
  narrative?: string;

  // the acts a teacher adds, in order. kept private so getRegistry() is the only
  // way out (it hands back the same shape runAllActs() already understands).
  private _registry: RegistryEntry[];
  // counter so each graph embed gets its own DOM id even if a lesson has several.
  private _graphCount: number;

  constructor(title: string, problemText: string) {
    this.title = title;
    this.problemText = problemText;
    this._registry = [];
    this._graphCount = 0;
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
<script src="https://www.desmos.com/api/v1.11/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6"></script>
<script>
  (function () {
    var elt = document.getElementById("${divId}");
    var calc = Desmos.GraphingCalculator(elt, { expressionsCollapsed: true });
${exprs}
  })();
</script>`;
  }
}
