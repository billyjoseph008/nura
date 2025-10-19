import type { NAgent, NContext, NAction, NActionSpec } from '@nura/core'

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

function slotPattern(type: 'number' | 'string', custom?: RegExp) {
  if (custom) return custom
  return type === 'number' ? /([0-9]+)/ : /(.+)/
}

function phraseToRegExp(phrase: string, entities?: NActionSpec['entities']) {
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
    const re = slotPattern(entity?.type ?? 'string', entity?.pattern)
    pattern += re.source
    lastIndex = placeholder.lastIndex
  }
  pattern += escapeRegex(trimmed.slice(lastIndex))
  pattern += '$'

  return new RegExp(pattern, 'i')
}

function deriveIntentsFromSpecs(specs: NActionSpec[], locale: string): NIntent[] {
  const intents: NIntent[] = []
  for (const spec of specs) {
    const pack =
      spec.phrases[locale] ??
      (spec.locale ? spec.phrases[spec.locale] : undefined) ??
      Object.values(spec.phrases)[0]
    if (!pack) continue

    const phrases = [...(pack.canonical ?? []), ...(pack.synonyms ?? [])]
    for (const phrase of phrases) {
      const rx = phraseToRegExp(phrase, spec.entities)
      intents.push({
        name: `${spec.name}:${phrase}`,
        match: rx,
        toAction: (m) => {
          const payload: Record<string, unknown> = {}
          if (spec.entities && spec.entities.length) {
            let groupIdx = 1
            for (const ent of spec.entities) {
              const raw = m[groupIdx++]
              if (raw === undefined) continue
              payload[ent.name] = ent.type === 'number' ? Number(raw) : raw
            }
          }

          if (spec.validate) {
            const valid = spec.validate(Object.keys(payload).length ? payload : undefined)
            if (!valid) return null
          }

          const finalPayload = Object.keys(payload).length ? payload : undefined

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
  const lang = opts.language ?? 'es-ES'
  const key = opts.keyWake ?? 'F2'

  // motor de coincidencia
  function resolveUtterance(text: string, intents: NIntent[]): NAction | null {
    const t = text.trim()
    for (const it of intents) {
      if (typeof it.match === 'function') {
        const a = it.match(t)
        if (a) return a
      } else {
        const m = t.match(it.match)
        if (m) {
          if (!it.toAction) continue
          const act = it.toAction(m)
          if (act) return act
        }
      }
    }
    return null
  }

  // Web Speech API (si disponible)
  function createRecognizer(ctx: NContext) {
    const anyWin = getWindow()
    if (!anyWin) return null
    const SR = anyWin.SpeechRecognition || anyWin.webkitSpeechRecognition
    if (!SR) return null
    const rec = new SR()
    rec.lang = lang
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
    const specs = getSpecsFromCtx(ctx)
    const derived = deriveIntentsFromSpecs(specs, lang)
    const intents = [...(opts.intents ?? []), ...derived]
    if (!hasWakeWord(text)) return
    const content = stripWake(text)
    const action = resolveUtterance(content, intents)
    if (action) void ctx.act(action)
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
