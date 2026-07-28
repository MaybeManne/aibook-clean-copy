// The web template: slot layout (where) + component dispatch (how). The same
// RenderModel through a different template lays out/styles differently with zero
// lesson changes. Stateless: all state lives in the host; events go out via send.
import React from "react";
import type { MachineEvent } from "@lessonstudio/state-machine"; // type-only
import { bySlot, type RenderModel } from "@lessonstudio/render-contract";
import { defaultStudioLayout, defaultTheme, type Template } from "@lessonstudio/template";
import { defaultComponents, FallbackComp, type ComponentFor } from "./components/index.js";

export type WebTemplate = Template<ComponentFor>;

export const defaultTemplate: WebTemplate = {
  layout: {
    slots: {
      stage: { gridArea: "stage" },
      prose: { gridArea: "prose" },
      prompt: { gridArea: "prompt" },
    },
    arrangement: `
      "stage"  auto
      "prose"  auto
      "prompt" auto
      / 1fr
    `,
  },
  // The default lesson layout is the split-screen studio (visuals | md+KaTeX). Swapping
  // this out re-lays-out any lesson without touching the lesson spec.
  studio: defaultStudioLayout,
  components: defaultComponents,
  theme: defaultTheme,
};

export interface TemplateViewProps {
  model: RenderModel;
  template?: WebTemplate;
  send: (event: MachineEvent) => void;
}

export function TemplateView({ model, template = defaultTemplate, send }: TemplateViewProps): React.ReactElement {
  const slots = bySlot(model);
  const { theme } = template;
  return (
    <div
      style={{
        display: "grid",
        gridTemplate: template.layout.arrangement,
        gap: theme.space(5),
        padding: theme.space(6),
        background: theme.color.bg,
        minHeight: "100%",
        boxSizing: "border-box",
      }}
    >
      {Object.entries(template.layout.slots).map(([slot, region]) => {
        const intents = slots[slot] ?? [];
        return (
          <div key={slot} style={{ gridArea: region.gridArea, display: "grid", gap: theme.space(3) }}>
            {intents.map((intent, i) => {
              const Comp = template.components[intent.kind] ?? FallbackComp;
              return <Comp key={i} intent={intent} theme={theme} send={send} />;
            })}
          </div>
        );
      })}
    </div>
  );
}
