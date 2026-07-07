// Headless proof that the SAME lesson renders through the React template.
// Uses react-dom/server (no browser). Drives a few steps and asserts markup.
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createSession } from "@lessonkit/lesson";
import { TemplateView, defaultTemplate } from "@lessonkit/render-web";
import { photosynthesis } from "./lesson.js";

const session = createSession(photosynthesis);
const html = () =>
  renderToStaticMarkup(<TemplateView model={session.render()} template={defaultTemplate} send={() => {}} />);

function assert(cond: boolean, msg: string): void {
  if (!cond) {
    console.error(`✗ FAILED: ${msg}`);
    process.exit(1);
  }
}

const intro = html();
assert(intro.includes("turn sunlight into sugar"), "intro prose present");
assert(intro.includes("leaf.svg"), "stage visual present");
console.log("✓ intro renders prose + visual through the template");

session.send({ type: "next" });
const q1 = html();
assert(q1.includes("What gas do plants take IN"), "mcq prompt present");
assert((q1.match(/<button/g) ?? []).length >= 3, "three choice buttons present");
assert(!q1.includes("Continue"), "no Continue before answering");
console.log("✓ q1 renders prompt + 3 choices, no Continue yet");

session.send({ type: "mcq.answer", payload: { choice: 1 } });
const answered = html();
assert(answered.includes("Correct!"), "correct feedback shown");
assert(answered.includes("Continue"), "Continue appears after answering");
console.log("✓ after answer: feedback + Continue render, still on q1");

console.log("\nAll render-template assertions passed.");
