# React Guide

Complete guide for using Nura.js with React.

## Installation

\`\`\`bash
npm install @nura/react @nura/core @nura/dom
\`\`\`

## Setup

Wrap your app with `NuraProvider`:

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

## Hooks

### useNura

Access the registry and indexer:

\`\`\`tsx
import { useNura } from '@nura/react'

function MyComponent() {
  const { registry, indexer } = useNura()
  
  // Use registry and indexer directly
  const actions = registry.getActions()
  const elements = indexer.getAll()
  
  return <div>...</div>
}
\`\`\`

### useNuraAction

Register actions that respond to commands:

\`\`\`tsx
import { useNuraAction } from '@nura/react'

function Modal() {
  const [isOpen, setIsOpen] = useState(false)

  const { execute } = useNuraAction({
    verb: 'open',
    scope: 'modal',
    handler: () => setIsOpen(true),
    description: 'Opens the modal',
    enabled: true
  })

  return (
    <div>
      {isOpen && <div>Modal content</div>}
      <button onClick={execute}>Open</button>
    </div>
  )
}
\`\`\`

### useNuraElement

Mark elements with Nura attributes:

\`\`\`tsx
import { useNuraElement } from '@nura/react'

function SubmitButton() {
  const ref = useNuraElement<HTMLButtonElement>({
    scope: 'submit-button',
    act: ['click', 'submit'],
    meta: { formId: 'contact-form' }
  })

  return <button ref={ref}>Submit</button>
}
\`\`\`

### useNuraPermission

Add permission rules:

\`\`\`tsx
import { useNuraPermission } from '@nura/react'

function AdminPanel() {
  const user = useUser()

  useNuraPermission({
    scope: 'admin-panel',
    verbs: ['edit', 'delete'],
    condition: () => user.isAdmin
  })

  return <div>Admin content</div>
}
\`\`\`

### useHasPermission

Check permissions:

\`\`\`tsx
import { useHasPermission } from '@nura/react'

function EditButton() {
  const canEdit = useHasPermission('edit', 'admin-panel')

  if (!canEdit) return null

  return <button>Edit</button>
}
\`\`\`

### useNuraEvent

Listen to Nura events:

\`\`\`tsx
import { useNuraEvent } from '@nura/react'

function EventLogger() {
  useNuraEvent('action:executed', (event) => {
    console.log('Action executed:', event.data)
  })

  return <div>Check console for events</div>
}
\`\`\`

## Components

### NuraElement

Generic wrapper component:

\`\`\`tsx
import { NuraElement } from '@nura/react'

function MyComponent() {
  return (
    <NuraElement
      scope="card"
      listen={['view', 'hover']}
      act={['click']}
      as="article"
      className="card"
    >
      <h2>Card Title</h2>
      <p>Card content</p>
    </NuraElement>
  )
}
\`\`\`

### NuraButton

Button with Nura attributes:

\`\`\`tsx
import { NuraButton } from '@nura/react'

function MyComponent() {
  return (
    <NuraButton
      scope="submit-button"
      onClick={handleSubmit}
      className="btn-primary"
    >
      Submit
    </NuraButton>
  )
}
\`\`\`

## Patterns

### Form with Actions

\`\`\`tsx
function ContactForm() {
  const [formData, setFormData] = useState({})

  useNuraAction({
    verb: 'submit',
    scope: 'contact-form',
    handler: async () => {
      await submitForm(formData)
    }
  })

  useNuraAction({
    verb: 'reset',
    scope: 'contact-form',
    handler: () => {
      setFormData({})
    }
  })

  return (
    <NuraElement scope="contact-form" listen={['submit', 'reset']}>
      <input 
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />
      <NuraButton scope="submit-button">Submit</NuraButton>
      <NuraButton scope="reset-button">Reset</NuraButton>
    </NuraElement>
  )
}
\`\`\`

### Modal with State

\`\`\`tsx
function Modal() {
  const [isOpen, setIsOpen] = useState(false)

  useNuraAction({
    verb: 'open',
    scope: 'modal',
    handler: () => setIsOpen(true)
  })

  useNuraAction({
    verb: 'close',
    scope: 'modal',
    handler: () => setIsOpen(false)
  })

  if (!isOpen) return null

  return (
    <NuraElement scope="modal" listen={['close']}>
      <div className="modal-content">
        <h2>Modal Title</h2>
        <NuraButton scope="close-button" onClick={() => setIsOpen(false)}>
          Close
        </NuraButton>
      </div>
    </NuraElement>
  )
}
\`\`\`

### Navigation

\`\`\`tsx
function Navigation() {
  const router = useRouter()

  useNuraAction({
    verb: 'navigate',
    scope: 'home-link',
    handler: () => router.push('/')
  })

  useNuraAction({
    verb: 'navigate',
    scope: 'about-link',
    handler: () => router.push('/about')
  })

  return (
    <nav>
      <NuraElement scope="home-link" act={['navigate']}>
        <a href="/">Home</a>
      </NuraElement>
      <NuraElement scope="about-link" act={['navigate']}>
        <a href="/about">About</a>
      </NuraElement>
    </nav>
  )
}
\`\`\`

## TypeScript

Nura.js is fully typed. Import types as needed:

\`\`\`tsx
import type { NuraVerb, NuraScope, NuraAction } from '@nura/react'

const customVerb: NuraVerb = 'custom-action'
const scope: NuraScope = 'my-component'
\`\`\`

## Best Practices

1. **Register actions in components**: Use `useNuraAction` where the logic lives
2. **Use semantic scopes**: Make scopes descriptive
3. **Clean up automatically**: Hooks handle cleanup on unmount
4. **Type your refs**: Use generic types with `useNuraElement<HTMLButtonElement>`
5. **Handle async actions**: Action handlers can be async
6. **Use permissions**: Protect sensitive actions
7. **Debug mode**: Enable during development
