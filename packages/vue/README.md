# @nura/vue

Adaptador oficial de Vue 3 para Nura.js. Expone un instalador minimalista y directivas reactivas para marcar el árbol del DOM con metadatos de Nura.

## Instalación

```bash
pnpm add @nura/vue @nura/core vue
```

## Uso rápido

```ts
import { createApp } from 'vue'
import App from './App.vue'
import { Nura, createRegistry } from '@nura/core'
import { withVue } from '@nura/vue'

const registry = createRegistry({ config: { app: { id: 'demo-nura' } } })
const nura = new Nura({ registry })

const app = createApp(App)
withVue(nura).install(app)
nura.start()

app.mount('#app')
```

### `v-nu-listen`

Marca nodos que deben indexarse como oyentes dentro de Nura.

```vue
<section v-nu-listen.soft.scope="'ui'">
  ...
</section>
```

- Añade `data-nu-listen="dom"`.
- `v-nu-listen.soft` fuerza `data-nu-priority="soft"`.
- `v-nu-listen.deep` fuerza `data-nu-priority="hard"`.
- `v-nu-listen:scope="'ui'"` añade `data-nu-scope="ui"`.

### `v-nu-act`

Conecta elementos interactivos con acciones de Nura. Serializa la acción en `data-nu-act`, rellena `data-nu-desc` cuando la acción expone `meta.desc` (o `description` en acciones legadas) y dispara `nura.act(...)` en el click.

```vue
<button
  v-nu-act="{ type: 'open', target: 'menu:orders', meta: { desc: 'Abrir menú de órdenes' } }"
  aria-label="Abrir menú de órdenes"
>
  Órdenes
</button>
```

En desarrollo, si `data-nu-act` está presente pero el elemento no tiene `aria-label`, `aria-labelledby` o `data-nu-desc`, se emite un `console.warn` para ayudar con la accesibilidad.

## Demo

Incluimos un ejemplo con Vite en `apps/vue-demo` que muestra un botón con `v-nu-act` y un contenedor con `v-nu-listen`. Ejecuta:

```bash
pnpm --filter nura-vue-demo install
pnpm --filter nura-vue-demo run dev
```

## Licencia

MIT
