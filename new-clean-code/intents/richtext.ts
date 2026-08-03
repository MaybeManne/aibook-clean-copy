export type Mark = "strong" | "em" | "code";

export type CalloutVariant = "note" | "warning" | "tip";

export type RichNode =
  | { type: "text"; text: string; marks?: Mark[] }
  | { type: "math"; tex: string; display?: boolean }
  | { type: "paragraph"; children: RichNode[] }
  | { type: "heading"; level: 1 | 2 | 3; children: RichNode[] }
  | { type: "list"; ordered: boolean; items: RichNode[][] }
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

const MATH_MASK = "\u0000";

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

function parseRich(s: string): RichNode[] {
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
 * `article()`. Pure. Where `toPlain` is for asserting on substrings, this is for anything a
 * PERSON (or a model standing in for one) reads: a teacher's terminal, a prompt, a log line.
 *
 *   • math keeps its `$`/`$$` delimiters, so a formula is legibly a formula;
 *   • presentation-only wrappers collapse to their body — see `PRESENTATION_TAGS`.
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
 * Two-argument TeX commands that carry PRESENTATION only, so `\cmd{arg}{body}` reduces to `body`.
 *
 * A lesson may colour-key its symbols, and it does so in one of two shapes depending on whether the
 * hue is fixed or has to follow the theme: `\textcolor{#hex}{v}` bakes it in, `\htmlClass{ls-sym-v}{v}`
 * defers it to CSS. Both are noise to a *reader* — a teacher scanning their terminal, or a model
 * reading an observation — so both flatten away here. Missing one would leak markup into the very
 * text this function exists to make legible.
 */
const PRESENTATION_TAGS = ["\\textcolor{", "\\htmlClass{"] as const;

function uncolor(tex: string): string {
  const close = (s: string, open: number): number => {
    let depth = 0;
    for (let i = open; i < s.length; i++) {
      if (s[i] === "{") depth++;
      else if (s[i] === "}" && --depth === 0) return i + 1;
    }
    return -1;
  };

  /** The earliest presentation tag at or after `from`, if any. */
  const next = (from: number): { at: number; tag: string } | null => {
    let best: { at: number; tag: string } | null = null;
    for (const tag of PRESENTATION_TAGS) {
      const at = tex.indexOf(tag, from);
      if (at >= 0 && (!best || at < best.at)) best = { at, tag };
    }
    return best;
  };

  let out = "";
  let i = 0;
  for (;;) {
    const hit = next(i);
    if (!hit) return out + tex.slice(i);
    const { at, tag } = hit;
    out += tex.slice(i, at);

    const afterArg = close(tex, at + tag.length - 1);
    const bodyEnd = afterArg < 0 || tex[afterArg] !== "{" ? -1 : close(tex, afterArg);
    if (bodyEnd < 0) {
      out += tex.slice(at, at + tag.length);
      i = at + tag.length;
      continue;
    }
    out += uncolor(tex.slice(afterArg + 1, bodyEnd - 1));
    i = bodyEnd;
  }
}

/**
 * Flatten to a plain string (headless tests, alt-text, logging). Pure.
 *
 * A bare string is accepted and returned as itself, which is what makes `{"kind":"label",
 * "text":"one ray"}` a legal scene node. The drawing vocabulary a director is shown says a label's
 * `text` may be "a RichText tree or a string", and the worked example for the `scene` beat uses a
 * string — before this, both were lies that surfaced as `rt.map is not a function` inside the
 * renderer, after the beat had already been installed.
 */
export function toPlain(rt: RichText | string): string {
  if (typeof rt === "string") return rt;
  const walk = (n: RichNode): string => {
    if (n.type === "text") return n.text;
    if (n.type === "math") return n.tex;
    if (n.type === "list") return n.items.map((it) => it.map(walk).join("")).join("\n");
    return n.children.map(walk).join("");
  };
  return rt.map(walk).join("\n");
}
