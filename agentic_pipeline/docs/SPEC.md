# agentic_pipeline — TypeScript Specification

Reference for every `.ts` file in `agentic_pipeline/`: purpose, function-level behavior, and dependencies between files.

This is a TypeScript port of the original Python pipeline, preserved unmodified in `python_originals/`. Logic is ported 1:1 unless otherwise noted.

---

## stateMachine.ts

**Purpose:** Generic finite state machine, plus the concrete 6-stage pipeline built on top of it.

**Key types/classes:**
- `StateMachine` — base class. Holds `states`, a transition table (`{state: {event: nextState}}`), the current `state`, and per-state `handlers`.
  - `register(state, handler)` — attaches a handler to a state.
  - `can(event)` — checks whether an event is valid from the current state.
  - `trigger(event)` — core driver. Resolves the next state, transitions, then awaits that state's handler if one is registered.
- `PipelineStateMachine extends StateMachine` — the 6-stage pipeline (`PLANNING → STRUCTURING → AUTHORING → GATING → VISUALIZING → ASSEMBLING → REVIEWING`). Each stage handler calls the matching function in `orchestrator.ts` and persists its output.
  - `run(problemPath, outputPath, workDir)` — starts a fresh run from a problem file.
  - `resume(workDir, outputPath)` — reloads previously saved artifacts and continues from the first incomplete stage.
  - `_runToDone()` — drives `trigger("next")` until `DONE` or `ERROR`; on a thrown error, records the failing stage and transitions to `ERROR`.
  - `_resumeState()` — determines the resume point by checking which artifacts are missing on disk.
  - `_doPlanning`, `_doStructuring`, `_doAuthoring`, `_doGating`, `_doVisualizing`, `_doAssembling`, `_doReviewing` — one handler per stage.

**Other:**
- `_linearTransitions(order, initial, done, error)` — builds a straight-line transition table with a `fail` edge to `ERROR` from every stage.
- `main()` — CLI entry point. Accepts `--problem`, `--resume`, `--output`, `--work-dir`, `--model`, `--no-review`.

**Depends on:** orchestrator.ts (every stage function).
**Used by:** CLI invocation only.

---

## orchestrator.ts

**Purpose:** Implements the 6-stage LLM pipeline — provider dispatch, validation/retry logic, and the individual stage functions.

**LLM provider dispatch:**
- `_isOpenrouter`, `_stripOpenrouter`, `_isGemini` — resolve which provider a model string routes to.
- `callLlm(systemPrompt, userMessage, outputSchema, model)` — structured JSON call, dispatched by provider.
- `callLlmText(systemPrompt, userMessage, model)` — plain-text call, dispatched by provider.
- `_callAnthropic`, `_callGemini`, `_callOpenrouter` and their `*Text` counterparts — provider-specific SDK calls. The OpenRouter path also strips markdown code fences some models wrap their JSON in.
- `_openrouterClient()` — constructs an OpenAI-SDK client pointed at the OpenRouter API.
- `_cleanSchemaForGemini(schema)` — recursively strips JSON Schema keywords unsupported by the Gemini API.
- `_schemaForTool(schemaName)` — loads a schema file and flattens the polymorphic `nodes` field for use as a tool schema.

**Validation and safety helpers:**
- `_checkJsSyntax(code)` — writes code to a temp file and runs `node --check` against it.
- `_checkVizLayout(code)` — heuristic checks on generated visualization code (overlapping text, out-of-bounds coordinates, missing layout zones).
- `_rejectIfInvalidDsl(corrected, original, label)` — rejects a reviewer's correction if it references undefined DSL methods or fails a syntax check.
- `_retryWithErrors(systemPrompt, userMsg, schema, errors, model)` — re-issues an LLM call with prior validation errors appended to the prompt.

