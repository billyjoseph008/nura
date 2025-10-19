import { ref, onMounted, watch, toRef, type Ref } from "vue"
import type { NuraVerb, NuraScope } from "@nura/core"

export interface UseNuraElementOptions {
  scope: NuraScope | Ref<NuraScope>
  listen?: NuraVerb[] | Ref<NuraVerb[]>
  act?: NuraVerb[] | Ref<NuraVerb[]>
  meta?: Record<string, any> | Ref<Record<string, any>>
}

export function useNuraElement<T extends HTMLElement = HTMLElement>(options: UseNuraElementOptions) {
  const elementRef = ref<T | null>(null)

  const scopeRef = toRef(options, "scope")
  const listenRef = toRef(options, "listen")
  const actRef = toRef(options, "act")
  const metaRef = toRef(options, "meta")

  const updateAttributes = () => {
    if (!elementRef.value) return

    const element = elementRef.value

    // Set scope
    element.setAttribute("data-nu-scope", scopeRef.value)

    // Set listen verbs
    const listen = listenRef.value || []
    if (listen.length > 0) {
      element.setAttribute("data-nu-listen", listen.join(" "))
    } else {
      element.removeAttribute("data-nu-listen")
    }

    // Set act verbs
    const act = actRef.value || []
    if (act.length > 0) {
      element.setAttribute("data-nu-act", act.join(" "))
    } else {
      element.removeAttribute("data-nu-act")
    }

    // Set metadata
    const meta = metaRef.value
    if (meta && Object.keys(meta).length > 0) {
      element.setAttribute("data-nu-meta", JSON.stringify(meta))
    } else {
      element.removeAttribute("data-nu-meta")
    }
  }

  onMounted(() => {
    updateAttributes()
  })

  watch([scopeRef, listenRef, actRef, metaRef], () => {
    updateAttributes()
  })

  return elementRef
}
