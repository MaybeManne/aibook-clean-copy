// LAYER 0: state machine (TypeScript port of state_machine.py).
//
// Generic StateMachine + the concrete PipelineStateMachine that runs the 6-stage
// pipeline on top of it. straight port of state_machine.py.
//
// ADAPTATIONS (TS differs from Python here):
//   1. ASYNC. orchestrator.ts's stage functions are async (the SDKs are Promise-based),
//      so the stage handlers, StateMachine.trigger, and the _runToDone driver are all
//      `async` here, and run()/resume()/main() return Promises. Python was synchronous.
//      `await handler()` works whether a handler is sync or async, so the generic base
//      stays modality-agnostic.
//   2. saveArtifacts signature. orchestrator.ts's saveArtifacts takes an options object
//      ({ narrative, plan, actSpecs, ... }) instead of Python's keyword args, so the
//      calls here pass an object. behavior is the same.
//   3. workDir is a plain string path (Python wrapped it in Path); all the orchestrator
//      helpers take string paths.
//
// VERIFICATION: typecheck-only, same as orchestrator.ts. no API keys here, so the
// pipeline can't actually run. tsc proves it compiles against orchestrator.ts's exports.

import * as fs from "fs";
import { pathToFileURL } from "url";

import {
  stage1Solve,
  stage2Structure,
  stage2AuthorActs,
  stage2bAuthorGates,
  stage3AuthorViz,
  stage4Assemble,
  stage5Review,
  buildHtml,
  saveArtifacts,
  loadArtifacts,
  loadProblemText,
} from "./orchestrator.ts";
// pulling in all the actual AI functions from orchestrator.ts
// the state machine itself doesn't do any AI work, it just calls these in order
// think of it like: orchestrator = the brains, state machine = the schedule


// ═══════════════════════════════════════════════════════════════════
// Generic base
// ═══════════════════════════════════════════════════════════════════

type Handler = () => void | Promise<void>;
type TransitionTable = Record<string, Record<string, string>>;

export class StateMachine {
  states: Set<string>;
  transitions: TransitionTable;
  state: string;
  handlers: Record<string, Handler>;

  // the state machine base class
  constructor(states: string[], transitions: TransitionTable, initial: string) {
    // store the full set of valid states so we know what's allowed
    this.states = new Set(states);
    // the map of where to go — {state: {event: next_state}}
    this.transitions = transitions;
    // we start here — whatever "initial" is passed in
    this.state = initial;
    // empty for now — handlers get attached later via register()
    this.handlers = {};
  }

  // attach a function to a state. whenever we enter that state, this function runs.
  register(state: string, handler: Handler): void {
    this.handlers[state] = handler;
  }

  // quick check: is this event even valid right now?
  can(event: string): boolean {
    return event in (this.transitions[this.state] ?? {});
  }

  // THIS IS THE WHOLE FSM — everything else is setup for this.
  async trigger(event: string): Promise<string | null> {
    // step 1: look up what transitions are valid from where we are right now
    const table = this.transitions[this.state] ?? {};

    // if the event isn't valid here, just ignore it and bail
    if (!(event in table)) {
      console.log(`[StateMachine] Ignored event '${event}' in ${this.state}`);
      return null;
    }

    // step 2: find the next state and move there
    const nxt = table[event];
    console.log(`[StateMachine] ${this.state} --${event}--> ${nxt}`);
    this.state = nxt; // we move FIRST before running anything
    // so if the handler crashes, self.state = the broken stage

    // step 3: run the handler for the new state (if there is one)
    const handler = this.handlers[nxt];
    if (handler) await handler(); // this is where the actual work happens (AI calls, saving, etc.)

    return nxt; // return the new state so callers know where we ended up
  }
}


// ═══════════════════════════════════════════════════════════════════
// Pipeline states + transition graph
// ═══════════════════════════════════════════════════════════════════

// all the possible states — basically the stages of making a lesson
const IDLE = "IDLE";
const PLANNING = "PLANNING"; // stage1Solve        -> narrative
const STRUCTURING = "STRUCTURING"; // stage2Structure    -> plan
const AUTHORING = "AUTHORING"; // stage2AuthorActs   -> act_specs
const GATING = "GATING"; // stage2bAuthorGates -> gate_specs
const VISUALIZING = "VISUALIZING"; // stage3AuthorViz    -> viz_spec
const ASSEMBLING = "ASSEMBLING"; // stage4Assemble
const REVIEWING = "REVIEWING"; // stage5Review + buildHtml
const DONE = "DONE";
const ERROR = "ERROR";

// the pipeline in order — IDLE, DONE, ERROR are excluded bc they're not "work" stages
const _ORDER = [PLANNING, STRUCTURING, AUTHORING, GATING, VISUALIZING, ASSEMBLING, REVIEWING];

