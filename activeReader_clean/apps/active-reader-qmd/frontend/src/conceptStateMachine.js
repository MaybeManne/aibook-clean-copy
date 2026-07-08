const CONCEPT_STATES = new Set(['locked', 'available', 'active', 'gate', 'mastered', 'support']);
const ACTIVE_SUBSTATES = ['orient', 'explain', 'connect', 'practice', 'support'];

function conceptIdFromState(id, state) {
  return state?.payload?.concept_id || state?.payload?.id || id || null;
}

function titleFromState(id, state) {
  return state?.payload?.title || state?.payload?.concept || conceptIdFromState(id, state) || id || '';
}

export class ConceptStateMachine {
  constructor(plan) {
    this.plan = plan || {};
    this.concepts = new Map();
    this.prerequisites = new Map();
    this.dependents = new Map();
    this.status = new Map();
    this.history = [];
    this.currentConceptId = null;
    this.activeGateId = null;
    this.activeSubstate = null;
    this.activeSubstateProgress = new Map();
    this.lastSupportTargets = [];
    this._build();
  }

  _build() {
    for (const [id, state] of Object.entries(this.plan.states || {})) {
      if (state?.kind !== 'CONCEPT') continue;
      const conceptId = conceptIdFromState(id, state);
      if (!conceptId) continue;
      this.concepts.set(conceptId, {
        id: conceptId,
        stateId: id,
        title: titleFromState(id, state),
        payload: state.payload || {},
      });
      this.status.set(conceptId, 'available');
    }

    const edges = this.plan.roadmap?.edges || [];
    for (const edge of edges) {
      const isPrereq = edge.kind === 'prerequisite' || edge.event === 'requires';
      if (!isPrereq || !edge.from || !edge.to) continue;
      this._addDependency(edge.from, edge.to);
    }

    for (const conceptId of this.concepts.keys()) {
      this._refreshAvailability(conceptId);
    }
  }

  _addDependency(conceptId, prereqId) {
    if (!this.prerequisites.has(conceptId)) this.prerequisites.set(conceptId, new Set());
    if (!this.dependents.has(prereqId)) this.dependents.set(prereqId, new Set());
    this.prerequisites.get(conceptId).add(prereqId);
    this.dependents.get(prereqId).add(conceptId);
  }

  _record(event, payload = {}) {
    this.history.push({ ts: Date.now(), event, ...payload });
    this.history = this.history.slice(-80);
  }

  _setStatus(conceptId, state) {
    if (!conceptId || !CONCEPT_STATES.has(state)) return;
    this.status.set(conceptId, state);
  }

  _markActiveSubstate(conceptId, substate) {
    if (!conceptId || !ACTIVE_SUBSTATES.includes(substate)) return;
    const reached = new Set(this.activeSubstateProgress.get(conceptId) || []);
    reached.add(substate);
    this.activeSubstateProgress.set(conceptId, reached);
    this.activeSubstate = substate;
  }

  _prereqIds(conceptId) {
    return Array.from(this.prerequisites.get(conceptId) || []);
  }

  _dependentIds(conceptId) {
    return Array.from(this.dependents.get(conceptId) || []);
  }

  _mastered(conceptId) {
    return this.status.get(conceptId) === 'mastered';
  }

  _prereqsSatisfied(conceptId) {
    const prereqs = this._prereqIds(conceptId);
    return prereqs.length === 0 || prereqs.every(id => this._mastered(id));
  }

  _refreshAvailability(conceptId) {
    const current = this.status.get(conceptId);
    if (['active', 'gate', 'mastered', 'support'].includes(current)) return;
    this.status.set(conceptId, this._prereqsSatisfied(conceptId) ? 'available' : 'locked');
  }

  enterConcept({ id, state }) {
    const conceptId = conceptIdFromState(id, state);
    if (!conceptId) return this.snapshot();
    this.currentConceptId = conceptId;
    this.activeGateId = null;
    this.lastSupportTargets = [];
    this._setStatus(conceptId, 'active');
    this._markActiveSubstate(conceptId, 'orient');
    this._record('ENTER_CONCEPT', { conceptId, stateId: id });
    return this.snapshot(conceptId);
  }

