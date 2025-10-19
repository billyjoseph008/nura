import type { NRegistry, NAction, NResult } from './types'

export class Nura {
  #registry: NRegistry
  #started = false

  constructor(opts: { registry: NRegistry }) {
    this.#registry = opts.registry
  }

  start(): void {
    if (this.#started) return

    this.#started = true
    document.dispatchEvent(new CustomEvent('nura:started'))
  }

  async act(action: NAction): Promise<NResult> {
    return this.#registry.actions.dispatch(action)
  }
}

export * from './types'
export { createRegistry } from './create-registry'
