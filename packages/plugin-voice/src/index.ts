import type { NAgent, NContext, NAction } from '@nura/core'

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
  toAction?: (m: RegExpMatchArray) => NAction
  locale?: string // ej: 'es-CR'
}

export type NVoiceOptions = {
  wakeWords?: string[] // ej: ['ok nura','hey nura']
  intents?: NIntent[] // intents declarativos
  deriveFromCatalog?: () => NAction[] // opcional: genera acciones base
  language?: string // Web Speech API lang, ej 'es-CR'
  keyWake?: string // fallback teclado (ej: 'F2')
  autoStart?: boolean // arranca de una vez
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')
}

function isModernAction(action: NAction): action is Extract<NAction, { type: string }> {
  return typeof (action as { type?: unknown }).type === 'string'
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

// ---- Agente de voz ----
export function voiceAgent(opts: NVoiceOptions = {}): NAgent {
  const wake = new Set((opts.wakeWords ?? []).map((w) => w.toLowerCase()))
  const lang = opts.language ?? 'es-ES'
  const key = opts.keyWake ?? 'F2'

  // derivación simple de gramática desde catálogo (si se provee)
  // se limita a generar frases "open <target>", "delete <target>" como demo
  function deriveIntentsFromCatalog(): NIntent[] {
    if (!opts.deriveFromCatalog) return []
    const acts = opts.deriveFromCatalog() || []
    const intents: NIntent[] = []
    for (const a of acts) {
      // ejemplo básico para open/delete
      if (isModernAction(a) && a.type === 'open' && a.target) {
        const label = a.target.replace(/[:]/g, ' ') // "menu:orders" -> "menu orders"
        intents.push({
          name: `open_${a.target}`,
          match: new RegExp(`^(abre|abrir)\\s+(el\\s+)?${escapeRegex(label)}$`, 'i'),
          toAction: () => ({ type: 'open', target: a.target, meta: a.meta })
        })
      }
      if (isModernAction(a) && a.type === 'delete' && a.target) {
        const label = a.target.replace(/[:]/g, ' ')
        intents.push({
          name: `delete_${a.target}`,
          match: new RegExp(
            `^(elimina|borrar)\\s+(el\\s+)?${escapeRegex(label)}(\\s+(\\d+))?$`,
            'i'
          ),
          toAction: (m) => ({
            type: 'delete',
            target: a.target,
            payload: m[4] ? { id: Number(m[4]) } : undefined,
            meta: a.meta
          })
        })
      }
    }
    return intents
  }

  // motor de coincidencia
  function resolveUtterance(text: string, intents: NIntent[]): NAction | null {
    const t = text.trim()
    for (const it of intents) {
      if (typeof it.match === 'function') {
        const a = it.match(t)
        if (a) return a
      } else {
        const m = t.match(it.match)
        if (m) return it.toAction ? it.toAction(m) : null
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
    const derived = deriveIntentsFromCatalog()
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
