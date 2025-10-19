/**
 * Core types for Nura.js
 */

export type NuraVerb =
  | "open"
  | "close"
  | "toggle"
  | "create"
  | "delete"
  | "edit"
  | "save"
  | "cancel"
  | "submit"
  | "navigate"
  | "search"
  | "filter"
  | "sort"
  | "select"
  | "deselect"
  | "expand"
  | "collapse"
  | "refresh"
  | "load"
  | "upload"
  | "download"
  | "play"
  | "pause"
  | "stop"
  | "next"
  | "previous"
  | "like"
  | "unlike"
  | "share"
  | "copy"
  | "paste"
  | "cut"
  | "undo"
  | "redo"
  | string

export type NuraScope = string

export interface NuraAction {
  verb: NuraVerb
  scope: NuraScope
  handler: (params?: Record<string, any>) => void | Promise<void>
  description?: string
  metadata?: Record<string, any>
}

export interface NuraElement {
  id: string
  scope: NuraScope
  verbs: NuraVerb[]
  element: HTMLElement
  metadata?: Record<string, any>
}

export interface NuraPermission {
  scope: NuraScope
  verbs: NuraVerb[]
  condition?: () => boolean | Promise<boolean>
}

export interface NuraConfig {
  debug?: boolean
  autoIndex?: boolean
  plugins?: NuraPlugin[]
  permissions?: NuraPermission[]
}

export interface NuraPlugin {
  name: string
  version: string
  install: (registry: any) => void | Promise<void>
  uninstall?: () => void | Promise<void>
}

export interface NuraRegistry {
  registerAction(action: NuraAction): void
  unregisterAction(verb: NuraVerb, scope: NuraScope): void
  executeAction(verb: NuraVerb, scope: NuraScope, params?: Record<string, any>): Promise<void>
  getActions(scope?: NuraScope): NuraAction[]
  hasPermission(verb: NuraVerb, scope: NuraScope): Promise<boolean>
  addPermission(permission: NuraPermission): void
  removePermission(scope: NuraScope): void
  use(plugin: NuraPlugin): Promise<void>
  getConfig(): NuraConfig
}

export type NuraEventType =
  | "action:registered"
  | "action:unregistered"
  | "action:executed"
  | "action:error"
  | "permission:added"
  | "permission:removed"
  | "permission:denied"
  | "element:indexed"
  | "element:removed"

export interface NuraEvent {
  type: NuraEventType
  data: any
  timestamp: number
}

export type NuraEventListener = (event: NuraEvent) => void
