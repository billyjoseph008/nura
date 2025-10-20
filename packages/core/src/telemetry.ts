export type NTelemetryEvent = string
export type NTelemetryHandler = (payload: any) => void

export interface NTelemetry {
  on(event: NTelemetryEvent | '*', handler: NTelemetryHandler): void
  off(event: NTelemetryEvent | '*', handler: NTelemetryHandler): void
  emit(event: NTelemetryEvent, payload: any): void
}

export function createTelemetry(): NTelemetry {
  const map = new Map<string, Set<NTelemetryHandler>>()
  function _get(e: string) {
    if (!map.has(e)) map.set(e, new Set())
    return map.get(e)!
  }
  return {
    on(e, h) {
      _get(e).add(h)
    },
    off(e, h) {
      _get(e).delete(h)
    },
    emit(e, p) {
      for (const h of _get(e)) h(p)
      for (const h of _get('*')) h({ event: e, ...p })
    },
  }
}
