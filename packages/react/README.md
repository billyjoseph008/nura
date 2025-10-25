# @nura/react

> Adaptador oficial de React para consumir el runtime de Nura.js con hooks y componentes declarativos.

## Instalación

```bash
npm i @nura/react
# o
pnpm add @nura/react
```

## Uso mínimo

```tsx
import { createRegistry } from '@nura/core'
import { NuraProvider, useNuraAction } from '@nura/react'

const registry = createRegistry({ /* acciones y plugins */ })

function App() {
  return (
    <NuraProvider registry={registry}>
      <OrdersButton />
    </NuraProvider>
  )
}

function OrdersButton() {
  const action = useNuraAction('open_orders')
  return (
    <button onClick={() => action?.run?.()} data-nu-act={JSON.stringify(action?.spec)}>
      Abrir órdenes
    </button>
  )
}
```

## APIs principales

* `NuraProvider` — Inyecta el registro de Nura en el árbol de React.
* `useNura` — Devuelve el runtime `Nura` y helpers para disparar acciones.
* `useNuraAction` — Resuelve una acción por nombre y expone métodos de ejecución.
* `useNuraPermission` — Comprueba permisos declarativos en componentes.
* `NuraElement` — Componente helper que serializa acciones y atributos `data-nu-*`.

## Tipos

* `NuraProviderProps` — Props del provider con registro y opciones de contexto.
* `UseNuraReturn` — Resultado del hook `useNura` con runtime y registro.
* `UseNuraActionOptions` — Opciones para `useNuraAction` (scope, argumentos, etc.).
* `NuraElementProps` — Props del wrapper que sincroniza atributos accesibles.

## Enlaces

* Repo: [https://github.com/nura-dev/nura](https://github.com/nura-dev/nura)
* Issues: [https://github.com/nura-dev/nura/issues](https://github.com/nura-dev/nura/issues)
