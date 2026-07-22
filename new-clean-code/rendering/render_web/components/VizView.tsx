// VizView: renders the `viz` intent kind. Two escape hatches, one intent:
//   • a registered SVG FIGURE (registerFigure) → pure string, rendered here AND
//     rasterized into the mp4 export (full creative freedom, still exportable);
//   • a registered DOM/canvas VIZ (registerViz) → mounted element driven by the
//     beat clock `t` (WebGL/canvas/D3/…), browser only.
// Hooks always run (figure path just makes the mount effects no-op).
//
// The mounted viz gets an OUTBOUND `send` (VizApi): it can report the learner's
// interaction back to the session (demo.set / signal.viz.*) so the tutor observes
// and adapts. `send` is proxied through a ref so a viz mounted once keeps calling
// the latest program.send without remounting.
import React from "react";
import type { RenderIntent } from "@lessonkit/render-contract";
import { asVizIntent } from "@lessonkit/timeline";
import { getFigure } from "@lessonkit/scene-svg";
import type { ComponentFor } from "./index.js";
import { getViz, type VizHandle } from "../viz.js";

export const VizView: ComponentFor = ({ intent, theme, send }) => {
  const viz = asVizIntent(intent as RenderIntent);
  const ref = React.useRef<HTMLDivElement>(null);
  const handle = React.useRef<VizHandle | null>(null);
  const name = viz?.name;
  const figure = name ? getFigure(name) : undefined;

  // Keep the newest `send` reachable from the viz's mount-time closure.
  const sendRef = React.useRef(send);
  sendRef.current = send;

  React.useEffect(() => {
    if (figure) return; // SVG figure path — nothing to mount
    const el = ref.current;
    if (!el || !name) return;
    const factory = getViz(name);
    if (!factory) {
      el.innerHTML = `<div style="color:${theme.color.muted};font-family:${theme.font.mono}">[viz not registered: ${name}]</div>`;
      return;
    }
    handle.current = factory(el, { ...(viz?.props ?? {}), t: viz?.t }, { send: (e) => sendRef.current(e) });
    return () => {
      handle.current?.destroy?.();
      handle.current = null;
      el.innerHTML = "";
    };
    // remount only when the viz name changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, !!figure]);

  React.useEffect(() => {
    if (!figure) handle.current?.update?.({ ...(viz?.props ?? {}), t: viz?.t });
  });

  if (!viz) return null;
  if (figure) return <div style={{ width: "100%" }} dangerouslySetInnerHTML={{ __html: figure(viz.props ?? {}, viz.t ?? 0, theme) }} />;
  return <div ref={ref} style={{ width: "100%" }} />;
};
