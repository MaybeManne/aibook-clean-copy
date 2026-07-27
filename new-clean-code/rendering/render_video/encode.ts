// Frame PNGs + per-beat audio → an mp4, behind an adapter. The default shells
// out to ffmpeg (via the `ffmpeg-static` prebuilt binary): frames become an
// image sequence at `fps`, per-beat audio clips are concatenated in order (they
// align because each beat's frame count = duration × fps), then video+audio are
// muxed. If ffmpeg-static is absent it throws a clear message.

import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

export interface AudioClip {
  bytes: Uint8Array;
  mime: string;
}
export interface EncodeInput {
  fps: number;
  /** PNG frames in playback order (index 0..N-1). */
  frames: Uint8Array[];
  /** Per-beat audio clips in playback order (may be empty for a silent video). */
  audio: AudioClip[];
  outPath: string;
  width?: number;
  height?: number;
}
export interface Encoder {
  encode(input: EncodeInput): Promise<{ path: string }>;
}

function run(bin: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const p = spawn(bin, args, { stdio: ["ignore", "ignore", "pipe"] });
    let err = "";
    p.stderr?.on("data", (d) => (err += String(d)));
    p.on("error", reject);
    p.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}:\n${err.slice(-1000)}`))));
  });
}

async function ffmpegPath(): Promise<string> {
  try {
    const pkg = "ffmpeg-static";
    const mod = (await import(/* @vite-ignore */ pkg)) as { default?: string } | string;
    const p = typeof mod === "string" ? mod : mod.default;
    if (!p) throw new Error("empty");
    return p;
  } catch {
    throw new Error("render_video: ffmpeg-static is not installed. Run `npm i ffmpeg-static` to encode mp4.");
  }
}

export function ffmpegEncoder(): Encoder {
  return {
    async encode(input: EncodeInput): Promise<{ path: string }> {
      const bin = await ffmpegPath();
      const dir = await mkdtemp(join(tmpdir(), "lessonkit-export-"));
      try {
        // Write frames as a zero-padded image sequence.
        for (let i = 0; i < input.frames.length; i++) {
          await writeFile(join(dir, `frame-${String(i + 1).padStart(6, "0")}.png`), input.frames[i]!);
        }
        const args = ["-y", "-framerate", String(input.fps), "-i", join(dir, "frame-%06d.png")];

        // Concatenate per-beat audio (order = playback order → aligned).
        let hasAudio = false;
        if (input.audio.length) {
          const listLines: string[] = [];
          for (let i = 0; i < input.audio.length; i++) {
            const ext = input.audio[i]!.mime.includes("wav") ? "wav" : "mp3";
            const f = join(dir, `audio-${String(i).padStart(3, "0")}.${ext}`);
            await writeFile(f, input.audio[i]!.bytes);
            listLines.push(`file '${f}'`);
          }
          const listPath = join(dir, "audio.txt");
          await writeFile(listPath, listLines.join("\n"));
          args.push("-f", "concat", "-safe", "0", "-i", listPath);
          hasAudio = true;
        }

        args.push("-c:v", "libx264", "-pix_fmt", "yuv420p");
        if (hasAudio) args.push("-c:a", "aac", "-shortest");
        args.push(input.outPath);

        await run(bin, args);
        return { path: input.outPath };
      } finally {
        await rm(dir, { recursive: true, force: true });
      }
    },
  };
}
