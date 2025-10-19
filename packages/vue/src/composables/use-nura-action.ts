import { onMounted, onBeforeUnmount, watch, toRef, type Ref } from "vue"
import { useNuraInstance } from "../plugin"
import type { NuraAction, NuraVerb, NuraScope } from "@nura/core"

export interface UseNuraActionOptions {
  verb: NuraVerb | Ref<NuraVerb>
  scope: NuraScope | Ref<NuraScope>
  handler: (params?: Record<string, any>) => void | Promise<void>
  description?: string | Ref<string>
  metadata?: Record<string, any> | Ref<Record<string, any>>
  enabled?: boolean | Ref<boolean>
}

export function useNuraAction(options: UseNuraActionOptions) {
  const { registry } = useNuraInstance()

  const verbRef = toRef(options, "verb")
  const scopeRef = toRef(options, "scope")
  const descriptionRef = toRef(options, "description")
  const metadataRef = toRef(options, "metadata")
  const enabledRef = toRef(options, "enabled")

  const register = () => {
    if (enabledRef.value === false) return

    const action: NuraAction = {
      verb: verbRef.value,
      scope: scopeRef.value,
      handler: options.handler,
      description: descriptionRef.value,
      metadata: metadataRef.value,
    }

    registry.registerAction(action)
  }

  const unregister = () => {
    registry.unregisterAction(verbRef.value, scopeRef.value)
  }

  onMounted(() => {
    register()
  })

  onBeforeUnmount(() => {
    unregister()
  })

  // Watch for changes and re-register
  watch([verbRef, scopeRef, descriptionRef, metadataRef, enabledRef], () => {
    unregister()
    register()
  })

  const execute = async (params?: Record<string, any>) => {
    return registry.executeAction(verbRef.value, scopeRef.value, params)
  }

  return { execute }
}
