import { onMounted, onBeforeUnmount, ref, watch, toRef, type Ref } from "vue"
import { useNuraInstance } from "../plugin"
import type { NuraVerb, NuraScope, NuraPermission } from "@nura/core"

export interface UseNuraPermissionOptions {
  scope: NuraScope | Ref<NuraScope>
  verbs: NuraVerb[] | Ref<NuraVerb[]>
  condition?: (() => boolean | Promise<boolean>) | Ref<() => boolean | Promise<boolean>>
}

export function useNuraPermission(options: UseNuraPermissionOptions) {
  const { registry } = useNuraInstance()

  const scopeRef = toRef(options, "scope")
  const verbsRef = toRef(options, "verbs")
  const conditionRef = toRef(options, "condition")

  const register = () => {
    const permission: NuraPermission = {
      scope: scopeRef.value,
      verbs: verbsRef.value,
      condition: conditionRef.value,
    }

    registry.addPermission(permission)
  }

  const unregister = () => {
    registry.removePermission(scopeRef.value)
  }

  onMounted(() => {
    register()
  })

  onBeforeUnmount(() => {
    unregister()
  })

  watch([scopeRef, verbsRef, conditionRef], () => {
    unregister()
    register()
  })
}

export function useHasPermission(verb: NuraVerb | Ref<NuraVerb>, scope: NuraScope | Ref<NuraScope>) {
  const { registry } = useNuraInstance()
  const hasPermission = ref(true)

  const verbRef = toRef(verb)
  const scopeRef = toRef(scope)

  const check = async () => {
    hasPermission.value = await registry.hasPermission(verbRef.value, scopeRef.value)
  }

  onMounted(() => {
    check()
  })

  watch([verbRef, scopeRef], () => {
    check()
  })

  return hasPermission
}
