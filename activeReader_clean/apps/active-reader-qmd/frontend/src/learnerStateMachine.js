/* ─────────────────────────────────────────────────────────────────────
 *  learnerStateMachine.js
 *
 *  The learner-facing runtime state machine for ActiveReader.
 *
 *  This is the concrete implementation of the "Learner State" diagram:
 *
 *      States  = Nodes   (what the learner is doing right now)
 *      Events  = Edges   (what happened: a verdict, a request, a timeout)
 *
 *  The diagram is a simplified overview. This table is the robust superset
 *  that the running app actually drives: it adds the transient support
 *  states (remediating / hinted / reviewing) and the guards needed to keep
 *  the tutor loop from getting stuck.
 *
 *  It sits ON TOP of the other machines rather than duplicating them:
 *    - LessonRuntime        owns phases / gates / branches (the plan).
 *    - ConceptStateMachine  owns per-concept mastery (locked→mastered).
 *    - LearnerStateMachine  owns the moment-to-moment learner status that
 *                           the runtime panel renders. It is fed by the
 *                           same verdicts those machines produce.
 *
 *  All transitions are validated against LEARNER_TRANSITIONS. An event that
 *  is not legal from the current state is a no-op (recorded as rejected),
 *  so currentLearnerState can never drift into an undefined value.
 * ────────────────────────────────────────────────────────────────────── */

// ── States = Nodes ───────────────────────────────────────────────────
export const LEARNER_STATES = Object.freeze({
  IDLE:        'idle',        // no active engagement
  READING:     'reading',     // reading the chapter, no open check
  ANSWERING:   'answering',   // prompted; working a first attempt
  RETRYING:    'retrying',    // follow-up attempt after a wrong answer
  STUCK:       'stuck',       // failed the follow-up attempt too
  REMEDIATING: 'remediating', // tutor is delivering support (transient)
  HINTED:      'hinted',      // a hint was shown; learner should try again
  REVIEWING:   'reviewing',   // reviewing an explanation / recap
  ADVANCING:   'advancing',   // answer accepted; moving forward / mastery
});

// ── Events = Edges ───────────────────────────────────────────────────
export const LEARNER_EVENTS = Object.freeze({
  TUTOR_PROMPT:   'tutor_prompt',   // tutor posed a check / question
  CORRECT:        'correct',        // answer accepted
  WRONG:          'wrong',          // first attempt wrong / partial
  WRONG_AGAIN:    'wrong_again',    // follow-up attempt wrong too
  HELP_REQUESTED: 'help_requested', // learner asked for help / gap diagnosed
  HINT_GIVEN:     'hint_given',     // tutor delivered a hint
  PREREQ_GAP:     'prereq_gap',     // missing prerequisite detected
  TIMEOUT:        'timeout',        // inactivity
  RETRY:          'retry',          // learner takes another attempt
  ADVANCE:        'advance',        // proceed after acceptance
  RESUME_READING: 'resume_reading', // return to reading flow
  REVIEW:         'review',         // enter a review / recap
});

// ── Transition table: LEARNER_TRANSITIONS[state][event] -> nextState ──
export const LEARNER_TRANSITIONS = Object.freeze({
  idle: {
    tutor_prompt:   'answering',
    resume_reading: 'reading',
    timeout:        'idle',
  },
  reading: {
    tutor_prompt:   'answering',
    help_requested: 'remediating',
    review:         'reviewing',
    timeout:        'idle',
  },
  answering: {
    correct:        'advancing',
    wrong:          'retrying',
    help_requested: 'remediating',
    prereq_gap:     'remediating',
    timeout:        'reading',
  },
  retrying: {
    correct:        'advancing',
    wrong_again:    'stuck',
    wrong:          'stuck',
    prereq_gap:     'remediating',
    help_requested: 'remediating',
    hint_given:     'hinted',
    retry:          'retrying',
  },
  stuck: {
    help_requested: 'remediating',
    prereq_gap:     'remediating',
    hint_given:     'hinted',
    retry:          'retrying',
    resume_reading: 'reading',
  },
  remediating: {
    hint_given:     'hinted',
    prereq_gap:     'remediating',
    retry:          'retrying',
    review:         'reviewing',
    resume_reading: 'reading',
  },
  hinted: {
    retry:          'retrying',
    correct:        'advancing',
    tutor_prompt:   'answering',
    review:         'reviewing',
  },
  reviewing: {
    retry:          'retrying',
    tutor_prompt:   'answering',
    correct:        'advancing',
    resume_reading: 'reading',
  },
  advancing: {
    resume_reading: 'reading',
    tutor_prompt:   'answering',
    review:         'reviewing',
  },
});

const ALL_STATES = new Set(Object.values(LEARNER_STATES));

export class LearnerStateMachine {
  constructor(initial = LEARNER_STATES.IDLE) {
    this.state = ALL_STATES.has(initial) ? initial : LEARNER_STATES.IDLE;
    this.history = [];
  }

  /** True if `event` is a legal transition from the current state. */
  can(event) {
    return Boolean(LEARNER_TRANSITIONS[this.state]?.[event]);
  }

  /**
   * Attempt a transition.
   * @returns {{from,to,event,changed,accepted}} — `accepted:false` when the
   *          event is not legal from the current state (state is unchanged).
   */
  dispatch(event, meta = {}) {
    const from = this.state;
    const to = LEARNER_TRANSITIONS[from]?.[event];
    if (!to) {
      const rec = { ts: Date.now(), from, to: from, event, accepted: false, ...meta };
      this._push(rec);
      return { from, to: from, event, changed: false, accepted: false };
    }
    this.state = to;
    const rec = { ts: Date.now(), from, to, event, accepted: true, ...meta };
    this._push(rec);
    return { from, to, event, changed: from !== to, accepted: true };
  }

  /** Force the machine to a known state (restore / reset). */
  set(state) {
    if (ALL_STATES.has(state)) this.state = state;
    return this.state;
  }

  reset(initial = LEARNER_STATES.IDLE) {
    this.state = ALL_STATES.has(initial) ? initial : LEARNER_STATES.IDLE;
    this.history = [];
    return this.state;
  }

  /** Events that are legal right now (for UI / debugging). */
  legalEvents() {
    return Object.keys(LEARNER_TRANSITIONS[this.state] || {});
  }

  snapshot() {
    return {
      state: this.state,
      legalEvents: this.legalEvents(),
      recent: this.history.slice(-8),
    };
  }

  _push(rec) {
    this.history.push(rec);
    if (this.history.length > 120) this.history = this.history.slice(-120);
  }
}
