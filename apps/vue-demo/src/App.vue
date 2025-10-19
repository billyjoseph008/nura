<template>
  <main class="demo">
    <section v-nu-listen.soft.scope="'ui'" class="panel">
      <h1>Nura Vue Demo</h1>
      <button
        v-nu-act="action"
        :aria-label="ariaLabel"
        class="action"
        type="button"
      >
        Órdenes
      </button>
      <button type="button" class="secondary" @click="toggleLabel">
        Alternar label (quita aria-label)
      </button>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const action = {
  type: 'open',
  target: 'menu:orders',
  meta: { desc: 'Abrir menú de órdenes' },
} as const

const hasLabel = ref(true)
const ariaLabel = computed(() => (hasLabel.value ? 'Abrir menú de órdenes' : undefined))

const toggleLabel = () => {
  hasLabel.value = !hasLabel.value
}
</script>

<style scoped>
.demo {
  min-height: 100vh;
  display: grid;
  place-items: center;
  font-family: system-ui, sans-serif;
  background: radial-gradient(circle at top left, #4ade80, #2563eb);
  color: #0f172a;
}

.panel {
  background: rgba(255, 255, 255, 0.92);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 15px 60px rgba(15, 23, 42, 0.35);
  display: grid;
  gap: 1rem;
  justify-items: start;
}

button {
  font: inherit;
  padding: 0.75rem 1.5rem;
  border-radius: 999px;
  border: none;
  cursor: pointer;
}

button.action {
  background: #2563eb;
  color: white;
}

button.secondary {
  background: transparent;
  color: #2563eb;
  border: 2px solid #2563eb;
}
</style>
