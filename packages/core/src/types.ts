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

export type NPolicy = 'deny' | 'allow' | 'confirm'

export interface NPermissionRule {
  roles?: string[]
  confirm?: boolean
  policy?: NPolicy
}

export interface NPermissions {
  scopes: Record<string, Record<string, NPermissionRule>>
}

export interface NActor {
  id?: string
  roles?: string[]
  via?: 'user' | 'agent' | 'system'
}

export interface NActionCatalog {
  dispatch(action: NAction): Promise<NResult>
}

export type NResult = { ok: boolean; message?: string }

export type NConfirmFn = (ctx: {
  action: NAction
  scope?: string
  rule?: NPermissionRule
}) => Promise<boolean> | boolean

export interface NAudit {
  log: (entry: {
    action: NAction
    actor?: NActor
    scope?: string
    allowed: boolean
    reason?: string
    timestamp: number
  }) => void
}

export interface NConfig {
  app: { id: string; locale?: string }
  capabilities?: Partial<{ voice: boolean; rpa: boolean; analytics: boolean }>
  resolveScope?: (action: NAction) => string | undefined
  confirm?: NConfirmFn
  actor?: () => NActor | undefined
}

export interface NRegistry {
  actions: NActionCatalog
  permissions: NPermissions
  config: NConfig
  audit?: NAudit
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
  audit?: NAudit
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
  policy?: NPolicy
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
