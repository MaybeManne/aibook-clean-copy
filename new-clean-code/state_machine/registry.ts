import type { Effect } from "./effects.js";
import type { MachineEvent } from "./types.js";

/** Pure predicate over context + event. MUST be deterministic (no I/O, clocks, random). */
export type Guard<C> = (ctx: C, event: MachineEvent) => boolean;

/** Declares a context patch (shallow-merged) + effects. Does NOT perform I/O. */
export interface ActionResult<C> {
  context?: Partial<C>;
  effects?: Effect[];
}
export type Action<C> = (ctx: C, event: MachineEvent) => ActionResult<C>;

export interface Registry<C> {
  guard(name: string, fn: Guard<C>): this;
  action(name: string, fn: Action<C>): this;
  getGuard(name: string): Guard<C>;
  getAction(name: string): Action<C>;
  hasGuard(name: string): boolean;
  hasAction(name: string): boolean;
  /**
   * A copy holding every CURRENT binding, whose later writes are its own. Bindings are keyed by
   * name, so two runtimes registering the same name into one registry would overwrite each
   * other; forking gives each its own namespace without re-registering the bindings they share.
   */
  fork(): Registry<C>;
}

class RegistryImpl<C> implements Registry<C> {
  private guards = new Map<string, Guard<C>>();
  private actions = new Map<string, Action<C>>();

  guard(name: string, fn: Guard<C>): this {
    this.guards.set(name, fn);
    return this;
  }
  action(name: string, fn: Action<C>): this {
    this.actions.set(name, fn);
    return this;
  }
  getGuard(name: string): Guard<C> {
    const g = this.guards.get(name);
    if (!g) throw new Error(`Unknown guard: "${name}"`);
    return g;
  }
  getAction(name: string): Action<C> {
    const a = this.actions.get(name);
    if (!a) throw new Error(`Unknown action: "${name}"`);
    return a;
  }
  hasGuard(name: string): boolean {
    return this.guards.has(name);
  }
  hasAction(name: string): boolean {
    return this.actions.has(name);
  }
  fork(): Registry<C> {
    const copy = new RegistryImpl<C>();
    copy.guards = new Map(this.guards);
    copy.actions = new Map(this.actions);
    return copy;
  }
}

export function createRegistry<C>(): Registry<C> {
  return new RegistryImpl<C>();
}
