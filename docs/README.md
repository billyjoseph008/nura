# Nura.js Documentation

Welcome to the Nura.js documentation. Learn how to make your web applications AI-friendly.

## Table of Contents

- [Getting Started](./getting-started.md)
- [Core Concepts](./core-concepts.md)
- [API Reference](./api-reference.md)
- [Framework Guides](#framework-guides)
  - [React Guide](./react-guide.md)
  - [Vue Guide](./vue-guide.md)
  - [Svelte Guide](./svelte-guide.md)
- [Examples](./examples.md)
- [Contributing](../CONTRIBUTING.md)

## What is Nura.js?

Nura.js is a framework for making web applications AI-friendly by adding semantic markup that AI agents, voice assistants, analytics tools, and RPA bots can understand and interact with.

### Key Features

- **AI-Friendly Markup**: Semantic data attributes that describe your UI's intent
- **Framework Agnostic**: Core library works with vanilla JS, with adapters for React, Vue, and Svelte
- **Action Registry**: Centralized system for routing AI commands to your app
- **Voice Plugin**: Built-in voice interaction capabilities
- **DevTools**: Visual overlay for development and debugging
- **Type-Safe**: Full TypeScript support

## Quick Example

\`\`\`html
<div data-nu-scope="modal"
     data-nu-listen="open close"
     data-nu-act="toggle">
  <!-- Your modal content -->
</div>
\`\`\`

\`\`\`typescript
import { createRegistry } from '@nura/core'

const registry = createRegistry()

registry.registerAction({
  verb: 'open',
  scope: 'modal',
  handler: () => {
    // Open modal logic
  }
})
\`\`\`

### Semantic Action Specs

```typescript
import { defineActionSpec } from '@nura/core'

const openOrdersSpec = defineActionSpec({
  name: 'open_orders_menu',
  type: 'open',
  target: 'menu:orders',
  scope: 'ui',
  locale: 'es-CR',
  phrases: {
    'es-CR': {
      canonical: ['abre el menú de órdenes'],
      synonyms: ['abrir el menú de órdenes', 'mostrar órdenes', 'abre órdenes'],
    },
  },
})

const deleteOrderSpec = defineActionSpec({
  name: 'delete_order',
  type: 'delete',
  target: 'order',
  scope: 'orders',
  locale: 'es-CR',
  entities: [{ name: 'id', type: 'number' }],
  phrases: {
    'es-CR': {
      canonical: ['elimina la orden {id}'],
      synonyms: ['borra la orden {id}', 'eliminar orden {id}'],
    },
  },
  validate: (payload) => typeof payload?.id === 'number',
})

const registryWithSpecs = createRegistry({
  config: { app: { id: 'demo-nura', locale: 'es-CR' } },
  specs: [openOrdersSpec, deleteOrderSpec],
})

registryWithSpecs.actions.register(
  defineActionSpec({
    name: 'search_orders',
    type: 'search',
    target: 'orders',
    phrases: {
      'es-CR': { canonical: ['buscar órdenes'], synonyms: ['encuentra órdenes'] },
    },
  }),
)
```

## Packages

- `@nura/core` - Core registry and types
- `@nura/dom` - DOM indexing and scanning
- `@nura/react` - React hooks and components
- `@nura/vue` - Vue directives and composables
- `@nura/svelte` - Svelte actions and stores

## CI/CD and Deployments

- Continuous integration runs linting, tests, and build verification via GitHub Actions.
- Vercel preview deployments have been removed from the workflow; PRs will not trigger Vercel checks or comments.
- No repository secrets with the `VERCEL_` prefix are required after this change.

## Philosophy

Nura.js follows these principles:

1. **Semantic First**: Every element should describe what it does, not just how it looks
2. **Progressive Enhancement**: Works with existing apps, no rewrite needed
3. **Developer Experience**: Simple API, great TypeScript support
4. **Performance**: Minimal overhead, efficient DOM scanning
5. **Extensible**: Plugin system for custom functionality

## Community

- [GitHub](https://github.com/nurajs/nura)
- [Discord](https://discord.gg/nurajs)
- [Twitter](https://twitter.com/nurajs)

## License

MIT
