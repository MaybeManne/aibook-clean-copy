# LessonKit — Video / Timeline Subsystem (design)

Goal: SocraticAI-class animated, narrated lessons — **both** interactive in-browser
playback **and** offline file export — built on LessonKit without reworking the
engine. Scope (decided): both outputs, a **light scene graph**, TTS + word-level
subtitles.

Status: Phases 0–3 implemented. Phase 0 (timeline + Player), Phase 2 (TTS
alignment + subtitles + single-clock audio, `audio/` layer), and Phase 3 (offline
mp4 export, `rendering/render_video/`) are built and covered by `npm run
anim|narrate|export`. Phase 1 depth (scrub-across-beats, gate cues) is still open.

---

## 1. The core principle

> **The state machine sequences beats (discrete). Each beat carries a timeline
> (continuous). One authoritative clock — beat time `t` — drives everything.**

This mirrors SocraticAI (Act = timeline, lesson = sequence of Acts) but fixes its
worst trait: SocraticAI synced three things (GSAP timeline + audio + scroll) and
needed an `isStuck()`/`recoverState()` subsystem to survive the races. We have
**one** clock; visuals, audio, and subtitles are all *pure functions of `t`*.

The engine is untouched: a beat that animates for 30 s is, to the SM, identical
to today's instant beat — a playback clock simply emits a `beat.done` event at
timeline end, which the compiler routes like any other outcome.

The unifying pure function (the linchpin):

```ts
sampleAt(storyboard, t): SceneSnapshot      // pure; deterministic; no I/O
```

- **Interactive playback** calls `sampleAt` in a requestAnimationFrame loop.
- **Seek/scrub** = `sampleAt(t)` (plus replay of SM events to reach the beat).
- **Offline export** calls `sampleAt(frameTime)` for each frame.

One function, three consumers → no triple-sync, fully scrubbable, replayable.

---

## 2. New layers (same strict one-way dependency rule)

```
timeline/         temporal contract: Storyboard + light scene graph + sampleAt(). PURE.
                  deps: render_contract
audio/            TTS adapter + alignment + subtitles + content-hash cache + AudioSink.
                  deps: timeline (Cue) + render_contract (RichText) only
video/            THE VIDEO LAYER: single clock + transport (play/pause/seek/restart) +
                  per-frame VideoFrame {model, caption, transport} + persistent stage +
                  gate pausing + AudioChannel. Composes a lesson Session (the SM host);
                  imports NO renderer/template. `createPlayer` compat shim lives here.
                  deps: lesson (Session), timeline, audio, render_contract, state_machine
rendering/
  render_web/     SceneView + CaptionView + VideoView (theater/notebook chrome) +
                  TransportBar + htmlAudioSink + speechSink (no-key WebSpeech fallback)
  render_video/   frame exporter (SceneSnapshot → SVG → resvg → ffmpeg) + audio mux
                  deps: render_contract, template, timeline, lesson
```

Dependency arrow: `state_machine (pure) ← lesson ← video ← render_web (VideoView)`;
`video` also ← timeline, audio. The state machine never knows about video; the
template/renderer only consumes `VideoFrame` + `TransportState`.

Beats gain one optional method (below). Everything else — engine, render_contract,
template, lesson compiler — is unchanged.

---

## 3. The timeline contract (`timeline/`)

### 3.1 Light scene graph (data, never code)

```ts
type NodeId = string;
type SceneNode =
  | { id: NodeId; kind: "rect";  x:number; y:number; w:number; h:number; fill?:string; ... }
  | { id: NodeId; kind: "circle"; x:number; y:number; r:number; ... }
  | { id: NodeId; kind: "line" | "arrow"; x1:number;y1:number;x2:number;y2:number; ... }
  | { id: NodeId; kind: "label"; x:number;y:number; text: RichText; ... }
  | { id: NodeId; kind: "group"; children: SceneNode[]; ... };
// shared animatable props: opacity, scale, rotation, x, y, color
```

### 3.2 Storyboard = the beat's timeline

```ts
interface Tween {
  target: NodeId; property: "x"|"y"|"opacity"|"scale"|"rotation"|"color";
  from?: number|string; to: number|string;
  start: number; duration: number; easing?: "linear"|"easeIn"|"easeOut"|"easeInOut";
}
interface Storyboard {
  duration: number;          // total beat time (may be derived from narration, §5)
  initial: SceneNode[];      // scene at t=0
  tweens: Tween[];           // timed property animations
  cues?: Cue[];              // sub-beat events: reveal intent, caption, gate, narration mark
}
interface SceneSnapshot { nodes: SceneNode[]; /* resolved at a given t */ }
```

`cues` carry the SocraticAI "say + do" idea: a `reveal` cue shows a render intent
at time `t`; a `caption` cue sets the active subtitle; a `gate` cue **pauses the
clock** until a student event (interactive question mid-animation).

### 3.3 The pure sampler

