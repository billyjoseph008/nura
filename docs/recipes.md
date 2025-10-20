# Recipes

Practical examples for building AI-friendly interfaces with Nura.js.

## Command with Slots

```ts
import { defineCommand } from '@nura/core'

export const checkout = defineCommand({
  id: 'checkout',
  description: 'Complete the active shopping cart',
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

## Synonyms & Localization

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

## Validating Agent Input

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
      Schedule meeting
    </button>
  )
}
```

## Voice Interaction

```ts
import { createVoiceAgent } from '@nura/plugin-voice'
import { registry } from './registry'

const voiceAgent = createVoiceAgent({ registry })

voiceAgent.listen()
```

- Tie the voice agent into browser speech APIs or native bridges.
- Use lexicon synonyms to improve recognition accuracy.

## Debugging with Devtools

```ts
import { mountLexiconOverlay } from '@nura/devtools-lexicon'
import { registry } from './registry'

mountLexiconOverlay({ registry })
```

The overlay highlights annotated elements, unresolved commands, and slot coverage across locales.
