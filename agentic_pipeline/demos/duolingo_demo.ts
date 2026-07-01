// DEMO — "duolingo" preset: counting and basic addition for young kids (6-10).
// Big friendly Nunito type, Duo-green accent, lots of encouragement.
//
// Run it:  npx tsx demos/duolingo_demo.ts

import { writeFileSync } from "fs";
import * as path from "path";

import { assembleLesson } from "../layer2Assembler.ts";
import { Lesson } from "../lesson.ts";


const lesson = new Lesson(
  "Counting and Adding",
  "You have 2 apples. A friend gives you 3 more. How many apples now?"
);
lesson.setTemplate("duolingo");

// render a Lesson visual as a left-column rawHtml block, leaving the act's jsCall
// slot free for the bottom-zone multiple choice.
let _vizId = 0;
function vizLeft(out: { jsCall?: string | null; jsArgs?: Record<string, any> }): string {
  const id = `viz-left-${_vizId++}`;
  const args = JSON.stringify({ ...(out.jsArgs ?? {}), targetId: id });
  return `<div id="${id}"></div><script>vizLib.${out.jsCall}(${args});</script>`;
}

lesson
  // intro — two groups of fruit to count, shown as bars.
  .addAct("intro", () => ({
    text: "Let's count and add! You start with 2 apples, and your friend gives you 3 more.",
    jsCall: "showBarChart",
    jsArgs: { labels: ["your apples", "friend's apples"], values: [2, 3], title: "Count the apples!" },
  }))
  // count_up — the steps, nice and simple.
  .addAct("count_up", () =>
    lesson.stepList([
      "Start with your 2 apples: 1, 2.",
      "Now add your friend's 3: 3, 4, 5.",
      "2 and 3 make 5!",
    ])
  )
  // check — THREE ZONES: a number line on the left, the prompt on the right, and
  // the question along the bottom.
  .addAct("check", () => ({
    ...lesson.multipleChoice("So what is 2 + 3?", ["5", "4", "6", "3"], 0),
    text: "Hop along the number line: start at 2, then take 3 hops to the right. Where do you land?",
    rawHtml: vizLeft(lesson.numberLine(0, 6, [2, 5], ["start: 2", "2 + 3 = 5"])),
  }))
  // celebrate — a big friendly win.
  .addAct("celebrate", () => ({
    ...lesson.highlight("Awesome! 2 + 3 = 5 apples!"),
    text: "You did it! Counting on from a number is a super-fast way to add. Keep it up!",
  }));


async function main() {
  await lesson.run();
  console.log(`final state: ${lesson.state}`);

  const page = assembleLesson(lesson.getResults(), lesson.title, lesson.getTemplate());
  const out = path.join(import.meta.dirname, "duolingo_demo.html");
  writeFileSync(out, page);
  console.log(`Wrote ${out} (${page.length} bytes)`);
}
main();
