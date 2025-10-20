import type { NAgent, NContext, NAction, NActionSpec, NEntityDef } from '@nura/core'
import { parseBoolean, parseNumber, parseDate, parseRangeNumber } from '@nura/core/entities'
import type { NI18n, NLocale } from '@nura/core/i18n'
import type { NLexicon } from '@nura/core/lexicon'
import { similarity } from './fuzzy'

// ---- Tipos auxiliares ----
type SpeechRecognitionResultAlternative = { transcript?: string }
type SpeechRecognitionResult = ArrayLike<SpeechRecognitionResultAlternative>
type NuraSpeechRecognitionEvent = {
  results?: ArrayLike<SpeechRecognitionResult>
}

type NuraSpeechRecognition = {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  onresult: ((event: NuraSpeechRecognitionEvent) => void) | null
  onerror: ((event: unknown) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

type SpeechRecognitionConstructor = new () => NuraSpeechRecognition

// ---- Tipos ----
export type NIntent = {
  name: string
  // patrón de coincidencia: RegExp o función (texto -> NAction | null)
  match: RegExp | ((utterance: string) => NAction | null)
  // si match es RegExp, toAction convierte el resultado al NAction
  toAction?: (m: RegExpMatchArray) => NAction | null
  locale?: string // ej: 'es-CR'
  /** frase original usada para derivar el intent */
  phrase?: string
  /** frase normalizada usada para ranking */
  normalizedPhrase?: string
  /** entidades asociadas al intent (si provienen de un spec) */
  entities?: NActionSpec['entities']
}

export type NVoiceOptions = {
  wakeWords?: string[] // ej: ['ok nura','hey nura']
  intents?: NIntent[] // intents declarativos
  language?: string // Web Speech API lang, ej 'es-CR'
  keyWake?: string // fallback teclado (ej: 'F2')
  autoStart?: boolean // arranca de una vez
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')
}

function getWindow(): (Window & typeof globalThis & {
  SpeechRecognition?: SpeechRecognitionConstructor
  webkitSpeechRecognition?: SpeechRecognitionConstructor
}) | undefined {
  if (typeof window === 'undefined') return undefined
  return window as typeof window & {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
}

function slotPattern(ent: NEntityDef): RegExp {
  if (ent.pattern) return ent.pattern
  switch (ent.type) {
    case 'number':
      return /(\d+(?:[.,]\d+)?)/
    case 'boolean':
      return /([a-zA-Záéíóúñ]+)/
    case 'enum':
      return /([a-zA-Z0-9_\-áéíóúñ]+)/
    case 'date':
      return /([\wáéíóúñ\-]+)/
    case 'range_number':
      return /([\w\s\-\–\—]+)/
    case 'string':
    default:
      return /(.+?)/
  }
}

function parseByType(
  raw: string,
  ent: NEntityDef,
  ctx: { locale: NLocale; i18n: NI18n; lexicon: NLexicon },
): unknown {
  if (ent.parse) return ent.parse(raw, ctx)
  switch (ent.type) {
    case 'string':
      return raw.trim()
    case 'number':
      return parseNumber(raw)
    case 'enum': {
      const v = raw.trim().toLowerCase()
      if (!ent.options || ent.options.length === 0) return v
      const ok = ent.options.map((option: string) => option.toLowerCase())
      return ok.includes(v) ? v : undefined
    }
    case 'boolean':
      return parseBoolean(raw, ctx)
    case 'date':
      return parseDate(raw, ctx)
    case 'range_number':
      return parseRangeNumber(raw)
    default:
      return raw
  }
}

function getActiveLocale(ctx: NContext, explicit?: NLocale): NLocale {
  return explicit ?? ctx.registry.i18n.getLocale()
}

function stripDiacritics(input: string): string {
  return input.normalize('NFD').replace(/\p{Diacritic}/gu, '')
}

function normalizeUtterance(
  ctx: NContext,
  text: string,
  localeOverride?: NLocale,
): string {
  const locale = localeOverride ?? ctx.registry.i18n.getLocale()
  const tokens = text
    .trim()
    .split(/\s+/g)
    .filter((part) => part.length > 0)
  if (tokens.length === 0) return ''
  return tokens
    .map((tok) => {
      const canonical = ctx.registry.lexicon.normalize(locale, tok) ?? tok
      return stripDiacritics(canonical.toLowerCase())
    })
    .join(' ')
}

function tokensForWeight(text: string): string[] {
  return text
    .trim()
    .split(/\s+/)
    .filter((part) => part.length > 0)
}

function patternForIntent(intent: NIntent): string {
  if (intent.normalizedPhrase) return intent.normalizedPhrase
  if (typeof intent.match === 'function') return intent.phrase ?? ''
  return intent.match.source.replace(/[\\^$]/g, '').toLowerCase()
}

function ensureGlobal(pattern: RegExp): RegExp {
  const baseFlags = pattern.flags.includes('g') ? pattern.flags : pattern.flags + 'g'
  return new RegExp(pattern.source, baseFlags)
}

function buildSyntheticMatch(
  normalized: string,
  original: string,
  intent: NIntent,
): RegExpMatchArray | null {
  if (!intent.entities || intent.entities.length === 0) return null
  const collected: string[] = []
  let cursorNormalized = 0
  let cursorOriginal = 0

  for (const entity of intent.entities) {
    const basePattern = slotPattern(entity)
    const normalizedPattern = ensureGlobal(basePattern)
    normalizedPattern.lastIndex = cursorNormalized
    let match = normalizedPattern.exec(normalized)
    if (match) {
      cursorNormalized = normalizedPattern.lastIndex
      collected.push(match[1] ?? match[0] ?? '')
      continue
    }

    const originalPattern = ensureGlobal(basePattern)
    originalPattern.lastIndex = cursorOriginal
    match = originalPattern.exec(original)
    if (!match) return null
    cursorOriginal = originalPattern.lastIndex
    collected.push(match[1] ?? match[0] ?? '')
  }

  const synthetic = [normalized, ...collected] as unknown as RegExpMatchArray
  ;(synthetic as any).index = 0
  ;(synthetic as any).input = original
  ;(synthetic as any).groups = undefined
  return synthetic
}

/** Detección simple de idioma por heurística */
export function detectLocale(text: string, candidates: NLocale[]): NLocale {
  const lower = text.toLowerCase()

  const score: Record<NLocale, number> = {}
  const uniqueCandidates = Array.from(new Set(candidates))
  for (const loc of uniqueCandidates) score[loc] = 0

  const esHints = ['el', 'la', 'los', 'las', 'un', 'una', 'de', 'que', 'por', 'con', 'sí', 'no']
  const enHints = ['the', 'of', 'for', 'to', 'in', 'yes', 'no', 'open', 'delete']

  for (const tok of lower.split(/\s+/)) {
    if (esHints.includes(tok)) score['es' as NLocale] = (score['es' as NLocale] ?? 0) + 1
    if (enHints.includes(tok)) score['en' as NLocale] = (score['en' as NLocale] ?? 0) + 1
    if (/[ñáéíóú]/.test(tok)) score['es' as NLocale] = (score['es' as NLocale] ?? 0) + 2
    if (/[a-z]/.test(tok) && !/[ñáéíóú]/.test(tok)) score['en' as NLocale] = (score['en' as NLocale] ?? 0) + 1
  }

  const best = Object.entries(score).sort((a, b) => b[1] - a[1])[0]
  return best && best[1] > 0 ? (best[0] as NLocale) : uniqueCandidates[0]
}

/** Matching inteligente con fuzzy + ranking */
export function matchUtterance(
  ctx: NContext,
  text: string,
  intents: NIntent[],
  opts?: { fuzzy?: boolean; threshold?: number },
): NAction | undefined {
  const original = text.trim()
  if (!original) return undefined
  const { fuzzy = true, threshold = 0.82 } = opts ?? {}
  const locale = ctx.registry.i18n.getLocale()
  const normalized = normalizeUtterance(ctx, original, locale)
  const normText = normalized.toLowerCase()

  const baseTokens = tokensForWeight(original.toLowerCase())
  const synonymsWeight = baseTokens.reduce((acc, token) => {
    const canon = ctx.registry.lexicon.normalize(locale, token)
    return acc + (canon && canon !== token ? 0.05 : 0)
  }, 0)

  const scored: Array<{
    intent: NIntent
    score: number
    match?: RegExpMatchArray
    via: 'exact' | 'fuzzy'
  }> = []

  for (const intent of intents) {
    if (typeof intent.match === 'function') {
      const actionNormalized = intent.match(normalized)
      if (actionNormalized) {
        ctx.registry.telemetry.emit('voice.intent.candidates', {
          textOriginal: text,
          normText: normalized,
          locale,
          candidates: [
            {
              name: intent.name,
              score: 1,
            },
          ],
        })
        return actionNormalized
      }
      if (normalized !== original) {
        const fallback = intent.match(original)
        if (fallback) {
          ctx.registry.telemetry.emit('voice.intent.candidates', {
            textOriginal: text,
            normText: normalized,
            locale,
            candidates: [
              {
                name: intent.name,
                score: 1,
              },
            ],
          })
          return fallback
        }
      }
      continue
    }

    const rx = intent.match
    const normalizedMatch = normalized.match(rx)
    if (normalizedMatch) {
      scored.push({ intent, score: 1, match: normalizedMatch, via: 'exact' })
      continue
    }

    if (normalized !== original) {
      const originalMatch = original.match(rx)
      if (originalMatch) {
        scored.push({ intent, score: 1, match: originalMatch, via: 'exact' })
        continue
      }
    }

    if (!fuzzy) continue

    const patternText = patternForIntent(intent)
    if (!patternText) continue
    const sim = similarity(normText, patternText)
    if (sim >= threshold * 0.8) {
      const score = Math.min(1, sim + synonymsWeight)
      scored.push({ intent, score, via: 'fuzzy' })
    }
  }

  scored.sort((a, b) => b.score - a.score)
  ctx.registry.telemetry.emit('voice.intent.candidates', {
    textOriginal: text,
    normText: normalized,
    locale,
    candidates: scored.map((s) => ({
      name: s.intent.name,
      score: s.score,
    })),
  })

  const best = scored[0]
  if (!best) return undefined

  let finalAction: NAction | null | undefined
  if (best.match && best.intent.toAction) {
    finalAction = best.intent.toAction(best.match)
  } else if (best.intent.toAction && typeof best.intent.match !== 'function') {
    const retryNormalized = normalized.match(best.intent.match)
    if (retryNormalized) {
      finalAction = best.intent.toAction(retryNormalized)
    } else {
      const retryOriginal = original.match(best.intent.match)
      if (retryOriginal) {
        finalAction = best.intent.toAction(retryOriginal)
      } else {
        const synthetic = buildSyntheticMatch(normalized, original, best.intent)
        if (synthetic) {
          finalAction = best.intent.toAction(synthetic)
        }
      }
    }
  }

  if (finalAction && best.score >= threshold) {
    return finalAction
  }

  return undefined
}

function phraseToRegExp(phrase: string, entities?: NEntityDef[]) {
  const trimmed = phrase.trim()
  if (!entities || entities.length === 0) {
    const simple = '^' + escapeRegex(trimmed) + '$'
    return new RegExp(simple, 'i')
  }

  const placeholder = /\{([^}]+)\}/g
  let lastIndex = 0
  let pattern = '^'
  let match: RegExpExecArray | null
  while ((match = placeholder.exec(trimmed)) !== null) {
    const before = trimmed.slice(lastIndex, match.index)
    pattern += escapeRegex(before)
    const name = match[1]
    const entity = entities.find((ent) => ent.name === name)
    const slot = entity ? slotPattern(entity) : /(.+?)/
    pattern += slot.source
    lastIndex = placeholder.lastIndex
  }
  pattern += escapeRegex(trimmed.slice(lastIndex))
  pattern += '$'

  return new RegExp(pattern, 'i')
}

export function deriveIntentsFromSpecs(
  specs: NActionSpec[],
  ctx: NContext,
  locale: NLocale,
): NIntent[] {
  const intents: NIntent[] = []
  for (const spec of specs) {
    const pack =
      spec.phrases[locale] ??
      (spec.locale ? spec.phrases[spec.locale] : undefined) ??
      Object.values(spec.phrases)[0]
    if (!pack) continue

    const phrases = [...(pack.canonical ?? []), ...(pack.synonyms ?? [])]
    for (const phrase of phrases) {
      const normalized = normalizeUtterance(ctx, phrase, locale)
      const normalizedForSimilarity = normalized
        .replace(/\{[^}]+\}/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
      const rx = phraseToRegExp(normalized, spec.entities)
      intents.push({
        name: `${spec.name}:${phrase}`,
        match: rx,
        phrase,
        normalizedPhrase: normalizedForSimilarity || normalized,
        entities: spec.entities,
        toAction: (m) => {
          const payload: Record<string, unknown> = {}
          const locale = ctx.registry.i18n.getLocale()
          const parseCtx = {
            locale,
            i18n: ctx.registry.i18n,
            lexicon: ctx.registry.lexicon,
          }
          if (spec.entities && spec.entities.length) {
            let groupIdx = 1
            for (const ent of spec.entities) {
              const raw = m[groupIdx++]
              if (raw === undefined) continue
              const value = parseByType(String(raw), ent, parseCtx)
              payload[ent.name] = value
            }
          }

          const finalPayload = Object.keys(payload).length ? payload : undefined

          if (spec.validate) {
            const valid = spec.validate(finalPayload)
            if (!valid) return null
          }

          return {
            type: spec.type,
            target: spec.target,
            payload: finalPayload,
            meta: { desc: phrase },
          }
        },
      })
    }
  }
  return intents
}

function getSpecsFromCtx(ctx: NContext): NActionSpec[] {
  try {
    return ctx.registry.actions.listSpecs()
  } catch {
    return []
  }
}

// ---- Agente de voz ----
export function voiceAgent(opts: NVoiceOptions = {}): NAgent {
  const wake = new Set((opts.wakeWords ?? []).map((w) => w.toLowerCase()))
  const explicitLocale = opts.language as NLocale | undefined
  const key = opts.keyWake ?? 'F2'

  // Web Speech API (si disponible)
  function createRecognizer(ctx: NContext) {
    const anyWin = getWindow()
    if (!anyWin) return null
    const SR = anyWin.SpeechRecognition || anyWin.webkitSpeechRecognition
    if (!SR) return null
    const rec = new SR()
    rec.lang = getActiveLocale(ctx, explicitLocale)
    rec.continuous = false
    rec.interimResults = false
    rec.maxAlternatives = 1
    rec.onresult = (ev: NuraSpeechRecognitionEvent) => {
      const t = ev.results?.[0]?.[0]?.transcript ?? ''
      handleTranscript(t, ctx)
    }
    rec.onerror = () => {
      /* opcional: log/reintentos */
    }
    rec.onend = () => {
      /* esperar nueva activación */
    }
    return rec
  }

  function hasWakeWord(u: string) {
    if (wake.size === 0) return true
    const norm = u.toLowerCase()
    for (const w of wake) if (norm.includes(w)) return true
    return false
  }

  function stripWake(u: string) {
    if (wake.size === 0) return u
    let out = u
    for (const w of wake) {
      const r = new RegExp(escapeRegex(w), 'ig')
      out = out.replace(r, '').trim()
    }
    return out
  }

  function handleTranscript(text: string, ctx: NContext) {
    const tel = ctx.registry.telemetry
    tel.emit('voice.input', { textOriginal: text })

    if (!hasWakeWord(text)) return
    const content = stripWake(text)
    if (!content.trim()) return

    const activeLocale = getActiveLocale(ctx, explicitLocale)
    const langCandidates: NLocale[] = []
    langCandidates.push(activeLocale)
    const base = activeLocale.split('-')[0] as NLocale
    if (!langCandidates.includes(base)) langCandidates.push(base)
    for (const fallback of ['es', 'en'] as const) {
      if (!langCandidates.includes(fallback)) langCandidates.push(fallback)
    }

    const detected = detectLocale(content, langCandidates)
    tel.emit('voice.locale.detected', { detected, candidates: langCandidates })
    ctx.registry.i18n.setLocale(detected)

    const specs = getSpecsFromCtx(ctx)
    const derived = deriveIntentsFromSpecs(specs, ctx, detected)
    tel.emit('voice.intents.derived', { count: derived.length, locale: detected })
    const intents = [...(opts.intents ?? []), ...derived]

    const action = matchUtterance(ctx, content, intents, { fuzzy: true, threshold: 0.82 })
    if (action) {
      tel.emit('voice.intent.selected', {
        action,
        locale: detected,
        textOriginal: content,
      })
      void ctx.act(action)
    } else {
      tel.emit('voice.intent.rejected', {
        textOriginal: content,
        locale: detected,
        reason: 'below_threshold_or_no_match',
      })
    }
  }

  let rec: NuraSpeechRecognition | null = null

  return {
    id: 'voice',
    kind: 'voice',
    start(ctx: NContext) {
      const win = getWindow()
      if (!win) return

      rec = createRecognizer(ctx)

      win.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === key) {
          const promptResult = win.prompt?.('[Nura voice] Di algo… (dev mock)') ?? ''
          if (promptResult) handleTranscript(promptResult, ctx)
        }
      })

      if (opts.autoStart && rec) {
        try {
          rec.start()
        } catch {
          // ignorar errores de arranque
        }
      }

      // botón global de escucha (opcional): puedes añadirlo desde devtools
    },
    stop() {
      try {
        rec?.stop()
      } catch {
        // ignorar errores al detener
      }
      rec = null
    }
  }
}
