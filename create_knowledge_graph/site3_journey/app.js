// Timeline ("journey") view — one continuous left-to-right scroll of the book.
// Each section is a vertical column; each chapter is a band grouping its sections.
// Concepts inside a section stack top-to-bottom in concept_order_in_section,
// with the title text to the right of each dot.

const ALL_KINDS = ["definition", "theorem", "technique", "idea"];
const KIND_COLOR = {
  definition: "#4f8cff",
  theorem:    "#d38bf0",
  technique:  "#7ee787",
  idea:       "#ffb347",
};

const EDGE_COLORS = {
  requires:         "#f0883e",
  formalizes:       "#d38bf0",
  special_case_of:  "#a371f7",
  generalizes:      "#bc8cff",
  used_to_prove:    "#ff7b72",
  illustrates:      "#7ee787",
  see_also:         "#6e7681",
  contrast_with:    "#ffa657",
  teaches_after:    "#58a6ff",
};
const DIRECTED_EDGES = new Set([
  "requires", "formalizes", "special_case_of", "generalizes",
  "used_to_prove", "illustrates", "teaches_after",
]);

const activeEdgeKinds = new Set(Object.keys(EDGE_COLORS));
const activeConceptKinds = new Set(ALL_KINDS);

let DATA = null;
let CONCEPTS_BY_ID = new Map();
let EDGES_BY_NODE = new Map();
let ITEMS_BY_SECTION = new Map();
let ITEMS_BY_CONCEPT = new Map();

let selectedId = null;
let onlySelectedEdges = false;

// ---------- boot ----------
d3.json("graph.json").then(g => {
  DATA = g;
  for (const c of g.concepts) CONCEPTS_BY_ID.set(c.id, c);
  for (const e of g.edges) {
    if (!EDGES_BY_NODE.has(e.from)) EDGES_BY_NODE.set(e.from, []);
    if (!EDGES_BY_NODE.has(e.to)) EDGES_BY_NODE.set(e.to, []);
    EDGES_BY_NODE.get(e.from).push({ id: e.to, kind: e.kind, dir: "out", rationale: e.rationale });
    EDGES_BY_NODE.get(e.to).push({ id: e.from, kind: e.kind, dir: "in", rationale: e.rationale });
  }
  for (const it of g.items) {
    if (it.section) {
      if (!ITEMS_BY_SECTION.has(it.section)) ITEMS_BY_SECTION.set(it.section, []);
      ITEMS_BY_SECTION.get(it.section).push(it);
    }
    if (it.parent_concept) {
      if (!ITEMS_BY_CONCEPT.has(it.parent_concept)) ITEMS_BY_CONCEPT.set(it.parent_concept, []);
      ITEMS_BY_CONCEPT.get(it.parent_concept).push(it);
    }
  }

  document.getElementById("stats").textContent =
    `${g.concepts.length} concepts · ${g.items.length} items · ${g.edges.length} edges`;

  buildEdgeFilters();
  buildKindFilters();
  render();

  window.addEventListener("resize", debounce(render, 120));
  document.getElementById("search").addEventListener("input", onSearch);
  document.getElementById("show-only-selected-edges").addEventListener("change", (e) => {
    onlySelectedEdges = e.target.checked;
    drawEdges();
  });
  document.getElementById("detail-close").addEventListener("click", clearSelection);

  const deep = parseHash();
  if (deep && CONCEPTS_BY_ID.has(deep)) focusConcept(deep);
});

