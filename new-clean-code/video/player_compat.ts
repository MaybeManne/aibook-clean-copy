// Backward-compat `Player` shim over VideoProgram. The original Player mixed the
// caption into the flat intents array and exposed only time/done/session/frame/
// tick/seek/play/pause. This preserves that surface (so existing headless callers
// and examples keep working) while the real logic lives in VideoProgram. New code
// should use createVideoProgram + VideoFrame directly.

import type { MachineEvent } from "@lessonkit/state-machine";
import type { RenderModel } from "@lessonkit/render-contract";
import type { Session } from "@lessonkit/lesson";
import { captionAsIntent } from "./render_model.js";
import { createVideoProgram, type VideoProgram, type VideoProgramOptions } from "./program.js";

export interface PlayerOptions extends VideoProgramOptions {
  /** slot the caption intent is routed to in frame() (default "caption"). */
  captionSlot?: string;
}

export class Player {
  private readonly program: VideoProgram;
  constructor(session: Session, private readonly opts: PlayerOptions = {}) {
    this.program = createVideoProgram(session, opts);
  }
  get time(): number {
    return this.program.time;
  }
  get done(): boolean {
    return this.program.done;
  }
  get session(): Session {
    return this.program.session;
  }
  /** RenderModel with the caption folded back into intents (legacy shape). */
  frame(): RenderModel {
    const f = this.program.frame();
    if (!f.caption) return f.model;
    return { intents: [...f.model.intents, captionAsIntent(f.caption, this.opts.captionSlot ?? "caption")] };
  }
  tick(dt: number): void {
    this.program.tick(dt);
  }
  seek(t: number): void {
    this.program.seekInBeat(t);
  }
  play(): void {
    this.program.play();
  }
  pause(): void {
    this.program.pause();
  }
}

export function createPlayer(session: Session, opts?: PlayerOptions): Player {
  return new Player(session, opts);
}
