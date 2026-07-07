# Calculus knowledge graph — journey view

A timeline visualization of the book as a learning journey.

- **X axis**: `position.book_order` from `data2/` — front-to-back reading order.
- **Y axis**: 4 swimlanes, one per concept kind (definition / theorem / technique / idea).
- **Background bands**: the 4 chapters.
- **Section ticks**: vertical dashes at each section's start, labeled `1.1`, `1.2`, …
- **Arcs above the axis**: semantic edges. The higher the arc, the wider the book-order span. Long arcs = cross-chapter dependencies.
- **Bars below the axis**: per-section density of exercises + worked examples.

## Build + serve

```
python3 build_graph.py       # emits graph.json from ../data2/
python3 -m http.server 8000  # run from site3_journey/
```

Open http://localhost:8000.

`site3_journey/images/` is a symlink to `../data2/images/` so that figures
embedded in the textbook content resolve to locally cached files. If the
symlink breaks, recreate it with:

```
ln -sf ../data2/images site3_journey/images
```

## Controls

- Scroll/pinch to zoom along the timeline. Drag to pan.
- Click a concept — it's pinned, neighbors highlight, sidebar shows details.
- Click an arc — jumps to the concept at the other end of the edge.
- Click a density bar — sidebar shows that section's concepts and items.
- **Only show edges touching selection** — if the arcs are too busy, toggle this.
- Edge-kind and concept-kind filters on the left.
- `#node=<concept_id>` in the URL deep-links.

## What to look for

The most interesting thing about this view is the **long arcs**: when a
late-chapter concept depends on a first-chapter concept. Those arcs are the
book's "callbacks." The builder prints the top-5 at build time.