function parseHash() {
  const m = /#node=([^&]+)/.exec(location.hash);
  return m ? decodeURIComponent(m[1]) : null;
}
function debounce(fn, ms) {
  let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

// ---------- filter panels ----------
function buildEdgeFilters() {
  const counts = {};
  for (const e of DATA.edges) counts[e.kind] = (counts[e.kind] || 0) + 1;
  const root = document.getElementById("edge-filters");
  root.innerHTML = "";
  for (const k of Object.keys(EDGE_COLORS)) {
    const label = document.createElement("label");
    label.innerHTML =
      `<input type="checkbox" checked data-edge="${k}">` +
      `<span class="swatch" style="background:${EDGE_COLORS[k]}"></span>` +
      `<span>${k}</span>` +
      `<span class="count">${counts[k] || 0}</span>`;
    root.appendChild(label);
  }
  root.addEventListener("change", (e) => {
    if (!e.target.dataset.edge) return;
    if (e.target.checked) activeEdgeKinds.add(e.target.dataset.edge);
    else activeEdgeKinds.delete(e.target.dataset.edge);
    drawEdges();
  });
}
function buildKindFilters() {
  const counts = {};
  for (const c of DATA.concepts) counts[c.kind] = (counts[c.kind] || 0) + 1;
  const root = document.getElementById("kind-filters");
  root.innerHTML = "";
  for (const k of ALL_KINDS) {
    const label = document.createElement("label");
    label.innerHTML =
      `<input type="checkbox" checked data-kind="${k}">` +
      `<span class="swatch" style="background:${KIND_COLOR[k]}"></span>` +
      `<span>${k}</span>` +
      `<span class="count">${counts[k] || 0}</span>`;
    root.appendChild(label);
  }
  root.addEventListener("change", (e) => {
    if (!e.target.dataset.kind) return;
    if (e.target.checked) activeConceptKinds.add(e.target.dataset.kind);
    else activeConceptKinds.delete(e.target.dataset.kind);
    render();  // need full re-layout since section heights depend on kind set
  });
}

function titleCase(s) {
  return s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

// ---------- layout constants ----------
const SECTION_WIDTH = 280;      // each section = one vertical column of this width
const CHAPTER_GAP = 42;
const CHAPTER_BANNER_H = 48;
const CONTENT_PAD_X = 40;
const GRID_PAD_Y = 24;
const SECTION_HEADER_H = 52;
const CONCEPT_RADIUS = 7;
const NODE_COLLIDE = 34;        // min distance between node centers (force sim)
const SECTION_INSET_X = 16;     // padding inside section (left/right) for clamping
const SECTION_MIN_HEIGHT = 340;
const SECTION_HEIGHT_PER_NODE = 26;  // budget per concept for sizing section height

const RC = {};

function render() {
  const scrollEl = document.getElementById("timeline-scroll");
  const viewportH = scrollEl.clientHeight;
  const svg = d3.select("#timeline");
  svg.selectAll("*").remove();

  // All sections, already sorted by book_order, partitioned by chapter.
  const sections = [...DATA.sections];
  sections.sort((a, b) => a.book_order - b.book_order);

  // Group concepts per section, filtered by active kinds, sorted by order.
  const bySection = new Map();
  for (const s of sections) bySection.set(s.id, []);
  for (const c of DATA.concepts) {
    if (!activeConceptKinds.has(c.kind)) continue;
    if (!bySection.has(c.section)) continue;
    bySection.get(c.section).push(c);
  }
  for (const bucket of bySection.values()) {
    bucket.sort((a, b) => (a.concept_order_in_section || 0) - (b.concept_order_in_section || 0));
  }

  // X: place each section at a cursor; insert a CHAPTER_GAP whenever the
  // chapter number changes relative to the previous section.
  const slotLeft = new Map();
  let cursor = CONTENT_PAD_X;
  let prevCh = null;
  const chapterSpans = [];  // [{num, title, x0, x1}]
  let currentChapter = null;
  for (const s of sections) {
    if (prevCh !== null && s.chapter !== prevCh) {
      cursor += CHAPTER_GAP;  // gap between chapters
    }
    if (s.chapter !== prevCh) {
      if (currentChapter) {
        currentChapter.x1 = slotLeft.get(prevSectionId) + SECTION_WIDTH;
        chapterSpans.push(currentChapter);
      }
      currentChapter = {
        num: s.chapter,
        title: s.chapter_title,
        x0: cursor,
        x1: cursor + SECTION_WIDTH,  // patched later
      };
    }
    slotLeft.set(s.id, cursor);
    cursor += SECTION_WIDTH;
    prevCh = s.chapter;
    var prevSectionId = s.id;
  }
  if (currentChapter) {
    currentChapter.x1 = slotLeft.get(prevSectionId) + SECTION_WIDTH;
    chapterSpans.push(currentChapter);
  }
  const innerW = cursor + CONTENT_PAD_X;

  // Y: size the grid so even the densest section has room. With a force
  // simulation we need roughly SECTION_HEIGHT_PER_NODE × n of vertical space
  // per section, clamped to a minimum so sparse sections still look nice.
  const maxConcepts = Math.max(1, ...sections.map(s => (bySection.get(s.id) || []).length));
  const gridTop = CHAPTER_BANNER_H + SECTION_HEADER_H + GRID_PAD_Y;
  const naturalGridH = Math.max(SECTION_MIN_HEIGHT, maxConcepts * SECTION_HEIGHT_PER_NODE);
  const availGrid = viewportH - gridTop - 40;
  const gridH = Math.max(naturalGridH, availGrid);
  const gridBottom = gridTop + gridH;
  const svgH = gridBottom + 40;
  svg.attr("width", innerW).attr("height", svgH);

  // --- chapter background bands (alternating fills so they read as blocks)
  const chG = svg.append("g").attr("class", "chapter-bands");
  chapterSpans.forEach((ch) => {
    chG.append("rect")
      .attr("class", "chapter-band")
      .attr("x", ch.x0 - CHAPTER_GAP / 2)
      .attr("y", 0)
      .attr("width", (ch.x1 - ch.x0) + CHAPTER_GAP)
      .attr("height", svgH)
      .attr("fill", `var(--chapter-${ch.num})`)
      .attr("opacity", 0.05);
    // Chapter banner label at the top.
    chG.append("text")
      .attr("class", "chapter-banner")
      .attr("x", (ch.x0 + ch.x1) / 2)
      .attr("y", CHAPTER_BANNER_H / 2 + 5)
      .attr("text-anchor", "middle")
      .attr("fill", `var(--chapter-${ch.num})`)
      .text(`Chapter ${ch.num} · ${titleCase(ch.title)}`);
    // Chapter separator line between chapters.
    chG.append("line")
      .attr("class", "chapter-divider")
      .attr("x1", ch.x0 - CHAPTER_GAP / 2).attr("x2", ch.x0 - CHAPTER_GAP / 2)
      .attr("y1", 0).attr("y2", svgH);
  });

  // --- section headers + column backgrounds
  const secG = svg.append("g").attr("class", "section-group");
  sections.forEach((s, i) => {
    const left = slotLeft.get(s.id);
    secG.append("rect")
      .attr("class", "section-bg")
      .attr("x", left)
      .attr("y", CHAPTER_BANNER_H)
      .attr("width", SECTION_WIDTH)
      .attr("height", svgH - CHAPTER_BANNER_H)
      .attr("fill", i % 2 === 0 ? "rgba(255,255,255,0.015)" : "rgba(255,255,255,0.035)");
    // Section header — can wrap to 2 lines via foreignObject.
    secG.append("foreignObject")
      .attr("x", left + 8)
      .attr("y", CHAPTER_BANNER_H + 4)
      .attr("width", SECTION_WIDTH - 16)
      .attr("height", SECTION_HEADER_H - 4)
      .attr("overflow", "hidden")
      .append("xhtml:div")
      .attr("class", "section-header-box")
      .html(
        `<div class="section-id">${escapeHtml(s.id)}</div>` +
        `<div class="section-title">${escapeHtml(titleCase(s.title))}</div>`
      );
  });

  // --- concept positions via force simulation, one per section
  // Each concept is constrained to its section's bounding box, repelled from
  // siblings, and softly pulled toward center. In-section prereq/overlay
  // edges become springs so related concepts cluster together.
  const xOf = new Map();
  const yOf = new Map();
  const yInSectionTop = gridTop + GRID_PAD_Y;
  const yInSectionBot = gridBottom - GRID_PAD_Y;
  const sectionHeight = yInSectionBot - yInSectionTop;

  for (const s of sections) {
    const bucket = bySection.get(s.id);
    if (!bucket.length) continue;
    const left = slotLeft.get(s.id);
    const sectionCenterX = left + SECTION_WIDTH / 2;
    const xMin = left + SECTION_INSET_X + CONCEPT_RADIUS;
    const xMax = left + SECTION_WIDTH - SECTION_INSET_X - CONCEPT_RADIUS;

    // Seed each node in reading order (left column first, top to bottom),
    // so even if the sim doesn't run long, order is preserved roughly.
    const simNodes = bucket.map((c, i) => {
      const t = bucket.length === 1 ? 0.5 : i / (bucket.length - 1);
      return {
        id: c.id,
        x: sectionCenterX + (i % 2 === 0 ? -20 : 20),
        y: yInSectionTop + t * sectionHeight,
      };
    });
    const idToNode = new Map(simNodes.map(n => [n.id, n]));

    // Intra-section edges become links (gentle pull).
    const intra = DATA.edges
      .filter(e => idToNode.has(e.from) && idToNode.has(e.to))
      .map(e => ({ source: e.from, target: e.to, kind: e.kind }));

    const sim = d3.forceSimulation(simNodes)
      .force("collide", d3.forceCollide(NODE_COLLIDE))
      .force("x", d3.forceX(sectionCenterX).strength(0.08))
      .force("y", d3.forceY((_, i) => {
        // Bias y by reading order so top-of-section stays near the top.
        const t = simNodes.length === 1 ? 0.5 : i / (simNodes.length - 1);
        return yInSectionTop + t * sectionHeight;
      }).strength(0.25))
      .force("charge", d3.forceManyBody().strength(-45).distanceMax(140))
      .force("link", d3.forceLink(intra).id(d => d.id).strength(0.15).distance(55))
      .stop();

    // Run enough ticks to settle. 200 is plenty for small graphs (<30 nodes).
    for (let i = 0; i < 200; i++) sim.tick();

    // Clamp each node inside its section's bounding box.
    for (const n of simNodes) {
      n.x = Math.max(xMin, Math.min(xMax, n.x));
      n.y = Math.max(yInSectionTop, Math.min(yInSectionBot, n.y));
      xOf.set(n.id, n.x);
      yOf.set(n.id, n.y);
    }
  }

  // --- layers (order matters: bg, edges under nodes, nodes above)
  svg.append("g").attr("class", "edges");
  svg.append("g").attr("class", "concepts");

  RC.innerW = innerW; RC.svgH = svgH;
  RC.gridTop = gridTop; RC.gridBottom = gridBottom;
  RC.xOf = xOf; RC.yOf = yOf;
  RC.slotLeft = slotLeft;
  RC.sections = sections;

  drawConcepts();
  drawEdges();
  if (selectedId) applySelectionStyle();
}

// ---------- concept nodes ----------
function drawConcepts() {
  const layer = d3.select("#timeline .concepts");
  if (!layer.node()) return;
  layer.selectAll("*").remove();

  const visible = DATA.concepts.filter(c =>
    activeConceptKinds.has(c.kind) && RC.xOf.has(c.id));

  const nodeG = layer.selectAll("g.node")
    .data(visible, d => d.id)
    .join("g")
    .attr("class", "node")
    .attr("transform", d => `translate(${RC.xOf.get(d.id)},${RC.yOf.get(d.id)})`);

  nodeG.append("circle")
    .attr("class", "concept-node")
    .attr("r", CONCEPT_RADIUS)
    .attr("fill", d => KIND_COLOR[d.kind] || "#888")
    .on("mouseenter", (ev, d) => showTooltip(ev, tooltipHtmlConcept(d)))
    .on("mouseleave", hideTooltip)
    .on("click", (ev, d) => { ev.stopPropagation(); focusConcept(d.id); });

  // Label below the dot, centered. foreignObject gives us clean word-wrap.
  const labelW = 110;
  const labelH = 24;
  nodeG.append("foreignObject")
    .attr("class", "concept-label-fo")
    .attr("x", -labelW / 2)
    .attr("y", CONCEPT_RADIUS + 3)
    .attr("width", labelW)
    .attr("height", labelH)
    .append("xhtml:div")
    .attr("class", "concept-label")
    .text(d => d.title);
}

// ---------- edge arcs ----------
function drawEdges() {
  const layer = d3.select("#timeline .edges");
  if (!layer.node()) return;
  layer.selectAll("*").remove();

  const allowed = (e) => activeEdgeKinds.has(e.kind);
  const hasPos = (id) => RC.xOf.has(id);

  let edges = DATA.edges.filter(e => allowed(e) && hasPos(e.from) && hasPos(e.to));
  if (onlySelectedEdges && selectedId) {
    edges = edges.filter(e => e.from === selectedId || e.to === selectedId);
  }

  for (const e of edges) {
    const x1 = RC.xOf.get(e.from), y1 = RC.yOf.get(e.from);
    const x2 = RC.xOf.get(e.to),   y2 = RC.yOf.get(e.to);

    // Cubic Bezier arching to the right (into the empty space between columns).
    // Horizontal tangents at the start/end make the arc leave nodes cleanly.
    // Bulge distance scales with horizontal span, clamped.
    const dx = Math.abs(x2 - x1);
    const bulge = Math.min(200, 40 + dx * 0.25);
    const c1x = x1 + bulge * (x2 >= x1 ? 1 : -1);
    const c2x = x2 + bulge * (x2 >= x1 ? -1 : 1);
    const path = `M${x1},${y1} C${c1x},${y1} ${c2x},${y2} ${x2},${y2}`;

    const isStrong = e.kind === "requires" || e.kind === "formalizes" || e.kind === "used_to_prove";
    const isRelevant = selectedId && (e.from === selectedId || e.to === selectedId);
    const baseOpacity = isStrong ? 0.45 : 0.22;
    const opacity = selectedId ? (isRelevant ? 0.92 : 0.03) : baseOpacity;
    const strokeW = isStrong ? 1.4 : 0.8;

    layer.append("path")
      .attr("class", "edge-arc")
      .attr("d", path)
      .attr("stroke", EDGE_COLORS[e.kind] || "#888")
      .attr("stroke-width", strokeW)
      .attr("opacity", opacity)
      .attr("fill", "none")
      .on("mouseenter", (ev) => showTooltip(ev, tooltipHtmlEdge(e)))
      .on("mouseleave", hideTooltip)
      .on("click", (ev) => {
        ev.stopPropagation();
        focusConcept(e.from === selectedId ? e.to : e.from);
      });

    if (DIRECTED_EDGES.has(e.kind)) {
      // Arrowhead at the target, pointing along the tangent (approx from c2).
      const tanX = x2 - c2x;
      const tanY = y2 - y2;  // tangent horizontal at end because of flat C2 y
      // If c2 is to the left of x2 (normal), arrow points right into the node.
      const dirX = Math.sign(tanX) || 1;
      const size = 4;
      layer.append("path")
        .attr("d",
          `M${x2 - dirX * (CONCEPT_RADIUS + 1)},${y2} ` +
          `L${x2 - dirX * (CONCEPT_RADIUS + 1 + size * 1.8)},${y2 - size} ` +
          `L${x2 - dirX * (CONCEPT_RADIUS + 1 + size * 1.8)},${y2 + size} Z`)
        .attr("fill", EDGE_COLORS[e.kind] || "#888")
        .attr("opacity", opacity);
    }
  }
}

// ---------- selection ----------
function focusConcept(id) {
  const c = CONCEPTS_BY_ID.get(id);
  if (!c) return;
  selectedId = id;
  applySelectionStyle();
  renderDetail(c);
  history.replaceState(null, "", `#node=${encodeURIComponent(id)}`);
  scrollIntoView(c);
}

function focusSection(sid) {
  const sec = DATA.sections.find(s => s.id === sid);
  if (!sec) return;
  selectedId = null;
  applySelectionStyle();
  showSectionDetail(sec);
}

function clearSelection() {
  selectedId = null;
  applySelectionStyle();
  document.getElementById("detail-body").hidden = true;
  document.getElementById("detail-empty").hidden = false;
  history.replaceState(null, "", location.pathname + location.search);
}

function applySelectionStyle() {
  const neighborIds = new Set();
  if (selectedId) {
    neighborIds.add(selectedId);
    for (const nb of (EDGES_BY_NODE.get(selectedId) || [])) neighborIds.add(nb.id);
  }
  d3.selectAll(".concept-node")
    .classed("selected", d => d && d.id === selectedId)
    .classed("dimmed", d => selectedId && !neighborIds.has(d.id));
  d3.selectAll("g.node").each(function(d) {
    if (!d) return;
    const dimmed = selectedId && !neighborIds.has(d.id);
    d3.select(this).select(".concept-label").classed("dimmed", dimmed);
  });
  drawEdges();
}

function scrollIntoView(c) {
  const x = RC.xOf.get(c.id);
  const y = RC.yOf.get(c.id);
  if (x == null) return;
  const scrollEl = document.getElementById("timeline-scroll");
  const targetX = x - scrollEl.clientWidth / 2;
  const targetY = Math.max(0, y - scrollEl.clientHeight / 2);
  scrollEl.scrollTo({ left: targetX, top: targetY, behavior: "smooth" });
}

// ---------- detail panel ----------
function renderDetail(c) {
  document.getElementById("detail-empty").hidden = true;
  const body = document.getElementById("detail-body");
  body.hidden = false;

  document.getElementById("detail-kind").textContent = c.kind;
  document.getElementById("detail-title").textContent = c.title;
  document.getElementById("detail-locator").textContent =
    `Ch ${c.chapter} · ${c.section} ${titleCase(c.section_title)} · book order #${c.book_order}`;

  const oneliner = document.getElementById("detail-oneliner");
  if (c.one_liner) {
    oneliner.innerHTML = mdWithMath(c.one_liner);
    oneliner.hidden = false;
  } else {
    oneliner.hidden = true;
    oneliner.textContent = "";
  }

  const secs = document.getElementById("detail-sections");
  secs.innerHTML = "";
  const sections = [];
  if (c.summary_md) sections.push(["Summary", c.summary_md]);
  if (c.motivation_md) sections.push(["Motivation", c.motivation_md]);
  if (c.recap_md) sections.push(["Recap", c.recap_md]);
  if ((c.aliases || []).length) sections.push(["Aliases", c.aliases.join(", ")]);
  if ((c.tags || []).length) sections.push(["Tags", c.tags.join(", ")]);
  for (const [head, md] of sections) {
    const div = document.createElement("div");
    div.className = "sec";
    div.innerHTML = `<div class="sec-head">${head}</div><div class="sec-body">${mdWithMath(md)}</div>`;
    secs.appendChild(div);
  }
  if (c.raw_body) secs.appendChild(makeRawBodyBlock(c.raw_body));

  const links = document.getElementById("detail-links");
  links.innerHTML = "";
  const neighbors = EDGES_BY_NODE.get(c.id) || [];
  const LABEL = {
    requires:        { out: "requires",            in: "required by" },
    formalizes:      { out: "formalizes",          in: "formalized by" },
    special_case_of: { out: "special case of",     in: "generalized to" },
    generalizes:     { out: "generalizes",         in: "specialized from" },
    used_to_prove:   { out: "used to prove",       in: "proved using" },
    illustrates:     { out: "illustrates",         in: "illustrated by" },
    see_also:        { out: "see also",            in: "see also" },
    contrast_with:   { out: "contrast with",       in: "contrast with" },
    teaches_after:   { out: "teaches after",       in: "taught before" },
  };
  const ORDER = Object.keys(LABEL);
  neighbors.sort((a, b) => {
    const oa = ORDER.indexOf(a.kind), ob = ORDER.indexOf(b.kind);
    if (oa !== ob) return oa - ob;
    return a.dir === "out" ? -1 : 1;
  });
  let lastGroup = "";
  if (!neighbors.length) links.innerHTML = `<span style="color:var(--muted);font-size:12px">none</span>`;
  for (const nb of neighbors) {
    const target = CONCEPTS_BY_ID.get(nb.id);
    if (!target) continue;
    const relText = LABEL[nb.kind]?.[nb.dir] || nb.kind;
    const key = `${nb.kind}:${nb.dir}`;
    if (key !== lastGroup) {
      const head = document.createElement("div");
      head.className = "chip-group-head";
      head.textContent = relText;
      links.appendChild(head);
      lastGroup = key;
    }
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.title = nb.rationale || relText;
    chip.innerHTML =
      `<span class="dot" style="background:${KIND_COLOR[target.kind] || "#888"}"></span>` +
      `<span>${escapeHtml(target.title)}</span>`;
    chip.addEventListener("click", () => focusConcept(nb.id));
    links.appendChild(chip);
  }

  const itemsDiv = document.getElementById("detail-items");
  document.getElementById("detail-items-heading").textContent = "Items using this concept";
  itemsDiv.innerHTML = "";
  const items = ITEMS_BY_CONCEPT.get(c.id) || [];
  if (!items.length) {
    itemsDiv.innerHTML = `<span style="color:var(--muted);font-size:12px">no items</span>`;
  } else {
    const order = ["example", "theorem", "exercise", "exercise_group", "figure", "table"];
    items.sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind)
                      || (a.difficulty || 0) - (b.difficulty || 0));
    for (const it of items.slice(0, 40)) {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.title = it.prompt_md || it.caption_md || "";
      chip.innerHTML = `<span>${escapeHtml(it.title)} <span style="color:var(--muted)">· ${it.kind}</span></span>`;
      chip.addEventListener("click", () => showItemDetail(it));
      itemsDiv.appendChild(chip);
    }
    if (items.length > 40) {
      const more = document.createElement("div");
      more.style.cssText = "color:var(--muted);font-size:11px;margin-top:6px";
      more.textContent = `…and ${items.length - 40} more`;
      itemsDiv.appendChild(more);
    }
  }

  renderMathInElement(body, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
      { left: "\\[", right: "\\]", display: true },
      { left: "\\(", right: "\\)", display: false },
    ],
    throwOnError: false,
  });
}

