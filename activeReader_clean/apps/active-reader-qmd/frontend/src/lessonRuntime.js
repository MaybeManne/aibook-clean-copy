/* ─────────────────────────────────────────────────────────────────────
 * lessonRuntime.js — ES module port of /active-reader-demo/runtime.js
 *
 * Headless state-machine engine: emits events, no DOM/React deps.
 * Mirrors the Python `lesson_engine` package one-to-one.
 * ────────────────────────────────────────────────────────────────────── */

const TRANSITIONS = {
  idle:    new Set(["running"]),
  running: new Set(["paused", "gating", "asking", "done", "idle"]),
  paused:  new Set(["running", "idle"]),
  gating:  new Set(["running", "asking", "idle"]),
  asking:  new Set(["running", "gating", "idle"]),
  done:    new Set(["idle", "running"]),
};

class EventBus {
  constructor() { this._h = {}; }
  on(e, fn)   { (this._h[e] = this._h[e] || []).push(fn); return () => this.off(e, fn); }
  off(e, fn)  { const a = this._h[e]; if (a) { const i = a.indexOf(fn); if (i>=0) a.splice(i,1); } }
  emit(e, p={}){ for (const fn of (this._h[e] || []).slice()) {
                  try { fn(p); } catch (err) { console.error(`[bus ${e}]`, err); } } }
}

class InterruptStack {
  constructor() { this._frames = []; this._next = 1; this._cancelled = new Set(); }
  push(stateId, returnTo) {
    const t = this._next++;
    this._frames.push({ token: t, stateId, returnTo });
    return t;
  }
  pop(token) {
    if (this._cancelled.has(token)) { this._cancelled.delete(token); return null; }
    if (!this._frames.length || this._frames[this._frames.length-1].token !== token) return null;
    return this._frames.pop();
  }
  cancel(token) {
    const i = this._frames.findIndex(f => f.token === token);
    if (i>=0) this._frames.splice(i, 1);
    this._cancelled.add(token);
  }
  depth() { return this._frames.length; }
  clear() { this._frames = []; this._cancelled.clear(); }
}

export class LessonRuntime {
  constructor(plan) {
    this.plan = plan;
    this.bus = new EventBus();
    this.interrupts = new InterruptStack();
    this._reset();
    this._markerAfter = {};
    for (const m of plan.markers || []) this._markerAfter[m.after_state] = m;
    this._gateAfter = {};
    for (const g of plan.gates || []) this._gateAfter[g.after_state] = g;
  }

  _reset() {
    this.phase = "idle";
    this.mainIndex = -1;
    this.pathHistory = [];
    this.gateResults = {};
    this.onBranch = false;
    this._branchQueue = [];
    this._branchReturnMainIndex = -1;
    this._activeGateId = null;
    this._prevPhaseBeforeAsking = "running";
  }

  _setPhase(to) {
    const frm = this.phase;
    if (!TRANSITIONS[frm].has(to)) throw new Error(`invalid transition ${frm} → ${to}`);
    this.phase = to;
    this.bus.emit("phase:change", { frm, to });
  }

  nextMainAfter(stateId) {
    const i = this.plan.main_path.indexOf(stateId);
    if (i < 0 || i+1 >= this.plan.main_path.length) return null;
    return this.plan.main_path[i+1];
  }

  currentStateId() {
    return this.pathHistory.length ? this.pathHistory[this.pathHistory.length-1] : null;
  }
  currentState() {
    const sid = this.currentStateId();
    return sid ? this.plan.states[sid] : null;
  }

  start() {
    this._reset();
    this._setPhase("running");
    const sid = this._advanceCursor();
    if (sid === null) { this._setPhase("done"); this.bus.emit("lesson:complete"); return; }
    this.bus.emit("state:enter", { id: sid, state: this.plan.states[sid] });
  }

  advance() {
    if (this.phase !== "running" && this.phase !== "paused") return;
    const curId = this.currentStateId();
    if (!curId) return;
    this.bus.emit("state:exit", { id: curId, state: this.plan.states[curId] });

    const marker = !this.onBranch ? this._markerAfter[curId] : null;
    if (marker) this.bus.emit("marker:fire", { marker, afterState: curId });

    const gate = !this.onBranch ? this._gateAfter[curId] : null;
    if (gate && !(gate.id in this.gateResults)) {
      this._activeGateId = gate.id;
      this._setPhase("gating");
      this.bus.emit("gate:enter", { gate });
      return;
    }
    this._stepToNext();
  }

