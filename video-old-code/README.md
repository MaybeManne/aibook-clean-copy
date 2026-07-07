# SocraticAI

Generates interactive math lessons from a problem statement. Output is a single, self-contained HTML file: narration, visuals, and inline quiz checks, no server required.

Two ways to build a lesson:

1. **AI pipeline** (`agentic_pipeline/orchestrator.ts`). Give it a raw problem, it runs 6 LLM stages (solve, structure, author acts, author quizzes, author visuals, review) and produces a finished lesson. Requires API keys.
2. **`Lesson` object** (`agentic_pipeline/lesson.ts`). No LLM calls. Build the lesson directly: add acts, call prebuilt visual methods, run it. Use this for manual authoring or testing.

## Quickstart

```
cd agentic_pipeline
npx tsx lessonDemo.ts
```

Writes `lesson_demo.html`. Open it in a browser.

To exercise every prebuilt visual at once:

```
npx tsx visualTest.ts
```

Writes `visual_test.html`.

Note: `package.json` does not set `"type": "module"`, so `tsx` compiles to CommonJS and top-level `await` is unavailable. Entry files wrap async code in a `main()` function instead.

## File structure

```
agentic_pipeline/
  stateMachine.ts        generic state machine + the 6-stage pipeline runner
  orchestrator.ts        the AI pipeline: LLM calls, validation, retries
  assembler.ts           pipeline JSON -> MX.lesson() JS, no LLM involved
  validate.ts            soft validation, returns error lists
  pipelineTypes.ts       hard validation, throws on malformed artifacts

  actRegistry.ts         the act system: a lesson is a list of small functions
  layer2Assembler.ts     act results -> single HTML file (vizLib drawing code lives here)
  lesson.ts              the Lesson class: teacher-facing API with prebuilt visuals
  lessonDemo.ts          reference example: pizza fractions lesson via Lesson
  visualTest.ts          smoke test covering every prebuilt visual
  demo.ts                same idea as lessonDemo, using actRegistry directly
  exampleCustomLesson.ts template for hand-writing a lesson

  python_originals/      original Python implementation, unmodified

  docs/SPEC.md           file-by-file, function-by-function reference
```

## Architecture

```
author -> lesson.ts (Lesson: addAct, fractionBar, pieChart, numberLine, ...)
       -> layer2Assembler.ts (acts -> HTML page)
       -> HTML file
```

Each act is a function returning text, a call into the `vizLib` drawing functions (defined in `layer2Assembler.ts`), or raw HTML for external embeds like Desmos. `Lesson.run()` is a state machine internally: IDLE -> act1 -> act2 -> ... -> DONE. `assembleLesson()` then compiles the collected results into one HTML file with the drawing code inlined.

The AI pipeline (`orchestrator.ts`) produces the same kind of act data via LLM calls instead of by hand, and runs it through a separate assembler (`assembler.ts`) targeting a different runtime (`MX.lesson()`, not `vizLib`). Both paths terminate in a playable lesson; they don't share code.

Full reference: [agentic_pipeline/docs/SPEC.md](agentic_pipeline/docs/SPEC.md).