function showSectionDetail(sec) {
  document.getElementById("detail-empty").hidden = true;
  const body = document.getElementById("detail-body");
  body.hidden = false;

  document.getElementById("detail-kind").textContent = "section";
  document.getElementById("detail-title").textContent = `${sec.id}: ${titleCase(sec.title)}`;
  document.getElementById("detail-locator").textContent =
    `Ch ${sec.chapter} · ${titleCase(sec.chapter_title)} · book order #${sec.book_order}`;

  document.getElementById("detail-oneliner").hidden = true;
  document.getElementById("detail-sections").innerHTML =
    `<div class="sec"><div class="sec-head">Stats</div><div class="sec-body">` +
    `${sec.concept_ids.length} concepts · ${sec.item_count} exercises/examples</div></div>`;

  const links = document.getElementById("detail-links");
  links.innerHTML = `<div class="chip-group-head">concepts</div>`;
  for (const cid of sec.concept_ids) {
    const c = CONCEPTS_BY_ID.get(cid);
    if (!c) continue;
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.innerHTML = `<span class="dot" style="background:${KIND_COLOR[c.kind]}"></span><span>${escapeHtml(c.title)}</span>`;
    chip.addEventListener("click", () => focusConcept(cid));
    links.appendChild(chip);
  }

  const itemsDiv = document.getElementById("detail-items");
  document.getElementById("detail-items-heading").textContent = "Items in this section";
  itemsDiv.innerHTML = "";
  const items = (ITEMS_BY_SECTION.get(sec.id) || [])
    .filter(it => it.kind !== "exercise_group" && !it.embedded_in)
    .slice(0, 60);
  for (const it of items) {
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.title = it.prompt_md || "";
    chip.innerHTML = `<span>${escapeHtml(it.title)} <span style="color:var(--muted)">· ${it.kind}</span></span>`;
    chip.addEventListener("click", () => showItemDetail(it));
    itemsDiv.appendChild(chip);
  }
}

