// The ONE visual primitive a free session needs: a generic `sandbox` viz that renders
// whatever self-contained HTML the tutor authored — a static SVG illustration or a fully
// interactive HTML+JS+canvas demo — inside a SANDBOXED iframe.
//
// This is the "LLM writes the artifact" end of the grounding spectrum (docs/VISION.md).
// Instead of a fixed chart/plot/vector kit the engine owns, the model authors the figure
// directly and we just PLACE it. The iframe is the whole security boundary:
//   • `sandbox="allow-scripts"` WITHOUT `allow-same-origin` → the authored document runs in a
//     unique opaque origin. Its scripts execute, but it cannot read the host page, its DOM,
//     cookies, or storage, and any fetch it attempts is cross-origin to nothing it can use.
//   • the html is therefore treated as untrusted DATA: a plain JSON-serializable string prop
//     (so an authored beat stays replay-safe — `assertNoInlineFns` holds) that we hand to
//     `srcdoc` and NEVER inject into the host DOM.
// A size cap is the only other guard. No sanitizer, no eval, no viz kit — the model writes the
// artifact; this ~30 lines just frames it. Registering more viz kinds is purely additive.
import { registerViz, type VizApi, type VizHandle, type VizProps } from "@lessonkit/render-web";
import { sampleAt, type Storyboard } from "@lessonkit/timeline";
import { snapshotToSvgInner } from "@lessonkit/scene-svg";
import { defaultTheme } from "@lessonkit/template";

const MAX_HTML = 96 * 1024; // authored figures are small + self-contained; cap runaway output

const clampHtml = (p: VizProps): string => {
  const h = typeof p.html === "string" ? p.html : "";
  return h.length > MAX_HTML ? h.slice(0, MAX_HTML) : h;
};

registerViz("sandbox", (el: HTMLElement, initial: VizProps, _api: VizApi): VizHandle => {
  const frame = document.createElement("iframe");
  frame.setAttribute("sandbox", "allow-scripts"); // scripts yes; same-origin NO → opaque origin
  frame.setAttribute("referrerpolicy", "no-referrer");
  frame.style.cssText = "width:100%;height:min(72vh,560px);border:0;border-radius:12px;background:#fff;display:block";
  frame.srcdoc = clampHtml(initial);
  el.appendChild(frame);

  return {
    update(next: VizProps): void {
      const doc = clampHtml({ ...initial, ...next });
      if (doc !== frame.srcdoc) frame.srcdoc = doc; // reload only when the authored html changes
    },
    destroy(): void {
      el.innerHTML = "";
    },
  };
});

// The SECOND free-session viz: a self-animating `storyboard` player. It receives a declarative
// `Storyboard` (pure JSON — replay-safe, `assertNoInlineFns` holds) and owns its OWN rAF clock:
// it advances `t`, samples the scene with the pure `sampleAt`, and paints the snapshot with the
// pure `snapshotToSvgInner` into an inline <svg>. It holds the final frame once `t ≥ duration`.
//
// WHY here and not a host clock: this keeps `live/program.ts` + `Session.render` clockless (no
// `t` threading, no scene-intent change) — the viz IS the per-beat autoplay clock, exactly the
// self-contained pattern the `sandbox` iframe already uses. `props.autoplay === false` paints the
// FINAL frame once with no rAF — used for PAST/persisted steps so only the ACTIVE step animates.
const asStoryboard = (p: VizProps): Storyboard | null => {
  const sb = p.storyboard as Storyboard | undefined;
  return sb && Array.isArray(sb.initial) && typeof sb.duration === "number" ? sb : null;
};

registerViz("storyboard", (el: HTMLElement, initial: VizProps, _api: VizApi): VizHandle => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svg.style.cssText = `width:100%;height:min(72vh,560px);display:block;border-radius:12px;background:${defaultTheme.color.stage}`;
  el.appendChild(svg);

  let raf = 0;
  let start = 0; // rAF timestamp of t=0
  let sb: Storyboard | null = asStoryboard(initial);
  let autoplay = initial.autoplay !== false;

  const paintAt = (t: number): void => {
    if (!sb) return;
    const snap = sampleAt(sb, t);
    const { x, y, w, h } = snap.viewBox;
    svg.setAttribute("viewBox", `${x} ${y} ${w} ${h}`);
    svg.innerHTML = snapshotToSvgInner(snap, defaultTheme);
  };

  const stop = (): void => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };

  const run = (): void => {
    stop();
    if (!sb) {
      svg.innerHTML = "";
      return;
    }
    if (!autoplay) {
      paintAt(sb.duration); // persisted / past step → hold the final frame, no clock
      return;
    }
    start = 0;
    const tick = (now: number): void => {
      if (!sb) return;
      if (!start) start = now;
      const t = now - start;
      paintAt(Math.min(t, sb.duration));
      if (t < sb.duration) raf = requestAnimationFrame(tick);
      else raf = 0; // reached the end → hold the final frame
    };
    raf = requestAnimationFrame(tick);
  };

  run();

  return {
    update(next: VizProps): void {
      const nextSb = asStoryboard({ ...initial, ...next });
      const nextAutoplay = (next.autoplay ?? initial.autoplay) !== false;
      // Restart only when the scene or the play mode actually changed (props flow every frame).
      if (JSON.stringify(nextSb) !== JSON.stringify(sb) || nextAutoplay !== autoplay) {
        sb = nextSb;
        autoplay = nextAutoplay;
        run();
      }
    },
    destroy(): void {
      stop();
      el.innerHTML = "";
    },
  };
});
