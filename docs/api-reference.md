# API Reference

Complete API reference for Nura.js packages.

## @nura/core

### `createRegistry(config?: NuraConfig): NuraRegistry`

Creates a new Nura registry.

\`\`\`typescript
const registry = createRegistry({
  debug: true,
  autoIndex: true,
  plugins: [],
  permissions: []
})
\`\`\`

### `NuraRegistry`

#### Methods

##### `registerAction(action: NuraAction): void`

Registers a new action.

\`\`\`typescript
registry.registerAction({
  verb: 'open',
  scope: 'modal',
  handler: () => console.log('Opening'),
  description: 'Opens the modal',
  metadata: { priority: 'high' }
})
\`\`\`

##### `unregisterAction(verb: NuraVerb, scope: NuraScope): void`

Unregisters an action.

\`\`\`typescript
registry.unregisterAction('open', 'modal')
\`\`\`

##### `executeAction(verb: NuraVerb, scope: NuraScope, params?: Record<string, any>): Promise<void>`

Executes an action.

\`\`\`typescript
await registry.executeAction('open', 'modal', { animated: true })
\`\`\`

##### `getActions(scope?: NuraScope): NuraAction[]`

Gets all actions, optionally filtered by scope.

\`\`\`typescript
const allActions = registry.getActions()
const modalActions = registry.getActions('modal')
\`\`\`

##### `hasPermission(verb: NuraVerb, scope: NuraScope): Promise<boolean>`

Checks if an action is permitted.

\`\`\`typescript
const canOpen = await registry.hasPermission('open', 'modal')
\`\`\`

##### `addPermission(permission: NuraPermission): void`

Adds a permission rule.

\`\`\`typescript
registry.addPermission({
  scope: 'admin-panel',
  verbs: ['edit', 'delete'],
  condition: () => user.isAdmin
})
\`\`\`

##### `removePermission(scope: NuraScope): void`

Removes a permission rule.

\`\`\`typescript
registry.removePermission('admin-panel')
\`\`\`

##### `use(plugin: NuraPlugin): Promise<void>`

Installs a plugin.

\`\`\`typescript
await registry.use(myPlugin)
\`\`\`

##### `on(type: NuraEventType, listener: NuraEventListener): () => void`

Listens to events. Returns unsubscribe function.

\`\`\`typescript
const unsubscribe = registry.on('action:executed', (event) => {
  console.log(event)
})

// Later
unsubscribe()
\`\`\`

## @nura/dom

### `DOMIndexer`

#### Constructor

\`\`\`typescript
const indexer = new DOMIndexer({
  root: document.body,
  autoScan: true,
  observeChanges: true
})
\`\`\`

#### Methods

##### `scan(root?: HTMLElement): NuraElement[]`

Scans the DOM for Nura elements.

\`\`\`typescript
const elements = indexer.scan()
\`\`\`

##### `findByScope(scope: NuraScope): NuraElement[]`

Finds elements by scope.

\`\`\`typescript
const modals = indexer.findByScope('modal')
\`\`\`

##### `findByVerb(verb: NuraVerb): NuraElement[]`

Finds elements by verb.

\`\`\`typescript
const clickable = indexer.findByVerb('click')
\`\`\`

##### `findById(id: string): NuraElement | undefined`

Finds an element by ID.

\`\`\`typescript
const element = indexer.findById('modal-123')
\`\`\`

##### `getAll(): NuraElement[]`

Gets all indexed elements.

\`\`\`typescript
const all = indexer.getAll()
\`\`\`

##### `destroy(): void`

Cleans up and stops observing.

\`\`\`typescript
indexer.destroy()
\`\`\`

### `scanDOM(root?: HTMLElement): ScanResult`

Utility function to scan the DOM.

\`\`\`typescript
import { scanDOM } from '@nura/dom'

const result = scanDOM()
console.log(result.stats.total) // Total elements found
\`\`\`

## @nura/react

### `NuraProvider`

Context provider component.

\`\`\`tsx
<NuraProvider config={{ debug: true }}>
  <App />
</NuraProvider>
\`\`\`

### `useNura(): UseNuraReturn`

Hook to access registry and indexer.

\`\`\`tsx
const { registry, indexer } = useNura()
\`\`\`

### `useNuraAction(options: UseNuraActionOptions)`

Hook to register actions.

\`\`\`tsx
const { execute } = useNuraAction({
  verb: 'open',
  scope: 'modal',
  handler: () => console.log('Opening'),
  enabled: true
})

// Execute manually
await execute()
\`\`\`

### `useNuraElement<T>(options: UseNuraElementOptions): Ref<T>`

Hook to mark elements.

\`\`\`tsx
const ref = useNuraElement<HTMLButtonElement>({
  scope: 'submit-button',
  listen: ['click'],
  act: ['submit'],
  meta: { id: '123' }
})

return <button ref={ref}>Submit</button>
\`\`\`

### `useNuraPermission(options: UseNuraPermissionOptions)`

Hook to add permissions.

\`\`\`tsx
useNuraPermission({
  scope: 'admin-panel',
  verbs: ['edit', 'delete'],
  condition: () => user.isAdmin
})
\`\`\`

### `useHasPermission(verb: NuraVerb, scope: NuraScope): boolean`

Hook to check permissions.

\`\`\`tsx
const canEdit = useHasPermission('edit', 'admin-panel')
\`\`\`

### `useNuraEvent(type: NuraEventType, listener: NuraEventListener)`

Hook to listen to events.

\`\`\`tsx
useNuraEvent('action:executed', (event) => {
  console.log(event)
})
\`\`\`

### Components

#### `<NuraElement>`

Generic element wrapper.

\`\`\`tsx
<NuraElement 
  scope="modal" 
  listen={['open', 'close']}
  act={['toggle']}
  as="div"
>
  Content
</NuraElement>
\`\`\`

#### `<NuraButton>`

Button with Nura attributes.

\`\`\`tsx
<NuraButton scope="submit-button" onClick={handleClick}>
  Submit
</NuraButton>
\`\`\`

## @nura/vue

See [Vue Guide](./vue-guide.md) for detailed API.

## @nura/svelte

See [Svelte Guide](./svelte-guide.md) for detailed API.

## Types

### `NuraVerb`

\`\`\`typescript
type NuraVerb = 
  | "open" | "close" | "toggle"
  | "create" | "delete" | "edit"
  | "save" | "cancel" | "submit"
  | "navigate" | "search" | "filter"
  | string // Custom verbs
\`\`\`

### `NuraScope`

\`\`\`typescript
type NuraScope = string
\`\`\`

### `NuraAction`

\`\`\`typescript
interface NuraAction {
  verb: NuraVerb
  scope: NuraScope
  handler: (params?: Record<string, any>) => void | Promise<void>
  description?: string
  metadata?: Record<string, any>
}
\`\`\`

### `NuraElement`

\`\`\`typescript
interface NuraElement {
  id: string
  scope: NuraScope
  verbs: NuraVerb[]
  element: HTMLElement
  metadata?: Record<string, any>
}
\`\`\`

### `NuraConfig`

\`\`\`typescript
interface NuraConfig {
  debug?: boolean
  autoIndex?: boolean
  plugins?: NuraPlugin[]
  permissions?: NuraPermission[]
}
