# Spec 06 — `timeline/`

The temporal contract: a beat's animation as **data** (a light scene graph + a
storyboard) plus the **pure sampler** that turns time into a scene snapshot.
This is the continuous-time analog of `render_contract`. **Pure — no DOM, no
clock, no I/O.** Depends on `render_contract` (for `RichText`/`RenderIntent`).

Design rationale: see [`../VIDEO.md`](../VIDEO.md). The single pure function
`sampleAt` is the linchpin shared by interactive playback, seek, and export.

Modules: `scene.ts`, `storyboard.ts`, `sample.ts`, `index.ts`.

---

## `scene.ts` — light scene graph (declarative, never code)

```ts
export type NodeId = string;

/** Properties every node can carry + animate. */
export interface NodeBase {
  id: NodeId;
  x?: number; y?: number;          // position (px in a virtual stage coord space)
  opacity?: number;                // 0..1
  scale?: number;                  // 1 = natural
  rotation?: number;               // degrees
  fill?: string;                   // color token or literal
}

export type SceneNode =
  | (NodeBase & { kind: "rect"; w: number; h: number })
  | (NodeBase & { kind: "circle"; r: number })
  | (NodeBase & { kind: "line" | "arrow"; x2: number; y2: number; stroke?: string })
  | (NodeBase & { kind: "label"; text: RichText; size?: number })
  | (NodeBase & { kind: "group"; children: SceneNode[] });

/** The resolved scene at one instant — what a renderer draws. */
export interface SceneSnapshot {
  nodes: SceneNode[];
  /** virtual stage size; renderers scale to fit. */
  viewBox: { w: number; h: number };
}
```

Animatable properties are the `NodeBase` numbers + `fill`/`stroke` colors. The
set is intentionally small ("light scene graph"); it grows additively.

---

## `storyboard.ts` — the beat's timeline

```ts
export type Easing = "linear" | "easeIn" | "easeOut" | "easeInOut";

export interface Tween {
  target: NodeId;
  property: "x" | "y" | "opacity" | "scale" | "rotation" | "fill";
  from?: number | string;          // omitted = node's current/base value
  to: number | string;
  start: number;                    // ms from beat start
  duration: number;                 // ms
  easing?: Easing;                  // default "linear"
}

/** Sub-beat events fired as the clock passes their time. */
export type Cue =
  | { at: number; kind: "reveal"; intent: RenderIntent }   // show a render intent
  | { at: number; kind: "caption"; text: RichText }        // active subtitle (§07)
  | { at: number; kind: "narrationMark"; label: string }   // word/segment marker
  | { at: number; kind: "gate"; event: string };           // PAUSE clock until `event`

export interface Storyboard {
  /** total beat duration in ms (may be derived from narration length, §07). */
  duration: number;
  initial: SceneNode[];             // scene at t=0
  tweens: Tween[];
  cues?: Cue[];
  stage?: { w: number; h: number }; // viewBox; default 1920x1080
}
```

> Storyboards are pure JSON (numbers/strings) — serializable, validatable, and
> AI-authorable, exactly like the lesson IR. No functions, no `eval`.

---

## `sample.ts` — the pure sampler (linchpin)

```ts
/** Resolve the scene at time `t` (ms). Applies every tween active at `t`. Pure. */
export function sampleAt(sb: Storyboard, t: number): SceneSnapshot;

/** Cues whose `at <= t`, in order — captions to show, intents revealed, etc. Pure. */
export function cuesUpTo(sb: Storyboard, t: number): Cue[];

/** The first unresolved gate cue at or before `t`, if the clock should pause. Pure. */
export function activeGate(sb: Storyboard, t: number): Extract<Cue, { kind: "gate" }> | null;

/** Standard easing functions, exported for renderers/tests. */
export const easings: Record<Easing, (p: number) => number>;
```

**Sampling contract:**
- A tween affects its `property` for `start <= t <= start+duration`; before
  `start` the property holds `from` (or base); after the end it holds `to`.
- Overlapping tweens on the same `(target, property)` apply in array order (last
  wins at equal priority).
- `sampleAt` is a pure function of `(storyboard, t)` only — **no clock, no
  randomness, no Date**. This is what makes playback scrubbable and export
  frame-exact: seek = `sampleAt(t)`, export = `sampleAt(frame*1000/fps)`.

---

## `index.ts` — public surface

Re-exports `scene`, `storyboard`, `sample`. No clock, no renderer — those live in
`rendering/`.

## Open items
- Easing curves beyond the basic four (cubic-bezier params).
- Path/morph animations (equation morphs) — Phase >1, additive.
- Camera (pan/zoom) as a stage-level transform node — additive.