function showItemDetail(it) {
  document.getElementById("detail-empty").hidden = true;
  const body = document.getElementById("detail-body");
  body.hidden = false;

  document.getElementById("detail-kind").textContent = it.kind;
  document.getElementById("detail-title").textContent = it.title;
  document.getElementById("detail-locator").textContent =
    `${it.section || ""}${it.difficulty != null ? ` · difficulty ${it.difficulty}/5` : ""}`;

  document.getElementById("detail-oneliner").hidden = true;
  const secs = document.getElementById("detail-sections");
  secs.innerHTML = "";
  const bits = [];
  if (it.caption_md) bits.push(["Caption", it.caption_md]);
  if (it.prompt_md) bits.push(["Prompt", it.prompt_md]);
  if (it.solution_md) bits.push(["Solution", it.solution_md]);
  if (it.proof_md) bits.push(["Proof", it.proof_md]);
  if (it.answer) bits.push(["Answer", String(it.answer)]);
  for (const [h, m] of bits) {
    const d = document.createElement("div");
    d.className = "sec";
    d.innerHTML = `<div class="sec-head">${h}</div><div class="sec-body">${mdWithMath(m)}</div>`;
    secs.appendChild(d);
  }
  if (it.raw_body) secs.appendChild(makeRawBodyBlock(it.raw_body));

  const links = document.getElementById("detail-links");
  links.innerHTML = `<div class="chip-group-head">concepts used</div>`;
  for (const cid of (it.concepts || [])) {
    const c = CONCEPTS_BY_ID.get(cid);
    if (!c) continue;
    const chip = document.createElement("span");
    chip.className = "chip";
    chip.innerHTML = `<span class="dot" style="background:${KIND_COLOR[c.kind]}"></span><span>${escapeHtml(c.title)}</span>`;
    chip.addEventListener("click", () => focusConcept(cid));
    links.appendChild(chip);
  }

  document.getElementById("detail-items").innerHTML = "";
  document.getElementById("detail-items-heading").textContent = "";

  renderMathInElement(body, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
    ],
    throwOnError: false,
  });
}

