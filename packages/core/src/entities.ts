import type { NLocale } from './i18n'
import type { NI18n } from './i18n'
import type { NLexicon } from './lexicon'

export type ParseCtx = { locale: NLocale; i18n: NI18n; lexicon: NLexicon }

const BOOL_TRUE_ES = [
  'sí',
  'si',
  'verdadero',
  'true',
  'on',
  'activo',
  'habilitar',
  'habilitado',
]
const BOOL_FALSE_ES = [
  'no',
  'falso',
  'false',
  'off',
  'inactivo',
  'deshabilitar',
  'deshabilitado',
]
const BOOL_TRUE_EN = ['yes', 'true', 'on', 'enable', 'enabled']
const BOOL_FALSE_EN = ['no', 'false', 'off', 'disable', 'disabled']

export function parseBoolean(raw: string, ctx: ParseCtx): boolean | undefined {
  const t = raw.trim().toLowerCase()
  const short = ctx.locale.split('-')[0]
  if (short === 'es') {
    if (BOOL_TRUE_ES.includes(t)) return true
    if (BOOL_FALSE_ES.includes(t)) return false
  } else {
    if (BOOL_TRUE_EN.includes(t)) return true
    if (BOOL_FALSE_EN.includes(t)) return false
  }
  return undefined
}

export function parseNumber(raw: string): number | undefined {
  const normalized = raw.replace(/\s+/g, '').replace(/,/g, '.')
  const m = normalized.replace(/[^\d.-]/g, '')
  const n = Number(m)
  return Number.isFinite(n) ? n : undefined
}

export function parseRangeNumber(raw: string): { min: number; max: number } | undefined {
  const cleaned = raw.toLowerCase().trim()
  const hy = cleaned.match(/(-|–|—)/)
  if (hy) {
    const parts = cleaned.split(/-|–|—/).map((s) => parseNumber(s.trim()))
    if (parts[0] != null && parts[1] != null) return { min: parts[0]!, max: parts[1]! }
  }
  const m1 = cleaned.match(/entre\s+(\d+(?:[\.,]\d+)?)\s+y\s+(\d+(?:[\.,]\d+)?)/)
  const m2 = cleaned.match(/de\s+(\d+(?:[\.,]\d+)?)\s+a\s+(\d+(?:[\.,]\d+)?)/)
  const pick = m1 ?? m2
  if (pick) {
    const a = parseNumber(pick[1]!)
    const b = parseNumber(pick[2]!)
    if (a != null && b != null) return { min: a!, max: b! }
  }
  return undefined
}

export function parseDate(raw: string, ctx: ParseCtx): Date | undefined {
  const t = raw.trim().toLowerCase()
  const now = new Date()
  const short = ctx.locale.split('-')[0]

  const iso = t.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (iso) {
    const d = new Date(`${iso[1]}-${iso[2]}-${iso[3]}T00:00:00`)
    return isNaN(d.getTime()) ? undefined : d
  }

  if (short === 'es') {
    if (t === 'hoy') return new Date(now.getFullYear(), now.getMonth(), now.getDate())
    if (t === 'mañana' || t === 'manana') {
      const d = new Date(now)
      d.setDate(d.getDate() + 1)
      return new Date(d.getFullYear(), d.getMonth(), d.getDate())
    }
    if (t === 'ayer') {
      const d = new Date(now)
      d.setDate(d.getDate() - 1)
      return new Date(d.getFullYear(), d.getMonth(), d.getDate())
    }
  } else {
    if (t === 'today') return new Date(now.getFullYear(), now.getMonth(), now.getDate())
    if (t === 'tomorrow') {
      const d = new Date(now)
      d.setDate(d.getDate() + 1)
      return new Date(d.getFullYear(), d.getMonth(), d.getDate())
    }
    if (t === 'yesterday') {
      const d = new Date(now)
      d.setDate(d.getDate() - 1)
      return new Date(d.getFullYear(), d.getMonth(), d.getDate())
    }
  }
  return undefined
}

export function defaultFormat(val: unknown): string {
  if (val == null) return ''
  if (val instanceof Date) return val.toISOString().slice(0, 10)
  if (typeof val === 'object') return JSON.stringify(val)
  return String(val)
}
