"""
LAYER 2 — Modular "acts" for a lesson.
=======================================

WHAT THIS FILE IS (read this first, even if you don't code much):

A lesson is just a list of small steps called "acts". Each act is one little
chunk of the lesson — an intro, an explanation, a picture, a wrap-up, or whatever This
file is where you, the teacher, write those acts and decide their order.

You do NOT need to touch the state machine, the orchestrator, or any of the
pipeline plumbing. You only edit two things in here:

   1. The act functions  — each one returns the words + (optionally) a visual.
   2. ACT_REGISTRY        — the ordered list at the bottom. Reorder it, add to
                            it, or delete from it to change the lesson. The
                            lesson can have any number of acts.

HOW ONE ACT WORKS:

Every act is a plain Python function that takes the lesson's context (the
problem, the narrative, any custom data) and returns an ActOutput describing
what the student should see:

    def my_act(ctx: LessonContext) -> ActOutput:
        return ActOutput(text="Some words to show the student.")

An act can show a visual in one of TWO ways:

   * js_call / js_args — call a ready-made drawing function from the shared
     visual library (vizLib, in layer2_assembler.py). This is the normal way.
     You write ONE function name + a dictionary of options. No <script> tags.

   * raw_html — an escape hatch for when you need an outside tool like Desmos
     or GeoGebra that brings its own embed/script code. Use this only when a
     normal vizLib function can't do the job.

That's the whole idea. Everything below is examples you can copy.
"""

from dataclasses import dataclass, field
from typing import Callable, Optional


# ─────────────────────────────────────────────────────────────────────
# The two little "containers" acts use.
# ─────────────────────────────────────────────────────────────────────

@dataclass
class LessonContext:
    """Everything an act might need to know about the lesson.

    problem_text : the math problem being taught (plain text).
    narrative    : the worked solution / story (plain text), if you have one.
    plan         : the structured lesson plan (a dict), if you have one.
    extra        : a free-form dict for ANY custom data you want to pass to
                   your acts — e.g. {"circle_radius": 5}. This is the easiest
                   place to put numbers your visuals depend on.
    """
    problem_text: str
    narrative: str = ""
    plan: dict = field(default_factory=dict)
    extra: dict = field(default_factory=dict)


@dataclass
class ActOutput:
    """What a single act hands back.

    text     : the words shown to the student for this act (required).
    js_call  : (optional) the name of a drawing function in vizLib, e.g.
               "showFractionBar". Leave it None for a text-only act.
    js_args  : the options passed to that function, as a dict. The teacher
               fills this in; it becomes the function's one argument.
    raw_html : (optional) literal HTML to drop in as-is. Use ONLY for outside
               tools (Desmos/GeoGebra) that need their own <script>/embed tags.
    """
    text: str
    js_call: Optional[str] = None
    js_args: dict = field(default_factory=dict)
    raw_html: Optional[str] = None


# ─────────────────────────────────────────────────────────────────────
# EXAMPLE ACTS
#
# Copy any of these as a starting point for your own. Each is just a
# function: take ctx in, return an ActOutput out.
# ─────────────────────────────────────────────────────────────────────

def intro_act(ctx: LessonContext) -> ActOutput:
    """A plain text opener. No visual — just sets up the problem."""
    return ActOutput(
        text=(
            "Let's work through this problem together:\n\n"
            f"{ctx.problem_text}\n\n"
            "Don't rush — we'll build the idea up one piece at a time."
        )
    )


def strategy_act(ctx: LessonContext) -> ActOutput:
    """A plain text explanation of the plan of attack. Still no visual."""
    return ActOutput(
        text=(
            "Here's our strategy: instead of guessing, we'll break the shape "
            "into pieces we already understand, measure each piece, and add "
            "them back up. Small steps, no jumps."
        )
    )


def fraction_bar_act(ctx: LessonContext) -> ActOutput:
    """A visual act that uses the shared library (the NORMAL way to draw).

    We just name a vizLib function and hand it a dictionary of options. The
    numbers come from ctx.extra so the same act works for any fraction.
    """
    frac = ctx.extra.get("fraction", {"numerator": 1, "denominator": 4})
    return ActOutput(
        text=(
            f"Picture {frac['numerator']} out of {frac['denominator']} of the "
            "whole. The shaded part of the bar below is exactly that fraction."
        ),
        js_call="showFractionBar",          # <- a function defined in vizLib
        js_args={                            # <- its single options argument
            "numerator": frac["numerator"],
            "denominator": frac["denominator"],
            "label": f"{frac['numerator']}/{frac['denominator']} of the whole",
        },
    )


