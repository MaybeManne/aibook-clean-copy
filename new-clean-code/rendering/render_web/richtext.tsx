// Render a portable RichText node tree to React elements. `math` nodes are
// typeset with KaTeX (import "katex/dist/katex.min.css" in the app entry). The
// video renderer would consume the same tree and emit tweenable spans instead.
import React from "react";
import katex from "katex";
import type { Mark, RichNode, RichText } from "@lessonstudio/render-contract";

function withMarks(marks: Mark[] | undefined, content: React.ReactNode): React.ReactNode {
  let node = content;
  for (const m of marks ?? []) {
    if (m === "strong") node = <strong>{node}</strong>;
    else if (m === "em") node = <em>{node}</em>;
    else if (m === "code") node = <code>{node}</code>;
  }
  return node;
}

function MathNode({ tex, display }: { tex: string; display?: boolean }): React.ReactElement {
  const html = React.useMemo(() => {
    try {
      return katex.renderToString(tex, { displayMode: !!display, throwOnError: false });
    } catch {
      return tex;
    }
  }, [tex, display]);
  return <span style={{ display: display ? "block" : "inline" }} dangerouslySetInnerHTML={{ __html: html }} />;
}

const CALLOUT_COLOR: Record<string, string> = { note: "#818cf8", warning: "#f59e0b", tip: "#34d399" };

function renderNode(n: RichNode, key: number): React.ReactNode {
  if (n.type === "text") return <React.Fragment key={key}>{withMarks(n.marks, n.text)}</React.Fragment>;
  if (n.type === "math") return <MathNode key={key} tex={n.tex} display={n.display} />;
  if (n.type === "heading") {
    const size = n.level === 1 ? "1.55em" : n.level === 2 ? "1.25em" : "1.05em";
    return React.createElement(
      `h${n.level}`,
      { key, style: { fontSize: size, fontWeight: n.level === 3 ? 600 : 700, lineHeight: 1.25, margin: key === 0 ? "0 0 .45em" : "1.15em 0 .45em" } },
      n.children.map((c, i) => renderNode(c, i)),
    );
  }
  if (n.type === "list") {
    return React.createElement(
      n.ordered ? "ol" : "ul",
      { key, style: { margin: ".5em 0", paddingLeft: "1.4em", display: "grid", gap: ".3em" } },
      n.items.map((item, i) => <li key={i}>{item.map((c, j) => renderNode(c, j))}</li>),
    );
  }
  if (n.type === "callout") {
    const c = CALLOUT_COLOR[n.variant ?? "note"]!;
    return (
      <div key={key} style={{ borderLeft: `3px solid ${c}`, background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: ".6em .85em", margin: ".7em 0" }}>
        {n.children.map((ch, i) => renderNode(ch, i))}
      </div>
    );
  }
  return (
    <p key={key} style={{ margin: 0 }}>
      {n.children.map((c, i) => renderNode(c, i))}
    </p>
  );
}

export function RichTextView({ value }: { value: RichText }): React.ReactElement {
  return <>{value.map((n, i) => renderNode(n, i))}</>;
}
