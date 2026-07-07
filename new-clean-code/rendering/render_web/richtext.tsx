// Render a portable RichText node tree to React elements. The video renderer
// would consume the same tree and emit tweenable spans instead.
import React from "react";
import type { Mark, RichNode, RichText } from "@lessonkit/render-contract";

function withMarks(marks: Mark[] | undefined, content: React.ReactNode): React.ReactNode {
  let node = content;
  for (const m of marks ?? []) {
    if (m === "strong") node = <strong>{node}</strong>;
    else if (m === "em") node = <em>{node}</em>;
    else if (m === "code") node = <code>{node}</code>;
  }
  return node;
}

function renderNode(n: RichNode, key: number): React.ReactNode {
  if (n.type === "text") return <React.Fragment key={key}>{withMarks(n.marks, n.text)}</React.Fragment>;
  return (
    <p key={key} style={{ margin: 0 }}>
      {n.children.map((c, i) => renderNode(c, i))}
    </p>
  );
}

export function RichTextView({ value }: { value: RichText }): React.ReactElement {
  return <>{value.map((n, i) => renderNode(n, i))}</>;
}
