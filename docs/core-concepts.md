# Core Concepts

Understanding the fundamental concepts of Nura.js.

## Data Attributes

Nura.js uses data attributes to mark elements with semantic meaning:

### `data-nu-scope`

Defines the scope or identifier of an element. This is required for all Nura elements.

\`\`\`html
<div data-nu-scope="modal">
  <!-- Modal content -->
</div>
\`\`\`

### `data-nu-listen`

Specifies which verbs this element can respond to.

\`\`\`html
<div data-nu-scope="modal" data-nu-listen="open close toggle">
  <!-- This modal can be opened, closed, or toggled -->
</div>
\`\`\`

### `data-nu-act`

Specifies which actions this element can perform.

\`\`\`html
<button data-nu-scope="submit-button" data-nu-act="click submit">
  Submit
</button>
\`\`\`

### `data-nu-meta`

Additional metadata in JSON format.

\`\`\`html
<div data-nu-scope="product-card" 
     data-nu-meta='{"id": "123", "price": 29.99}'>
  <!-- Product card -->
</div>
\`\`\`

## Verbs

Verbs are actions that can be performed on elements. Common verbs include:

- **Navigation**: `open`, `close`, `toggle`, `navigate`
- **Data**: `create`, `edit`, `delete`, `save`, `cancel`
- **Interaction**: `click`, `submit`, `select`, `deselect`
- **Media**: `play`, `pause`, `stop`, `next`, `previous`
- **UI**: `expand`, `collapse`, `refresh`, `load`

You can also define custom verbs for your application.

## Scopes

Scopes identify elements in your application. They should be:

- **Descriptive**: `user-profile-modal` instead of `modal1`
- **Unique**: Each scope should identify a specific element or component
- **Hierarchical**: Use prefixes for related elements: `form`, `form-submit`, `form-cancel`

## Registry

The registry is the central hub for managing actions:

\`\`\`typescript
import { createRegistry } from '@nura/core'

const registry = createRegistry({
  debug: true,
  autoIndex: true
})

// Register an action
registry.registerAction({
  verb: 'open',
  scope: 'modal',
  handler: () => {
    console.log('Opening modal')
  }
})

// Execute an action
await registry.executeAction('open', 'modal')
\`\`\`

## Permissions

Control which actions can be performed:

\`\`\`typescript
registry.addPermission({
  scope: 'admin-panel',
  verbs: ['open', 'edit', 'delete'],
  condition: () => user.isAdmin
})
\`\`\`

## Events

Listen to Nura events:

\`\`\`typescript
registry.on('action:executed', (event) => {
  console.log('Action executed:', event.data)
})

registry.on('permission:denied', (event) => {
  console.log('Permission denied:', event.data)
})
\`\`\`

Available events:
- `action:registered`
- `action:unregistered`
- `action:executed`
- `action:error`
- `permission:added`
- `permission:removed`
- `permission:denied`
- `element:indexed`
- `element:removed`

## DOM Indexer

The DOM indexer scans and tracks Nura elements:

\`\`\`typescript
import { DOMIndexer } from '@nura/dom'

const indexer = new DOMIndexer({
  autoScan: true,
  observeChanges: true
})

// Find elements
const modalElements = indexer.findByScope('modal')
const clickableElements = indexer.findByVerb('click')

// Get all indexed elements
const allElements = indexer.getAll()
\`\`\`

## Plugins

Extend Nura with plugins:

\`\`\`typescript
const myPlugin = {
  name: 'my-plugin',
  version: '1.0.0',
  install: (registry) => {
    // Plugin initialization
    console.log('Plugin installed')
  },
  uninstall: () => {
    // Cleanup
  }
}

registry.use(myPlugin)
\`\`\`

## Best Practices

1. **Use semantic scopes**: Make scopes descriptive and meaningful
2. **Register actions early**: Register actions when components mount
3. **Clean up**: Unregister actions when components unmount
4. **Use permissions**: Protect sensitive actions with permissions
5. **Handle errors**: Always handle errors in action handlers
6. **Debug mode**: Enable debug mode during development
7. **Type safety**: Use TypeScript for better developer experience
