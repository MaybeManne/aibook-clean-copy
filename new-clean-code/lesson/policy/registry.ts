// Name → implementation registry for the pure policies, mirroring the discipline
// the engine already requires for guards/actions: a session/lesson config references
// a policy BY NAME, so swapping an "understanding model" or a "what-to-do policy" is
// a config change, not an engine edit. Ships seeded with the batteries-included
// defaults; callers register their own before looking one up.

import type { LearnerModel, TeachingPolicy } from "./contracts.js";
import { defaultLearnerModel } from "./default_learner_model.js";
import { defaultTeachingPolicy } from "./default_teaching_policy.js";

export class PolicyRegistry {
  private readonly learners = new Map<string, LearnerModel>();
  private readonly teachers = new Map<string, TeachingPolicy>();

  /** Register a Perceive policy under its own `name`. Chainable. */
  learnerModel(model: LearnerModel): this {
    this.learners.set(model.name, model);
    return this;
  }
  /** Register a Decide policy under its own `name`. Chainable. */
  teachingPolicy(policy: TeachingPolicy): this {
    this.teachers.set(policy.name, policy);
    return this;
  }

  getLearnerModel(name: string): LearnerModel | undefined {
    return this.learners.get(name);
  }
  getTeachingPolicy(name: string): TeachingPolicy | undefined {
    return this.teachers.get(name);
  }

  learnerModelNames(): string[] {
    return [...this.learners.keys()];
  }
  teachingPolicyNames(): string[] {
    return [...this.teachers.keys()];
  }
}

/** A fresh registry seeded with the built-in defaults (callers may extend it). */
export function defaultPolicyRegistry(): PolicyRegistry {
  return new PolicyRegistry().learnerModel(defaultLearnerModel()).teachingPolicy(defaultTeachingPolicy());
}
