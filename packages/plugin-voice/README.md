# @nura/plugin-voice

> Agente de voz para Nura.js con detección de wake-word, coincidencia difusa y anotación de intents.

## Instalación

```bash
npm i @nura/plugin-voice
# o
pnpm add @nura/plugin-voice
```

## Uso mínimo

```ts
import { createRegistry, defineActionSpec } from '@nura/core'
import { voiceAgent } from '@nura/plugin-voice'

const registry = createRegistry({
  actions: [
    defineActionSpec({
      name: 'open_orders',
      type: 'open',
      target: 'orders',
      phrases: {
        'es-CR': { canonical: ['abre órdenes'], wake: ['hey nura'] },
      },
    }),
  ],
  agents: [voiceAgent({ wakeWords: ['hey nura'] })],
})

registry.agents.start('voice', {
  locale: 'es-CR',
  intents: registry.actions.intents(),
})
```

## APIs principales

* `voiceAgent` — Registra reconocimiento de voz y coordina intents para un `NRegistry`.
* `matchUtterance` — Pipeline para puntuar intents según tokens, entidades y wake word.
* `detectLocale` — Heurística simple para detectar locale a partir de la frase (re-exporta `@nura/core`).
* `stripWake` — Normalizador de wake-word que limpia frases (re-exportado desde el core).
* `compareWakeWord` — Comparador difuso de wake-word expuesto para integraciones personalizadas.

## Tipos

* `NVoiceOptions` — Configuración del agente (wake words, umbrales, modo dev).
* `WakeWordInput` — Entrada normalizada para comparar wake words.
* `NIntent` — Intent derivado del registro listo para reconocimiento.
* `IntentMatchResult` — Resultado detallado de `matchUtterance` con puntuaciones y tokens.

## Enlaces

* Repo: [https://github.com/nura-dev/nura](https://github.com/nura-dev/nura)
* Issues: [https://github.com/nura-dev/nura/issues](https://github.com/nura-dev/nura/issues)
