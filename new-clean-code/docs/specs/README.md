# LessonKit — Interface Specs

Interface-level specifications for every layer. These define the **contracts**
(types + function signatures + behavioral notes) — not implementations. Code is
written against these.

Read order follows the dependency arrows (bottom layers first):

| # | Spec | Package | Depends on |
|---|------|---------|------------|
| 01 | [state-machine](01-state-machine.md) | `state_machine/` | — (nothing) |
| 02 | [render-contract](02-render-contract.md) | `render_contract/` | — (nothing) |
| 03 | [lesson](03-lesson.md) | `lesson/` | state_machine, render_contract |
| 04 | [template](04-template.md) | `template/` | render_contract |
| 05 | [rendering](05-rendering.md) | `rendering/render_web/` | render_contract, template |
| 06 | [timeline](06-timeline.md) | `timeline/` | render_contract |
| 07 | [audio](07-audio.md) | `audio/` | timeline |
| 08 | [video-rendering](08-video-rendering.md) | `rendering/render_web` + `render_video/` | render_contract, template, timeline |

Specs 06–08 are the **video subsystem** (see [`../VIDEO.md`](../VIDEO.md)). Phase 0
implements `timeline/` + the `scene` intent kind + `SceneView` + `Player`.

## Dependency rule (the load-bearing constraint)

Imports flow in **one direction only**, bottom → top. The enforcement is social
+ structural: each package's `index.ts` may only re-export from packages at or
below it in the table.

```
state_machine ──┐                      render_contract ──┐
                │                                         │
                ▼                                         ▼
              lesson ◄──────────────────────────────── (uses contract)
                                                          │
                                          template ◄──────┤
                                                          │
                                       render_web ◄───────┘
                                          (also uses template)
example/app ── may import everything (the glue layer)
```

**Litmus test:** `state_machine/` imports nothing from this repo. It can be
unit-tested with a toy context (turnstile, counter) with no beats, scores,
lessons, templates, or DOM. If that ever breaks, a lesson-ism has leaked.

## Conventions used in these specs

- Signatures are shown as TypeScript `interface` / `type` / function
  declarations **without bodies**. `// →` comments describe runtime behavior.
- `C` is always the **context type parameter** — opaque to the engine, made
  concrete (`LessonContext`) only in the `lesson/` layer.
- "Pure" means: no I/O, no mutation of inputs, deterministic — safe to replay.
- "by name" means a value is referenced via a string key resolved against a
  `Registry` (keeps the serialized IR pure JSON and agent-authorable).

## Layer responsibilities at a glance

- **state_machine** — a generic, serializable, replayable hierarchical state
  machine. Knows states, transitions, guards, actions, effects. Knows nothing
  about *what* it is running.
- **render_contract** — the typed, presentation-free description of what to
  show (`RenderIntent`/`RenderModel`) + portable rich text. The handshake
  between a lesson and any renderer.
- **lesson** — lesson semantics on top of the engine: a `LessonContext`,
  predefined `beats`, and an authoring API that compiles **teacher-authored
  flow** into generic transitions. Owns history.
- **template** — presentation-agnostic description of *where* content goes
  (slots/regions) and design tokens (theme). Pure data.
- **rendering** — concrete renderers (React web now; video later) that consume
  a `RenderModel` + a `Template` and emit pixels, pushing events back up.
