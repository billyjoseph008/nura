# @nura/vue

> Adaptador oficial de Vue 3 para exponer directivas y provide/inject del runtime de Nura.js.

## Instalación

```bash
npm i @nura/vue
# o
pnpm add @nura/vue
```

## Uso mínimo

```ts
import { createApp } from 'vue'
import { Nura, createRegistry, defineActionSpec } from '@nura/core'
import { withVue } from '@nura/vue'
import App from './App.vue'

const registry = createRegistry({
  actions: [defineActionSpec({ name: 'open_orders', type: 'open', target: 'orders' })],
})

const nura = new Nura({ registry })

createApp(App)
  .use(withVue(nura))
  .mount('#app')
```

```vue
<template>
  <button v-nu-act="action" v-nu-listen="'open'" data-nu-scope="orders">
    Abrir órdenes
  </button>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import { NURA_KEY } from '@nura/vue'

const nura = inject(NURA_KEY)
const action = nura?.registry.actions.find('open_orders')
</script>
```

## APIs principales

* `withVue` — Plugin que registra directivas `v-nu-*` y expone el runtime vía provide/inject.
* `NURA_KEY` — Clave de inyección para recuperar la instancia de `Nura`.
* `nu-act` — Directiva que serializa acciones en atributos `data-nu-act` y maneja clicks.
* `nu-listen` — Directiva para marcar scopes y prioridades de escucha en el DOM.

## Tipos

* `GuardBinding` — Configuración para la directiva de guardia de permisos.
* `InjectionKey<Nura>` — Tipo de la clave `NURA_KEY` para TypeScript.
* `NuActElement` — Elemento extendido que gestiona metadata de acciones.

## Enlaces

* Repo: [https://github.com/nura-dev/nura](https://github.com/nura-dev/nura)
* Issues: [https://github.com/nura-dev/nura/issues](https://github.com/nura-dev/nura/issues)
