import type {
  NRegistry,
  NAction,
  NResult,
  NActor,
  NPermissionRule,
} from './types'
import { decidePolicy, hasRole, pickRule } from './permissions'

export class Nura {
  #registry: NRegistry
  #started = false

  constructor(opts: { registry: NRegistry }) {
    this.#registry = opts.registry
  }

  start(): void {
    if (this.#started) return

    this.#started = true
    document.dispatchEvent(new CustomEvent('nura:started'))
  }

  async act(action: NAction): Promise<NResult> {
    const { config, permissions, actions } = this.#registry
    const actor: NActor | undefined = config.actor?.()
    const scope = resolveScope(action, config)

    const actionType = getActionType(action)
    const rule = pickRule(permissions, scope, actionType)

    let allowed = true
    let reason: string | undefined

    if (rule) {
      if (!hasRole(rule, actor)) {
        allowed = false
        reason = 'forbidden:role'
      } else {
        const policy = decidePolicy(rule)
        if (policy === 'deny') {
          allowed = false
          reason = 'forbidden:policy'
        } else if (policy === 'confirm') {
          const confirmFn = config.confirm ?? defaultConfirm
          const ok = await Promise.resolve(confirmFn({ action, scope, rule }))
          if (!ok) {
            allowed = false
            reason = 'cancelled:confirm'
          }
        }
      }
    }

    if (!allowed) {
      this.#registry.audit?.log?.({
        action,
        actor,
        scope,
        allowed,
        reason,
        timestamp: Date.now(),
      })
      return { ok: false, message: reason ?? 'forbidden' }
    }

    const res = await actions.dispatch(action)

    this.#registry.audit?.log?.({
      action,
      actor,
      scope,
      allowed: true,
      timestamp: Date.now(),
    })

    return res
  }
}

export * from './types'
export { createRegistry } from './create-registry'
export { createActionCatalog, defineActionSpec } from './actions'
export { createI18n } from './i18n'
export { createLexicon } from './lexicon'
export type {
  NI18n,
  NI18nConfig,
  NLocale,
  NNamespaces,
  NMessages,
  NBundle,
} from './i18n'
export type { NLexicon, NCanonical, NSense } from './lexicon'
export { seedLexicon } from './seeds/lexicon'

function resolveScope(action: NAction, config: NRegistry['config']): string | undefined {
  const resolved = config.resolveScope?.(action)
  if (resolved) return resolved
  if ('scope' in action) return action.scope
  return undefined
}

function getActionType(action: NAction): string | undefined {
  if ('type' in action) return action.type
  if ('verb' in action) return action.verb
  return undefined
}

function defaultConfirm(_: {
  action: NAction
  scope?: string
  rule?: NPermissionRule
}): boolean {
  if (typeof window !== 'undefined' && typeof window.confirm === 'function') {
    return window.confirm('¿Confirmar acción?')
  }
  return true
}