function _linearTransitions(order: string[], initial: string, done: string, error: string): TransitionTable {
  // chain = [IDLE, PLANNING, STRUCTURING, ..., REVIEWING, DONE]
  const chain = [initial, ...order, done];

  // for every consecutive pair, add "next" -> the one after it
  const transitions: TransitionTable = {};
  for (let i = 0; i < chain.length - 1; i++) {
    transitions[chain[i]] = { next: chain[i + 1] };
  }

  // every pipeline stage also gets a "fail" exit -> ERROR
  for (const state of order) {
    transitions[state].fail = error;
  }

  // terminal states — no way out, pipeline is over
  transitions[done] = {};
  transitions[error] = {};

  return transitions;
}


// ═══════════════════════════════════════════════════════════════════
// Concrete pipeline machine
// ═══════════════════════════════════════════════════════════════════

export class PipelineStateMachine extends StateMachine {
  model: string;
  review: boolean;
  failed_stage: string | null;
  error: string | null;
  work_dir: string | null;
  output_path: string | null;
  problem_text: string | null;
  narrative: string | null;
  plan: any;
  act_specs: any;
  gate_specs: any;
  viz_spec: any;
  content_path: string | null;
  viz_path: string | null;

  constructor(model = "claude-sonnet-4-6", review = true) {
    // build the full states list and transition table, then init the base class
    const states = [IDLE, ..._ORDER, DONE, ERROR];
    const transitions = _linearTransitions(_ORDER, IDLE, DONE, ERROR);
    super(states, transitions, IDLE); // starts in IDLE

    // config — which model to use and whether to run the review stage
    this.model = model;
    this.review = review;

    // if we hit ERROR, these tell us exactly what broke
    this.failed_stage = null;
    this.error = null;

    // set when run() or resume() is called
    this.work_dir = null;
    this.output_path = null;

    // all the artifacts that get built up as the pipeline runs
    this.problem_text = null; // the raw AMC problem
    this.narrative = null; // PLANNING output
    this.plan = null; // STRUCTURING output
    this.act_specs = {}; // AUTHORING output
    this.gate_specs = {}; // GATING output
    this.viz_spec = null; // VISUALIZING output
    this.content_path = null; // ASSEMBLING output — path to content JS
    this.viz_path = null; // ASSEMBLING output — path to viz JS

    // hook up each stage to its handler function (arrow keeps `this` bound)
    this.register(PLANNING, () => this._doPlanning());
    this.register(STRUCTURING, () => this._doStructuring());
    this.register(AUTHORING, () => this._doAuthoring());
    this.register(GATING, () => this._doGating());
    this.register(VISUALIZING, () => this._doVisualizing());
    this.register(ASSEMBLING, () => this._doAssembling());
    this.register(REVIEWING, () => this._doReviewing());
    // IDLE, DONE, ERROR get no handler — nothing to do when we hit them
  }

  // ─────────────────────────────────────────────────────────────────
  // Drivers
  // ─────────────────────────────────────────────────────────────────

  // fresh run from scratch — takes a problem file and goes all the way to DONE
  async run(problemPath: string, outputPath: string, workDir: string): Promise<string> {
    this.work_dir = workDir;
    this.output_path = outputPath;
    fs.mkdirSync(workDir, { recursive: true }); // create the folder if it doesn't exist

    // read the problem file — if it doesn't exist, treat the path itself as the text
    this.problem_text = fs.existsSync(problemPath) ? fs.readFileSync(problemPath, "utf8") : problemPath;
    saveArtifacts(this.work_dir, { problemText: this.problem_text }); // checkpoint immediately

    this.state = IDLE; // make sure we're starting fresh
    return this._runToDone(); // kick off the loop
  }

  // pick up a run that got interrupted — reload whatever was already saved
  async resume(workDir: string, outputPath: string): Promise<string> {
    this.work_dir = workDir;
    this.output_path = outputPath;

    // load back all the artifacts that were already computed
    [this.narrative, this.plan, this.act_specs, this.gate_specs, this.viz_spec] = loadArtifacts(this.work_dir);
    this.problem_text = loadProblemText(this.work_dir);

    // figure out which stage to start from based on what's missing
    this.state = this._resumeState();
    return this._runToDone(); // continue from wherever we left off
  }

  // THE ENGINE — just keeps firing "next" until we hit DONE or ERROR
  async _runToDone(): Promise<string> {
    while (this.state !== DONE && this.state !== ERROR) {
      try {
        await this.trigger("next"); // move to next state AND run its handler
      } catch (e: any) {
        // something crashed — record which stage broke and why
        this.failed_stage = this.state;
        this.error = String(e?.message ?? e);
        await this.trigger("fail"); // -> ERROR
        console.log(`[Pipeline] FAILED in ${this.failed_stage}: ${e?.message ?? e}`);
        return this.state; // stop the loop, we're in ERROR
      }
    }

    if (this.state === DONE) console.log("[Pipeline] Complete.");
    return this.state;
  }

