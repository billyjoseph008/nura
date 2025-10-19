// Plugin
export { NuraPlugin, useNuraInstance, NuraSymbol } from "./plugin"
export type { NuraVueOptions, NuraInstance } from "./plugin"

// Composables
export { useNura } from "./composables/use-nura"
export type { UseNuraReturn } from "./composables/use-nura"

export { useNuraAction } from "./composables/use-nura-action"
export type { UseNuraActionOptions } from "./composables/use-nura-action"

export { useNuraElement } from "./composables/use-nura-element"
export type { UseNuraElementOptions } from "./composables/use-nura-element"

export { useNuraPermission, useHasPermission } from "./composables/use-nura-permission"
export type { UseNuraPermissionOptions } from "./composables/use-nura-permission"

export { useNuraEvent, useNuraEvents } from "./composables/use-nura-events"

// Directives
export { vNura } from "./directives/v-nura"
export type { VNuraBinding } from "./directives/v-nura"

// Components
export { default as NuraElement } from "./components/NuraElement.vue"

// Re-export core types
export type {
  NuraAction,
  NuraConfig,
  NuraElement as NuraElementType,
  NuraEvent,
  NuraEventListener,
  NuraEventType,
  NuraPermission,
  NuraPlugin,
  NuraRegistry,
  NuraScope,
  NuraVerb,
} from "@nura/core"
