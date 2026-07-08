/* ─────────────────────────────────────────────────────────────────────
 *  learnerModel.js
 *
 *  A fine-grained, per-concept model of how the learner is doing — as
 *  opposed to LearnerStateMachine, which tracks what they are *doing*.
 *
 *  It replaces the binary "right / wrong" view with two orthogonal axes:
 *
 *    KNOWLEDGE   (how much they know)  — an ordinal ladder:
 *      untouched → misconception → shaky → partial → developing
 *                → proficient → mastered
 *
 *    DISPOSITION (how they are coping) — captures "unsure" / "struggling":
 *      confident · unsure · struggling · disengaged
 *
 *  Both are derived from an internal continuous estimate that is updated
 *  by evidence bundles (verdict + confidence + latency + attempts + hints
 *  + self-reported uncertainty + reading time …). The discrete labels above
 *  are what the UI renders; the numbers underneath make the transitions smooth.
 * ────────────────────────────────────────────────────────────────────── */

export const KNOWLEDGE_LEVELS = Object.freeze([
  'untouched', 'misconception', 'shaky', 'partial', 'developing', 'proficient', 'mastered',
]);

export const DISPOSITIONS = Object.freeze([
  'confident', 'unsure', 'struggling', 'disengaged',
]);

export const KNOWLEDGE_META = Object.freeze({
  untouched:     { label: 'Untouched',     tone: 'grey'  },
  misconception: { label: 'Misconception', tone: 'red'   },
  shaky:         { label: 'Shaky',         tone: 'amber' },
  partial:       { label: 'Partial',       tone: 'amber' },
  developing:    { label: 'Developing',    tone: 'blue'  },
  proficient:    { label: 'Proficient',    tone: 'green' },
  mastered:      { label: 'Mastered',      tone: 'green' },
});

export const DISPOSITION_META = Object.freeze({
  confident:  { label: 'Confident',  tone: 'green' },
  unsure:     { label: 'Unsure',     tone: 'amber' },
  struggling: { label: 'Struggling', tone: 'red'   },
  disengaged: { label: 'Disengaged', tone: 'grey'  },
});

const clamp01 = (n) => Math.max(0, Math.min(1, n));
const round2 = (n) => Math.round(n * 100) / 100;

const VERDICT_TARGET = { correct: 0.85, partial: 0.5, wrong: 0.15 };

function freshRecord(conceptId, conceptTitle) {
  return {
    conceptId,
    conceptTitle: conceptTitle || conceptId || null,
    understanding: 0,          // 0..1 continuous knowledge estimate
    struggle: 0,               // 0..1 continuous struggle estimate
    confidence: null,          // 'high' | 'medium' | 'low'
    misconception: false,
    mastered: false,
    attempts: 0,
    hints: 0,
    readingMs: 0,
    evidenceCount: 0,
    lastEvidenceTs: null,
    // derived labels (kept on the record for cheap rendering)
    knowledge: 'untouched',
    disposition: 'confident',
    evidence: [],              // rolling log of the last few evidence bundles
  };
}

export class LearnerModel {
  constructor(serialized = null) {
    this.concepts = new Map();
    if (serialized) this.load(serialized);
  }

  _ensure(conceptId, conceptTitle) {
    if (!conceptId) return null;
    if (!this.concepts.has(conceptId)) {
      this.concepts.set(conceptId, freshRecord(conceptId, conceptTitle));
    }
    const rec = this.concepts.get(conceptId);
    if (conceptTitle) rec.conceptTitle = conceptTitle;
    return rec;
  }

