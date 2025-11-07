# Nura.js

[![CI](https://github.com/nura-dev/nura/actions/workflows/ci.yml/badge.svg)](https://github.com/nura-dev/nura/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@nura/core.svg?label=%40nura%2Fcore)](https://www.npmjs.com/package/@nura/core)
[![npm](https://img.shields.io/npm/v/@nurajs/intents.svg?label=%40nurajs%2Fintents)](https://www.npmjs.com/package/@nurajs/intents)
[![npm](https://img.shields.io/npm/v/@nurajs/transport-http.svg?label=%40nurajs%2Ftransport-http)](https://www.npmjs.com/package/@nurajs/transport-http)
[![npm](https://img.shields.io/npm/v/@nurajs/client.svg?label=%40nurajs%2Fclient)](https://www.npmjs.com/package/@nurajs/client)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

Nura.js helps your agent interfaces stay in sync with your UI. The toolkit includes fuzzy and phonetic matching, wake-word and
voice helpers, lightweight context storage, and adapters for React, Vue, and Svelte.

## About Nura

Nura was created by **Billy Rojas**. The name blends *nur* (light ray) and *pneuma* (breath). The framework focuses on ergonomic agent ↔ UI interactions across modern web stacks.

## Key Capabilities

- Intent and action descriptions that agents can reason about.
- Wake-word stripping, locale detection, numeral parsing, and synonym normalization.
- Hybrid Damerau–Levenshtein and phonetic ranking for fuzzy matching.
- Context manager for confirmations and follow-up state.
- First-party UI adapters for React, Vue, and Svelte.

## What’s New

Nura now ships an AI–to–UI bridge:
- **@nurajs/intents** – Define and validate JSON intents (Intent → Approval → Execute).
- **@nurajs/transport-http** – Hardened HTTP surface for AI tools (`POST /ai/intents`, `POST /ai/intents/:id/approve`).
- **@nurajs/client** – Agnostic SDK (`AiClient`) plus a simple `UiDispatcher` for UI reactions.

## AI Intents & Secure HTTP Surface

Nura closes the loop from AI tools to safe, user-facing UI:

```
AI / Client → @nurajs/transport-http → @nurajs/intents → (App Host / Executor) → @nurajs/client → UI
```

**Key ideas**
- Describe *what* to do as a JSON intent (e.g., `orders.delete`).
- Validate payloads with JSON Schema before execution.
- Apply approval/security policy.
- Emit UI-friendly results that your front end can map to actions (open modal, route, toast, etc.).

```ts
// hello-intent.ts
import { registerType } from '@nurajs/intents'

registerType({
  type: 'orders.create',
  schema: { type: 'object', required: ['id'], properties: { id: { type: 'string' } } },
  policy: { requiresApproval: false },
  mapper: payload => ({ type: 'ui.open', payload, uiHint: { target: 'orderForm' } }),
  executor: async payload => ({ ok: true, createdId: payload.id })
})
```

### Quick Start (AI Path)

```bash
pnpm add @nurajs/intents @nurajs/transport-http @nurajs/client
```

**Register an intent type**

```ts
// app/intents/orders.ts
import { registerType } from '@nurajs/intents'

registerType({
  type: 'orders.create',
  schema: { type: 'object', required: ['id','items'], properties: {
    id: { type: 'string' }, items: { type: 'array', items: { type: 'string' } }
  }},
  policy: { requiresApproval: true },
  mapper: payload => ({ type: 'ui.open', payload, uiHint: { target: 'orderForm' } }),
  executor: async payload => ({ ok: true, createdId: payload.id })
})
```

**Expose the public HTTP surface**

```ts
// app/http/ai.ts (express-ish or hono)
import { buildRouter } from '@nurajs/transport-http'
export const aiRouter = buildRouter({
  cors: { origins: ['https://yourapp.com'] },
  limits: { body: '64kb' },
  rateLimit: { windowMs: 60000, max: 60 }
})
// mount under /ai
```

**Consume from the client**

```ts
import { AiClient, UiDispatcher } from '@nurajs/client'
const client = new AiClient('/ai')
const dispatcher = new UiDispatcher()
dispatcher.register('ui.open', (_, hint) => openModal(hint?.target))

const { id } = await client.createIntent({ type: 'orders.create', payload: { id:'o-1', items:['coffee'] } })
await client.approveIntent(id) // if policy requires it
const result = await client.getIntentResult(id)
dispatcher.dispatch(result)
```

### Security Notes

* JSON-only (`Content-Type: application/json`)
* CORS allowlist, size limits, IP/tenant rate limiting
* Idempotency via `Idempotency-Key`
* Runtime validation with JSON Schema

## Quick Start

Requirements: Node.js 18.18+ and pnpm 8+ (via Corepack).

```bash
pnpm add @nura/core
pnpm add @nura/plugin-voice @nura/plugin-fuzzy  # optional packages
pnpm add @nura/react  # or: pnpm add @nura/vue / pnpm add @nura/svelte
```

If you cloned the monorepo:

```bash
pnpm install
pnpm dev  # or: npm run dev / yarn dev
pnpm build  # or: npm run build / yarn build
```

### Minimal core example

```ts
import { stripWake } from '@nura/core/wake';
import { parseNumeral } from '@nura/core/numerals';
import { normalizeSynonyms } from '@nura/core/synonyms';
import { ContextManager } from '@nura/core/context';

const text = stripWake('ok nora open orders menu', {
  aliases: ['nora', 'lura', 'nula'],
  minConfidence: 0.7,
});
// → "open orders menu"

const id = parseNumeral('quince', 'es'); // → 15
const normalized = normalizeSynonyms('abre el menú de pedidos', 'es');
// → normalizes "pedidos" to "órdenes" per locale dictionary

const ctx = new ContextManager();
ctx.save({ type: 'delete', target: 'order', payload: { id } });
const next = ctx.maybeConfirm('sí, elimínala');
// → { type: 'delete', target: 'order', payload: { id: 15 } }
```

## Adapters Matrix

| Adapter | Package | Quick usage |
| --- | --- | --- |
| React | `@nura/react` | ```tsx
import { NuraProvider, useNuraCommand } from '@nura/react';

export function App() {
  useNuraCommand('open-cart', ({ context }) => {
    console.log('Opening cart for', context?.userId);
  });
  return (
    <NuraProvider>
      <button data-nura-command="open-cart">Open cart</button>
    </NuraProvider>
  );
}
``` |
| Vue | `@nura/vue` | ```vue
<script setup lang="ts">
import { NuraProvider } from '@nura/vue';
</script>

<template>
  <NuraProvider>
    <button data-nura-command="open-cart">Open cart</button>
  </NuraProvider>
</template>
``` |
| Svelte | `@nura/svelte` | ```svelte
<script lang="ts">
  import { NuraProvider } from '@nura/svelte';
</script>

<NuraProvider>
  <button data-nura-command="open-cart">Open cart</button>
</NuraProvider>
``` |

## Release Verification

Run the bundled smoke tests before publishing packages.

```bash
pnpm run verify:release
```

## Troubleshooting

- **Node version:** Ensure `node -v` reports 18.18 or later. Use Corepack to pin pnpm if needed.
- **Executable permissions:** On Unix systems run `chmod +x scripts/*.ts` when cloning on case-sensitive file systems.
- **Firewall rules:** Allow outbound HTTPS access for MCP hosts referenced in `docs/internals/mcp.md`.

## Repository Layout

```
apps/                 Playground applications that do not gate CI
packages/core         Core runtime (wake, numerals, synonyms, context, locale)
packages/intents      AI intent registry, policy, and execution helpers
packages/transport-http  Express router exposing the AI surface
packages/client       Thin HTTP client and UI dispatcher
packages/plugin-*     Voice and fuzzy matching plugins
packages/react|vue|svelte
packages/examples     Reference scenarios (e.g., ai-intents-starter)
scripts/              Maintenance and smoke-test tooling
```

## Contributing

Follow [CONTRIBUTING.md](./CONTRIBUTING.md) and Conventional Commits. Typical workflow:

```bash
pnpm install
pnpm -w run typecheck
pnpm -w run build
pnpm run smoke
```

## Security

Report vulnerabilities privately to [security@nura.dev](mailto:security@nura.dev). See [SECURITY.md](./SECURITY.md) for
process details.

## License

[MIT](./LICENSE)

<!-- 🇨🇷 -->
