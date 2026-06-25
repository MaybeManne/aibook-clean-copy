"""
EXAMPLE: a brand new lesson written by a teacher.
=================================================

This is what YOU write to make a lesson. It's the "input" to the framework.

Notice what's NOT here: no state machine, no assembler guts, no vizLib code.
all of that lives in the framework files (act_registry.py, layer2_assembler.py)
and you never touch it. you just:

   1. import the few helpers you need,
   2. describe your problem in a LessonContext,
   3. write a couple of act functions for your problem,
   4. list them in your own registry,
   5. run it.

Copy this whole file, rename it, swap in your own problem, and you've got a
new lesson. Run it with:   python example_custom_lesson.py
"""

from pathlib import Path

# The only things a teacher imports from the framework:
from act_registry import LessonContext, ActOutput, run_all_acts
from layer2_assembler import assemble_lesson


# ─────────────────────────────────────────────────────────────────────
# 1) YOUR PROBLEM + ANY DATA YOUR VISUALS NEED
#
# Put numbers your acts care about into `extra` so the acts can read them.
# ─────────────────────────────────────────────────────────────────────

ctx = LessonContext(
    problem_text=(
        "A pizza is cut into 8 equal slices. You and your friends eat 5 of "
        "them. How much of the pizza is left?"
    ),
    extra={
        "slices_total": 8,
        "slices_eaten": 5,
    },
)


# ─────────────────────────────────────────────────────────────────────
# 2) YOUR ACTS
#
# Each act is a function: take ctx in, return an ActOutput. Show words with
# `text`, and (optionally) a visual by naming a vizLib function in `js_call`
# plus its options in `js_args`. that's the whole deal.
# ─────────────────────────────────────────────────────────────────────

def intro(ctx):
    """Just set up the problem in plain words. No visual."""
    return ActOutput(
        text=(
            "Let's figure out how much pizza is left.\n\n"
            f"{ctx.problem_text}\n\n"
            "We'll picture it first, then check our answer."
        )
    )


def show_eaten(ctx):
    """Draw a fraction bar of the slices that got eaten, using the shared
    vizLib.showFractionBar. the numbers come straight from ctx.extra."""
    eaten = ctx.extra["slices_eaten"]
    total = ctx.extra["slices_total"]
    return ActOutput(
        text=f"Here's the {eaten} out of {total} slices that got eaten:",
        js_call="showFractionBar",
        js_args={
            "numerator": eaten,
            "denominator": total,
            "label": f"{eaten}/{total} eaten",
        },
    )


def quick_check(ctx):
    """A multiple choice gut check, using vizLib.showMultipleChoice. green if
    they pick right, red if not."""
    return ActOutput(
        text="So how much pizza is LEFT?",
        js_call="showMultipleChoice",
        js_args={
            "question": "Pick the fraction of the pizza still on the table.",
            "options": ["3/8", "5/8", "8/8", "1/8"],
            "correctIndex": 0,  # 8 - 5 = 3 slices left, so 3/8
        },
    )


# ─────────────────────────────────────────────────────────────────────
# 3) YOUR RUNNING ORDER
#
# Same idea as ACT_REGISTRY in the framework: a list of (name, function).
# reorder, add, or remove lines to change the lesson.
# ─────────────────────────────────────────────────────────────────────

MY_LESSON = [
    ("intro",       intro),
    ("show_eaten",  show_eaten),
    ("quick_check", quick_check),
]


# ─────────────────────────────────────────────────────────────────────
# 4) RUN IT
#
# This bit is the same for every lesson, so just leave it as is.
# ─────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    acts = run_all_acts(ctx, MY_LESSON)
    page = assemble_lesson(acts, title="Pizza Fractions")
    out = Path(__file__).parent / "example_custom_lesson.html"
    out.write_text(page)
    print(f"Wrote {out} ({len(page)} bytes)")
