"""
LAYER 2 — End-to-end demo.
==========================

Shows the whole Layer 2 flow with no pipeline, no API keys, no orchestrator:

   1. Build a LessonContext (the problem + any custom data in `extra`).
   2. run_all_acts() — walk the ACT_REGISTRY and collect each act's output.
   3. assemble_lesson() — stitch those into one self-contained HTML page.
   4. Write it to demo_lesson.html.

Run it:   python demo.py             (writes demo_lesson.html, the default lesson)
          python demo.py --preview   (also writes demo_preview.html so you can
                                      eyeball the extra act types: multiple
                                      choice, slider, table)
"""

import sys
from pathlib import Path

from act_registry import (
    LessonContext, run_all_acts,
    multiple_choice_act, slider_act, table_act,
)
from layer2_assembler import assemble_lesson


# A throwaway registry just for --preview. These are the extra act types that
# aren't wired into ACT_REGISTRY by default. handy to see them all at once
# without messing with the real lesson order.
PREVIEW_REGISTRY = [
    ("multiple_choice", multiple_choice_act),
    ("slider",          slider_act),
    ("table",           table_act),
]


def main():
    # 1) The context every act receives. `extra` carries the per-lesson numbers
    #    our visual acts depend on (the fraction, the circle's radius).
    ctx = LessonContext(
        problem_text=(
            "A target is made of nested circles. If the radius of the outer "
            "circle is 5, what does the region look like, and how much of it "
            "is shaded?"
        ),
        narrative="We break the target into rings, measure each, and add them up.",
        plan={},  # not needed for this demo, but available to acts if you have one
        extra={
            "fraction": {"numerator": 1, "denominator": 4},
            "circle_radius": 5,
        },
    )

    # 2) Run every act in registry order -> list of plain dicts.
    acts = run_all_acts(ctx)
    print(f"Ran {len(acts)} acts: {[a['name'] for a in acts]}")

    # 3) Stitch them into one HTML page.
    page = assemble_lesson(acts, title="Nested Circles — a Layer 2 demo lesson")

    # 4) Write it next to this file.
    out_path = Path(__file__).parent / "demo_lesson.html"
    out_path.write_text(page)
    print(f"Wrote {out_path} ({len(page)} bytes)")

    # 5) Optional: render the extra act types so you can see what they do. same
    #    flow as above, just pointed at the preview registry instead.
    if "--preview" in sys.argv:
        preview_acts = run_all_acts(ctx, PREVIEW_REGISTRY)
        print(f"Preview acts: {[a['name'] for a in preview_acts]}")
        preview_page = assemble_lesson(preview_acts, title="Layer 2 extra act types preview")
        preview_path = Path(__file__).parent / "demo_preview.html"
        preview_path.write_text(preview_page)
        print(f"Wrote {preview_path} ({len(preview_page)} bytes)")


if __name__ == "__main__":
    main()
