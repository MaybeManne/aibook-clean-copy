import React from "react";
import type { RenderIntent } from "@lessonstudio/intents";
import { asVizIntent } from "@lessonstudio/timeline";
import { getFigure } from "@lessonstudio/svg";
import type { ComponentFor } from "./index.js";
import { getViz, type VizHandle } from "../viz.js";

export const VizView: ComponentFor = ({ intent, theme, send }) => {
  const viz = asVizIntent(intent as RenderIntent);
  const ref = React.useRef<HTMLDivElement>(null);
  const handle = React.useRef<VizHandle | null>(null);
  const name = viz?.name;
  const figure = name ? getFigure(name) : undefined;

  const sendRef = React.useRef(send);
  sendRef.current = send;
  // The mount effect must not depend on the theme (see below), so it reads the current one via a ref.
  const themeRef = React.useRef(theme);
  themeRef.current = theme;

  // Mount deps stay `[name, !!figure]` on purpose: a persistent viz survives beat changes, and
  // remounting it on a theme switch would discard the camera pose it owns. Theme changes are
  // delivered by the effect below instead.
  React.useEffect(() => {
    if (figure) return;
    const el = ref.current;
    if (!el || !name) return;
    const factory = getViz(name);
    if (!factory) {
      const t = themeRef.current;
      el.innerHTML = `<div style="color:${t.color.muted};font-family:${t.font.mono}">[viz not registered: ${name}]</div>`;
      return;
    }
    handle.current = factory(el, { ...(viz?.props ?? {}), t: viz?.t }, { send: (e) => sendRef.current(e), theme: themeRef.current });
    return () => {
      handle.current?.destroy?.();
      handle.current = null;
      el.innerHTML = "";
    };
  }, [name, !!figure]);

  React.useEffect(() => {
    if (!figure) handle.current?.setTheme?.(theme);
  }, [theme, figure]);

  React.useEffect(() => {
    if (!figure) handle.current?.update?.({ ...(viz?.props ?? {}), t: viz?.t });
  });

  if (!viz) return null;
  if (figure) return <div style={{ width: "100%" }} dangerouslySetInnerHTML={{ __html: figure(viz.props ?? {}, viz.t ?? 0, theme) }} />;
  return <div ref={ref} style={{ width: "100%" }} />;
};
