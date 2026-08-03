import React from "react";
import katex from "katex";
import type { Mark, RichNode, RichText } from "@lessonstudio/intents";
import { defaultTheme, type Theme } from "@lessonstudio/theme";

function withMarks(marks: Mark[] | undefined, content: React.ReactNode): React.ReactNode {
  let node = content;
  for (const m of marks ?? []) {
    if (m === "strong") node = <strong>{node}</strong>;
    else if (m === "em") node = <em>{node}</em>;
    else if (m === "code") node = <code>{node}</code>;
  }
  return node;
}

/**
 * KaTeX's `trust` gate, opened for exactly ONE thing.
 *
 * A lesson may colour-key its symbols, and that colour has to survive a dark/light switch — so the
 * authored TeX carries `\htmlClass{ls-sym-v}{v}` and the theme supplies the hue as a CSS rule
 * (`StudioView`'s `symbolColors`). `\htmlClass` is a trusted command, so it needs this predicate.
 *
 * It must stay this narrow. `forge/` lets a *model* author beat text, and that text reaches this same
 * renderer — blanket `trust: true` would hand it `\href{javascript:…}`, `\htmlStyle{position:fixed…}`
 * and `\includegraphics`. One command, one class shape, nothing else.
 */
const SYMBOL_CLASS = /^ls-sym-[A-Za-z][A-Za-z0-9_-]*$/;
export function trustSymbolClassOnly(ctx: { command: string; class?: string }): boolean {
  return ctx.command === "\\htmlClass" && SYMBOL_CLASS.test(ctx.class ?? "");
}

function MathNode({ tex, display }: { tex: string; display?: boolean }): React.ReactElement {
  const html = React.useMemo(() => {
    try {
      return katex.renderToString(tex, { displayMode: !!display, throwOnError: false, trust: trustSymbolClassOnly });
    } catch {
      return tex;
    }
  }, [tex, display]);
  return <span style={{ display: display ? "block" : "inline" }} dangerouslySetInnerHTML={{ __html: html }} />;
}

function renderNode(n: RichNode, key: number, theme: Theme): React.ReactNode {
  if (n.type === "text") return <React.Fragment key={key}>{withMarks(n.marks, n.text)}</React.Fragment>;
  if (n.type === "math") return <MathNode key={key} tex={n.tex} display={n.display} />;
  if (n.type === "heading") {
    const size = n.level === 1 ? "1.55em" : n.level === 2 ? "1.25em" : "1.05em";
    return React.createElement(
      `h${n.level}`,
      { key, style: { fontSize: size, fontWeight: n.level === 3 ? 600 : 700, lineHeight: 1.25, margin: key === 0 ? "0 0 .45em" : "1.15em 0 .45em" } },
      n.children.map((c, i) => renderNode(c, i, theme)),
    );
  }
  if (n.type === "list") {
    return React.createElement(
      n.ordered ? "ol" : "ul",
      { key, style: { margin: ".5em 0", paddingLeft: "1.4em", display: "grid", gap: ".3em" } },
      n.items.map((item, i) => <li key={i}>{item.map((c, j) => renderNode(c, j, theme))}</li>),
    );
  }
  if (n.type === "callout") {
    const variant = (n.variant ?? "note") as keyof Theme["color"]["callout"];
    const accent = theme.color.callout[variant] ?? theme.color.callout.note;
    return (
      <div key={key} style={{ borderLeft: `3px solid ${accent}`, background: theme.color.calloutBg, borderRadius: theme.radius, padding: ".6em .85em", margin: ".7em 0" }}>
        {n.children.map((ch, i) => renderNode(ch, i, theme))}
      </div>
    );
  }
  return (
    <p key={key} style={{ margin: 0 }}>
      {n.children.map((c, i) => renderNode(c, i, theme))}
    </p>
  );
}

/** `RichText` → React, with KaTeX for `$math$`. The theme supplies callout colours and radii. */
export function RichTextView({ value, theme = defaultTheme }: { value: RichText; theme?: Theme }): React.ReactElement {
  return <>{value.map((n, i) => renderNode(n, i, theme))}</>;
}