  /**
   * Fold one piece of evidence into the model.
   * @param {string} conceptId
   * @param {object} ev
   *   ev.verdict        'correct' | 'partial' | 'wrong'
   *   ev.understanding  0..1 (from scorer, optional)
   *   ev.confidence     'high' | 'medium' | 'low' (from scorer/client, optional)
   *   ev.misconception  boolean (from scorer, optional)
   *   ev.attempt        1-based attempt number
   *   ev.hintsUsed      number of hints shown before this answer
   *   ev.latencyMs      time from prompt shown to answer
   *   ev.readingMs      time spent reading the page/concept before moving on
   *   ev.selfUnsure     learner said "I don't know" / hedged
   *   ev.mcq            answer came from a multiple-choice option
   *   ev.gateVerdict    'pass' | 'fail' (a mastery gate resolved)
   *   ev.disengaged     inactivity / skip
   *   ev.conceptTitle   optional label
   */
  applyEvidence(conceptId, ev = {}) {
    const rec = this._ensure(conceptId, ev.conceptTitle);
    if (!rec) return null;
    rec.evidenceCount += 1;
    rec.lastEvidenceTs = Date.now();

    // Disengagement is its own kind of signal (no answer to grade).
    if (ev.disengaged && !ev.verdict) {
      rec.struggle = clamp01(rec.struggle + 0.08);
      this._recompute(rec, { disengaged: true });
      this._log(rec, ev);
      return this.snapshot(conceptId);
    }

    // Reading time is useful context, but it is not a correctness signal by
    // itself. It can indicate engagement, confusion, or careful reading, so it
    // only nudges disposition and never changes the knowledge estimate alone.
    if (ev.readingMs && !ev.verdict) {
      rec.readingMs += Math.max(0, ev.readingMs);
      if (ev.readingMs > 180000) rec.struggle = clamp01(rec.struggle + 0.1);
      else if (ev.readingMs > 90000) rec.struggle = clamp01(rec.struggle + 0.05);
      this._recompute(rec, { disengaged: false });
      this._log(rec, ev);
      return this.snapshot(conceptId);
    }

    // ── Knowledge estimate (EWMA toward an evidence-derived target) ──
    let target = typeof ev.understanding === 'number'
      ? clamp01(ev.understanding)
      : (VERDICT_TARGET[ev.verdict] ?? rec.understanding);

    // A lucky multiple-choice hit while hedging shouldn't read as mastery.
    const guessing = ev.verdict === 'correct' && ev.mcq
      && (ev.confidence === 'low' || ev.selfUnsure);
    if (guessing) target = Math.min(target, 0.55);
    // Getting there only after hints is real but not full credit.
    if (ev.verdict === 'correct' && ev.hintsUsed > 0) target = Math.min(target, 0.72);

    const alpha = rec.evidenceCount <= 1 ? 0.7 : 0.45;
    rec.understanding = round2(rec.understanding * (1 - alpha) + target * alpha);

    // ── Struggle estimate ──
    let ds = 0;
    if (ev.verdict === 'wrong') ds += 0.3;
    else if (ev.verdict === 'partial') ds += 0.1;
    else if (ev.verdict === 'correct') ds -= 0.25;
    if (ev.attempt >= 2) ds += 0.18;
    if (ev.hintsUsed) ds += 0.1 * ev.hintsUsed;
    if (ev.selfUnsure) ds += 0.15;
    if (typeof ev.latencyMs === 'number' && ev.latencyMs > 45000) ds += 0.1;
    if (typeof ev.readingMs === 'number' && ev.readingMs > 90000 && ev.verdict !== 'correct') ds += 0.08;
    rec.struggle = clamp01(rec.struggle + ds);

    // ── Confidence & misconception ──
    if (ev.confidence) rec.confidence = ev.confidence;
    else if (ev.selfUnsure) rec.confidence = 'low';

    if (ev.misconception || (ev.verdict === 'wrong' && ev.confidence === 'high' && !ev.selfUnsure)) {
      rec.misconception = true;
    } else if (ev.verdict === 'correct') {
      rec.misconception = false;
    }

    // ── Mastery gate outcome ──
    if (ev.gateVerdict === 'pass') {
      rec.mastered = true;
      rec.understanding = Math.max(rec.understanding, 0.9);
      rec.struggle = Math.min(rec.struggle, 0.3);
      rec.misconception = false;
    } else if (ev.gateVerdict === 'fail') {
      rec.mastered = false;
    }

    if (ev.attempt) rec.attempts = Math.max(rec.attempts, ev.attempt);
    if (ev.hintsUsed) rec.hints = Math.max(rec.hints, ev.hintsUsed);
    if (ev.readingMs) rec.readingMs += Math.max(0, ev.readingMs);

    this._recompute(rec, { disengaged: false });
    this._log(rec, ev);
    return this.snapshot(conceptId);
  }

  markMastered(conceptId, conceptTitle) {
    return this.applyEvidence(conceptId, { gateVerdict: 'pass', conceptTitle });
  }

  markDisengaged(conceptId, conceptTitle) {
    return this.applyEvidence(conceptId, { disengaged: true, conceptTitle });
  }

  _recompute(rec, { disengaged } = {}) {
    // Knowledge band
    if (rec.mastered) {
      rec.knowledge = 'mastered';
    } else if (rec.evidenceCount === 0) {
      rec.knowledge = 'untouched';
    } else if (rec.misconception) {
      rec.knowledge = 'misconception';
    } else {
      const u = rec.understanding;
      rec.knowledge = u < 0.3 ? 'shaky'
        : u < 0.5 ? 'partial'
        : u < 0.7 ? 'developing'
        : 'proficient';
    }
    // Disposition (priority: disengaged > struggling > unsure > confident)
    if (disengaged) {
      rec.disposition = 'disengaged';
    } else if (rec.struggle >= 0.6) {
      rec.disposition = 'struggling';
    } else if (rec.confidence === 'low' || rec.struggle >= 0.35) {
      rec.disposition = 'unsure';
    } else {
      rec.disposition = 'confident';
    }
  }

  _log(rec, ev) {
    rec.evidence.push({
      ts: rec.lastEvidenceTs,
      verdict: ev.verdict || (ev.disengaged ? 'disengaged' : null),
      confidence: ev.confidence || null,
      misconception: !!ev.misconception,
      attempt: ev.attempt || null,
      latencyMs: ev.latencyMs || null,
      readingMs: ev.readingMs || null,
      knowledge: rec.knowledge,
      disposition: rec.disposition,
    });
    if (rec.evidence.length > 12) rec.evidence = rec.evidence.slice(-12);
  }

  snapshot(conceptId) {
    const rec = this.concepts.get(conceptId);
    if (!rec) return null;
    return {
      ...rec,
      evidence: rec.evidence.slice(-8),
      knowledgeMeta: KNOWLEDGE_META[rec.knowledge],
      dispositionMeta: DISPOSITION_META[rec.disposition],
      masteryPct: Math.round(rec.understanding * 100),
    };
  }

  /** All concept snapshots keyed by conceptId (for map coloring / persistence). */
  all() {
    const out = {};
    for (const id of this.concepts.keys()) out[id] = this.snapshot(id);
    return out;
  }

  serialize() {
    const out = {};
    for (const [id, rec] of this.concepts.entries()) out[id] = rec;
    return out;
  }

  load(serialized) {
    if (!serialized || typeof serialized !== 'object') return;
    for (const [id, rec] of Object.entries(serialized)) {
      this.concepts.set(id, { ...freshRecord(id, rec.conceptTitle), ...rec });
    }
  }
}
