import { writable, type Readable } from "svelte/store"
import { getNuraContext } from "./context"
import type { NuraAction, NuraElement, NuraScope, NuraVerb } from "@nura/core"

export function createNuraStore() {
  const { registry, indexer } = getNuraContext()

  const actions = writable<NuraAction[]>([])
  const elements = writable<NuraElement[]>([])

  // Update actions when registry changes
  registry.on("action:registered", () => {
    actions.set(registry.getActions())
  })

  registry.on("action:unregistered", () => {
    actions.set(registry.getActions())
  })

  // Update elements when indexer changes
  const updateElements = () => {
    elements.set(indexer.getAll())
  }

  // Initial load
  actions.set(registry.getActions())
  updateElements()

  return {
    actions: { subscribe: actions.subscribe },
    elements: { subscribe: elements.subscribe },
    registry,
    indexer,
  }
}

export function createActionStore(scope?: NuraScope): Readable<NuraAction[]> {
  const { registry } = getNuraContext()
  const store = writable<NuraAction[]>([])

  const update = () => {
    store.set(registry.getActions(scope))
  }

  registry.on("action:registered", update)
  registry.on("action:unregistered", update)

  update()

  return { subscribe: store.subscribe }
}

export function createPermissionStore(verb: NuraVerb, scope: NuraScope): Readable<boolean> {
  const { registry } = getNuraContext()
  const store = writable<boolean>(true)

  const check = async () => {
    const hasPermission = await registry.hasPermission(verb, scope)
    store.set(hasPermission)
  }

  check()

  return { subscribe: store.subscribe }
}
