/**
 * `machine/` — watching the statechart run.
 *
 * Imports `lesson`, `state-machine` and `theme`, and deliberately NOT `web/`: the layout and the
 * snapshot are then checkable headlessly, and a second page that mirrors a lesson does not pull the
 * studio renderer in behind it. The only coupling to a running session is `attachMachineMirror`,
 * which is one-way.
 */
export * from "./layout.js";
export * from "./mirror.js";
export * from "./MachineView.js";
export * from "./MachinePage.js";
