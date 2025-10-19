import { NuraRegistry } from "./registry"
import type { NuraConfig } from "./types"

let globalRegistry: NuraRegistry | null = null

export function createRegistry(config?: NuraConfig): NuraRegistry {
  return new NuraRegistry(config)
}

export function getGlobalRegistry(): NuraRegistry {
  if (!globalRegistry) {
    globalRegistry = createRegistry()
  }
  return globalRegistry
}

export function setGlobalRegistry(registry: NuraRegistry): void {
  globalRegistry = registry
}
