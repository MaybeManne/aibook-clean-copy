"""
Generic state machine + the concrete pipeline that runs on top of it.

StateMachine is modality-agnostic, states/transitions/handlers all come
from the caller, so this same class can drive an activereader flow later,
not jus the AMC pipeline.
"""

import argparse
from pathlib import Path

# js grabbing the tools we need, argparse cuz terminal flags,
# path is so no messy string file paths

from orchestrator import (
    stage1_solve, stage2_structure, stage2_author_acts, stage2b_author_gates,
    stage3_author_viz, stage4_assemble, stage5_review,
    build_html, save_artifacts, load_artifacts, _load_problem_text,
)
# pulling in all the actual AI functions from orchestrator.py
# the state machine itself doesn't do any AI work, it just calls these in order
# think of it like: orchestrator = the brains, state machine = the schedule


# ═══════════════════════════════════════════════════════════════════
# Generic base
# ═══════════════════════════════════════════════════════════════════

class StateMachine:
    """Event-driven FSM. states/transitions/initial all passed in by caller.

    transitions = {state: {event: next_state}}

    Handlers are optional entry actions (no-arg callables) run when a state
    is entered. Register after construction, states with no handler just
    do nothing on entry.
    """

    def __init__(self, states, transitions, initial):
        # store the full set of valid states so we know what's allowed
        self.states = set(states)
        # the map of where to go — {state: {event: next_state}}
        self.transitions = transitions
        # we start here — whatever "initial" is passed in
        self.state = initial
        # empty for now — handlers get attached later via register()
        self.handlers = {}

    def register(self, state, handler):
        # attach a function to a state
        # whenever we enter that state, this function runs
        # e.g. register(PLANNING, self._do_planning) means
        # "when we enter PLANNING, call _do_planning()"
        self.handlers[state] = handler

    def can(self, event):
        # quick check: is this event even valid right now?
        # not used internally but useful if you wanna check before triggering
        return event in self.transitions.get(self.state, {})

    def trigger(self, event):
        # THIS IS THE WHOLE FSM — everything else is setup for this
        # step 1: look up what transitions are valid from where we are right now
        table = self.transitions.get(self.state, {})

        # if the event isn't valid here, just ignore it and bail
        if event not in table:
            print(f"[StateMachine] Ignored event '{event}' in {self.state}")
            return None

        # step 2: find the next state and move there
        nxt = table[event]
        print(f"[StateMachine] {self.state} --{event}--> {nxt}")
        self.state = nxt  # we move FIRST before running anything
                          # so if the handler crashes, self.state = the broken stage

        # step 3: run the handler for the new state (if there is one)
        handler = self.handlers.get(nxt)
        if handler:
            handler()  # this is where the actual work happens (AI calls, saving, etc.)

        return nxt  # return the new state so callers know where we ended up


# ═══════════════════════════════════════════════════════════════════
# Pipeline states + transition graph
# ══════════════════════════════════════════════════════════════

# all the possible states — basically the stages of making a lesson
IDLE        = "IDLE"
PLANNING    = "PLANNING"      # stage1_solve        → narrative
STRUCTURING = "STRUCTURING"   # stage2_structure    → plan
AUTHORING   = "AUTHORING"     # stage2_author_acts  → act_specs
GATING      = "GATING"        # stage2b_author_gates→ gate_specs
VISUALIZING = "VISUALIZING"   # stage3_author_viz   → viz_spec
ASSEMBLING  = "ASSEMBLING"    # stage4_assemble
REVIEWING   = "REVIEWING"     # stage5_review + build_html
DONE        = "DONE"
ERROR       = "ERROR"

# the pipeline in order — IDLE, DONE, ERROR are excluded bc they're not "work" stages
_ORDER = [PLANNING, STRUCTURING, AUTHORING, GATING, VISUALIZING, ASSEMBLING, REVIEWING]


def _linear_transitions(order, initial, done, error):
    # builds the full roadmap for the state machine
    # chain = [IDLE, PLANNING, STRUCTURING, ..., REVIEWING, DONE]
    chain = [initial, *order, done]

    # for every consecutive pair, add "next" → the one after it
    # so IDLE→{"next": PLANNING}, PLANNING→{"next": STRUCTURING}, etc.
    transitions = {cur: {"next": nxt} for cur, nxt in zip(chain, chain[1:])}

    # every pipeline stage also gets a "fail" exit → ERROR
    # so if anything crashes mid-stage we can bail gracefully
    for state in order:
        transitions[state]["fail"] = error

    # terminal states — no way out, pipeline is over
    transitions[done] = {}
    transitions[error] = {}

    return transitions


