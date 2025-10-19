import type {
  NuraAction,
  NuraConfig,
  NuraPermission,
  NuraPlugin,
  NuraRegistry as INuraRegistry,
  NuraVerb,
  NuraScope,
  NuraEvent,
  NuraEventListener,
  NuraEventType,
} from "./types"

export class NuraRegistry implements INuraRegistry {
  private actions: Map<string, NuraAction> = new Map()
  private permissions: Map<NuraScope, NuraPermission> = new Map()
  private plugins: Map<string, NuraPlugin> = new Map()
  private listeners: Map<NuraEventType, Set<NuraEventListener>> = new Map()
  private config: NuraConfig

  constructor(config: NuraConfig = {}) {
    this.config = {
      debug: false,
      autoIndex: true,
      plugins: [],
      permissions: [],
      ...config,
    }

    // Register default permissions
    if (this.config.permissions) {
      this.config.permissions.forEach((permission) => {
        this.addPermission(permission)
      })
    }

    // Install plugins
    if (this.config.plugins) {
      this.config.plugins.forEach((plugin) => {
        this.use(plugin)
      })
    }
  }

  private getActionKey(verb: NuraVerb, scope: NuraScope): string {
    return `${verb}:${scope}`
  }

  private emit(type: NuraEventType, data: any): void {
    const event: NuraEvent = {
      type,
      data,
      timestamp: Date.now(),
    }

    const listeners = this.listeners.get(type)
    if (listeners) {
      listeners.forEach((listener) => listener(event))
    }

    if (this.config.debug) {
      console.log("[Nura]", type, data)
    }
  }

  public on(type: NuraEventType, listener: NuraEventListener): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set())
    }
    this.listeners.get(type)!.add(listener)

    // Return unsubscribe function
    return () => {
      this.listeners.get(type)?.delete(listener)
    }
  }

  public registerAction(action: NuraAction): void {
    const key = this.getActionKey(action.verb, action.scope)
    this.actions.set(key, action)
    this.emit("action:registered", { verb: action.verb, scope: action.scope })
  }

  public unregisterAction(verb: NuraVerb, scope: NuraScope): void {
    const key = this.getActionKey(verb, scope)
    this.actions.delete(key)
    this.emit("action:unregistered", { verb, scope })
  }

  public async executeAction(verb: NuraVerb, scope: NuraScope, params?: Record<string, any>): Promise<void> {
    const hasPermission = await this.hasPermission(verb, scope)
    if (!hasPermission) {
      this.emit("permission:denied", { verb, scope })
      throw new Error(`Permission denied for action: ${verb} on ${scope}`)
    }

    const key = this.getActionKey(verb, scope)
    const action = this.actions.get(key)

    if (!action) {
      throw new Error(`Action not found: ${verb} on ${scope}`)
    }

    try {
      await action.handler(params)
      this.emit("action:executed", { verb, scope, params })
    } catch (error) {
      this.emit("action:error", { verb, scope, error })
      throw error
    }
  }

  public getActions(scope?: NuraScope): NuraAction[] {
    if (!scope) {
      return Array.from(this.actions.values())
    }

    return Array.from(this.actions.values()).filter((action) => action.scope === scope)
  }

  public async hasPermission(verb: NuraVerb, scope: NuraScope): Promise<boolean> {
    const permission = this.permissions.get(scope)

    if (!permission) {
      // No permission defined means allowed by default
      return true
    }

    // Check if verb is in allowed verbs
    if (!permission.verbs.includes(verb)) {
      return false
    }

    // Check condition if exists
    if (permission.condition) {
      return await permission.condition()
    }

    return true
  }

  public addPermission(permission: NuraPermission): void {
    this.permissions.set(permission.scope, permission)
    this.emit("permission:added", { scope: permission.scope })
  }

  public removePermission(scope: NuraScope): void {
    this.permissions.delete(scope)
    this.emit("permission:removed", { scope })
  }

  public async use(plugin: NuraPlugin): Promise<void> {
    if (this.plugins.has(plugin.name)) {
      console.warn(`Plugin ${plugin.name} is already installed`)
      return
    }

    await plugin.install(this)
    this.plugins.set(plugin.name, plugin)

    if (this.config.debug) {
      console.log(`[Nura] Plugin installed: ${plugin.name}@${plugin.version}`)
    }
  }

  public getConfig(): NuraConfig {
    return { ...this.config }
  }

  public destroy(): void {
    // Uninstall all plugins
    this.plugins.forEach((plugin) => {
      if (plugin.uninstall) {
        plugin.uninstall()
      }
    })

    // Clear all data
    this.actions.clear()
    this.permissions.clear()
    this.plugins.clear()
    this.listeners.clear()
  }
}