  submitVerdict(gateId, verdict) {
    if (this.phase !== "gating") throw new Error(`cannot submit verdict in phase=${this.phase}`);
    if (this._activeGateId !== gateId) throw new Error(`verdict for ${gateId} but active is ${this._activeGateId}`);
    if (!["pass","fail","dismiss"].includes(verdict)) throw new Error(`unknown verdict ${verdict}`);

    const gate = this.plan.gates.find(g => g.id === gateId);
    this.gateResults[gateId] = verdict;
    this._activeGateId = null;

    if (verdict === "fail" && gate.branch_on_fail && gate.branch_on_fail.length) {
      const rejoin = gate.rejoin_to || this.nextMainAfter(gate.after_state);
      const rejoinIdx = rejoin ? this.plan.main_path.indexOf(rejoin) : this.plan.main_path.length;
      this._setPhase("running");
      this.onBranch = true;
      this._branchReturnMainIndex = rejoinIdx;
      this._branchQueue = gate.branch_on_fail.slice();
      const first = this._branchQueue.shift();
      this.pathHistory.push(first);
      this.bus.emit("branch:enter", { gate, branchIds: gate.branch_on_fail, returnTo: rejoin });
      this.bus.emit("gate:resolve", { gate, verdict, branchEntered: true });
      this.bus.emit("state:enter", { id: first, state: this.plan.states[first] });
      return;
    }

    this._setPhase("running");
    this.bus.emit("gate:resolve", { gate, verdict, branchEntered: false });
    this._stepToNext();
  }

  pushInterrupt(stateId) {
    if (!["running","gating","paused"].includes(this.phase))
      throw new Error(`cannot push interrupt in phase=${this.phase}`);
    const returnTo = this.currentStateId() || "";
    const token = this.interrupts.push(stateId, returnTo);
    this._prevPhaseBeforeAsking = this.phase === "paused" ? "running" : this.phase;
    if (this.phase === "paused") this._setPhase("running");
    this._setPhase("asking");
    this.bus.emit("interrupt:enter", { stateId, returnTo, token });
    return token;
  }

  popInterrupt(token) {
    if (this.phase !== "asking") return false;
    const f = this.interrupts.pop(token);
    if (!f) return false;
    this._setPhase(this._prevPhaseBeforeAsking);
    this.bus.emit("interrupt:exit", { stateId: f.stateId, returnTo: f.returnTo, token });
    return true;
  }

  abortInterrupt(token) {
    this.interrupts.cancel(token);
    if (this.phase === "asking") {
      this._setPhase(this._prevPhaseBeforeAsking);
      this.bus.emit("interrupt:exit", { stateId: null, returnTo: null, token, aborted: true });
    }
  }

  pause()  { if (this.phase === "running") this._setPhase("paused"); }
  resume() { if (this.phase === "paused")  this._setPhase("running"); }
  reset()  { if (this.phase !== "idle") this._setPhase("idle"); this._reset(); }

  _advanceCursor() {
    if (this.onBranch) {
      if (this._branchQueue.length) {
        const sid = this._branchQueue.shift();
        this.pathHistory.push(sid);
        return sid;
      }
      this.onBranch = false;
      this.mainIndex = this._branchReturnMainIndex;
      this._branchReturnMainIndex = -1;
    } else {
      this.mainIndex++;
    }
    if (this.mainIndex >= this.plan.main_path.length) return null;
    const sid = this.plan.main_path[this.mainIndex];
    this.pathHistory.push(sid);
    return sid;
  }

  _stepToNext() {
    const prevId = this.currentStateId();
    const prevWasBranch = prevId && this.plan.states[prevId].is_branch;
    const sid = this._advanceCursor();
    if (sid === null) { this._setPhase("done"); this.bus.emit("lesson:complete"); return; }
    if (prevWasBranch && !this.plan.states[sid].is_branch)
      this.bus.emit("branch:exit", { rejoinTo: sid });
    this.bus.emit("state:enter", { id: sid, state: this.plan.states[sid] });
  }
}
