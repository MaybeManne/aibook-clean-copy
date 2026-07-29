// Portable rich-text node tree (ProseMirror-style). Structured so spans can be
// highlighted/animated and a future video renderer can tween at span level.
// A markdown parser may feed this; the contract is the tree, not the markdown.

export type Mark = "strong" | "em" | "code";

export type CalloutVariant = "note" | "warning" | "tip";

export type RichNode =
  | { type: "text"; text: string; marks?: Mark[] }
  | { type: "math"; tex: string; display?: boolean } // inline LaTeX (KaTeX)
  | { type: "paragraph"; children: RichNode[] }
  // block-level nodes for authored "article" / explainer content:
  | { type: "heading"; level: 1 | 2 | 3; children: RichNode[] }
  | { type: "list"; ordered: boolean; items: RichNode[][] } // each item = inline nodes
  | { type: "callout"; variant?: CalloutVariant; children: RichNode[] };

export type RichText = RichNode[];

/** Plain string → one paragraph. The 90% authoring case. */
export function text(s: string): RichText {
  return [{ type: "paragraph", children: [{ type: "text", text: s }] }];
}

/** An inline math fragment (one paragraph, one math node). */
export function math(tex: string, display = false): RichText {
  return [{ type: "paragraph", children: [{ type: "math", tex, display }] }];
}

/** Parse `**bold**` / `*em*` runs in a plain string into marked text nodes. */
function parseInline(str: string): RichNode[] {
  const out: RichNode[] = [];
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(str))) {
    if (m.index > last) out.push({ type: "text", text: str.slice(last, m.index) });
    if (m[1] != null) out.push({ type: "text", text: m[1], marks: ["strong"] });
    else out.push({ type: "text", text: m[2]!, marks: ["em"] });
    last = re.lastIndex;
  }
  if (last < str.length) out.push({ type: "text", text: str.slice(last) });
  return out;
}

/** Placeholder for an extracted math span. NUL can't occur in authored prose. */
const MATH_MASK = "\u0000";

/** Put the extracted math spans back, inheriting the marks of the run they sit in. */
function expandMath(node: RichNode, math: RichNode[]): RichNode[] {
  if (node.type !== "text" || !node.text.includes(MATH_MASK)) return [node];
  const out: RichNode[] = [];
  const re = /\u0000(\d+)\u0000/g;
  const keep = (t: string): void => {
    if (t) out.push(node.marks ? { type: "text", text: t, marks: node.marks } : { type: "text", text: t });
  };
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(node.text))) {
    keep(node.text.slice(last, m.index));
    const found = math[Number(m[1])];
    if (found) out.push(found);
    last = re.lastIndex;
  }
  keep(node.text.slice(last));
  return out;
}

/** Inline nodes: `$...$`/`$$...$$` math interleaved with `**bold**`/`*em*` runs. */
function parseRich(s: string): RichNode[] {
  // Math comes out FIRST, because a `$…$` body is LaTeX and not markdown — `*` in it is
  // multiplication, `_` a subscript. But emphasis routinely WRAPS math, as in
  // `**Push the screen out to $v \ge 12$**`, so extraction leaves a placeholder behind and
  // the emphasis pass runs over the whole line. Parsing each side of the math separately
  // (the obvious implementation) leaves the `**` unpaired and prints it to the learner.
  const math: RichNode[] = [];
  const masked = s.replace(/\$\$([^$]+)\$\$|\$([^$]+)\$/g, (_all, display: string | undefined, inline: string | undefined) => {
    math.push({ type: "math", tex: (display ?? inline ?? "").trim(), display: display != null });
    return `${MATH_MASK}${math.length - 1}${MATH_MASK}`;
  });
  return parseInline(masked).flatMap((n) => expandMath(n, math));
}

/**
 * Parse a string with `$...$`/`$$...$$` math and `**bold**`/`*em*` runs into a
 * single paragraph. The 90% inline math+markdown authoring case.
 */
export function md(s: string): RichText {
  return [{ type: "paragraph", children: parseRich(s) }];
}

/**
 * Block-level parser for authored explainer prose (book/blog feel). Line-based:
 *   `# / ## / ###` → heading   `- ` / `1. ` → list   `> ` (opt. `> [tip]`) → callout
 * blank line separates blocks; other runs of lines → a paragraph. Inline `$math$`
 * and `**bold**`/`*em*` work everywhere via parseRich. Returns a full RichText doc.
 */