```ts
function sampleAt(sb: Storyboard, t: number): SceneSnapshot;   // apply tweens active at t
function cuesUpTo(sb: Storyboard, t: number): Cue[];           // fired cues (captions, reveals)
```

---

## 4. Beats become (optionally) timed

`RenderableBeat` gains one optional method — beats without it stay instant:

```ts
interface RenderableBeat<P> {
  render(params, state, ctx): RenderIntent[];          // unchanged (instant snapshot)
  storyboard?(params, state, ctx): Storyboard;         // NEW: the beat's timeline
}
```

The animated scene reaches the renderer through the **existing** slot/intent
machinery as a new content kind:

```ts
{ kind: "scene"; slot: "stage"; snapshot: SceneSnapshot }
```

So the template's component registry just needs one new component (`scene` →
SceneView). No new rendering architecture — video is "a content kind that varies
with `t`."

---

## 5. Audio / narration / subtitles (`audio/`)

- Each timed beat has narration text. A **TTS adapter** synthesizes audio +
  **word-level timestamps**, cached by content hash (SocraticAI-style; survives
  re-runs). Provider TBD (ElevenLabs like SocraticAI, or Azure — keys exist in
  the embed-bench env; confirm at impl).
- **Narration drives duration**: a beat's `Storyboard.duration` defaults to the
  audio length (exact), not SocraticAI's word-count estimate.
- **Word timestamps → subtitle track** → emitted as `caption` cues / a `caption`
  intent sampled at `t`.
- **Single-clock sync**: audio element is *slaved* to beat time `t` (seek audio to
  `t` on scrub); visuals and captions are `sampleAt(t)`. No independent audio
  clock = no drift races.

---

## 6. Playback & export (`rendering/`)

### 6.1 Interactive Player (`render_web`)
Wraps a `Session` + a clock. rAF loop: advance `t`; render `sampleAt` +
fired cues through the template; at `t = duration` (or a `gate` cue) emit the
event that advances the SM. `play/pause`, `seek(beat, t)`. Seek across beats =
replay SM events to that beat (deterministic, pure) then `sampleAt`.

### 6.2 Offline export (`render_video`)
Walk the beat sequence (a recorded path); for each timed beat, `sampleAt` at
frame times (e.g. 30 fps) → render each SceneSnapshot to an offscreen canvas →
PNG frames → encoder (ffmpeg) → mp4; mux the per-beat TTS audio. Same
`sampleAt`, same scene graph, different sink — the `Template<FrameEmitter>` path.

---

## 7. What we deliberately do NOT copy from SocraticAI

- **No `eval`'d generated JS.** Animations are declarative `Storyboard` data +
  registered primitives — replayable, validatable, agent-authorable.
- **No triple-sync.** One clock; audio/subtitles/visuals are functions of `t`.
- **No global singletons.** Player wraps a Session instance; multiple lessons OK.

---

## 8. Phased plan

**Phase 0 — vertical slice (proves discrete+continuous).** `timeline/` with the
light scene graph + `sampleAt`; 3–4 primitives; fade/move tweens; the `scene`
intent kind + a `SceneView` (SVG) in render_web; a `Player` that plays ONE
animated beat on a clock and emits `beat.done` → SM advances. *No audio, no
export yet.* Headless test asserts `sampleAt` values at t=0/mid/end.

**Phase 1 — playback depth.** More primitives + easings; `seek`/scrub via
replay-to-beat + sample; `gate` cues (interactive question mid-timeline).

**Phase 2 — audio + subtitles. ✅ IMPLEMENTED.** `audio/` layer: `TtsAdapter`
(ElevenLabs adapter via `/with-timestamps` + a deterministic `fakeTtsAdapter` for
tests), `charAlignmentToWords` alignment, `toCaptions`/`captionCues`/`activeCaption`
subtitles, content-hash cache, and an offline `prepareNarration` precompile that
sets each storyboard's duration to the audio length and merges caption cues.
`Player` emits word-highlighted `caption` intents and slaves an `AudioSink`
(browser: `htmlAudioSink`) to beat time `t`. Test: `examples/narrated`.

**Phase 3 — offline export. ✅ IMPLEMENTED.** `rendering/render_video`: pure
`snapshotToSvg`/`frameSvg` (shared with `SceneView` via `@lessonkit/scene-svg`),
`planFrames` walking the beat path (`sampleAt` per frame, captions burned in),
injectable `Rasterizer` (`@resvg/resvg-js`) + `Encoder` (`ffmpeg-static`), and
`exportLesson`. The frame *plan* is pure/dep-free; only real encoding needs the
two prebuilt binaries.

> Audio is in scope but sequenced after Phase 0/1: the visual timeline must exist
> before narration can drive it. Phase 0 is the real readiness proof.

## 9. Verdict on readiness

Architecturally ready — no engine/contract/layout rework. Functionally, this is
the largest build so far (a timeline contract, a scene graph, a player, an
exporter, and an audio subsystem). Phase 0 is small and decisive; the rest is
additive on top of it.