  markActiveSubstate(substate, payload = {}) {
    const conceptId = payload.conceptId || this.currentConceptId;
    if (!conceptId) return this.snapshot();
    if (!['active', 'gate', 'support'].includes(this.status.get(conceptId))) return this.snapshot(conceptId);
    this.currentConceptId = conceptId;
    this._markActiveSubstate(conceptId, substate);
    this._record('ACTIVE_SUBSTATE', { conceptId, substate, reason: payload.reason || null });
    return this.snapshot(conceptId);
  }

  enterGate(gate) {
    const conceptId = gate?.payload?.concept_id || this.currentConceptId;
    if (!conceptId) return this.snapshot();
    this.currentConceptId = conceptId;
    this.activeGateId = gate?.id || null;
    this._setStatus(conceptId, 'gate');
    this._markActiveSubstate(conceptId, 'practice');
    this._record('ENTER_GATE', { conceptId, gateId: gate?.id || null });
    return this.snapshot(conceptId);
  }

  resolveGate({ gate, verdict }) {
    const conceptId = gate?.payload?.concept_id || this.currentConceptId;
    if (!conceptId) return this.snapshot();
    this.currentConceptId = conceptId;
    this.activeGateId = null;
    if (verdict === 'pass') {
      this._setStatus(conceptId, 'mastered');
      for (const dependentId of this._dependentIds(conceptId)) {
        this._refreshAvailability(dependentId);
      }
    } else if (verdict === 'fail') {
      this._setStatus(conceptId, 'support');
      this._markActiveSubstate(conceptId, 'support');
      this.lastSupportTargets = this.supportTargets(conceptId);
    }
    this._record('RESOLVE_GATE', { conceptId, gateId: gate?.id || null, verdict });
    return this.snapshot(conceptId);
  }

  enterSupport({ gate, branchIds = [] }) {
    const conceptId = gate?.payload?.concept_id || this.currentConceptId;
    if (!conceptId) return this.snapshot();
    this.currentConceptId = conceptId;
    this._setStatus(conceptId, 'support');
    this._markActiveSubstate(conceptId, 'support');
    this.lastSupportTargets = this.supportTargets(conceptId, branchIds);
    this._record('ENTER_SUPPORT', { conceptId, gateId: gate?.id || null, branchIds });
    return this.snapshot(conceptId);
  }

  supportTargets(conceptId = this.currentConceptId, branchIds = []) {
    const prereqTargets = this._prereqIds(conceptId).map(id => ({
      id,
      title: this.concepts.get(id)?.title || id,
      reason: 'prerequisite',
    }));
    const branchTargets = branchIds.map(id => ({
      id,
      title: this.plan.states?.[id]?.payload?.title || this.plan.states?.[id]?.title || id,
      reason: 'support branch',
    }));
    return [...prereqTargets, ...branchTargets].slice(0, 5);
  }

  snapshot(conceptId = this.currentConceptId) {
    const id = conceptId || this.currentConceptId;
    const concept = id ? this.concepts.get(id) : null;
    const prereqs = id ? this._prereqIds(id).map(pid => ({
      id: pid,
      title: this.concepts.get(pid)?.title || pid,
      state: this.status.get(pid) || 'unknown',
      mastered: this._mastered(pid),
    })) : [];
    return {
      conceptId: id || null,
      conceptTitle: concept?.title || id || null,
      state: id ? (this.status.get(id) || 'available') : 'idle',
      activeSubstate: id === this.currentConceptId ? this.activeSubstate : null,
      activeSubstates: ACTIVE_SUBSTATES.map(name => ({
        name,
        current: id === this.currentConceptId && this.activeSubstate === name,
        reached: Boolean(this.activeSubstateProgress.get(id)?.has(name)),
      })),
      activeGateId: this.activeGateId,
      prereqs,
      prereqsSatisfied: id ? this._prereqsSatisfied(id) : false,
      dependents: id ? this._dependentIds(id).map(did => ({
        id: did,
        title: this.concepts.get(did)?.title || did,
        state: this.status.get(did) || 'unknown',
      })) : [],
      supportTargets: this.lastSupportTargets,
      recentEvents: this.history.slice(-8),
    };
  }
}