export function article(src: string): RichText {
  const lines = src.replace(/\r/g, "").split("\n");
  const out: RichNode[] = [];
  const isHeading = (t: string) => /^#{1,3}\s+/.test(t);
  const isCallout = (t: string) => /^>\s?/.test(t);
  const isItem = (t: string) => /^(-|\d+\.)\s+/.test(t);
  let i = 0;
  while (i < lines.length) {
    const t = lines[i]!.trim();
    if (t === "") { i++; continue; }
    const h = /^(#{1,3})\s+(.*)$/.exec(t);
    if (h) {
      out.push({ type: "heading", level: h[1]!.length as 1 | 2 | 3, children: parseRich(h[2]!) });
      i++;
      continue;
    }
    if (isCallout(t)) {
      const buf: string[] = [];
      let variant: CalloutVariant = "note";
      while (i < lines.length && isCallout(lines[i]!.trim())) {
        let c = lines[i]!.trim().replace(/^>\s?/, "");
        const v = /^\[(note|warning|tip)\]\s*/.exec(c);
        if (v) { variant = v[1] as CalloutVariant; c = c.slice(v[0].length); }
        buf.push(c);
        i++;
      }
      out.push({ type: "callout", variant, children: [{ type: "paragraph", children: parseRich(buf.join(" ")) }] });
      continue;
    }
    if (isItem(t)) {
      const ordered = /^\d+\.\s+/.test(t);
      const items: RichNode[][] = [];
      while (i < lines.length && isItem(lines[i]!.trim())) {
        items.push(parseRich(lines[i]!.trim().replace(/^(-|\d+\.)\s+/, "")));
        i++;
      }
      out.push({ type: "list", ordered, items });
      continue;
    }
    // paragraph: gather consecutive plain lines
    const buf: string[] = [];
    while (i < lines.length) {
      const cur = lines[i]!.trim();
      if (cur === "" || isHeading(cur) || isCallout(cur) || isItem(cur)) break;
      buf.push(cur);
      i++;
    }
    out.push({ type: "paragraph", children: parseRich(buf.join(" ")) });
  }
  return out;
}

/**
 * Flatten back toward the MARKDOWN SOURCE a human would have authored — the near-inverse of
 * `article()`. Pure.
 *
 * `toPlain` is for asserting on substrings; this is for anything a PERSON (or a model standing in
 * for one) reads: a teacher's terminal, a prompt, a log line. Two differences, both about being
 * read rather than matched:
 *
 *   • math keeps its `$`/`$$` delimiters, so a formula is legibly a formula.
 *   • presentation-only `\textcolor{…}{body}` collapses to `body`. Colour is applied on the way to
 *     the screen; a reader shown `\textcolor{#f87171}{L_r}` is decoding a hex code to find `L_r`.
 */
export function toSource(rt: RichText): string {
  const walk = (n: RichNode): string => {
    if (n.type === "text") return n.text;
    if (n.type === "math") return n.display ? `$$${uncolor(n.tex)}$$` : `$${uncolor(n.tex)}$`;
    if (n.type === "list") return n.items.map((it) => `- ${it.map(walk).join("")}`).join("\n");
    return n.children.map(walk).join("");
  };
  return rt.map(walk).join("\n");
}

/**
 * `\textcolor{#f87171}{L_r}` → `L_r`, leaving all other TeX alone.
 *
 * Scanned rather than regexed because the body nests: `\textcolor{#c4b5fd}{\mathbf{n}}` defeats any
 * `[^{}]*` pattern, and a greedy one would eat the rest of the formula. Malformed input passes
 * through unchanged — mangling a formula is worse than leaving a hex code in it.
 */
function uncolor(tex: string): string {
  const TAG = "\\textcolor{";
  /** Index just past the `}` closing the group that starts at `open` (a `{`), or -1. */
  const close = (s: string, open: number): number => {
    let depth = 0;
    for (let i = open; i < s.length; i++) {
      if (s[i] === "{") depth++;
      else if (s[i] === "}" && --depth === 0) return i + 1;
    }
    return -1;
  };

  let out = "";
  let i = 0;
  for (;;) {
    const at = tex.indexOf(TAG, i);
    if (at < 0) return out + tex.slice(i);
    out += tex.slice(i, at);

    const afterColor = close(tex, at + TAG.length - 1);
    const bodyEnd = afterColor < 0 || tex[afterColor] !== "{" ? -1 : close(tex, afterColor);
    if (bodyEnd < 0) {
      out += tex.slice(at, at + TAG.length); // unbalanced: emit verbatim and move on
      i = at + TAG.length;
      continue;
    }
    out += uncolor(tex.slice(afterColor + 1, bodyEnd - 1)); // nested colours inside the body
    i = bodyEnd;
  }
}

/** Flatten to a plain string (headless tests, alt-text, logging). Pure. */
export function toPlain(rt: RichText): string {
  const walk = (n: RichNode): string => {
    if (n.type === "text") return n.text;
    if (n.type === "math") return n.tex;
    if (n.type === "list") return n.items.map((it) => it.map(walk).join("")).join("\n");
    return n.children.map(walk).join("");
  };
  return rt.map(walk).join("\n");
}
