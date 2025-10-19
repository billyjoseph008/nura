import type { NAction, NActionCatalog, NActionSpec, NResult } from './types'

type ActionHandler = (payload?: any) => Promise<NResult> | NResult

type HandlerRecord = Record<string, ActionHandler>

function isRecord(value: unknown): value is HandlerRecord {
  return typeof value === 'object' && value !== null
}

export function createActionCatalog(
  initial?: HandlerRecord,
  specs?: NActionSpec[],
): NActionCatalog {
  const handlers = new Map<string, ActionHandler>()
  const _specs: NActionSpec[] = Array.isArray(specs) ? [...specs] : []

  if (isRecord(initial)) {
    for (const [k, fn] of Object.entries(initial)) {
      if (typeof fn === 'function') {
        handlers.set(k, fn)
      }
    }
  }

  function keyFor(a: NAction) {
    return `${'type' in a ? a.type : a.verb}::${'target' in a ? a.target ?? '' : a.scope ?? ''}`
  }

  return {
    async dispatch(action: NAction) {
      const k = keyFor(action)
      const fn = handlers.get(k) ?? handlers.get('type' in action ? action.type : action.verb)
      if (!fn) return { ok: false, message: `No handler for ${k}` }
      return await fn('payload' in action ? action.payload : action.metadata)
    },
    listSpecs() {
      return [..._specs]
    },
    register(spec: NActionSpec) {
      _specs.push(spec)
    },
  }
}

export function defineActionSpec(spec: NActionSpec): NActionSpec {
  return spec
}
