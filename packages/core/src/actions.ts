import type {
  ModernNAction,
  NAction,
  NActionCatalog,
  NActionSpec,
  NResult,
} from './types'

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

  function isModernAction(action: NAction): action is ModernNAction {
    return 'type' in action
  }

  function keyFor(action: NAction) {
    if (isModernAction(action)) {
      return `${action.type}::${action.target ?? ''}`
    }
    return `${action.verb}::${action.scope ?? ''}`
  }

  return {
    async dispatch(action: NAction) {
      const k = keyFor(action)
      const fn = handlers.get(k) ?? handlers.get(isModernAction(action) ? action.type : action.verb)
      if (!fn) return { ok: false, message: `No handler for ${k}` }
      const input = isModernAction(action) ? action.payload : action.metadata
      return await fn(input)
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
