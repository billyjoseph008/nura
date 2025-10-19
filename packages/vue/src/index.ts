import type { App, DirectiveBinding, InjectionKey } from 'vue'
import type { LegacyNuraAction, ModernNAction, NAction, Nura } from '@nura/core'

type ImportMetaWithEnv = ImportMeta & { env?: { MODE?: string } }
type NuActElement = HTMLElement & {
  __nuActHandler__?: EventListener
  __nuActValue__?: NAction
  __nuActDescManaged__?: boolean
}

export const NURA_KEY: InjectionKey<Nura> = Symbol('nura')

function ensureA11y(el: HTMLElement) {
  const mode = (import.meta as ImportMetaWithEnv).env?.MODE
  if (mode === 'production') return
  if (!el.hasAttribute('data-nu-act')) return
  const hasAria = el.hasAttribute('aria-label') || el.hasAttribute('aria-labelledby')
  const hasDesc = el.hasAttribute('data-nu-desc')
  if (!hasAria && !hasDesc) {
    console.warn('[nura][a11y] Falta aria-label o data-nu-desc en un elemento con data-nu-act:', el)
  }
}

function isModernAction(action?: NAction): action is ModernNAction {
  return !!action && 'type' in action
}

function isLegacyAction(action?: NAction): action is LegacyNuraAction {
  return !!action && 'verb' in action
}

function getActionDescription(action?: NAction) {
  if (!action) return undefined
  if (isModernAction(action)) return action.meta?.desc
  if (isLegacyAction(action)) return action.description
  return undefined
}

function serializeAction(action: NAction) {
  try {
    const json = JSON.stringify(action)
    return json ?? 'null'
  } catch {
    return 'null'
  }
}

function applyActionState(el: NuActElement, action: NAction | undefined) {
  el.__nuActValue__ = action
  if (!action) {
    el.removeAttribute('data-nu-act')
    if (el.__nuActDescManaged__) {
      el.removeAttribute('data-nu-desc')
      delete el.__nuActDescManaged__
    }
    return
  }
  const serialized = serializeAction(action)
  el.setAttribute('data-nu-act', serialized)
  const desc = getActionDescription(action)
  if (desc) {
    el.setAttribute('data-nu-desc', desc)
    el.__nuActDescManaged__ = true
  } else if (el.__nuActDescManaged__) {
    el.removeAttribute('data-nu-desc')
    delete el.__nuActDescManaged__
  }
  ensureA11y(el)
}

export function withVue(nura: Nura) {
  return {
    install(app: App) {
      app.provide(NURA_KEY, nura)

      app.directive('nu-listen', {
        mounted(el: HTMLElement, binding: DirectiveBinding) {
          // marca de escucha
          el.setAttribute('data-nu-listen', 'dom')
          if (binding.modifiers.soft) el.setAttribute('data-nu-priority', 'soft')
          if (binding.modifiers.deep) el.setAttribute('data-nu-priority', 'hard')
          if (binding.arg === 'scope') el.setAttribute('data-nu-scope', String(binding.value))
        },
        updated() {
          // noop: nada pesado por ahora
        },
        unmounted() {
          // limpieza si fuera necesaria
        }
      })

      app.directive('nu-act', {
        mounted(element: HTMLElement, binding: DirectiveBinding<NAction>) {
          const el = element as NuActElement
          applyActionState(el, binding.value)
          const handler: EventListener = () => {
            const current = el.__nuActValue__
            if (!current) return
            void nura.act(current)
          }
          el.__nuActHandler__ = handler
          element.addEventListener('click', handler, { passive: true })
        },
        updated(element: HTMLElement, binding: DirectiveBinding<NAction>) {
          applyActionState(element as NuActElement, binding.value)
        },
        unmounted(element: HTMLElement) {
          const el = element as NuActElement
          if (el.__nuActHandler__) {
            element.removeEventListener('click', el.__nuActHandler__)
            delete el.__nuActHandler__
          }
          delete el.__nuActValue__
          if (el.__nuActDescManaged__) {
            element.removeAttribute('data-nu-desc')
            delete el.__nuActDescManaged__
          }
        }
      })
    }
  }
}
