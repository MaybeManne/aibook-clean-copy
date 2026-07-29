"""
Minimal QMD → clean text conversion.

Only strips things that are structural noise (not content):
  - YAML frontmatter
  - Quarto div markers (::: and :::{ ... }) — keeps inner content
  - Standalone equation-label lines {#eq-id}
  - Raw LaTeX annotation lines (\\caption{}, \\label{}, \\index{})

Everything else is preserved as-is:
  - Headings H1/H2/H3 with their {#sec-id} attributes
  - Figure markdown with {#fig-id width=...} attributes
  - Cross-references (@fig-xxx, @sec-xxx, @AuthorYear)
  - Math blocks, code blocks, tables
"""
from __future__ import annotations

import re
from pathlib import Path

# YAML frontmatter (optional — not all QMD files have it)
_FRONTMATTER_RE = re.compile(r"\A---\s*\n.*?^---\s*\n", re.DOTALL | re.MULTILINE)

# Div markers: :::{ ... } or ::: alone on a line
_DIV_OPEN_RE  = re.compile(r"^:::\s*[\{\[]")
_DIV_CLOSE_RE = re.compile(r"^:::\s*$")

# Standalone equation-label line: {#eq-foo} or {#eq-foo .unnumbered} alone
_EQ_LABEL_LINE_RE = re.compile(r"^\s*\{#eq-[\w-]+[^}]*\}\s*$")

# Raw LaTeX annotation lines (never carry textbook content)
_LATEX_ANNOT_RE = re.compile(r"^\\(?:caption|label|index)\{")

# Code fence
_FENCE_RE = re.compile(r"^(`{3,}|~{3,})")


def strip_qmd(qmd_path: Path) -> str:
    """
    Return the cleaned text of one QMD file.
    """
    text = qmd_path.read_text(encoding="utf-8")
    text = _FRONTMATTER_RE.sub("", text, count=1)

    # ── Pass 1: join lines where a Quarto attr block spans multiple lines ─────
    # e.g.  ![alt](path){#fig-id
    #        width="60%"}
    # becomes one line so the figure regex can match it cleanly.
    joined: list[str] = []
    pending: str | None = None
    for raw in text.splitlines():
        if pending is not None:
            # Append this line to the pending one; stop when { ... } is closed
            combined = pending + " " + raw.strip()
            if "}" in raw:
                joined.append(combined)
                pending = None
            else:
                pending = combined
            continue
        # Does this line open a { without closing it (and is not a div marker)?
        if re.search(r"\)\{[^}]*$", raw):
            pending = raw
        else:
            joined.append(raw)
    if pending is not None:
        joined.append(pending)

    # ── Pass 2: strip Quarto structural noise ─────────────────────────────────
    out: list[str] = []
    in_code = False

    for line in joined:
        stripped = line.strip()

        # Track code fences
        if _FENCE_RE.match(stripped):
            in_code = not in_code
            out.append(line)
            continue
        if in_code:
            out.append(line)
            continue

        # Drop div markers (keep inner content)
        if _DIV_OPEN_RE.match(line) or _DIV_CLOSE_RE.match(line):
            continue

        # Drop standalone equation-label lines
        if _EQ_LABEL_LINE_RE.match(line):
            continue

        # Drop raw LaTeX annotation lines
        if _LATEX_ANNOT_RE.match(stripped):
            continue

        out.append(line)

    return "\n".join(out)
