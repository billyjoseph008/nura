# Examples

Practical examples of using Nura.js in real applications.

## Todo List

A complete todo list with Nura actions:

\`\`\`tsx
import { useState } from 'react'
import { useNuraAction, NuraElement, NuraButton } from '@nura/react'

interface Todo {
  id: string
  text: string
  completed: boolean
}

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')

  useNuraAction({
    verb: 'create',
    scope: 'todo-list',
    handler: () => {
      if (input.trim()) {
        setTodos([...todos, {
          id: Date.now().toString(),
          text: input,
          completed: false
        }])
        setInput('')
      }
    }
  })

  useNuraAction({
    verb: 'delete',
    scope: 'todo-list',
    handler: (params) => {
      setTodos(todos.filter(t => t.id !== params?.id))
    }
  })

  useNuraAction({
    verb: 'toggle',
    scope: 'todo-list',
    handler: (params) => {
      setTodos(todos.map(t => 
        t.id === params?.id ? { ...t, completed: !t.completed } : t
      ))
    }
  })

  return (
    <NuraElement scope="todo-list" listen={['create', 'delete', 'toggle']}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add todo..."
      />
      <NuraButton scope="add-todo-button" onClick={() => {
        // Action will be triggered
      }}>
        Add
      </NuraButton>

      <ul>
        {todos.map(todo => (
          <NuraElement
            key={todo.id}
            scope={`todo-item-${todo.id}`}
            act={['toggle', 'delete']}
            meta={{ id: todo.id }}
            as="li"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => {/* toggle */}}
            />
            <span>{todo.text}</span>
            <button onClick={() => {/* delete */}}>Delete</button>
          </NuraElement>
        ))}
      </ul>
    </NuraElement>
  )
}
\`\`\`

## Search with Filters

Search interface with Nura actions:

\`\`\`tsx
function SearchPage() {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState({})
  const [results, setResults] = useState([])

  useNuraAction({
    verb: 'search',
    scope: 'search-form',
    handler: async () => {
      const data = await searchAPI(query, filters)
      setResults(data)
    }
  })

  useNuraAction({
    verb: 'filter',
    scope: 'search-form',
    handler: (params) => {
      setFilters({ ...filters, ...params })
    }
  })

  useNuraAction({
    verb: 'reset',
    scope: 'search-form',
    handler: () => {
      setQuery('')
      setFilters({})
      setResults([])
    }
  })

  return (
    <NuraElement scope="search-form" listen={['search', 'filter', 'reset']}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      
      <NuraButton scope="search-button">Search</NuraButton>
      <NuraButton scope="reset-button">Reset</NuraButton>

      <div className="results">
        {results.map(result => (
          <NuraElement
            key={result.id}
            scope={`result-${result.id}`}
            act={['view', 'select']}
            meta={{ id: result.id }}
          >
            {result.title}
          </NuraElement>
        ))}
      </div>
    </NuraElement>
  )
}
\`\`\`

## Multi-Step Form

Form with navigation between steps:

\`\`\`tsx
function MultiStepForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({})

  useNuraAction({
    verb: 'next',
    scope: 'multi-step-form',
    handler: () => setStep(s => Math.min(s + 1, 3))
  })

  useNuraAction({
    verb: 'previous',
    scope: 'multi-step-form',
    handler: () => setStep(s => Math.max(s - 1, 1))
  })

  useNuraAction({
    verb: 'submit',
    scope: 'multi-step-form',
    handler: async () => {
      await submitForm(formData)
    }
  })

  return (
    <NuraElement 
      scope="multi-step-form" 
      listen={['next', 'previous', 'submit']}
      meta={{ currentStep: step }}
    >
      {step === 1 && <Step1 data={formData} onChange={setFormData} />}
      {step === 2 && <Step2 data={formData} onChange={setFormData} />}
      {step === 3 && <Step3 data={formData} onChange={setFormData} />}

      <div className="navigation">
        {step > 1 && (
          <NuraButton scope="previous-button">Previous</NuraButton>
        )}
        {step < 3 && (
          <NuraButton scope="next-button">Next</NuraButton>
        )}
        {step === 3 && (
          <NuraButton scope="submit-button">Submit</NuraButton>
        )}
      </div>
    </NuraElement>
  )
}
\`\`\`

## Media Player

Audio/video player with Nura controls:

\`\`\`tsx
function MediaPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useNuraAction({
    verb: 'play',
    scope: 'media-player',
    handler: () => {
      audioRef.current?.play()
      setIsPlaying(true)
    }
  })

  useNuraAction({
    verb: 'pause',
    scope: 'media-player',
    handler: () => {
      audioRef.current?.pause()
      setIsPlaying(false)
    }
  })

  useNuraAction({
    verb: 'stop',
    scope: 'media-player',
    handler: () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        setIsPlaying(false)
      }
    }
  })

  return (
    <NuraElement 
      scope="media-player" 
      listen={['play', 'pause', 'stop']}
      meta={{ src, isPlaying }}
    >
      <audio ref={audioRef} src={src} />
      
      <div className="controls">
        {!isPlaying ? (
          <NuraButton scope="play-button">Play</NuraButton>
        ) : (
          <NuraButton scope="pause-button">Pause</NuraButton>
        )}
        <NuraButton scope="stop-button">Stop</NuraButton>
      </div>
    </NuraElement>
  )
}
\`\`\`

## Dashboard with Widgets

Dashboard with draggable widgets:

\`\`\`tsx
function Dashboard() {
  const [widgets, setWidgets] = useState([
    { id: '1', type: 'chart', position: { x: 0, y: 0 } },
    { id: '2', type: 'stats', position: { x: 1, y: 0 } },
  ])

  useNuraAction({
    verb: 'refresh',
    scope: 'dashboard',
    handler: async () => {
      // Refresh all widgets
      await Promise.all(widgets.map(w => refreshWidget(w.id)))
    }
  })

  useNuraAction({
    verb: 'add',
    scope: 'dashboard',
    handler: (params) => {
      setWidgets([...widgets, {
        id: Date.now().toString(),
        type: params?.type || 'chart',
        position: { x: 0, y: widgets.length }
      }])
    }
  })

  return (
    <NuraElement scope="dashboard" listen={['refresh', 'add']}>
      <NuraButton scope="refresh-button">Refresh All</NuraButton>
      
      <div className="widgets">
        {widgets.map(widget => (
          <NuraElement
            key={widget.id}
            scope={`widget-${widget.id}`}
            act={['move', 'resize', 'delete']}
            meta={{ id: widget.id, type: widget.type }}
          >
            <Widget {...widget} />
          </NuraElement>
        ))}
      </div>
    </NuraElement>
  )
}
\`\`\`

## More Examples

Check out the [demo application](../apps/demo) for more complete examples.
