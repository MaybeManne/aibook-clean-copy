import { topId, type StateValue } from "@lessonstudio/state-machine";
import { graphNode, lessonGraph, type ChartGraph, type DirectionResult, type Session } from "@lessonstudio/lesson";

/** One line of the event log: what was sent, and where it moved the learner. */
export interface MachineEventLine {
  seq: number;
  type: string;
  from: string;
  to: string;
}

/**
 * Everything the machine page draws, as pure JSON.
 *
 * A snapshot, not a live handle: the two pages share nothing but this object, so the machine view
 * cannot accidentally read a Session it does not own, and the same payload works over a
 * `BroadcastChannel` today or a websocket to a teacher's laptop later without changing the view.
 */
export interface MachineSnapshot {
  lesson: { id: string; version: number; title: string };
  graph: ChartGraph;
  /** Where the learner is standing right now. */
  activeBeatId: string;
  /** `history.length` — the monotonic step count, and the thing to compare to spot a stale tab. */
  step: number;
  done: boolean;
  /** The tutor is authoring: the active node is an ephemeral leaf. */
  thinking: boolean;
  score: number;
  /**
   * Every `from>to` pair the learner has actually traversed, deduped, over the WHOLE history — so
   * the travelled path stays painted even after the event log has scrolled past it.
   */
  traversed: string[];
  /** The tail of the event log, newest last. */
  historyTail: MachineEventLine[];
  /** The last director turn's verdict — the only place a REFUSED turn is visible at all. */
  lastResult: DirectionResult | null;
}

/** The `BroadcastChannel` name both pages meet on. */
export const MACHINE_CHANNEL = "lessonstudio.machine";

/** Wire format. `hello` is the late-joiner's request: a channel message is not retained, so a
 *  machine tab opened after the lesson would otherwise stare at an empty screen until the next
 *  transition — which, on a lesson that is mid-beat, may be a long time. */
type Wire = { kind: "snapshot"; snapshot: MachineSnapshot } | { kind: "hello" };

export interface SnapshotOptions {
  /** How many recent transitions to carry. Default 60. */
  tail?: number;
}

/**
 * Project a live session into a snapshot. Pure and cheap — no clock, no randomness — so it is safe
 * on every frame and a check can compare two of them.
 */
export function machineSnapshot(session: Session, opts: SnapshotOptions = {}): MachineSnapshot {
  const tail = opts.tail ?? 60;
  const graph = lessonGraph(session.lesson);
  const history = session.context.history;
  const activeBeatId = session.activeBeatId();

  const traversed: string[] = [];
  const seen = new Set<string>();
  for (const r of history) {
    const key = `${topId(r.from)}>${topId(r.to)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    traversed.push(key);
  }

  return {
    lesson: { id: session.lesson.spec.id, version: session.lesson.spec.version, title: session.lesson.spec.title },
    graph,
    activeBeatId,
    step: history.length,
    done: session.done,
    // Read off the node rather than the `__ask-` id: the ephemeral flag is what the ENGINE means by
    // "this leaf is scaffolding", and the naming convention is only how it happens to be spelled.
    thinking: graphNode(graph, activeBeatId)?.ephemeral === true,
    score: session.context.score,
    traversed,
    historyTail: history.slice(-tail).map((r) => ({ seq: r.seq, type: r.event.type, from: topId(r.from), to: topId(r.to) })),
    lastResult: session.lastResult,
  };
}

function channel(name: string): BroadcastChannel | null {
  // Absent in Node, which is where the checks run: a mirror that cannot publish is not an error,
  // it is a headless process. `machineSnapshot` and the layout are the parts worth checking anyway.
  if (typeof BroadcastChannel === "undefined") return null;
  return new BroadcastChannel(name);
}

/**
 * Publish this session to any machine page, for as long as the returned detach fn is uncalled.
 *
 * One line in a host's `App.tsx`, and deliberately one-way: the machine view is a WINDOW, not a
 * second controller. Anything a teacher wants to *do* already has a door — `teach/`'s bus and
 * `Session.direct` — and giving this channel write access would be a second, unadjudicated one.
 */
export function attachMachineMirror(session: Session, opts: SnapshotOptions & { channel?: string } = {}): () => void {
  const ch = channel(opts.channel ?? MACHINE_CHANNEL);
  if (!ch) return () => {};
  const publish = (): void => {
    ch.postMessage({ kind: "snapshot", snapshot: machineSnapshot(session, opts) } satisfies Wire);
  };
  const onMessage = (e: MessageEvent<Wire>): void => {
    if (e.data?.kind === "hello") publish();
  };
  ch.addEventListener("message", onMessage);
  const detachSession = session.subscribe(() => publish());
  publish();
  return () => {
    ch.removeEventListener("message", onMessage);
    detachSession();
    ch.close();
  };
}

/** Receive snapshots. Says hello on attach, so a page opened late is caught up immediately. */
export function subscribeMachine(fn: (s: MachineSnapshot) => void, opts: { channel?: string } = {}): () => void {
  const ch = channel(opts.channel ?? MACHINE_CHANNEL);
  if (!ch) return () => {};
  const onMessage = (e: MessageEvent<Wire>): void => {
    if (e.data?.kind === "snapshot") fn(e.data.snapshot);
  };
  ch.addEventListener("message", onMessage);
  ch.postMessage({ kind: "hello" } satisfies Wire);
  return () => {
    ch.removeEventListener("message", onMessage);
    ch.close();
  };
}

/** The state value's beat id — re-exported so a host reading `historyTail` needs no second import. */
export function beatIdOf(state: StateValue): string {
  return topId(state);
}