# ═════════════════════════════════════════════════════════════════
# Concrete pipeline machine
# ═══════════════════════════════════════════════════════════════════

class PipelineStateMachine(StateMachine):
    """The 6-stage AMC pipeline on top of StateMachine.

    Just fires "next" down the chain. If a handler raises, fire "fail"
    instead (-> ERROR) and remember which stage broke.
    """

    def __init__(self, model="gemini-2.5-flash", review=True):
        # build the full states list and transition table, then init the base class
        states = [IDLE, *_ORDER, DONE, ERROR]
        transitions = _linear_transitions(_ORDER, IDLE, DONE, ERROR)
        super().__init__(states, transitions, IDLE)  # starts in IDLE

        # config — which model to use and whether to run the review stage
        self.model = model
        self.review = review

        # if we hit ERROR, these tell us exactly what broke
        self.failed_stage = None
        self.error = None

        # set when run() or resume() is called
        self.work_dir = None
        self.output_path = None

        # all the artifacts that get built up as the pipeline runs
        # each stage reads from the ones before and writes to the next
        self.problem_text = None   # the raw AMC problem
        self.narrative = None      # PLANNING output — how to solve it
        self.plan = None           # STRUCTURING output — lesson structure
        self.act_specs = {}        # AUTHORING output — what each act says
        self.gate_specs = {}       # GATING output — the quiz/check-in questions
        self.viz_spec = None       # VISUALIZING output — what to animate
        self.content_path = None   # ASSEMBLING output — path to content JS file
        self.viz_path = None       # ASSEMBLING output — path to viz JS file

        # hook up each stage to its handler function
        # so when we enter PLANNING, _do_planning() runs automatically
        self.register(PLANNING,    self._do_planning)
        self.register(STRUCTURING, self._do_structuring)
        self.register(AUTHORING,   self._do_authoring)
        self.register(GATING,      self._do_gating)
        self.register(VISUALIZING, self._do_visualizing)
        self.register(ASSEMBLING,  self._do_assembling)
        self.register(REVIEWING,   self._do_reviewing)
        # IDLE, DONE, ERROR get no handler — nothing to do when we hit them

    # ─────────────────────────────────────────────────────────────────
    # Drivers
    # ─────────────────────────────────────────────────────────────────

    def run(self, problem_path, output_path, work_dir):
        # fresh run from scratch — takes a problem file and goes all the way to DONE
        self.work_dir = Path(work_dir)
        self.output_path = output_path
        self.work_dir.mkdir(parents=True, exist_ok=True)  # create the folder if it doesn't exist

        # read the problem file — if it doesn't exist, treat the path itself as the text
        # (useful for quick testing where you just pass the problem as a string)
        problem_path = Path(problem_path)
        self.problem_text = problem_path.read_text() if problem_path.exists() else str(problem_path)
        save_artifacts(self.work_dir, problem_text=self.problem_text)  # checkpoint immediately

        self.state = IDLE  # make sure we're starting fresh
        return self._run_to_done()  # kick off the loop

    def resume(self, work_dir, output_path):
        # pick up a run that got interrupted — reload whatever was already saved
        self.work_dir = Path(work_dir)
        self.output_path = output_path

        # load back all the artifacts that were already computed
        self.narrative, self.plan, self.act_specs, self.gate_specs, self.viz_spec = \
            load_artifacts(self.work_dir)
        self.problem_text = _load_problem_text(self.work_dir)

        # figure out which stage to start from based on what's missing
        self.state = self._resume_state()
        return self._run_to_done()  # continue from wherever we left off

    def _run_to_done(self):
        # THE ENGINE — just keeps firing "next" until we hit DONE or ERROR
        while self.state not in (DONE, ERROR):
            try:
                self.trigger("next")  # move to next state AND run its handler
            except Exception as e:
                # something crashed — record which stage broke and why
                self.failed_stage = self.state
                self.error = str(e)
                self.trigger("fail")  # → ERROR
                print(f"[Pipeline] FAILED in {self.failed_stage}: {e}")
                return self.state  # stop the loop, we're in ERROR

        if self.state == DONE:
            print("[Pipeline] Complete.")
        return self.state

    def _resume_state(self):
        # figure out where to restart by checking which artifacts are missing
        # we return the state BEFORE the missing one so "next" lands on the right stage
        if not self.narrative:   return IDLE          # → PLANNING
        if not self.plan:        return PLANNING      # → STRUCTURING
        if not self.act_specs:   return STRUCTURING   # → AUTHORING
        if not self.gate_specs:  return AUTHORING     # → GATING
        if not self.viz_spec:    return GATING        # → VISUALIZING
        return VISUALIZING                            # → ASSEMBLING
        # note: assembled JS isn't tracked as an artifact, so if everything
        # else exists we just redo ASSEMBLING + REVIEWING — no biggie

    # ─────────────────────────────────────────────────────────────────
    # one orchestrator stage fn each, saving output as it goes
    # ─────────────────────────────────────────────────────────────────

    def _do_planning(self):
        # call the AI, get back a narrative (how to solve the problem)
        # save it immediately so if we crash later we don't lose this
        self.narrative = stage1_solve(self.problem_text, model=self.model)
        save_artifacts(self.work_dir, narrative=self.narrative)

    def _do_structuring(self):
        # take the narrative and turn it into a structured lesson plan
        self.plan = stage2_structure(self.problem_text, self.narrative, model=self.model)
        save_artifacts(self.work_dir, plan=self.plan)

    def _do_authoring(self):
        # write out what each "act" of the lesson actually says
        self.act_specs = stage2_author_acts(self.plan, model=self.model)
        save_artifacts(self.work_dir, act_specs=self.act_specs)

    def _do_gating(self):
        # generate the quiz questions / check-ins between acts
        self.gate_specs = stage2b_author_gates(self.plan, self.act_specs, model=self.model)
        save_artifacts(self.work_dir, gate_specs=self.gate_specs)

    def _do_visualizing(self):
        # spec out what the animations/visuals should look like
        self.viz_spec = stage3_author_viz(self.plan, self.act_specs, model=self.model)
        save_artifacts(self.work_dir, viz_spec=self.viz_spec)

    def _do_assembling(self):
        # take all the specs and actually write the JS files
        # returns file paths, not in-memory data — the files live on disk
        self.content_path, self.viz_path = stage4_assemble(
            self.plan, self.act_specs, self.gate_specs, self.viz_spec, self.work_dir
        )

    def _do_reviewing(self):
        # final stage — review the JS for bugs then build the HTML output

        if not self.review:
            # --no-review was passed, skip it and just build directly
            build_html(self.content_path, self.viz_path, self.output_path)
            return

        # read the assembled JS files into memory for the reviewer
        with open(self.content_path) as f:
            content_js = f.read()
        viz_js = None
        if self.viz_path:
            with open(self.viz_path) as f:
                viz_js = f.read()

        # run the review — get back corrected JS (and a list of issues we don't need)
        reviewed_content, reviewed_viz, _issues = stage5_review(
            self.plan, content_js, viz_js, model=self.model
        )

        # only write back if the reviewer actually changed something
        # no point in touching the file if nothing was fixed
        if reviewed_content != content_js:
            with open(self.content_path, "w") as f:
                f.write(reviewed_content)
        if self.viz_path and reviewed_viz and reviewed_viz != viz_js:
            with open(self.viz_path, "w") as f:
                f.write(reviewed_viz)

        # stitch the JS into the final HTML lesson file — we're done
        build_html(self.content_path, self.viz_path, self.output_path)