**Pipeline stages:**
- `stage1Solve(problemText, objectives, model)` — generates a natural-language solution narrative. Retries once if the result is too short or too long.
- `stage2Structure(problemText, narrative, objectives, model)` — converts the narrative into a structured lesson plan (schema-validated, retries on validation errors).
- `stage2AuthorActs(plan, model)` — generates content (beats: narration + visuals) for every act node. `_actContext` builds the per-act prompt (problem, lesson arc, outline, available visualization actions, next act).
- `stage2bAuthorGates(plan, actSpecs, model)` — generates quiz/gate content. `_gateContext` builds the per-gate prompt (preceding act, next act, remediation paths).
- `stage3AuthorViz(plan, actSpecs, model)` — generates the visualization implementation (SVG/canvas JS) covering every visualization action used across all acts. `_buildVizTimeline` orders all visualization actions across the lesson for context.
- `stage3bVizVisualRevision(...)` — optional sighted revision pass: renders the lesson, screenshots it, and asks an Anthropic model to fix visual issues based on the screenshot.
- `stage4Assemble(plan, actSpecs, gateSpecs, vizSpec, outputDir)` — deterministic, no LLM call. Delegates to `assembler.ts` to write JS files to disk.
- `stage5Review(plan, contentJs, vizJs, screenshotPath, model)` — final LLM review pass over assembled JS; may return corrected code. Retries once if a correction fails a syntax check. Multimodal when a screenshot and an Anthropic model are both available.
- `buildHtml(contentJsPath, vizJsPath, outputHtmlPath)` — invokes `build.sh` to produce the final HTML file.
- `takeScreenshot(htmlPath, screenshotPath, waitMs)` — optional, requires Playwright; renders and screenshots the HTML.

**Persistence:**
- `saveArtifacts(workDir, opts)` — writes whatever pipeline state exists to disk (`problem.md`, `narrative.md`, `lesson_plan.json`, `acts/*.json`, `gates/*.json`, `viz_spec.json`).
- `loadProblemText`, `loadArtifacts` — read those files back for `resume`.

**CLI:**
- `parseArgs`, `main()` — standalone CLI supporting per-stage execution (`--stage narrative|plan|acts|viz|assemble|review|all`) and resume.

**Depends on:** assembler.ts (`stage4Assemble`), validate.ts (soft validation per stage), pipelineTypes.ts (hard assertions per stage).
**Used by:** stateMachine.ts.

---

## assembler.ts

**Purpose:** Converts the pipeline's JSON artifacts (plan, act specs, gate specs, viz spec) into the `MX.lesson()` JavaScript the engine executes. Deterministic, no LLM involvement.

**Key functions:**
- `jsStr(s)` — escapes a string for a JS double-quoted literal.
- `pyNum(v)` — formats a number to match Python's `str()` output (see the integral-float caveat noted at the top of the file).
- `jsValue(v, indent)`, `jsObj(obj, indent)` — serialize any JSON value to JS literal source, with line-wrapping for long structures.
- `jsFnBody(codeStr)` — wraps code in a `function(k) {...}` body. Unused currently; retained for parity with the Python source.
- `emitBeat(beat, indent)` — renders one beat as a chained `A.say(...).show(...).do(...)` statement.
- `emitAct(actSpec, indent)` — wraps a beat list in an `L.act(title, function(A) {...})` block.
- `emitGate(gateSpec, branchActSpecs, indent)` — renders a gate as `L.ask(...)` / `L.askFillIn(...)` / `L.askProof(...)`, including a `wrongPath` branch when remediation acts exist.
- `emitMarker(label, indent)` — renders an `L.marker(label)` call.
- `assembleContent(plan, actSpecs, gateSpecs, vizSpec)` — walks `plan.nodes` in order and emits the full `MX.lesson(...)` body. Throws `AssemblyError` if a plan-declared gate has no corresponding spec.
- `normalizeVizCode(code)` — inserts newlines into single-line viz code so a `//` comment can't swallow the rest of the file.
- `assembleViz(vizSpec)` — extracts the implementation code from a viz spec based on its mode (`custom_code`, `mobject_plugin`, `three_js`; `null` for `preset`).
- `assemble(planPath, actsDir, gatesDir, vizSpecPath, outputDir)` — full file-based assembly: reads JSON from disk, writes resulting JS files.
- `main()` — CLI wrapper around `assemble`.

**Depends on:** none (pure transform).
**Used by:** orchestrator.ts (`stage4Assemble`).

---

## pipelineTypes.ts

