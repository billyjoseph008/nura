export type { ParseCtx } from './entities/types'
export {
  parseBoolean,
  parseEnum,
  parseDate,
  parseRangeNumber,
} from './entities/parsers'

export function parseNumber(raw: string): number | undefined {
  const normalized = raw.replace(/\s+/g, '').replace(/,/g, '.')
  const m = normalized.replace(/[^\d.-]/g, '')
  if (!m || m === '-' || m === '.' || m === '-.' || m === '.-' ) return undefined
  const n = Number(m)
  return Number.isFinite(n) ? n : undefined
}
 
export function defaultFormat(val: unknown): string {
  if (val == null) return ''
  if (val instanceof Date) return val.toISOString().slice(0, 10)
  if (typeof val === 'object') return JSON.stringify(val)
  return String(val)
}
