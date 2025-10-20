import type { NLocale } from './types'

export type NCanonical = string

export interface NSense {
  canonical: NCanonical
  weight?: number
}

export interface NLexicon {
  entries: Record<NLocale, Record<string, NSense>>
  register(locale: NLocale, term: string, sense: NSense): void
  normalize(locale: NLocale, term: string): NCanonical | undefined
  bulk(locale: NLocale, batch: Record<string, NCanonical>): void
}

export function createLexicon(telemetry?: { emit?: Function }): NLexicon {
  const entries: Record<NLocale, Record<string, NSense>> = {}
  return {
    entries,
    register(locale, term, sense) {
      const lower = term.toLowerCase()
      const l = (entries[locale] ??= {})
      l[lower] = { canonical: sense.canonical, weight: sense.weight ?? 1 }
      telemetry?.emit?.('lexicon.register', {
        locale,
        term: lower,
        canonical: sense.canonical,
      })
    },
    bulk(locale, batch) {
      const l = (entries[locale] ??= {})
      for (const [k, v] of Object.entries(batch)) {
        const lower = k.toLowerCase()
        l[lower] = { canonical: v, weight: 1 }
        telemetry?.emit?.('lexicon.bulk', {
          locale,
          term: lower,
          canonical: v,
        })
      }
    },
    normalize(locale, term) {
      const lower = term.toLowerCase().trim()
      const pack = entries[locale] ?? {}
      if (pack[lower]) {
        const result = pack[lower].canonical
        telemetry?.emit?.('lexicon.normalize', {
          locale,
          term: lower,
          result,
        })
        return result
      }
      const short = locale.split('-')[0]
      const base = entries[short] ?? {}
      const result = base[lower]?.canonical
      telemetry?.emit?.('lexicon.normalize', {
        locale,
        term: lower,
        result: result ?? null,
      })
      return result
    },
  }
}
