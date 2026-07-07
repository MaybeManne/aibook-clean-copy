// ACT STATES
//
// An act is one step of a lesson. ActState is a tiny base class — NOT the Layer 0
// StateMachine — that holds an act's name plus a function that produces its content,
// tracks a simple IDLE -> RUNNING -> DONE status, and runs it. The subclasses below
// just prebuild that function for the common act shapes (text, a visual, a question,
// a slider), so each one is only a couple of lines.

import type { LessonContext, ActOutput, ActFn, ActLocation } from "./actRegistry.ts";


// the lightweight base every act type shares.
export class ActState {
  name: string;
  // the function that produces this act's content (ctx in, ActOutput out).
  readonly fn: ActFn;
  // optional placement override for the assembler (left / right / bottom).
  location?: ActLocation;
  // where this act is in its own little lifecycle.
  status: "IDLE" | "RUNNING" | "DONE" = "IDLE";

  constructor(name: string, fn: ActFn, location?: ActLocation) {
    this.name = name;
    this.fn = fn;
    this.location = location;
  }

  // run the act: IDLE -> RUNNING, produce the output, -> DONE. returns the ActOutput.
  run(ctx: LessonContext): ActOutput {
    this.status = "RUNNING";
    const output = this.fn(ctx);
    this.status = "DONE";
    return output;
  }
}


// a plain text act — no visual.
export class TextAct extends ActState {
  constructor(name: string, text: string, location?: ActLocation) {
    super(name, () => ({ text }), location);
  }
}

// a visual act — names a vizLib draw function (fractionBar, barChart, numberLine, ...).
export class VisualAct extends ActState {
  constructor(name: string, jsCall: string, jsArgs: Record<string, any>, text = "", location?: ActLocation) {
    super(name, () => ({ text, jsCall, jsArgs }), location);
  }
}

// a multiple-choice question act. correctIndex is 0-based.
export class MCQAct extends ActState {
  constructor(name: string, question: string, options: string[], correctIndex: number, text = "", location?: ActLocation) {
    super(name, () => ({ text, jsCall: "showMultipleChoice", jsArgs: { question, options, correctIndex } }), location);
  }
}

// a drag-slider act. (vizLib's option is named `default`, so we map it here.)
export class SliderAct extends ActState {
  constructor(name: string, label: string, min: number, max: number, step: number, defaultValue: number, text = "", location?: ActLocation) {
    super(name, () => ({ text, jsCall: "showSlider", jsArgs: { label, min, max, step, default: defaultValue } }), location);
  }
}




