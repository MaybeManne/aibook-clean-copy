// DEPRECATED: Lesson now extends StateMachine directly (see lesson.ts).
// this file is kept for reference only and will be removed in a future
// cleanup. do not use LessonStateMachine in new code.
//
// LAYER 3: LessonStateMachine — runs a Lesson's acts AS states.
//
// This is the Layer 3 state machine. it INHERITS the Layer 0 generic base
// (StateMachine in stateMachine.ts) — it does not re-implement states/transitions/
// trigger; it just builds a state graph out of a Lesson and registers handlers.
//
// HOW IT MAPS A LESSON ONTO STATES:
//   lesson.getRegistry() gives us [name, ActFn][] in order. we turn that into a
//   linear chain of states, one per act:
//       IDLE -> act0 -> act1 -> ... -> actN -> DONE
//   every act state also gets a "fail" edge to ERROR. entering an act state runs
//   its handler, which calls the ActFn and stashes the ActOutput as an ActResult.
//
// ASYNC NOTE: act functions are synchronous (they just return an ActOutput, no API
// calls). BUT the inherited base StateMachine.trigger() is async (Promise-based), so
// run()/_runToDone() await it — same pattern as PipelineStateMachine. that await is
// what lets a throwing act be caught and routed to "fail" -> ERROR; a plain sync loop
// would turn the throw into an unhandled rejection and skip the fail path.

import { pathToFileURL } from "url";

import { StateMachine } from "./stateMachine.ts";
import { Lesson } from "./lesson.ts";
import type { ActFn, ActResult } from "./actRegistry.ts";


// the bookend states (the act states themselves come from the lesson).
const IDLE = "IDLE";
const DONE = "DONE";
const ERROR = "ERROR";


// build the linear transition table for a list of act names:
//   IDLE -> act0 -> ... -> actN -> DONE, plus a "fail" edge to ERROR on each act.
function buildLinearTransitions(actNames: string[]): Record<string, Record<string, string>> {
  const chain = [IDLE, ...actNames, DONE];
  const transitions: Record<string, Record<string, string>> = {};
  for (let i = 0; i < chain.length - 1; i++) {
    transitions[chain[i]] = { next: chain[i + 1] };
  }
  for (const name of actNames) {
    transitions[name].fail = ERROR;
  }
  // terminal states — no way out
  transitions[DONE] = {};
  transitions[ERROR] = {};
  return transitions;
}


export class LessonStateMachine extends StateMachine {
  lesson: Lesson;
  // collected results, in act order, ready for assembleLesson().
  private _results: ActResult[];
  // if we hit ERROR, these say what broke.
  failedAct: string | null;
  error: string | null;

  constructor(lesson: Lesson) {
    // read the acts and build the state graph BEFORE calling super().
    const registry = lesson.getRegistry();
    const actNames = registry.map(([name]) => name);
    const states = [IDLE, ...actNames, DONE, ERROR];
    const transitions = buildLinearTransitions(actNames);
    super(states, transitions, IDLE); // starts in IDLE

    this.lesson = lesson;
    this._results = [];
    this.failedAct = null;
    this.error = null;

    // one handler per act state: entering the state runs that act.
    // IDLE / DONE / ERROR get no handler — nothing to do on entry.
    for (const [name, fn] of registry) {
      this.register(name, () => this._runAct(name, fn));
    }
  }

  // start at IDLE and step through every act to DONE (or ERROR). returns the
  // final state; call getResults() afterward for the collected ActResult[].
  async run(): Promise<string> {
    this._results = [];
    this.state = IDLE;
    return this._runToDone();
  }

  // the collected results in act order, shaped exactly like runAllActs() output so
  // they drop straight into assembleLesson().
  getResults(): ActResult[] {
    return this._results;
  }

  // keep firing "next" until DONE; on a throwing act, fire "fail" -> ERROR.
  // async because the inherited trigger() is async (see ASYNC NOTE up top).
  private async _runToDone(): Promise<string> {
    while (this.state !== DONE && this.state !== ERROR) {
      try {
        await this.trigger("next"); // move to the next act AND run its handler
      } catch (e: any) {
        this.failedAct = this.state;
        this.error = String(e?.message ?? e);
        await this.trigger("fail"); // -> ERROR
        console.log(`[LessonStateMachine] FAILED in ${this.failedAct}: ${e?.message ?? e}`);
        return this.state;
      }
    }

    if (this.state === DONE) console.log("[LessonStateMachine] Complete.");
    return this.state;
  }

  // run one act: call its ActFn with the lesson context, stash the result as an
  // ActResult (same shape runAllActs produces), and log that it ran.
  private _runAct(name: string, fn: ActFn): void {
    const out = fn(this.lesson.toContext());
    this._results.push({
      name,
      text: out.text,
      jsCall: out.jsCall ?? null,
      jsArgs: out.jsArgs ?? {},
      rawHtml: out.rawHtml ?? null,
    });
    console.log(`[LessonStateMachine] ran act: ${name}`);
  }
}


// ─────────────────────────────────────────────────────────────────────
// Self-test: build the pizza fractions lesson, run it through the SM, assemble.
// ─────────────────────────────────────────────────────────────────────

async function _runTest(): Promise<void> {
  const { writeFileSync } = await import("fs");
  const path = await import("path");
  const { assembleLesson } = await import("./layer2Assembler.ts");

  // build the same pizza fractions lesson as lessonDemo.ts, via the Lesson object.
  const lesson = new Lesson(
    "Pizza Fractions",
    "A pizza is cut into 8 equal slices. You and your friends eat 5 of them. How much of the pizza is left?"
  );
  lesson
    .addAct("intro", (ctx) => ({
      text:
        "Let's figure out how much pizza is left.\n\n" +
        `${ctx.problemText}\n\n` +
        "We'll picture it, do the math, then check our answer.",
    }))
    .addAct("show_eaten", () => lesson.fractionBar(5, 8, "5/8 eaten"))
    .addAct("the_math", () => lesson.latex("\\frac{8 - 5}{8} = \\frac{3}{8}"))
    .addAct("quick_check", () =>
      lesson.multipleChoice("So how much pizza is LEFT?", ["3/8", "5/8", "8/8", "1/8"], 0)
    )
    .addAct("graph", () => lesson.graph(["x^2 + y^2 = 25"]));

  // run the acts as states through the SM.
  const sm = new LessonStateMachine(lesson);
  await sm.run();

  // results are ready for assembleLesson().
  const results = sm.getResults();
  const page = assembleLesson(results, lesson.title);

  const out = path.join(import.meta.dirname, "lesson_sm_demo.html");
  writeFileSync(out, page);
  console.log(`Wrote ${out} (${page.length} bytes)`);
  console.log("Acts ran in order: " + results.map((r) => r.name).join(" -> "));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  _runTest().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
