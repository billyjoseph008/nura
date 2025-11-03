import type { NIntent, PolicyEngine, NIntentSpec, NIntentStatus } from './types.js';

const DEFAULT_STATUS: NIntentStatus = 'queued';

export class SimplePolicyEngine implements PolicyEngine {
  decide(spec: NIntentSpec, ctx?: NIntent['context']): { status: NIntentStatus; reason?: string } {
    if (spec.policy?.requiresApproval) {
      return { status: 'requires_approval', reason: 'policy.requires_approval' };
    }

    if (spec.policy?.roles && spec.policy.roles.length > 0) {
      const userRoles = Array.isArray(ctx?.roles) ? ctx?.roles : [];
      const isAllowed = spec.policy.roles.some(role => userRoles?.includes(role));
      if (!isAllowed) {
        return { status: 'requires_approval', reason: 'policy.roles_missing' };
      }
    }

    return { status: DEFAULT_STATUS };
  }
}