**Purpose:** Type definitions for every pipeline artifact, plus runtime structural assertions enforced at each stage boundary.

**Types:** `BeatVizAction`, `Beat`, `ActSpec`, `BlankConfig`, `GateSpec`, `VizSpec`, `BeatOutline`, `ActNode`, `GateNode`, `MarkerNode`, `PlanNode`, `VizActionSpec`, `VizRequirements`, `PlanMeta`, `PlanProblem`, `LessonPlan`. Mirror the JSON schemas; type-only, erased at compile time.

**Runtime assertions** (throw `TypeError` prefixed `[pipeline contract]`):
- `isDict`, `typeName`, `pyRepr` — formatting helpers for Python-style error messages.
- `require_(cond, msg)` — throws if `cond` is false; the basis for every assertion below.
- `findDuplicate(xs)` — returns the first duplicate value's index pair, used to catch repeated beat narration. Uses a null-prototype map so values like `"toString"` cannot false-match against `Object.prototype`.
- `assertPlanShape(plan)` — validates `meta.title`, `problem.text`, `nodes` array, node type/id format, and id uniqueness.
- `assertActSpecShape(spec, planNode)` — validates act id format, non-empty beats with non-empty `say` text, and no duplicate narration. With a plan node, also checks id match and beat-count match against the planned outline.
- `assertGateSpecShape(spec, planNode)` — validates gate id format (orchestrator-injected, not LLM-provided), gate type, and `after_act`. With a plan node, checks all three fields match the plan.
- `assertVizSpecShape(spec)` — validates `mode` and the field that mode requires.
- `assertVizImplementsPlanActions(vizSpec, plan)` — confirms every visualization action declared in the plan appears in `vizSpec.actions_implemented`.

**Depends on:** none.
**Used by:** orchestrator.ts, called immediately after each LLM stage returns, as a hard backstop on top of validate.ts.

---

## validate.ts

**Purpose:** Soft validation layer. Returns error-string lists instead of throwing, so the orchestrator can retry with feedback before falling back to the hard assertions in pipelineTypes.ts.

**Key functions:**
- `loadSchema(name)` — reads a JSON schema file from `schemas/`.
- `tryJsonschema(data, schema)` — would perform full JSON Schema validation if the `jsonschema` package were available. Always returns `null` here (not wired up), which routes every validator through the structural checks below — matching Python's behavior when `jsonschema` is not installed.
- `validatePlan(plan)` — checks required fields, node id uniqueness, and that gate/marker `after_act` references resolve to real acts.
- `validateActSpec(actSpec, plan, planNode)` — checks act id and beats exist, every beat has non-empty `say`, no duplicate narration, known visualization actions, and (with a plan node) beat-count and per-beat action coverage against the planned outline.
- `validateGateSpec(gateSpec, plan)` — checks `gate_type` and `after_act`, plus type-specific required fields (quiz: question/options/correct; fill-in: prompt containing the `[___]` blank marker, plus blank config).
- `validateVizSpec(vizSpec, plan, allActs)` — checks `mode` and its required field, and (given all acts) that every visualization action used is listed in `actions_implemented`.
- `validateAll(plan, actSpecs, gateSpecs, vizSpec)` — runs all validators, returns a map of category to errors for categories with problems.
- `main()` — CLI wrapper: `--plan`, repeatable `--act`/`--gate`, `--viz`.

**Depends on:** none.
**Used by:** orchestrator.ts, called before the pipelineTypes.ts assertions.

---

## actRegistry.ts

**Purpose:** Defines the act system underlying Layer 2 — a lesson as an ordered list of small content-generating functions.

**Key types:**
- `LessonContext` — input to an act: `problemText`, optional `narrative`/`plan`, and an `extra` bag for visual-specific data.
- `ActOutput` — output of an act: required `text`, plus either `jsCall`/`jsArgs` (invoke a `vizLib` drawing function) or `rawHtml` (embed external content, e.g. Desmos).
- `ActFn`, `RegistryEntry`, `ActResult` — the act function signature, the `[name, fn]` tuple type, and the runner's plain-object output shape.

