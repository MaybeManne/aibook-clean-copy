// Headless acceptance for the live-generation path. Proves the full loop:
//   trigger → generate effect → (fake) author → beat.generated → splice + jump,
// and — the crux — that REPLAY from history alone reconstructs the generated beat
// WITHOUT the author (generate → freeze → replay), plus that a malformed generated
// beat fails loudly instead of corrupting the chart.

import { createSession, defaultRunner, generatingRunner, replay, defineLesson, type BeatSpec } from "@lessonkit/lesson";
import { genLesson, genLessonSpec, fakeAuthor } from "./generate.js";

function assert(cond: unknown, msg: string): void {
  if (!cond) throw new Error(`FAIL: ${msg}`);
  console.log(`  ✓ ${msg}`);
}
const tick = (): Promise<void> => new Promise((r) => setTimeout(r, 0)); // flush the async author

console.log("grad-descent/generate: live generation splices + jumps into a generated beat");
{
  const s = createSession(genLesson, { runner: generatingRunner(fakeAuthor, defaultRunner()) });
  s.send({ type: "next" }); // intro → gate
  assert(s.activeBeatId() === "gate", "advanced intro → gate");

  s.send({ type: "ask.generate" }); // → thinking placeholder + declares the generate effect
  assert(s.activeBeatId() === "thinking", "moved to the thinking placeholder");

  await tick(); // let the (async) author resolve → beat.generated
  assert(s.activeBeatId() === "gen-remediation", "spliced + jumped into the generated beat");
  assert(genLesson.chart.states["gen-remediation"] !== undefined, "generated beat is now in the live chart");

  const rendered = s.render().intents.find((i) => i.kind === "text");
  assert(!!rendered, "the generated beat renders (it's a real, dispatchable beat)");

  const gen = s.context.history.find((r) => r.event.type === "beat.generated");
  assert(!!gen && (gen.event.payload as unknown as { id?: string })?.id === "gen-remediation", "beat.generated recorded in history WITH its spec");
}

console.log("grad-descent/generate: REPLAY reconstructs the generated beat from data — no author");
{
  // Re-run the live session to capture a fresh history.
  const live = createSession(genLesson, { runner: generatingRunner(fakeAuthor, defaultRunner()) });
  live.send({ type: "next" });
  live.send({ type: "ask.generate" });
  await tick();
  const history = live.context.history;

  const fresh = defineLesson(genLessonSpec); // pristine chart — no generated beat
  assert(fresh.chart.states["gen-remediation"] === undefined, "fresh lesson has NO generated beat");
  const r = replay(fresh, history); // replay() uses a no-op runner + no policies (no author)
  assert(r.activeBeatId() === "gen-remediation", "REPLAY landed on the generated beat from history alone");
  assert(fresh.chart.states["gen-remediation"] !== undefined, "replay re-spliced the beat into the fresh chart (data, not a call)");
}

console.log("grad-descent/generate: a malformed generated beat fails loudly");
{
  const s = createSession(defineLesson(genLessonSpec));
  let threw = false;
  try {
    s.spliceBeat({ id: "bad", type: "no-such-beat", params: {}, next: "outro" } as BeatSpec);
  } catch {
    threw = true;
  }
  assert(threw, "spliceBeat threw on an unknown beat type instead of corrupting the chart");
}

console.log("\nGrad-descent generation acceptance passed — live splice + deterministic replay + loud validation.");