# ─────────────────────────────────────────────────────────────────────
# CLI
# ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Run the lesson pipeline as a guarded state machine."
    )

    # you have to pick one: fresh run (--problem) or continue (--resume)
    # can't pass both — they're mutually exclusive
    src = parser.add_mutually_exclusive_group(required=True)
    src.add_argument("--problem", help="Path to problem description (markdown/text)")
    src.add_argument("--resume", help="Work dir to resume from (skips completed stages)")

    parser.add_argument("--output", required=True, help="Path for final HTML output")
    parser.add_argument("--work-dir", default="output",
                        help="Directory for intermediate artifacts (ignored with --resume)")
    parser.add_argument("--model", default="gemini-2.5-flash", help="Model to use")
    parser.add_argument("--no-review", action="store_true", help="Skip the review stage")

    args = parser.parse_args()

    # spin up the machine with whatever flags were passed
    m = PipelineStateMachine(model=args.model, review=not args.no_review)

    # kick it off — either fresh or resuming
    if args.resume:
        final = m.resume(args.resume, args.output)
    else:
        final = m.run(args.problem, args.output, args.work_dir)

    # if we ended in ERROR, crash with a message telling you exactly what broke
    if final == ERROR:
        raise SystemExit(f"Pipeline failed in {m.failed_stage}: {m.error}")


if __name__ == "__main__":
    main()
