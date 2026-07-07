// LITMUS TEST: the generic engine drives a non-lesson machine with a toy
// context, importing ONLY @lessonkit/state-machine. No beats, no lessons, no
// render, no DOM. If this compiles and runs, the engine is genuine generic
// infrastructure and no lesson-ism has leaked into it.

import {
  createRegistry,
  start,
  transition,
  snapshot,
  restore,
  type Statechart,
  type Step,
} from "@lessonkit/state-machine";

// A classic coin-operated turnstile. Context is just a coin counter.
interface TurnstileCtx {
  coins: number;
  pushes: number;
}

const reg = createRegistry<TurnstileCtx>()
  .action("addCoin", (ctx) => ({ context: { coins: ctx.coins + 1 } }))
  .action("countPush", (ctx) => ({ context: { pushes: ctx.pushes + 1 } }));

const chart: Statechart<TurnstileCtx> = {
  id: "turnstile",
  version: 1,
  initial: "locked",
  states: {
    locked: {
      id: "locked",
      on: {
        coin: [{ target: "unlocked", actions: ["addCoin"] }],
        push: [{ target: "locked" }], // stays locked
      },
    },
    unlocked: {
      id: "unlocked",
      on: {
        push: [{ target: "locked", actions: ["countPush"] }],
        coin: [{ target: "unlocked", actions: ["addCoin"] }],
      },
    },
  },
};

function assert(cond: boolean, msg: string): void {
  if (!cond) {
    console.error(`✗ FAILED: ${msg}`);
    process.exit(1);
  }
}

let step: Step<TurnstileCtx> = start(chart, { coins: 0, pushes: 0 }, reg);
assert(step.state === "locked", "starts locked");

step = transition(chart, step, { type: "push" }, reg);
assert(step.state === "locked", "push while locked stays locked");

step = transition(chart, step, { type: "coin" }, reg);
assert(step.state === "unlocked" && step.context.coins === 1, "coin unlocks + counts");

// snapshot mid-run, then keep going, then restore back
const snap = snapshot(chart, step);

step = transition(chart, step, { type: "push" }, reg);
assert(step.state === "locked" && step.context.pushes === 1, "push while unlocked locks + counts");

const restored = restore(chart, snap);
assert(restored.state === "unlocked" && restored.context.coins === 1, "restore returns the snapshotted position");

console.log("✓ turnstile: generic engine runs with a toy context, no lesson/render deps");
console.log("All litmus assertions passed.");
