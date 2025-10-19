<template>
  <component :is="as" ref="elementRef">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { useNuraElement } from "../composables/use-nura-element"
import type { NuraVerb, NuraScope } from "@nura/core"

interface Props {
  scope: NuraScope
  listen?: NuraVerb[]
  act?: NuraVerb[]
  meta?: Record<string, any>
  as?: string
}

const props = withDefaults(defineProps<Props>(), {
  listen: () => [],
  act: () => [],
  meta: () => ({}),
  as: "div",
})

const elementRef = useNuraElement({
  scope: props.scope,
  listen: props.listen,
  act: props.act,
  meta: props.meta,
})
</script>
