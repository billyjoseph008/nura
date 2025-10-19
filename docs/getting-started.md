# Getting Started with Nura.js

This guide will help you get started with Nura.js in your project.

## Installation

Choose the package for your framework:

### React

\`\`\`bash
npm install @nura/react @nura/core @nura/dom
# or
pnpm add @nura/react @nura/core @nura/dom
\`\`\`

### Vue

\`\`\`bash
npm install @nura/vue @nura/core @nura/dom
# or
pnpm add @nura/vue @nura/core @nura/dom
\`\`\`

### Svelte

\`\`\`bash
npm install @nura/svelte @nura/core @nura/dom
# or
pnpm add @nura/svelte @nura/core @nura/dom
\`\`\`

### Vanilla JavaScript

\`\`\`bash
npm install @nura/core @nura/dom
# or
pnpm add @nura/core @nura/dom
\`\`\`

## Basic Setup

### React

\`\`\`tsx
import { NuraProvider } from '@nura/react'

function App() {
  return (
    <NuraProvider config={{ debug: true }}>
      <YourApp />
    </NuraProvider>
  )
}
\`\`\`

### Vue

\`\`\`typescript
import { createApp } from 'vue'
import { NuraPlugin } from '@nura/vue'
import App from './App.vue'

const app = createApp(App)
app.use(NuraPlugin, { config: { debug: true } })
app.mount('#app')
\`\`\`

### Svelte

\`\`\`svelte
<script>
  import { NuraProvider } from '@nura/svelte'
</script>

<NuraProvider config={{ debug: true }}>
  <YourApp />
</NuraProvider>
\`\`\`

### Vanilla JavaScript

\`\`\`typescript
import { createRegistry } from '@nura/core'
import { DOMIndexer } from '@nura/dom'

const registry = createRegistry({ debug: true })
const indexer = new DOMIndexer({ autoScan: true })
\`\`\`

## Your First Nura Action

Let's create a simple action that opens a modal:

### React

\`\`\`tsx
import { useNuraAction, NuraButton } from '@nura/react'

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)

  useNuraAction({
    verb: 'open',
    scope: 'modal',
    handler: () => setIsOpen(true)
  })

  return (
    <NuraButton scope="open-modal-button" onClick={() => setIsOpen(true)}>
      Open Modal
    </NuraButton>
  )
}
\`\`\`

### Vue

\`\`\`vue
<script setup>
import { ref } from 'vue'
import { useNuraAction } from '@nura/vue'

const isOpen = ref(false)

useNuraAction({
  verb: 'open',
  scope: 'modal',
  handler: () => isOpen.value = true
})
</script>

<template>
  <button v-nura="{ scope: 'open-modal-button', act: ['click'] }"
          @click="isOpen = true">
    Open Modal
  </button>
</template>
\`\`\`

### Svelte

\`\`\`svelte
<script>
  import { nura } from '@nura/svelte'
  import { useNuraAction } from '@nura/svelte'
  
  let isOpen = false

  useNuraAction({
    verb: 'open',
    scope: 'modal',
    handler: () => isOpen = true
  })
</script>

<button use:nura={{ scope: 'open-modal-button', act: ['click'] }}
        on:click={() => isOpen = true}>
  Open Modal
</button>
\`\`\`

## Next Steps

- Learn about [Core Concepts](./core-concepts.md)
- Explore the [API Reference](./api-reference.md)
- Check out [Examples](./examples.md)
- Read your framework's guide:
  - [React Guide](./react-guide.md)
  - [Vue Guide](./vue-guide.md)
  - [Svelte Guide](./svelte-guide.md)