// ---------- search ----------
function onSearch(e) {
  const q = e.target.value.trim().toLowerCase();
  d3.selectAll(".concept-node")
    .classed("dimmed", d => {
      if (!q) return selectedId ? !isNeighbor(selectedId, d.id) : false;
      const hay = [d.title, ...(d.aliases || []), ...(d.tags || [])].join(" ").toLowerCase();
      return !hay.includes(q);
    });
}
function isNeighbor(sel, other) {
  if (sel === other) return true;
  const list = EDGES_BY_NODE.get(sel) || [];
  return list.some(nb => nb.id === other);
}

// ---------- tooltip ----------
let tooltip = null;
function ensureTooltip() {
  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.id = "tooltip";
    document.body.appendChild(tooltip);
  }
  return tooltip;
}
function showTooltip(ev, html) {
  const t = ensureTooltip();
  t.innerHTML = html;
  t.style.left = (ev.clientX + 12) + "px";
  t.style.top = (ev.clientY + 12) + "px";
  t.classList.add("visible");
}
function hideTooltip() {
  if (tooltip) tooltip.classList.remove("visible");
}
function tooltipHtmlConcept(d) {
  return `<div class="tt-title">${escapeHtml(d.title)}</div>` +
         `<div class="tt-sub">${d.kind} · ch ${d.chapter} · ${d.section}</div>` +
         (d.one_liner ? `<div class="tt-rationale">${escapeHtml(d.one_liner)}</div>` : "");
}
function tooltipHtmlEdge(e) {
  const from = CONCEPTS_BY_ID.get(e.from), to = CONCEPTS_BY_ID.get(e.to);
  return `<div class="tt-title">${e.kind}</div>` +
         `<div class="tt-sub">${escapeHtml(from.title)} → ${escapeHtml(to.title)}</div>` +
         (e.rationale ? `<div class="tt-rationale">${escapeHtml(e.rationale)}</div>` : "");
}

