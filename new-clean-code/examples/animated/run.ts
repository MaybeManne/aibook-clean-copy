// Phase 0 acceptance: prove (1) sampleAt interpolates correctly, (2) the Player
// advances beat time and hands control back to the SM at storyboard end.
import { createSession } from "@lessonkit/lesson";
import { createPlayer } from "@lessonkit/video";
import { sampleAt, type SceneNode } from "@lessonkit/timeline";
import { demo, intro } from "./lesson.js";

function assert(cond: boolean, msg: string): void {
  if (!cond) {
    console.error(`✗ FAILED: ${msg}`);
    process.exit(1);
  }
}
const circle = (t: number): Extract<SceneNode, { kind: "circle" }> =>
  sampleAt(intro, t).nodes.find((n) => n.id === "c") as Extract<SceneNode, { kind: "circle" }>;

// 1. sampleAt at t = 0 / mid / end
const c0 = circle(0);
assert(c0.opacity === 0 && c0.x === 50, `t=0: opacity 0, x 50 (got ${c0.opacity}, ${c0.x})`);

const cMid = circle(400);
assert(Math.abs((cMid.opacity ?? 0) - 1) < 1e-6, `t=400: opacity reached 1 (got ${cMid.opacity})`);
assert((cMid.x ?? 0) > 50 && (cMid.x ?? 0) < 350, `t=400: x mid-slide (got ${cMid.x})`);

const cEnd = circle(1000);
assert(cEnd.x === 350 && cEnd.opacity === 1, `t=1000: x 350, opacity 1 (got ${cEnd.x}, ${cEnd.opacity})`);
console.log("✓ sampleAt interpolates fade + move at t=0 / mid / end");

// 2. Player drives the clock and advances the SM at storyboard end
const session = createSession(demo);
const player = createPlayer(session);
assert(session.activeBeatId() === "a1", "starts on the animated beat");

const f0 = player.frame();
assert(f0.intents.some((i) => i.kind === "scene"), "frame() emits a scene intent");

player.seek(500);
assert(player.frame().intents.some((i) => i.kind === "text"), "reveal cue surfaces a text intent at t=500");

player.tick(600); // 500 + 600 = 1100 > duration 1000 → should advance
assert(session.activeBeatId() === "outro", `storyboard end advances SM to next beat (got ${session.activeBeatId()})`);
console.log("✓ Player advances beat time and hands control back to the state machine");

console.log("\nPhase 0 acceptance passed — discrete SM + continuous timeline reconciled.");
