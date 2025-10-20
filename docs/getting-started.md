# Getting Started

Welcome to Nura.js! This guide walks you through installing dependencies, bootstrapping a project, and registering your first agent-friendly command.

## Prerequisites

- Node.js 18.18 or newer
- pnpm 8+ (via Corepack) or npm/bun if you prefer
- TypeScript 5 with `strict` mode enabled

## Install the Core Package

```bash
pnpm add @nura/core
```

Want framework helpers?

- React: `pnpm add @nura/react`
- Vue: `pnpm add @nura/vue`
- Svelte: `pnpm add @nura/svelte`

## Initialize Nura.js

Create an entry point that sets up the provider for your app. Example using React:

```tsx
import { NuraProvider } from '@nura/react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <NuraProvider>
    <App />
  </NuraProvider>
)
```

## Define Your First Command

Commands connect structured intents to executable logic.

```tsx
import { useNuraCommand } from '@nura/react'

export function CheckoutButton() {
  useNuraCommand('checkout', ({ context }) => {
    console.log('Checking out for user', context.userId)
  })

  return (
    <button data-nura-command="checkout">Checkout</button>
  )
}
```

- `data-nura-command` exposes the action to agents, screen readers, and other tools.
- `useNuraCommand` registers the handler with context-aware metadata.

## Run Locally

```bash
pnpm install
pnpm dev
```

`pnpm dev` uses TurboRepo to run all active workspaces in watch mode.

## Next Steps

- Explore the [Recipes](./recipes.md) for more complex scenarios like slot filling and validation.
- Read the [Architecture](./architecture.md) overview to understand the building blocks.
- Track upcoming features on the [Roadmap](./roadmap.md).
