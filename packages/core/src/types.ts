export type NActionType =
  | 'open'
  | 'close'
  | 'toggle'
  | 'create'
  | 'update'
  | 'delete'
  | 'navigate'
  | 'focus'
  | 'speak'
  | 'custom'
  | 'click'

export type ModernNAction = {
  type: NActionType
  target?: string
  payload?: Record<string, unknown>
  meta?: { priority?: 'soft' | 'normal' | 'hard'; desc?: string }
}

export interface LegacyNuraAction {
  verb: NActionType
  scope: NuraScope
  handler: (params?: Record<string, unknown>) => void | Promise<void>
  description?: string
  metadata?: Record<string, unknown>
}

export type NAction = ModernNAction | LegacyNuraAction

export interface NAgent {
  id: string
  kind: 'voice' | 'analytics' | 'rpa' | 'custom'
  start(ctx: NContext): Promise<void> | void
  stop?(): void
}

export interface NPermissions {
  scopes: Record<string, Record<string, { roles?: string[]; confirm?: boolean }>>
}

export interface NActionCatalog {
  dispatch(action: NAction): Promise<NResult>
}

export type NResult = { ok: boolean; message?: string }

export interface NConfig {
  app: { id: string; locale?: string }
  capabilities?: Partial<{ voice: boolean; rpa: boolean; analytics: boolean }>
}

export interface NRegistry {
  actions: NActionCatalog
  permissions: NPermissions
  config: NConfig
  registerAction(action: NuraAction): void
  unregisterAction(verb: NActionType, scope: NuraScope): void
  executeAction(
    verb: NActionType,
    scope: NuraScope,
    params?: Record<string, unknown>,
  ): Promise<NResult | void> | void
  on(type: NuraEventType, listener: NuraEventListener): () => void
  addPermission(permission: NuraPermission): void
  removePermission(scope: NuraScope): void
  hasPermission(verb: NActionType, scope: NuraScope): Promise<boolean>
}

export interface NContext {
  registry: NRegistry
  act(action: NAction): Promise<NResult>
  select(selector: string): Element[]
  audit: { log: (action: NAction, actor: string, result: NResult) => void }
}

export type NuraVerb = NActionType
export type NuraScope = string

export interface NuraElement {
  id: string
  scope: NuraScope
  verbs: NuraVerb[]
  element: Element
  metadata?: Record<string, unknown>
}

export type NuraAction = LegacyNuraAction
export type NuraRegistry = NRegistry
export type NuraConfig = NConfig

export interface NuraPermission {
  scope: NuraScope
  verbs: NuraVerb[]
  roles?: string[]
  confirm?: boolean
  condition?: () => boolean | Promise<boolean>
}

export interface NuraPlugin {
  name: string
  version: string
  install: (registry: NuraRegistry) => void | Promise<void>
  uninstall?: () => void | Promise<void>
}

export type NuraEventType =
  | 'action:registered'
  | 'action:unregistered'
  | 'action:executed'
  | 'action:error'
  | 'permission:added'
  | 'permission:removed'
  | 'permission:denied'
  | 'element:indexed'
  | 'element:removed'

export interface NuraEvent {
  type: NuraEventType
  data: unknown
  timestamp: number
}

export type NuraEventListener = (event: NuraEvent) => void
