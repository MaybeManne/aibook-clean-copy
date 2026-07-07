// Portable rich-text node tree (ProseMirror-style). Structured so spans can be
// highlighted/animated and a future video renderer can tween at span level.
// A markdown parser may feed this; the contract is the tree, not the markdown.

export type Mark = "strong" | "em" | "code";

export type RichNode =
  | { type: "text"; text: string; marks?: Mark[] }
  | { type: "paragraph"; children: RichNode[] };

export type RichText = RichNode[];

/** Plain string → one paragraph. The 90% authoring case. */
export function text(s: string): RichText {
  return [{ type: "paragraph", children: [{ type: "text", text: s }] }];
}

/** Flatten to a plain string (headless tests, alt-text, logging). Pure. */
export function toPlain(rt: RichText): string {
  const walk = (n: RichNode): string =>
    n.type === "text" ? n.text : n.children.map(walk).join("");
  return rt.map(walk).join("\n");
}
