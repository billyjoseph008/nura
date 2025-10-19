# @nura/vue

Vue adapter for Nura.js - Make your Vue apps AI-friendly.

## Installation

\`\`\`bash
npm install @nura/vue @nura/core @nura/dom
# or
pnpm add @nura/vue @nura/core @nura/dom
\`\`\`

## Usage

### Setup Plugin

\`\`\`typescript
import { createApp } from 'vue'
import { NuraPlugin } from '@nura/vue'
import App from './App.vue'

const app = createApp(App)

app.use(NuraPlugin, {
  config: {
    debug: true
  }
})

app.mount('#app')
\`\`\`

### Register Actions

\`\`\`vue
<script setup>
import { useNuraAction } from '@nura/vue'

useNuraAction({
  verb: 'open',
  scope: 'modal',
  handler: () => {
    console.log('Opening modal')
  }
})
</script>
\`\`\`

### Use Directives

\`\`\`vue
<template>
  <div v-nura="{ scope: 'form', listen: ['submit'] }">
    <button v-nura="{ scope: 'submit-button', act: ['click'] }">
      Submit
    </button>
  </div>
</template>
\`\`\`

### Use Composables

\`\`\`vue
<script setup>
import { useNuraElement } from '@nura/vue'

const buttonRef = useNuraElement({
  scope: 'submit-button',
  act: ['click', 'submit']
})
</script>

<template>
  <button ref="buttonRef">Submit</button>
</template>
\`\`\`

### Use Components

\`\`\`vue
<template>
  <NuraElement scope="form" :listen="['submit']">
    <NuraElement scope="submit-button" :act="['click']" as="button">
      Submit
    </NuraElement>
  </NuraElement>
</template>

<script setup>
import { NuraElement } from '@nura/vue'
</script>
\`\`\`

## API

### Plugin

- \`NuraPlugin\` - Vue plugin for global installation

### Composables

- \`useNura()\` - Access registry and indexer
- \`useNuraAction(options)\` - Register actions
- \`useNuraElement(options)\` - Mark elements with Nura attributes
- \`useNuraPermission(options)\` - Add permissions
- \`useHasPermission(verb, scope)\` - Check permissions
- \`useNuraEvent(type, listener)\` - Listen to Nura events

### Directives

- \`v-nura\` - Add Nura attributes to elements

### Components

- \`<NuraElement>\` - Generic element wrapper

## License

MIT
