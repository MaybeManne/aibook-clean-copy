// Transport: the video layer's playback state. Pure data — no clock, no DOM.
// A VideoProgram recomputes this each frame; hosts render controls from it.

export interface TransportState {
  playing: boolean;
  beatId: string;
  tInBeat: number; // ms into the current beat's storyboard
  beatDuration: number; // 0 for non-timed (gate/explain) beats
  progress: number; // tInBeat / beatDuration, 0-guarded
  globalTime: number; // sum of completed spine beats + tInBeat (estimate)
  estimatedTotal: number; // sum of spine storyboard durations (estimate)
  done: boolean; // the lesson reached a terminal beat
  timed: boolean; // is the current beat animated?
  atGate: boolean; // blocked at an in-storyboard gate cue, awaiting an event
  gateEvent: string | null;
  rate: number; // playback speed multiplier (1 = normal)
}

/** One beat as a point on the global timeline (visited/spine order). */
export interface TimelineEntry {
  beatId: string;
  startGlobal: number;
  duration: number;
  timed: boolean;
}
