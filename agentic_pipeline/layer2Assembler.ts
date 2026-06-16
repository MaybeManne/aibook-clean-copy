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


// The shared visual library, kept as a string so it can drop into the page.
// To add a visual:
//   1. add a function inside vizLib below.
//   2. it takes ONE argument: an `args` object.
//   3. draw with plain DOM calls into <div id="viz">.
//   4. back in actRegistry.ts set jsCall="yourFn" and jsArgs={...}.
// follow the same one options object pattern as showFractionBar.
const VIZ_LIB_JS = `
window.vizLib = {

  // Draws a fraction bar: a rectangle split into \`denominator\` equal cells,
  // with the first \`numerator\` cells shaded. Options:
  //   numerator   (number)  how many cells to shade
  //   denominator (number)  how many cells total
  //   label       (string)  optional caption above the bar
  //   width       (number)  optional bar width in pixels (default 320)
  showFractionBar: function (args) {
    var viz = document.getElementById('viz');
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

  // Multiple choice question. Shows the prompt, then one button per option.
  // click a button and it goes green if it's right, red if it's wrong. Opts:
  //   question     (string)  the prompt to show
  //   options      (array)   the answer choices, as strings
  //   correctIndex (number)  which choice is right (0 = the first one)
  showMultipleChoice: function (args) {
    var viz = document.getElementById('viz');
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
        // green for the right one, red for everything else
        btn.style.background = (i === args.correctIndex) ? '#22c55e' : '#ef4444';
        btn.style.color = '#fff';
      };
      wrap.appendChild(btn);
    });

    viz.appendChild(wrap);
  },

  // A drag slider with its current value shown live next to the label. Opts:
  //   label   (string)  text shown before the value
  //   min     (number)  smallest value
  //   max     (number)  biggest value
  //   step    (number)  how far each notch moves
  //   default (number)  where the slider starts out
  showSlider: function (args) {
    var viz = document.getElementById('viz');
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
    slider.value = args.default;
    slider.style.display = 'block';
    slider.style.width = '320px';
    slider.style.marginTop = '6px';
    // bump the live number every time the student drags
    slider.oninput = function () { out.textContent = slider.value; };
    wrap.appendChild(slider);

    viz.appendChild(wrap);
  },

  // A plain data table. Good for laying out steps or values side by side. Opts:
  //   headers (array)  the column titles, one flat list of strings
  //   rows    (array)  a list of rows, where each row is its own list of
  //                    cells. keep every row the same length as headers.
  showTable: function (args) {
    var viz = document.getElementById('viz');
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
  }

  // , add the next function here, same shape: name: function (args) { ... }

};
`;


// Tiny HTML escaper. matches Python's html.escape (quotes included).
function htmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}


// Turn one act into an HTML <section>: the text, then at most one vizLib line
// if jsCall is set, then rawHtml as is if set.
export function assembleAct(act: ActResult): string {
  const name = act.name || "act";
  const parts: string[] = [`<section class="act" id="act-${htmlEscape(name)}">`];

  // the words. escaped so a stray "<" can't break the page.
  const text = act.text || "";
  if (text) {
    const safe = htmlEscape(text).replace(/\n/g, "<br>");
    parts.push(`  <p>${safe}</p>`);
  }

  // the one line visual call into vizLib, if any.
  if (act.jsCall) {
    const argsJson = JSON.stringify(act.jsArgs || {});
    parts.push(`  <script>vizLib.${act.jsCall}(${argsJson});</script>`);
  }

  // the escape hatch: literal HTML for an outside embed, inserted verbatim.
  if (act.rawHtml) {
    parts.push(act.rawHtml);
  }

  parts.push("</section>");
  return parts.join("\n");
}


// Stitch every act section, a shared <div id="viz">, and vizLib into one full
// HTML page. vizLib is defined in <head> and #viz sits near the top so each
// act's one line call (lower on the page) can find both when it runs.
export function assembleLesson(acts: ActResult[], title: string): string {
  const sections = acts.map(assembleAct).join("\n");
  const safeTitle = htmlEscape(title);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${safeTitle}</title>
<style>
  body { font-family: -apple-system, Segoe UI, Roboto, sans-serif;
          max-width: 760px; margin: 40px auto; padding: 0 16px;
          line-height: 1.6; color: #1a1a2e; }
  h1 { font-size: 1.6rem; }
  section.act { padding: 16px 0; border-bottom: 1px solid #eee; }
  #viz { margin: 8px 0 24px; }
</style>
<!-- vizLib is defined first so every act's one-line call below can use it. -->
<script>
${VIZ_LIB_JS}
</script>
</head>
<body>
<h1>${safeTitle}</h1>

<!-- Shared drawing area. vizLib functions append their visuals here. -->
<div id="viz"></div>

${sections}
</body>
</html>
`;
}