  // figure out where to restart by checking which artifacts are missing.
  // we return the state BEFORE the missing one so "next" lands on the right stage.
  _resumeState(): string {
    if (!this.narrative) return IDLE; // -> PLANNING
    if (!this.plan) return PLANNING; // -> STRUCTURING
    if (!this.act_specs || Object.keys(this.act_specs).length === 0) return STRUCTURING; // -> AUTHORING
    if (!this.gate_specs || Object.keys(this.gate_specs).length === 0) return AUTHORING; // -> GATING
    if (!this.viz_spec) return GATING; // -> VISUALIZING
    return VISUALIZING; // -> ASSEMBLING
    // note: assembled JS isn't tracked as an artifact, so if everything else
    // exists we just redo ASSEMBLING + REVIEWING — no biggie
  }

  // ─────────────────────────────────────────────────────────────────
  // one orchestrator stage fn each, saving output as it goes
  // ─────────────────────────────────────────────────────────────────

  async _doPlanning(): Promise<void> {
    // call the AI, get back a narrative (how to solve the problem), save immediately
    this.narrative = await stage1Solve(this.problem_text!, null, this.model);
    saveArtifacts(this.work_dir!, { narrative: this.narrative });
  }

  async _doStructuring(): Promise<void> {
    // take the narrative and turn it into a structured lesson plan
    this.plan = await stage2Structure(this.problem_text!, this.narrative!, null, this.model);
    saveArtifacts(this.work_dir!, { plan: this.plan });
  }

  async _doAuthoring(): Promise<void> {
    // write out what each "act" of the lesson actually says
    this.act_specs = await stage2AuthorActs(this.plan, this.model);
    saveArtifacts(this.work_dir!, { actSpecs: this.act_specs });
  }

  async _doGating(): Promise<void> {
    // generate the quiz questions / check-ins between acts
    this.gate_specs = await stage2bAuthorGates(this.plan, this.act_specs, this.model);
    saveArtifacts(this.work_dir!, { gateSpecs: this.gate_specs });
  }

  async _doVisualizing(): Promise<void> {
    // spec out what the animations/visuals should look like
    this.viz_spec = await stage3AuthorViz(this.plan, this.act_specs, this.model);
    saveArtifacts(this.work_dir!, { vizSpec: this.viz_spec });
  }

  _doAssembling(): void {
    // take all the specs and actually write the JS files (returns file paths)
    [this.content_path, this.viz_path] = stage4Assemble(
      this.plan,
      this.act_specs,
      this.gate_specs,
      this.viz_spec,
      this.work_dir!
    );
  }

  async _doReviewing(): Promise<void> {
    // final stage — review the JS for bugs then build the HTML output

    if (!this.review) {
      // --no-review was passed, skip it and just build directly
      buildHtml(this.content_path!, this.viz_path, this.output_path!);
      return;
    }

    // read the assembled JS files into memory for the reviewer
    const contentJs = fs.readFileSync(this.content_path!, "utf8");
    let vizJs: string | null = null;
    if (this.viz_path) vizJs = fs.readFileSync(this.viz_path, "utf8");

    // run the review — get back corrected JS (and a list of issues we don't need)
    const [reviewedContent, reviewedViz, _issues] = await stage5Review(this.plan, contentJs, vizJs, null, this.model);

    // only write back if the reviewer actually changed something
    if (reviewedContent !== contentJs) {
      fs.writeFileSync(this.content_path!, reviewedContent);
    }
    if (this.viz_path && reviewedViz && reviewedViz !== vizJs) {
      fs.writeFileSync(this.viz_path, reviewedViz);
    }

    // stitch the JS into the final HTML lesson file — we're done
    buildHtml(this.content_path!, this.viz_path, this.output_path!);
  }
}


// ─────────────────────────────────────────────────────────────────────
// CLI
// ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const args: any = { problem: undefined, resume: undefined, output: undefined, work_dir: "output", model: "gemini-2.5-flash", no_review: false };
  const usageExit = (msg: string) => {
    console.error(`state_machine.ts: error: ${msg}`);
    process.exit(2);
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    switch (a) {
      case "--problem": args.problem = argv[++i]; break;
      case "--resume": args.resume = argv[++i]; break;
      case "--output": args.output = argv[++i]; break;
      case "--work-dir": args.work_dir = argv[++i]; break;
      case "--model": args.model = argv[++i]; break;
      case "--no-review": args.no_review = true; break;
      default: usageExit(`unrecognized argument: ${a}`);
    }
  }
  // you have to pick one: fresh run (--problem) or continue (--resume), not both
  if ((args.problem === undefined) === (args.resume === undefined)) {
    usageExit("exactly one of --problem / --resume is required");
  }
  if (args.output === undefined) usageExit("--output is required");

  // spin up the machine with whatever flags were passed
  const m = new PipelineStateMachine(args.model, !args.no_review);

  // kick it off — either fresh or resuming
  let final: string;
  if (args.resume) {
    final = await m.resume(args.resume, args.output);
  } else {
    final = await m.run(args.problem, args.output, args.work_dir);
  }

  // if we ended in ERROR, crash with a message telling you exactly what broke
  if (final === ERROR) {
    console.error(`Pipeline failed in ${m.failed_stage}: ${m.error}`);
    process.exit(1);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
