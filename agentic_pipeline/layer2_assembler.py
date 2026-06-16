"""
LAYER 2 — Assembler.
====================

Takes the list of act dictionaries produced by act_registry.run_all_acts()
and stitches them into ONE self-contained HTML file you can open in a browser.

There are three pieces here:

   * VIZ_LIB_JS    — the shared visual library (vizLib). Teachers add new
                     drawing functions here. Each function takes ONE options
                     object and draws with plain DOM calls. No frameworks.
   * assemble_act  — turns one act dict into an HTML <section>.
   * assemble_lesson — wraps all the sections + vizLib into a full HTML page.

Design rule: an act's JavaScript is at most ONE line — a call into vizLib —
or, for outside tools (Desmos/GeoGebra), the act's raw_html. A teacher should
never have to hand-write a <script> block for an ordinary visual.

This module is standalone. It does NOT import or touch assembler.py,
orchestrator.py, or the state machine.
"""

import html
import json


# ─────────────────────────────────────────────────────────────────────
# The shared visual library.
#
# This is plain JavaScript kept as a Python string so it can be dropped into
# the page. To add a new visual:
#
#   1. Add a function inside the `vizLib` object below.
#   2. It must take exactly ONE argument: an `args` object (so acts can pass
#      {numerator: 1, denominator: 4, ...}).
#   3. Draw using ordinary DOM calls. The shared drawing area is the page's
#      <div id="viz">; grab it with document.getElementById('viz').
#   4. Back in act_registry.py, set js_call="yourFunctionName" and
#      js_args={...} on the act. Done — no <script> tags to write.
#
# Follow the same one-options-object-in pattern as showFractionBar and any
# teacher can wire it up.
# ─────────────────────────────────────────────────────────────────────

VIZ_LIB_JS = r"""
window.vizLib = {

  // Draws a fraction bar: a rectangle split into `denominator` equal cells,
  // with the first `numerator` cells shaded. Options:
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
"""


# ─────────────────────────────────────────────────────────────────────
# One act -> one <section>.
# ─────────────────────────────────────────────────────────────────────

def assemble_act(act: dict) -> str:
    """Turn a single act dict into an HTML <section>.

    The section contains, in order:
      * the act's text (escaped — teachers write plain words, not HTML),
      * at most ONE line of JS calling into vizLib, if js_call is set,
      * the act's raw_html appended as-is, if set (the Desmos/GeoGebra hatch).
    """
    name = act.get("name", "act")
    parts = [f'<section class="act" id="act-{html.escape(name)}">']

    # The words. We escape them so a stray "<" in the text can't break the page.
    text = act.get("text") or ""
    if text:
        safe = html.escape(text).replace("\n", "<br>")
        parts.append(f"  <p>{safe}</p>")

    # The one-line visual call into the shared library, if any.
    if act.get("js_call"):
        args_json = json.dumps(act.get("js_args") or {})
        parts.append(f"  <script>vizLib.{act['js_call']}({args_json});</script>")

    # The escape hatch: literal HTML for an outside embed. Inserted verbatim.
    if act.get("raw_html"):
        parts.append(act["raw_html"])

    parts.append("</section>")
    return "\n".join(parts)


# ─────────────────────────────────────────────────────────────────────
# All acts -> one full HTML page.
# ─────────────────────────────────────────────────────────────────────

def assemble_lesson(acts: list, title: str) -> str:
    """Stitch every act section, a shared <div id="viz"> target, and vizLib
    into one self-contained HTML document (returned as a string).

    Order matters for the browser: vizLib is defined in <head> and the shared
    #viz target sits near the top, so each act's one-line vizLib call (which
    appears lower in the page) can always find both when it runs.
    """
    sections = "\n".join(assemble_act(a) for a in acts)
    safe_title = html.escape(title)

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{safe_title}</title>
<style>
  body {{ font-family: -apple-system, Segoe UI, Roboto, sans-serif;
          max-width: 760px; margin: 40px auto; padding: 0 16px;
          line-height: 1.6; color: #1a1a2e; }}
  h1 {{ font-size: 1.6rem; }}
  section.act {{ padding: 16px 0; border-bottom: 1px solid #eee; }}
  #viz {{ margin: 8px 0 24px; }}
</style>
<!-- vizLib is defined first so every act's one-line call below can use it. -->
<script>
{VIZ_LIB_JS}
</script>
</head>
<body>
<h1>{safe_title}</h1>

<!-- Shared drawing area. vizLib functions append their visuals here. -->
<div id="viz"></div>

{sections}
</body>
</html>
"""
