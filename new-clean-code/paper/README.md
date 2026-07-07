# Paper — LUDUS (CHI submission draft)

ACM `sigconf` draft of the project paper: a game-inspired state-machine
substrate for authoring and agentically generating interactive, adaptive
educational experiences (interactive video + knowledge-graph reading).

## Files
- `main.tex` — the paper (ACM `sigconf`, `review,anonymous`).
- `refs.bib` — bibliography. **Entries marked `% TODO verify` are placeholders**
  with plausible-but-unverified metadata; confirm before submission.
- `figures/*.tex` — TikZ figures, each `\input`-ed by `main.tex`. Every figure
  file begins with an **ASCII preview** in comments so you can read it without
  compiling.

## Conventions in the draft
- `\PH{...}` marks placeholders (red bold in the PDF) — unrun numbers, TODO
  content, collaborator sections. Search for `\PH` to find everything to fill.
- `\sys` is the project name macro, currently `\textsc{Ludus}` (Latin for both
  "game" and "school"). **Placeholder — rename in one place if you pick another.**

## Build

Needs a TeX distribution with the ACM `acmart` class (TeX Live `texlive-publishers`).

```bash
# preferred
latexmk -pdf main.tex
# or manually
pdflatex main && bibtex main && pdflatex main && pdflatex main
```

If `acmart.cls` is missing: `tlmgr install acmart` (or install
`texlive-publishers` via the system package manager).

## Figures (what each shows)
1. `fig-architecture` — the layered substrate + two instantiations + agentic authoring.
2. `fig-player-loop` — learner-as-player: actions/signals → routing → render, all recorded.
3. `fig-agentic-decomposition` — planner → one agent per beat (bounded context) → validate → compile.
4. `fig-video-model` — discrete SM + continuous per-beat timeline + one clock + pure `sampleAt` → playback & export.
5. `fig-kg-environment` — book → knowledge graph → environment; reader = player.

## Status / TODO
- Fill `\PH{}` placeholders after the technical eval and user studies.
- Verify/expand `refs.bib` (especially the `% TODO verify` entries).
- Expand the knowledge-graph reader section with the collaborator's details.
- Decide the final project name (replace `\sys` definition).
