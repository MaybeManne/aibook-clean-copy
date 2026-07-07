// Headless end-to-end driver. Proves the layers + routing model:
//   correct → advances past remediation, branches to deep-dive
//   wrong   → routes into remediation, then continues to recap
// Also exercises snapshot/restore and replay (the persistence paths).
import { createSession, replay, restoreSession, snapshotSession, type Session } from "@lessonkit/lesson";
import { bySlot, toPlain, type RenderIntent, type RenderModel } from "@lessonkit/render-contract";
import { photosynthesis } from "./lesson.js";

function show(model: RenderModel): string {
  const slots = bySlot(model);
  const parts: string[] = [];
  for (const [slot, intents] of Object.entries(slots)) {
    for (const it of intents) {
      if (it.kind === "text") {
        parts.push(`[${slot}] ${toPlain((it as Extract<RenderIntent, { kind: "text" }>).content)}`);
      } else if (it.kind === "visual") {
        parts.push(`[${slot}] <visual ${(it as Extract<RenderIntent, { kind: "visual" }>).ref.src}>`);
      } else if (it.kind === "mcq") {
        const m = it as Extract<RenderIntent, { kind: "mcq" }>;
        const cs = m.choices
          .map((c, i) => `(${c.revealedCorrect ? "*" : c.picked ? "x" : " "}) ${i}. ${c.text}`)
          .join("  ");
        parts.push(`[${slot}] Q: ${toPlain(m.prompt)}  ${cs}`);
        if (m.feedback) parts.push(`        ↳ ${toPlain(m.feedback)}`);
      }
    }
  }
  return parts.join("\n");
}

function drive(label: string, answer: number): Session {
  console.log(`\n=== Run: ${label} (answers choice ${answer} to q1) ===`);
  const s = createSession(photosynthesis);
  let guard = 0;
  while (!s.done && guard++ < 20) {
    const beat = s.activeBeatId();
    console.log(`\n• beat: ${beat}`);
    console.log(show(s.render()));
    if (beat === "q1") {
      s.send({ type: "mcq.answer", payload: { choice: answer } });
      console.log("  -- after answer --");
      console.log(show(s.render()));
      s.send({ type: "next" });
    } else {
      s.send({ type: "next" });
    }
  }
  console.log(`\n→ end. score=${s.context.score}, steps=${s.context.history.length}`);
  console.log(`  path: ${s.context.history.map((h) => stringify(h.to)).join(" → ")}`);
  return s;
}

function stringify(v: unknown): string {
  return typeof v === "string" ? v : JSON.stringify(v);
}

const correct = drive("correct answer", 1);
drive("wrong answer", 0);

// ── persistence smoke checks ───────────────────────────────────────────────
console.log("\n=== persistence ===");
const snap = snapshotSession(correct);
const restored = restoreSession(photosynthesis, snap);
console.log(`snapshot/restore: state=${stringify(restored.toSnapshot().state)} score=${restored.context.score}`);

const replayed = replay(photosynthesis, correct.context.history);
const ok = replayed.context.score === correct.context.score &&
  JSON.stringify(replayed.toSnapshot().state) === JSON.stringify(correct.toSnapshot().state);
console.log(`replay reproduces session: ${ok ? "✓" : "✗"}`);
if (!ok) process.exit(1);
