import type { Directive } from "vue"
import type { NuraVerb, NuraScope } from "@nura/core"

export interface VNuraBinding {
  scope: NuraScope
  listen?: NuraVerb[]
  act?: NuraVerb[]
  meta?: Record<string, any>
}

export const vNura: Directive<HTMLElement, VNuraBinding> = {
  mounted(el, binding) {
    const { scope, listen = [], act = [], meta } = binding.value

    // Set scope
    el.setAttribute("data-nu-scope", scope)

    // Set listen verbs
    if (listen.length > 0) {
      el.setAttribute("data-nu-listen", listen.join(" "))
    }

    // Set act verbs
    if (act.length > 0) {
      el.setAttribute("data-nu-act", act.join(" "))
    }

    // Set metadata
    if (meta && Object.keys(meta).length > 0) {
      el.setAttribute("data-nu-meta", JSON.stringify(meta))
    }
  },

  updated(el, binding) {
    const { scope, listen = [], act = [], meta } = binding.value

    // Update scope
    el.setAttribute("data-nu-scope", scope)

    // Update listen verbs
    if (listen.length > 0) {
      el.setAttribute("data-nu-listen", listen.join(" "))
    } else {
      el.removeAttribute("data-nu-listen")
    }

    // Update act verbs
    if (act.length > 0) {
      el.setAttribute("data-nu-act", act.join(" "))
    } else {
      el.removeAttribute("data-nu-act")
    }

    // Update metadata
    if (meta && Object.keys(meta).length > 0) {
      el.setAttribute("data-nu-meta", JSON.stringify(meta))
    } else {
      el.removeAttribute("data-nu-meta")
    }
  },

  unmounted(el) {
    el.removeAttribute("data-nu-scope")
    el.removeAttribute("data-nu-listen")
    el.removeAttribute("data-nu-act")
    el.removeAttribute("data-nu-meta")
  },
}
