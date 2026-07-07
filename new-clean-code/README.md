# LessonKit

*Advanced Manim for interactive educational content.* A declarative engine for
authoring interactive lessons that run on a generic state machine, render
through swappable templates, and are editable by humans **and** AI agents.

Design: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) · Contracts:
[`docs/specs/`](docs/specs/).

## Layers (strict one-way dependencies)

```
state_machine/      generic hierarchical state machine, generic over Context <C>.
                    Imports NOTHING from this repo. (litmus: examples/turnstile)
render_contract/    RenderIntent / RenderModel / rich text. Imports nothing.
timeline/           video subsystem: scene graph + Storyboard + pure sampleAt().
                    deps render_contract. (Phase 0 of docs/VIDEO.md)
lesson/             lesson semantics on top of the engine:
  lesson_sm/          LessonContext + compile (teacher flow → transitions) + validate
  beats/              Explain, MCQ, Branch + Animate (timed beat)
  authoring/          defineLesson DSL + Session + Player (single playback clock)
template/           presentation-agnostic slots + theme (pure data, renderer-generic)
rendering/render_web/  React renderer: TemplateView + SceneView (draws a SceneSnapshot)
examples/
  turnstile/          litmus test — generic engine with a toy context
  photosynthesis/     one lesson, one template, headless + browser harnesses
  animated/           Phase-0 video slice — one animated beat on a clock
```

**The teacher owns the flow.** Branching is authored data, not an engine feature:
the compiler lowers `onWrong` / `branch` / `next` into generic transitions. An
LLM/gaze policy is a *selector* on the teacher's graph (via `match` routes), never
an author of arbitrary jumps.

## Run

Node here is a **dev tool only** (the runtime is pure browser JS). A project-local
Node lives at `.conda-node/`:

```bash
export PATH="$PWD/.conda-node/bin:$PATH"
npm install

npm run litmus       # generic engine drives a turnstile (no lesson/render deps)
npm run demo         # headless lesson: both paths + snapshot/restore + replay
npm run render-test  # headless React: the lesson renders through the template
npm run anim         # Phase-0 video: sampleAt interpolation + Player advances the SM
npm test             # all of the above
npm run typecheck    # tsc --noEmit, whole repo
npm run dev          # vite dev server — click through the lesson
```

## Files & toolchain (all build-time only)

The library itself is plain TypeScript that compiles to browser JS. These files
exist only so we can typecheck, run `.ts` directly, and bundle — **none ship at
runtime**, and none should be deleted:

| File | Role |
|------|------|
| `package.json` | dependency + script manifest (needed by `npm install` and every script) |
| `package-lock.json` | pins exact dependency versions for reproducible installs |
| `tsconfig.json` | TS compiler options **and** the `@lessonkit/*` path aliases |
| `vite.config.ts` | dev-server/bundler config (mirrors the aliases) |
| `.conda-node/` | project-local Node (this box has no system Node); dev tool only |
| `node_modules/` | installed deps; regenerable via `npm install` (relocatable — see below) |

`node_modules/` can live outside the project (e.g. on scratch) via a symlink:
`ln -s /path/to/store node_modules` before `npm install` — tools still resolve
`./node_modules` transparently. (Or switch to `pnpm`, which hardlinks from a
shared global store.)

## What's pure vs. effectful

The engine (`transition`) is a **pure reducer** — guards/actions are deterministic,
so sessions are snapshot-able and replayable from their event log. All I/O and
nondeterminism (timers, network, **LLM/gaze decisions**) are **effects** run by the
`Session`, whose results re-enter as recorded events — which is exactly what keeps
adaptive routing replayable. See [`docs/specs/03-lesson.md`](docs/specs/03-lesson.md).
