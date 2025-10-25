# @nura/svelte

> Adaptador oficial de Svelte para inicializar Nura.js con stores, acciones y componentes listos para el DOM semántico.

## Instalación

```bash
npm i @nura/svelte
# o
pnpm add @nura/svelte
```

## Uso mínimo

```svelte
<script lang="ts">
  import { initNura, NuraProvider, nuraAction } from '@nura/svelte'
  import { defineActionSpec } from '@nura/core'

  const { registry } = initNura({
    actions: [
      defineActionSpec({ name: 'open_orders', type: 'open', target: 'orders' }),
    ],
  })
</script>

<NuraProvider {registry}>
  <button use:nuraAction={{ name: 'open_orders' }} data-nu-scope="orders">
    Abrir órdenes
  </button>
</NuraProvider>
```

## APIs principales

* `initNura` — Crea el registro y deja el contexto disponible para el árbol de Svelte.
* `NuraProvider` — Componente envoltorio que expone contexto y atributos `data-nu-*`.
* `nura` — Acción para sincronizar atributos y telemetría de elementos interactivos.
* `nuraAction` — Acción específica para registrar intents y ejecutar acciones.
* `createNuraStore` — Store derivado con helpers para el runtime y permisos.

## Tipos

* `NuraContext` — Objeto compartido con `registry` e indexer DOM.
* `NuraActionParams` — Parámetros para la acción `nura` (scope, meta, etc.).
* `UseNuraReturn` — Resultado helper para acceder al runtime desde scripts.
* `UseNuraActionOptions` — Configuración para recuperar acciones reactivas.

## Enlaces

* Repo: [https://github.com/nura-dev/nura](https://github.com/nura-dev/nura)
* Issues: [https://github.com/nura-dev/nura/issues](https://github.com/nura-dev/nura/issues)
