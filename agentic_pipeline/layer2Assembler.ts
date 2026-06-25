// LAYER 2: assembler (TypeScript port of layer2_assembler.py).
//
// Takes the act objects from runAllActs and stitches them into one self
// contained HTML file you can open in a browser.
//
// Rule: an act's JS is at most ONE line (a vizLib call), or rawHtml for an
// outside tool. a teacher never hand writes a <script> block for a normal visual.
//
// Standalone. does not touch assembler.py, orchestrator.py, or the state machine.

import type { ActResult } from "./actRegistry.ts";


const VIZ_LIB_JS = `
window.vizLib = {

  showFractionBar: function (args) {
    var viz = document.getElementById(args.targetId || 'viz');
    if (!viz) { return; }
    var wrap = document.createElement('div');
    wrap.style.margin = '12px 0';
    if (args.label) {
      var cap = document.createElement('div');
      cap.textContent = args.label;
      cap.style.marginBottom = '4px';
      cap.style.fontWeight = '600';
      wrap.appendChild(cap);
    }
    var bar = document.createElement('div');
    bar.style.display = 'flex';
    bar.style.width = (args.width || 320) + 'px';
    bar.style.border = '2px solid #333';
    for (var i = 0; i < args.denominator; i++) {
      var cell = document.createElement('div');
      cell.style.flex = '1';
      cell.style.height = '40px';
      cell.style.borderRight = (i < args.denominator - 1) ? '1px solid #333' : 'none';
      cell.style.background = (i < args.numerator) ? '#6366f1' : '#ffffff';
      bar.appendChild(cell);
    }
    wrap.appendChild(bar);
    viz.appendChild(wrap);
  },

  showMultipleChoice: function (args) {
    var viz = document.getElementById(args.targetId || 'viz');
    if (!viz) { return; }
    var wrap = document.createElement('div');
    wrap.style.margin = '12px 0';
    var q = document.createElement('div');
    q.textContent = args.question;
    q.style.fontWeight = '600';
    q.style.marginBottom = '8px';
    wrap.appendChild(q);
    args.options.forEach(function (opt, i) {
      var btn = document.createElement('button');
      btn.textContent = opt;
      btn.style.display = 'block';
      btn.style.margin = '4px 0';
      btn.style.padding = '8px 12px';
      btn.style.cursor = 'pointer';
      btn.onclick = function () {
        btn.style.background = (i === args.correctIndex) ? '#22c55e' : '#ef4444';
        btn.style.color = '#fff';
      };
      wrap.appendChild(btn);
    });
    viz.appendChild(wrap);
  },

  showSlider: function (args) {
    var viz = document.getElementById(args.targetId || 'viz');
    if (!viz) { return; }
    var wrap = document.createElement('div');
    wrap.style.margin = '12px 0';
    var label = document.createElement('label');
    label.textContent = args.label + ': ';
    var out = document.createElement('span');
    out.textContent = args.default;
    out.style.fontWeight = '600';
    label.appendChild(out);
    wrap.appendChild(label);
    var slider = document.createElement('input');
    slider.type = 'range';
    slider.min = args.min;
    slider.max = args.max;
    slider.step = args.step;
    slider.style.display = 'block';
    slider.style.width = '320px';
    slider.style.marginTop = '6px';
    slider.oninput = function () { out.textContent = slider.value; };
    wrap.appendChild(slider);
    viz.appendChild(wrap);
    slider.value = args.default;
  },

  showTable: function (args) {
    var viz = document.getElementById(args.targetId || 'viz');
    if (!viz) { return; }
    var table = document.createElement('table');
    table.style.borderCollapse = 'collapse';
    table.style.margin = '12px 0';
    var thead = document.createElement('thead');
    var hrow = document.createElement('tr');
    args.headers.forEach(function (h) {
      var th = document.createElement('th');
      th.textContent = h;
      th.style.border = '1px solid #333';
      th.style.padding = '6px 10px';
      th.style.background = '#f1f1f9';
      hrow.appendChild(th);
    });
    thead.appendChild(hrow);
    table.appendChild(thead);
    var tbody = document.createElement('tbody');
    args.rows.forEach(function (row) {
      var tr = document.createElement('tr');
      row.forEach(function (cell) {
        var td = document.createElement('td');
        td.textContent = cell;
        td.style.border = '1px solid #333';
        td.style.padding = '6px 10px';
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    viz.appendChild(table);
  },

  // A horizontal number line with optional marked points. Opts:
  //   min    (number)  left end value
  //   max    (number)  right end value
  //   points (array)   optional values to mark with dots
  //   labels (array)   optional labels for those points (same order)
  showNumberLine: function (args) {
    var viz = document.getElementById(args.targetId || 'viz');
    if (!viz) { return; }
    var NS = 'http://www.w3.org/2000/svg';
    var W = 360, pad = 24, span = (args.max - args.min) || 1;
    function xAt(v) { return pad + (v - args.min) / span * (W - 2 * pad); }
    function mk(tag, a) { var e = document.createElementNS(NS, tag); for (var k in a) { e.setAttribute(k, a[k]); } return e; }
    var svg = mk('svg', { width: W, height: 70 }); svg.style.margin = '12px 0';
    svg.appendChild(mk('line', { x1: pad, y1: 35, x2: W - pad, y2: 35, stroke: '#333', 'stroke-width': 2 }));
    [args.min, args.max].forEach(function (v) {
      svg.appendChild(mk('line', { x1: xAt(v), y1: 28, x2: xAt(v), y2: 42, stroke: '#333', 'stroke-width': 2 }));
      var t = mk('text', { x: xAt(v), y: 58, 'text-anchor': 'middle', 'font-size': 12 }); t.textContent = v; svg.appendChild(t);
    });
    (args.points || []).forEach(function (p, i) {
      svg.appendChild(mk('circle', { cx: xAt(p), cy: 35, r: 5, fill: '#6366f1' }));
      var labels = args.labels || [];
      if (labels[i]) { var lt = mk('text', { x: xAt(p), y: 20, 'text-anchor': 'middle', 'font-size': 12, fill: '#6366f1' }); lt.textContent = labels[i]; svg.appendChild(lt); }
    });
    viz.appendChild(svg);
  },

  // A simple x/y grid with optional plotted points and line segments. Opts:
  //   xRange (array)  [min, max] for the x axis
  //   yRange (array)  [min, max] for the y axis
  //   points (array)  optional list of [x, y] points to plot
  //   lines  (array)  optional list of segments, each [[x1,y1],[x2,y2]]
  showCoordinatePlane: function (args) {
    var viz = document.getElementById(args.targetId || 'viz');
    if (!viz) { return; }
    var NS = 'http://www.w3.org/2000/svg';
    var xr = args.xRange || [-5, 5], yr = args.yRange || [-5, 5];
    var W = 320, H = 320, pad = 20;
    function xAt(x) { return pad + (x - xr[0]) / ((xr[1] - xr[0]) || 1) * (W - 2 * pad); }
    function yAt(y) { return H - pad - (y - yr[0]) / ((yr[1] - yr[0]) || 1) * (H - 2 * pad); }
    function mk(tag, a) { var e = document.createElementNS(NS, tag); for (var k in a) { e.setAttribute(k, a[k]); } return e; }
    var svg = mk('svg', { width: W, height: H }); svg.style.margin = '12px 0';
    for (var gx = Math.ceil(xr[0]); gx <= xr[1]; gx++) {
      svg.appendChild(mk('line', { x1: xAt(gx), y1: pad, x2: xAt(gx), y2: H - pad, stroke: gx === 0 ? '#333' : '#e5e5ef', 'stroke-width': gx === 0 ? 1.5 : 1 }));
    }
    for (var gy = Math.ceil(yr[0]); gy <= yr[1]; gy++) {
      svg.appendChild(mk('line', { x1: pad, y1: yAt(gy), x2: W - pad, y2: yAt(gy), stroke: gy === 0 ? '#333' : '#e5e5ef', 'stroke-width': gy === 0 ? 1.5 : 1 }));
    }
    (args.lines || []).forEach(function (seg) {
      svg.appendChild(mk('line', { x1: xAt(seg[0][0]), y1: yAt(seg[0][1]), x2: xAt(seg[1][0]), y2: yAt(seg[1][1]), stroke: '#f59e0b', 'stroke-width': 2 }));
    });
    (args.points || []).forEach(function (p) {
      svg.appendChild(mk('circle', { cx: xAt(p[0]), cy: yAt(p[1]), r: 4, fill: '#6366f1' }));
    });
    viz.appendChild(svg);
  },

  // Highlights a piece of text or a formula in a colored box. Opts:
  //   text  (string)  the text to call out
  //   color (string)  optional background color (default soft yellow)
  showHighlight: function (args) {
    var viz = document.getElementById(args.targetId || 'viz');
    if (!viz) { return; }
    var box = document.createElement('div');
    box.textContent = args.text;
    box.style.display = 'inline-block';
    box.style.margin = '12px 0';
    box.style.padding = '8px 14px';
    box.style.borderRadius = '6px';
    box.style.fontWeight = '600';
    box.style.background = args.color || '#fde68a';
    box.style.border = '1px solid rgba(0,0,0,0.15)';
    viz.appendChild(box);
  },

  // A numbered list of solution steps. Opts:
  //   steps (array)  the steps, as strings, in order
  showStepList: function (args) {
    var viz = document.getElementById(args.targetId || 'viz');
    if (!viz) { return; }
    var ol = document.createElement('ol');
    ol.style.margin = '12px 0';
    ol.style.paddingLeft = '22px';
    ol.style.lineHeight = '1.8';
    (args.steps || []).forEach(function (s) {
      var li = document.createElement('li'); li.textContent = s; ol.appendChild(li);
    });
    viz.appendChild(ol);
  },

  // A simple bar chart. Opts:
  //   labels (array)   one label per bar
  //   values (array)   one number per bar (same order)
  //   title  (string)  optional title above the chart
  showBarChart: function (args) {
    var viz = document.getElementById(args.targetId || 'viz');
    if (!viz) { return; }
    var wrap = document.createElement('div'); wrap.style.margin = '12px 0';
    if (args.title) {
      var t = document.createElement('div'); t.textContent = args.title;
      t.style.fontWeight = '600'; t.style.marginBottom = '6px'; wrap.appendChild(t);
    }
    var vals = args.values || [];
    var max = Math.max.apply(null, vals.concat([1]));
    var chart = document.createElement('div');
    chart.style.display = 'flex'; chart.style.alignItems = 'flex-end';
    chart.style.gap = '8px'; chart.style.height = '150px';
    vals.forEach(function (v, i) {
      var col = document.createElement('div');
      col.style.display = 'flex'; col.style.flexDirection = 'column';
      col.style.alignItems = 'center'; col.style.justifyContent = 'flex-end';
      var bar = document.createElement('div');
      bar.style.width = '32px'; bar.style.height = (v / max * 110) + 'px';
      bar.style.background = '#6366f1'; bar.style.borderRadius = '3px 3px 0 0';
      var lab = document.createElement('div');
      lab.textContent = (args.labels || [])[i] || '';
      lab.style.fontSize = '11px'; lab.style.marginTop = '4px';
      col.appendChild(bar); col.appendChild(lab); chart.appendChild(col);
    });
    wrap.appendChild(chart); viz.appendChild(wrap);
  },

  // Two overlapping circles with labels (a Venn diagram). Opts:
  //   setA         (number|string)  what to show in the left-only region
  //   setB         (number|string)  what to show in the right-only region
  //   intersection (number|string)  what to show in the overlap
  //   labels       (array)          optional [leftTitle, rightTitle]
  showVennDiagram: function (args) {
    var viz = document.getElementById(args.targetId || 'viz');
    if (!viz) { return; }
    var NS = 'http://www.w3.org/2000/svg';
    function mk(tag, a) { var e = document.createElementNS(NS, tag); for (var k in a) { e.setAttribute(k, a[k]); } return e; }
    var svg = mk('svg', { width: 320, height: 200 }); svg.style.margin = '12px 0';
    svg.appendChild(mk('circle', { cx: 120, cy: 100, r: 70, fill: '#6366f1', 'fill-opacity': 0.45, stroke: '#333' }));
    svg.appendChild(mk('circle', { cx: 200, cy: 100, r: 70, fill: '#f59e0b', 'fill-opacity': 0.45, stroke: '#333' }));
    function txt(x, y, s, weight) { var t = mk('text', { x: x, y: y, 'text-anchor': 'middle', 'font-size': 13 }); if (weight) { t.setAttribute('font-weight', '600'); } t.textContent = s; svg.appendChild(t); }
    txt(85, 105, String(args.setA));
    txt(235, 105, String(args.setB));
    txt(160, 105, String(args.intersection));
    var labels = args.labels || [];
    if (labels[0]) { txt(95, 28, labels[0], true); }
    if (labels[1]) { txt(225, 28, labels[1], true); }
    viz.appendChild(svg);
  },

  // A pie chart, handy for fraction / ratio problems. Opts:
  //   slices (array)  list of { label, value, color? } objects
  showPieChart: function (args) {
    var viz = document.getElementById(args.targetId || 'viz');
    if (!viz) { return; }
    var NS = 'http://www.w3.org/2000/svg';
    function mk(tag, a) { var e = document.createElementNS(NS, tag); for (var k in a) { e.setAttribute(k, a[k]); } return e; }
    var slices = args.slices || [], total = 0;
    slices.forEach(function (s) { total += s.value; });
    if (total <= 0) { total = 1; }
    var R = 80, CX = 100, CY = 100;
    var palette = ['#6366f1', '#f59e0b', '#22c55e', '#ef4444', '#818cf8', '#14b8a6'];
    var svg = mk('svg', { width: 300, height: 200 }); svg.style.margin = '12px 0';
    var ang = -Math.PI / 2;
    slices.forEach(function (s, i) {
      var color = s.color || palette[i % palette.length];
      var frac = s.value / total;
      if (frac >= 0.999) {
        svg.appendChild(mk('circle', { cx: CX, cy: CY, r: R, fill: color }));
      } else {
        var a2 = ang + frac * 2 * Math.PI;
        var x1 = CX + R * Math.cos(ang), y1 = CY + R * Math.sin(ang);
        var x2 = CX + R * Math.cos(a2), y2 = CY + R * Math.sin(a2);
        var large = frac > 0.5 ? 1 : 0;
        svg.appendChild(mk('path', { d: 'M' + CX + ',' + CY + ' L' + x1 + ',' + y1 + ' A' + R + ',' + R + ' 0 ' + large + ' 1 ' + x2 + ',' + y2 + ' Z', fill: color }));
        ang = a2;
      }
      var ly = 20 + i * 18;
      svg.appendChild(mk('rect', { x: 200, y: ly, width: 12, height: 12, fill: color }));
      var lt = mk('text', { x: 218, y: ly + 11, 'font-size': 12 }); lt.textContent = s.label + ' (' + s.value + ')'; svg.appendChild(lt);
    });
    viz.appendChild(svg);
  },

  // A box-and-whisker plot. Opts: min, q1, median, q3, max (numbers), label (string?).
  showBoxPlot: function (args) {
    var viz = document.getElementById(args.targetId || 'viz'); if (!viz) { return; }
    var NS = 'http://www.w3.org/2000/svg';
    function mk(t, a) { var e = document.createElementNS(NS, t); for (var k in a) { e.setAttribute(k, a[k]); } return e; }
    var W = 340, pad = 24, span = (args.max - args.min) || 1, cy = 55;
    function xAt(v) { return pad + (v - args.min) / span * (W - 2 * pad); }
    var svg = mk('svg', { width: W, height: 100 }); svg.style.margin = '12px 0';
    svg.appendChild(mk('line', { x1: xAt(args.min), y1: cy, x2: xAt(args.q1), y2: cy, stroke: '#333' }));
    svg.appendChild(mk('line', { x1: xAt(args.q3), y1: cy, x2: xAt(args.max), y2: cy, stroke: '#333' }));
    svg.appendChild(mk('rect', { x: xAt(args.q1), y: cy - 18, width: xAt(args.q3) - xAt(args.q1), height: 36, fill: '#6366f1', 'fill-opacity': 0.25, stroke: '#6366f1', 'stroke-width': 2 }));
    svg.appendChild(mk('line', { x1: xAt(args.median), y1: cy - 18, x2: xAt(args.median), y2: cy + 18, stroke: '#6366f1', 'stroke-width': 2 }));
    [args.min, args.max].forEach(function (v) { svg.appendChild(mk('line', { x1: xAt(v), y1: cy - 12, x2: xAt(v), y2: cy + 12, stroke: '#333' })); });
    [['min', args.min], ['Q1', args.q1], ['med', args.median], ['Q3', args.q3], ['max', args.max]].forEach(function (p) {
      var t = mk('text', { x: xAt(p[1]), y: 90, 'text-anchor': 'middle', 'font-size': 10 }); t.textContent = p[1]; svg.appendChild(t);
    });
    if (args.label) { var l = mk('text', { x: W / 2, y: 14, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 600 }); l.textContent = args.label; svg.appendChild(l); }
    viz.appendChild(svg);
  },


  // A colored callout box. Opts: text (string), style ("info"|"warning"|"success", default info).
  showCallout: function (args) {
    var viz = document.getElementById(args.targetId || 'viz'); if (!viz) { return; }
    var palette = { info: ['#dbeafe', '#3b82f6'], warning: ['#fef3c7', '#f59e0b'], success: ['#dcfce7', '#22c55e'] };
    var c = palette[args.style] || palette.info;
    var box = document.createElement('div'); box.textContent = args.text;
    box.style.margin = '12px 0'; box.style.padding = '10px 14px'; box.style.background = c[0];
    box.style.borderLeft = '4px solid ' + c[1]; box.style.borderRadius = '4px';
    viz.appendChild(box);
  },

};
`;


function htmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}


export function assembleAct(act: ActResult): string {
  const name = act.name || "act";
  const parts: string[] = [`<section class="act" id="act-${htmlEscape(name)}">`];

  const text = act.text || "";
  if (text) {
    const safe = htmlEscape(text).replace(/\n/g, "<br>");
    parts.push(`  <p>${safe}</p>`);
  }

  if (act.jsCall) {
    const vizId = `viz-${htmlEscape(name)}`;
    parts.push(`  <div id="${vizId}"></div>`);
    const argsJson = JSON.stringify({ ...act.jsArgs, targetId: vizId });
    parts.push(`  <script>vizLib.${act.jsCall}(${argsJson});</script>`);
  }

  if (act.rawHtml) {
    parts.push(act.rawHtml);
  }

  parts.push("</section>");
  return parts.join("\n");
}


export function assembleLesson(acts: ActResult[], title: string): string {
  const sections = acts.map(assembleAct).join("\n");
  const safeTitle = htmlEscape(title);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${safeTitle}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<style>
  body { font-family: -apple-system, Segoe UI, Roboto, sans-serif;
          max-width: 760px; margin: 40px auto; padding: 0 16px;
          line-height: 1.6; color: #1a1a2e; }
  h1 { font-size: 1.6rem; }
  section.act { padding: 16px 0; border-bottom: 1px solid #eee; }
</style>
<!-- KaTeX for math rendering -->
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<!-- vizLib is defined first so every act's one-line call below can use it. -->
<script>
${VIZ_LIB_JS}
</script>
</head>
<body>
<h1>${safeTitle}</h1>

${sections}
</body>
</html>
`;
}
