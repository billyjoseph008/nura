# Nura.js

[![CI](https://github.com/nura-dev/nura/actions/workflows/ci.yml/badge.svg)](https://github.com/nura-dev/nura/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@nura/core?label=%40nura%2Fcore)](https://www.npmjs.com/package/@nura/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

> **Make your app breathe.**  
> Nura.js is a TypeScript-first framework that helps your **agents** and **UIs** talk to each other. It ships fuzzy and phonetic matching, wake-word helpers, simple i18n, lightweight context, and UI adapters for React, Vue, and Svelte.

---

## ✨ Origin

- Developer: **Billy Joseph Rojas Vindas** — Costa Rica.
- Inspired by a trip to the **Republic of Tatarstan (Russia)**.
- The name **“Nura”** blends **_nur_** (a “ray of light” in Tatar) and **_pneuma_** (“breath”). The idea: let your app **breathe**—be understandable for both people and agents.

---

## 🌟 Highlights

- **Agent-Friendly Semantics** – Describe intent and actions so tools/agents can cooperate with your UI.
- **Fuzzy + Phonetic** – Damerau + soundex-style strategies to catch what users meant.
- **Wake & Voice-Ready** – Wake-word helpers and voice plugin scaffolding.
- **Context & i18n** – Natural confirmations (“yes, do it”), numeral parsing (ES/EN), and simple locale detection.
- **UI Adapters** – First-party packages for **React**, **Vue**, and **Svelte**.

---

## 🚀 Quick Start

```bash
# core
pnpm add @nura/core

# optional plugins
pnpm add @nura/plugin-voice @nura/plugin-fuzzy

# pick a UI adapter (optional):
pnpm add @nura/react   # or @nura/vue / @nura/svelte
```

Workspace bootstrap (if you cloned the monorepo):

```bash
pnpm install
pnpm run verify:release   # typecheck → build → pack → smoke tests
```

---

## 🧩 Core in 60 seconds

**Wake stripping + numerals + synonyms:**

```ts
import { stripWake } from '@nura/core/wake';
import { parseNumeral } from '@nura/core/numerals';
import { normalizeSynonyms } from '@nura/core/synonyms';

const text = stripWake('ok nora open orders menu', {
  aliases: ['nora', 'lura', 'nula'],
  minConfidence: 0.7,
});
// → "open orders menu"

const id = parseNumeral('quince', 'es'); // → 15
const normalized = normalizeSynonyms('abre el menú de pedidos', 'es');
// → normalizes "pedidos" to "ordenes" (per dictionary)
```

**Context & confirmations:**

```ts
import { ContextManager } from '@nura/core/context';

const ctx = new ContextManager();
ctx.save({ type: 'delete', target: 'order', payload: { id: 15 } });

// later…
const next = ctx.maybeConfirm('sí, elimínala');
// → { type: 'delete', target: 'order', payload: { id: 15 } } | null
```

---

## 🎙️ Voice & Fuzzy (Plugins)

**Wake check (voice):**

```ts
import { compareWakeWord } from '@nura/plugin-voice';

const res = compareWakeWord(
  'okey nuera',
  { canonical: 'nura', aliases: ['nora', 'lura'] },
  { strategy: 'hybrid', minConfidence: 0.7, locale: 'es' }
);
if (res && res.score >= 0.7) {
  // wake matched, parse the rest of the utterance…
}
```

**Fuzzy ranking (hybrid Damerau + phonetic):**

```ts
import { rankCandidates } from '@nura/plugin-fuzzy';

const intents = [
  { id: 'open::menu:orders', phrase: 'abre el menu de ordenes' },
  { id: 'delete::order', phrase: 'borra la orden {id}' },
];

const { best } = rankCandidates('abre el menú de pedidos', intents, {
  threshold: 0.8,
  strategy: 'hybrid',
});

if (best?.score >= 0.8) {
  // → open::menu:orders
}
```

---

## 🧱 UI Adapters

**React**

```tsx
import { NuraProvider, useNuraCommand } from '@nura/react';

export default function App() {
  useNuraCommand('open-cart', ({ context }) => {
    console.log('Opening cart for user', context?.userId);
  });
  return (
    <NuraProvider>
      <button data-nura-command="open-cart">Open cart</button>
    </NuraProvider>
  );
}
```

**Vue**

```vue
<script setup lang="ts">
import { NuraProvider } from '@nura/vue';
// Listens to data-nura-command="..." and provides helpers via provide/inject
</script>

<template>
  <NuraProvider>
    <button data-nura-command="open-cart">Open cart</button>
  </NuraProvider>
</template>
```

**Svelte**

```svelte
<script lang="ts">
  import { NuraProvider } from '@nura/svelte';
</script>

<NuraProvider>
  <button data-nura-command="open-cart">Open cart</button>
</NuraProvider>
```

---

## 🛠️ Monorepo scripts (maintainers)

```bash
pnpm -w run typecheck
pnpm -w run build
pnpm run verify:release   # typecheck → build → pack → smoke
```

---

## 🗂️ Layout

```
apps/                 # playgrounds and sandboxes (don’t block main CI)
packages/core         # core runtime (wake, numerals, synonyms, context, i18n)
packages/plugin-*     # voice, fuzzy
packages/dom          # DOM helpers
packages/react|vue|svelte
scripts/              # smoke, maintenance, etc.
```

---

## ✅ Compatibility

- **Runtime:** Node.js 18.18+
- **TypeScript:** 5.x (`strict`)
- **UI:** React 18/19, Vue 3, Svelte 4/5

---

## 🤝 Contributing

- Conventional Commits encouraged
- Local flow:

  ```bash
  pnpm i
  pnpm -w run typecheck
  pnpm -w run build
  pnpm run smoke
  ```

- Please review **CONTRIBUTING.md** and our **CODE_OF_CONDUCT.md**.

---

## 🔐 Security

Private reports: **[security@nura.dev](mailto:security@nura.dev)**
See **SECURITY.md** for response times and disclosure policy.

---

## 📄 License

[MIT](./LICENSE) © **Billy Joseph Rojas Vindas** — Costa Rica
