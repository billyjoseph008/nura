# Recetas

Ejemplos prácticos para construir interfaces compatibles con IA usando Nura.js.

## Comando con slots

```ts
import { defineCommand } from '@nura/core'

export const checkout = defineCommand({
  id: 'checkout',
  description: 'Completar el carrito activo',
  slots: {
    paymentMethod: {
      type: 'enum',
      values: ['card', 'wallet', 'cash'],
    },
    shippingSpeed: {
      type: 'enum',
      values: ['standard', 'express'],
      optional: true,
    },
  },
  run: async ({ slots, context }) => {
    await context.api.checkout({
      paymentMethod: slots.paymentMethod,
      shippingSpeed: slots.shippingSpeed ?? 'standard',
    })
    return { status: 'success' }
  },
})
```

## Sinónimos e internacionalización

```ts
import { defineLexicon } from '@nura/core'

export const lexicon = defineLexicon({
  intents: {
    'cart.view': {
      utterances: {
        en: ['open cart', 'show basket'],
        es: ['abrir carrito', 'mostrar cesta'],
      },
    },
  },
})
```

## Validar entradas del agente

```ts
import { useNuraCommand } from '@nura/react'

export function ScheduleMeetingButton() {
  useNuraCommand('meeting.schedule', {
    validate: ({ slots }) => {
      if (!slots.time) {
        return { valid: false, reason: 'time slot required' }
      }
      return { valid: true }
    },
    run: async ({ slots, context }) => {
      await context.calendar.book(slots.time as string)
      return { status: 'scheduled' }
    },
  })

  return (
    <button data-nura-command="meeting.schedule">
      Agendar reunión
    </button>
  )
}
```

## Interacción por voz

```ts
import { createVoiceAgent } from '@nura/plugin-voice'
import { registry } from './registry'

const voiceAgent = createVoiceAgent({ registry })

voiceAgent.listen()
```

- Conecta el agente de voz con APIs de voz del navegador o bridges nativos.
- Usa sinónimos en el léxico para mejorar la precisión del reconocimiento.

## Depuración con devtools

```ts
import { mountLexiconOverlay } from '@nura/devtools-lexicon'
import { registry } from './registry'

mountLexiconOverlay({ registry })
```

La superposición resalta elementos anotados, comandos sin resolver y cobertura de slots por locale.