def circle_desmos_act(ctx: LessonContext) -> ActOutput:
    """A visual act that uses the raw_html ESCAPE HATCH (an outside tool).

    Here we embed a live Desmos graphing calculator. Desmos needs its own
    <script> tags, so a normal vizLib function can't do it — this is exactly
    when raw_html is appropriate. The circle's equation is built from
    ctx.extra so the graph matches this lesson's data.

    NOTE FOR TEACHERS: the apiKey below is Desmos's public demo key. For real
    use, get your own free key at https://www.desmos.com/api .
    """
    r = ctx.extra.get("circle_radius", 5)
    latex = f"x^2 + y^2 = {r}^2"             # equation derived from ctx.extra
    div_id = "desmos-circle"

    raw = f'''<div id="{div_id}" style="width: 600px; height: 400px; margin: 12px 0;"></div>
<script src="https://www.desmos.com/api/v1.11/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6"></script>
<script>
  (function () {{
    var elt = document.getElementById("{div_id}");
    var calc = Desmos.GraphingCalculator(elt, {{ expressionsCollapsed: true }});
    calc.setExpression({{ id: "circle", latex: "{latex}" }});
  }})();
</script>'''

    return ActOutput(
        text=(
            f"Here is the circle x² + y² = {r}² drawn live. Drag and zoom it to "
            "get a feel for how the radius controls the size."
        ),
        raw_html=raw,
    )


def wrapup_act(ctx: LessonContext) -> ActOutput:
    """A plain text closer that ties the lesson together. No visual."""
    return ActOutput(
        text=(
            "And that's the whole idea. We broke the shape into pieces, measured "
            "each one, and added them up — the same move works on much harder "
            "problems too. Nice work."
        )
    )


# ─────────────────────────────────────────────────────────────────────
# EXTRA EXAMPLE ACTS (not in the running order by default)
#
# These three aren't in ACT_REGISTRY, so they don't run on their own. they're
# just here as ready made examples. wanna use one? copy its line into
# ACT_REGISTRY below (or into your own registry). demo.py has a --preview mode
# that renders all three so you can see what they look like first.
# ─────────────────────────────────────────────────────────────────────

def multiple_choice_act(ctx: LessonContext) -> ActOutput:
    """A quick multiple choice check. The buttons go green if the student picks
    right, red if they don't.

    Uses vizLib.showMultipleChoice. you give it the question, the list of
    options, and which option is the correct one (0 means the first option).
    """
    return ActOutput(
        text="Quick gut check before we keep going.",
        js_call="showMultipleChoice",
        js_args={
            "question": "If the outer radius is 5, what's the area of the whole circle?",
            "options": ["10π", "25π", "5π", "50π"],
            "correctIndex": 1,  # 25π is the right one
        },
    )


def slider_act(ctx: LessonContext) -> ActOutput:
    """An interactive slider the student can drag. The value updates live right
    next to the label as they move it.

    Uses vizLib.showSlider with {label, min, max, step, default}. here the
    starting value comes from ctx.extra so it matches the lesson's data.
    """
    r = ctx.extra.get("circle_radius", 5)
    return ActOutput(
        text="Drag the slider and get a feel for how the radius changes things.",
        js_call="showSlider",
        js_args={"label": "radius", "min": 1, "max": 10, "step": 1, "default": r},
    )


def table_act(ctx: LessonContext) -> ActOutput:
    """A plain data table, handy for organizing values or steps so nothing
    slips through the cracks.

    Uses vizLib.showTable with {headers, rows}. headers is one flat list, rows
    is a list of lists (one inner list per row). just keep the column counts
    lined up with the headers.
    """
    return ActOutput(
        text="Let's drop the rings into a table so we don't lose track.",
        js_call="showTable",
        js_args={
            "headers": ["Ring", "Inner r", "Outer r", "Area"],
            "rows": [
                [1, 0, 1, "π"],
                [2, 1, 2, "3π"],
                [3, 2, 3, "5π"],
            ],
        },
    )


# ─────────────────────────────────────────────────────────────────────
# THE PART A TEACHER EDITS
#
# This is the running order of the lesson. Each entry is just
#     ("a short name", the_function)
# Reorder the lines to reorder the lesson. Delete a line to drop an act.
# Add a line (pointing at one of your own functions above) to add an act.
# There is no fixed number of acts — make it as long or short as you like.
# ─────────────────────────────────────────────────────────────────────

ACT_REGISTRY: list = [
    ("intro",        intro_act),
    ("strategy",     strategy_act),
    ("fraction_bar", fraction_bar_act),
    ("circle",       circle_desmos_act),
    ("wrapup",       wrapup_act),
]


# ─────────────────────────────────────────────────────────────────────
# The runner. You normally don't need to change this.
# ─────────────────────────────────────────────────────────────────────

def run_all_acts(ctx: LessonContext, registry=None) -> list:
    """Run every act in order and collect plain dictionaries.

    Walks the registry top to bottom, calls each act function with the shared
    context, and turns each ActOutput into a simple dict the assembler can
    turn into HTML. Pass your own `registry` to preview a different ordering
    without editing ACT_REGISTRY.

    Returns: a list of dicts, each with keys
             name / text / js_call / js_args / raw_html.
    """
    registry = registry if registry is not None else ACT_REGISTRY
    results = []
    for name, fn in registry:
        out = fn(ctx)
        results.append({
            "name": name,
            "text": out.text,
            "js_call": out.js_call,
            "js_args": out.js_args,
            "raw_html": out.raw_html,
        })
    return results