**Example acts:**
- `introAct`, `strategyAct`, `wrapupAct` — text-only acts.
- `fractionBarAct` — draws a fraction bar from `ctx.extra.fraction`.
- `circleDesmosAct` — embeds a live Desmos calculator via `rawHtml`.
- `multipleChoiceAct`, `sliderAct`, `tableAct` — additional examples not in the default registry; reference material for copy-paste use (rendered by `demo.ts --preview`).

**Runner:**
- `actRegistry` — the default running order, a `[name, fn][]` list.
- `runAllActs(ctx, registry)` — executes every act in order, returns the collected `ActResult[]`.

**Depends on:** none.
**Used by:** demo.ts, exampleCustomLesson.ts (`runAllActs`); output consumed by layer2Assembler.ts.

---

## layer2Assembler.ts

**Purpose:** Converts an `ActResult[]` (from `runAllActs` or `Lesson`) into a single self-contained HTML file.

**Key components:**
- `VIZ_LIB_JS` — a JS source string emitted into the page as `window.vizLib`. Defines 13 drawing functions: `showFractionBar`, `showMultipleChoice`, `showSlider`, `showTable`, `showNumberLine`, `showCoordinatePlane`, `showHighlight`, `showStepList`, `showBarChart`, `showVennDiagram`, `showPieChart`, `showBoxPlot`, `showCallout`. Each renders DOM/SVG into a target `<div>` by id.
- `htmlEscape(s)` — escapes `& < > " '` for safe embedding.
- `assembleAct(act)` — renders one `ActResult` as a `<section>`: text as a paragraph, a target `<div>` plus a one-line `<script>vizLib.X(...)</script>` if `jsCall` is set, or the raw HTML directly if `rawHtml` is set.
- `assembleLesson(acts, title)` — wraps all act sections in a complete HTML document with KaTeX CSS/JS, the `vizLib` script block, and base styling.

**Depends on:** none. Independent of assembler.ts, orchestrator.ts, and stateMachine.ts.
**Used by:** actRegistry.ts consumers (demo.ts, exampleCustomLesson.ts) and Lesson consumers (lessonDemo.ts, visualTest.ts).

---

## lesson.ts

**Purpose:** Layer 3 — the `Lesson` class, the primary authoring API. Wraps act creation and execution behind prebuilt visual methods, removing the need to hand-construct `jsCall`/`jsArgs`/`rawHtml`.

**Supporting functions:**
- `escapeHtml(s)` — HTML escaper used by the rawHtml-producing methods.
- `buildLinearTransitions(actNames)` — builds the `IDLE → act0 → ... → actN → DONE` transition table with a `fail` edge per act, matching stateMachine.ts's `_linearTransitions`.

**`Lesson extends StateMachine`:**
- Constructor — calls `super([], {}, "IDLE")`; the full state graph is built later in `run()` once all acts are registered.
- `addAct(name, fn)` — appends to the internal registry, returns `this` for chaining.
- `setNarrative(narrative)` — attaches an optional narrative string.
- `getRegistry()` — returns the act list as `RegistryEntry[]`.
- `toContext()` — builds the `LessonContext` passed to each act (`problemText` plus optional `narrative`; no `extra` field).
- `run()` — rebuilds `states`/`transitions`/`handlers` from the current act list, then drives execution from `IDLE` to `DONE` or `ERROR`.
- `getResults()` — returns the `ActResult[]` collected by the last `run()`.
- `_runToDone()` — same drive loop as `PipelineStateMachine._runToDone`: fires `next` until terminal, routes a thrown error to `fail`.
- `_runAct(name, fn)` — invokes the act with `toContext()`, records the result.
- **Prebuilt visual methods** (each returns a complete `ActOutput`): `fractionBar`, `multipleChoice`, `slider`, `table`, `latex`, `graph`, `numberLine`, `coordinatePlane`, `highlight`, `stepList`, `barChart`, `vennDiagram`, `pieChart`, `boxPlot`, `callout`. All but `latex` and `graph` delegate to a named `vizLib` function; `latex` renders via KaTeX and `graph` via a Desmos embed (`_desmosEmbed`), both as `rawHtml`.
- `_desmosEmbed(equations, options)` — private helper constructing the Desmos `<div>`/`<script>` embed used by `graph()`.

