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

export function createLexicon(): NLexicon {
  const entries: Record<NLocale, Record<string, NSense>> = {}
  return {
    entries,
    register(locale, term, sense) {
      const l = (entries[locale] ??= {})
      l[term.toLowerCase()] = { canonical: sense.canonical, weight: sense.weight ?? 1 }
    },
    bulk(locale, batch) {
      const l = (entries[locale] ??= {})
      for (const [k, v] of Object.entries(batch)) {
        l[k.toLowerCase()] = { canonical: v, weight: 1 }
      }
    },
    normalize(locale, term) {
      const lower = term.toLowerCase().trim()
      const pack = entries[locale] ?? {}
      if (pack[lower]) return pack[lower].canonical
      const short = locale.split('-')[0]
      const base = entries[short] ?? {}
      return base[lower]?.canonical
    },
  }
}
