# Spec 08 — video rendering (`rendering/render_web` + `rendering/render_video`)

How a timeline becomes pixels — interactively in the browser (`render_web`
additions) and offline as files (`render_video`). Both consume the SAME
`sampleAt` from `timeline/`; that's what guarantees the interactive preview and
the exported file match frame-for-frame.

Depends on `render_contract`, `template`, `timeline`. The Phase 0 slice
implements the **bold** items only.

---

## A. `scene` content kind (in `render_contract`, then `render_web`)

The animated scene reaches the renderer through the EXISTING slot/registry
machinery as a new intent kind — video is "a content kind that varies with `t`":

```ts
// render_contract addition:
| { kind: "scene"; slot: SlotName; snapshot: SceneSnapshot }
| { kind: "caption"; slot: SlotName; text: RichText }
```

**`render_web` adds one component:** `SceneView` (kind `"scene"`) draws a
`SceneSnapshot` to SVG (Phase 0) — rect/circle/line/arrow/label/group, applying
`x/y/opacity/scale/rotation/fill`, scaled to fit the slot via `viewBox`. A
`CaptionView` (kind `"caption"`) renders subtitles (Phase 2).

---

## B. The `Player` (in `lesson/authoring`)

> Placement: the Player drives a `Session` and produces a `RenderModel`, so it
> lives in the lesson layer (alongside `Session`) — NOT in `render_web`, which
> stays lesson-free and only gains `SceneView`. `lesson` already depends on
> `timeline` (for `Storyboard`). The view renders `player.frame()` via the
> normal `TemplateView`.

Wraps a `Session` and owns the **single clock** (beat time `t`). Clock-agnostic
so it is headless-testable: time is advanced via `tick(dt)`; `play()` drives
`tick` from `requestAnimationFrame` in the browser.

```ts
export interface PlayerOptions {
  /** frames source for play(); defaults to requestAnimationFrame. Inject for tests. */
  raf?: (cb: (dtMs: number) => void) => () => void; // returns cancel
}

export interface Player {
  /** Render model for the current beat at the current `t` (scene + revealed cues). */
  frame(): RenderModel;
  /** Advance beat time by `dt` ms. Fires due cues; at end-of-storyboard advances the SM. */
  tick(dt: number): void;
  /** Jump within the current beat. */
  seek(t: number): void;
  play(): void;
  pause(): void;
  readonly time: number;
  readonly done: boolean;
  readonly session: Session;
}

export function createPlayer(session: Session, opts?: PlayerOptions): Player;
```

**Behavior (Phase 0):**
- On entering a beat, read its `storyboard()` (if any); `duration` known.
- `frame()` = `{ intents: [{ kind:"scene", slot:"stage", snapshot: sampleAt(sb,t) },
  ...cuesUpTo(t).filter(reveal).map(c=>c.intent) ] }`. A non-timed beat falls back
  to `session.render()`.
- `tick(dt)`: `t += dt`; when `t >= sb.duration`, emit the beat's advance event
  (`{ type: "next" }`) via `session.send` and reset `t = 0` for the next beat.
- **Phase 1+:** `activeGate(sb,t)` pauses the clock until the named event arrives;
  `seek` across beats replays SM events to the target beat (deterministic) then
  samples.

> The Player only sequences time and forwards events; all lesson state stays in
> the pure Session. One clock; no GSAP/audio/scroll triple-sync.

---

## C. Offline export (`render_video`) — Phase 3

```ts
export interface ExportOptions { fps?: number; path?: string } // default 30 fps
/** Walk a recorded beat path; sampleAt(frameTime) → canvas frames → encoder → file. */
export function exportLesson(
  lesson: CompiledLesson, history: EventRecord[], opts?: ExportOptions,
): Promise<{ path: string }>;
```

Implements `Template<FrameEmitter>`: same `SceneSnapshot`, drawn to an offscreen
canvas instead of the DOM; frames piped to an encoder (ffmpeg) and muxed with the
per-beat TTS audio. Because it reuses `sampleAt`, the export is identical to what
`Player` shows — the interactive preview *is* the storyboard.

---

## Phase 0 acceptance (what the slice must prove)

1. `timeline/`: `sampleAt` returns correct interpolated values at t=0 / mid / end
   for a fade+move storyboard (headless assertions).
2. A `scene` beat renders through the template (SVG) — `SceneView` draws the
   snapshot.
3. `Player.tick` advances beat time and, at storyboard end, emits the event that
   advances the SM to the next beat (proves discrete+continuous reconciliation).

## Open items
- `CaptionView` + audio element sync (Phase 2).
- Scrub UI / scroll driver (Phase 1+).
- Encoder choice + audio mux details (Phase 3).