**Depends on:** stateMachine.ts (`StateMachine`). Output is shape-compatible with `assembleLesson` (layer2Assembler.ts) without adapter code.
**Used by:** lessonDemo.ts, visualTest.ts.

---

## lessonStateMachine.ts (deprecated)

**Purpose:** Superseded. Previously ran a `Lesson`'s acts as states externally; this responsibility now lives inside `Lesson` itself (see lesson.ts). Retained for reference only — do not use in new code.

- `LessonStateMachine extends StateMachine` — took a `Lesson` instance and executed its acts as states. Same `run()`/`getResults()`/`_runToDone()`/`_runAct()` pattern now built into lesson.ts.
- `_runTest()` — self-test building the pizza fractions lesson and running it through `LessonStateMachine`; writes `lesson_sm_demo.html`.

**Depends on:** stateMachine.ts, lesson.ts.
**Used by:** nothing else in the codebase.

---

## lessonDemo.ts

**Purpose:** Reference example for the `Lesson` API. Builds the pizza fractions lesson, runs it, writes `lesson_demo.html`.

Constructs a `Lesson`, chains `.addAct(...)` calls using prebuilt visual methods (`fractionBar`, `pieChart`, `stepList`, `latex`, `numberLine`, `multipleChoice`, `graph`), then in `main()`: `await lesson.run()`, `assembleLesson(lesson.getResults(), lesson.title)`, writes the output file. Wrapped in an async `main()` because the repo lacks `"type": "module"`, so `tsx` compiles to CommonJS and top-level `await` is unavailable.

**Depends on:** lesson.ts, layer2Assembler.ts.
**Used by:** run directly via CLI.

---

## visualTest.ts

**Purpose:** Smoke test covering the 11 `Lesson` prebuilt visual methods not exercised by lessonDemo.ts: `numberLine`, `coordinatePlane`, `highlight`, `stepList`, `barChart`, `vennDiagram`, `pieChart`, `boxPlot`, `callout`, `slider`, `table`. One act per method with minimal valid arguments. Writes `visual_test.html` for manual inspection.

**Depends on:** lesson.ts, layer2Assembler.ts.
**Used by:** run directly via CLI; not part of the runtime pipeline.

---

## demo.ts

**Purpose:** End-to-end demo of Layer 2 (the registry-based system one level below `Lesson`). Constructs a `LessonContext` by hand, runs the default `actRegistry` acts via `runAllActs`, writes `demo_lesson.html`. With `--preview`, also runs the example-only acts (`multipleChoiceAct`, `sliderAct`, `tableAct`) into `demo_preview.html`.

**Depends on:** actRegistry.ts, layer2Assembler.ts.
**Used by:** run directly via CLI.

---

## exampleCustomLesson.ts

**Purpose:** Template demonstrating direct use of Layer 2 without the `Lesson` class. Defines its own context, act functions (`intro`, `showEaten`, `quickCheck`), and running order, then assembles output identically to demo.ts.

**Depends on:** actRegistry.ts, layer2Assembler.ts.
**Used by:** intended as a copy-paste starting point; not imported elsewhere.

---

## Layer summary

```
Layer 0   stateMachine.ts ──> orchestrator.ts (6-stage LLM pipeline)
                                    │
                                    ▼
                  assembler.ts · validate.ts · pipelineTypes.ts

Layer 1   assembler.ts / validate.ts / pipelineTypes.ts
          JSON artifacts → MX.lesson() JS. No LLM calls; transforms and checks only.

Layer 2   actRegistry.ts ──> layer2Assembler.ts
          Act functions (ctx → ActOutput) → ActResult[] → HTML page.

Layer 3   lesson.ts (Lesson extends StateMachine)
          Wraps Layer 2's act pattern in prebuilt visual methods and its own run().
```

Layers 0–1 form the LLM-driven authoring pipeline: requires API keys, builds a lesson from a raw problem statement. Layers 2–3 form the manual authoring path: write acts directly, or use `Lesson`'s prebuilt visuals, then run and render to HTML. Both paths share the `ActOutput`/`ActResult` contract defined in actRegistry.ts; neither layer pair depends on the other's implementation.
