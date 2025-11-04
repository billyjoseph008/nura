# Nura.js

[![CI](https://github.com/nura-dev/nura/actions/workflows/ci.yml/badge.svg)](https://github.com/nura-dev/nura/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@nura/core.svg?label=%40nura%2Fcore)](https://www.npmjs.com/package/@nura/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

Nura.js helps your agent interfaces stay in sync with your UI. The toolkit includes fuzzy and phonetic matching, wake-word and
voice helpers, lightweight context storage, and adapters for React, Vue, and Svelte.

## About Nura

Nura was created by **Billy Joseph Rojas Vindas** (Costa Rica). The name blends *nur* (ray of light, in Tatar) and *pneuma*
(breath) after a formative trip to the Republic of Tatarstan, Russia. The framework focuses on ergonomic agent ↔ UI
interactions across modern web stacks.

## Key Capabilities

- Intent and action descriptions that agents can reason about.
- Wake-word stripping, locale detection, numeral parsing, and synonym normalization.
- Hybrid Damerau–Levenshtein and phonetic ranking for fuzzy matching.
- Context manager for confirmations and follow-up state.
- First-party UI adapters for React, Vue, and Svelte.

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
packages/plugin-*     Voice and fuzzy matching plugins
packages/react|vue|svelte
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