// ---------- utils ----------
const IMAGE_BASE = "images/";

function replaceImages(md) {
  return md.replace(/!\[([\s\S]*?)\]\(([^)]+)\)/g, (_, alt, url) => {
    const assetId = (DATA.image_urls && DATA.image_urls[url])
                 || (DATA.image_urls && DATA.image_urls[url.split("?")[0]]);
    const src = assetId ? IMAGE_BASE + assetId + ".jpg" : url;
    const safeAlt = alt.trim();
    return (
      `<figure class="inline-figure">` +
      `<img src="${src}" alt="${escapeHtmlAttr(safeAlt)}" loading="lazy">` +
      (safeAlt ? `<figcaption>${safeAlt}</figcaption>` : "") +
      `</figure>`
    );
  });
}

function escapeHtmlAttr(s) {
  return String(s).replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function mdWithMath(md) {
  if (!md) return "";
  const withImages = replaceImages(md);
  return marked.parse(withImages, { breaks: true, gfm: true });
}

function makeRawBodyBlock(raw) {
  const div = document.createElement("details");
  div.className = "sec raw-body";
  div.open = true;
  const summary = document.createElement("summary");
  summary.innerHTML = `<span class="sec-head" style="display:inline">Textbook content</span>`;
  div.appendChild(summary);
  const body = document.createElement("div");
  body.className = "sec-body raw-body-content";
  body.innerHTML = mdWithMath(raw);
  div.appendChild(body);
  return div;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}
