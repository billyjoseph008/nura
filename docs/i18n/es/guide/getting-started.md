# Guía de inicio

¡Bienvenido a Nura.js! Esta guía te muestra cómo instalar dependencias, arrancar un proyecto y registrar tu primer comando compatible con agentes.

## Requisitos previos

- Node.js 18.18 o superior
- pnpm 8+ (vía Corepack) o npm/bun si lo prefieres
- TypeScript 5 con modo `strict` activado

## Instala el paquete core

```bash
pnpm add @nura/core
```

¿Necesitas helpers para un framework?

- React: `pnpm add @nura/react`
- Vue: `pnpm add @nura/vue`
- Svelte: `pnpm add @nura/svelte`

## Inicializa Nura.js

Crea un punto de entrada que configure el provider de tu app. Ejemplo en React:

```tsx
import { NuraProvider } from '@nura/react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <NuraProvider>
    <App />
  </NuraProvider>
)
```

## Define tu primer comando

Los comandos conectan intenciones estructuradas con lógica ejecutable.

```tsx
import { useNuraCommand } from '@nura/react'

export function CheckoutButton() {
  useNuraCommand('checkout', ({ context }) => {
    console.log('Finalizando compra para', context.userId)
  })

  return (
    <button data-nura-command="checkout">Finalizar compra</button>
  )
}
```

- `data-nura-command` expone la acción a agentes, lectores de pantalla y otras herramientas.
- `useNuraCommand` registra el handler con metadatos conscientes del contexto.

## Ejecuta localmente

```bash
pnpm install
pnpm dev
```

`pnpm dev` usa TurboRepo para ejecutar todos los workspaces activos en modo watch.

## Próximos pasos

- Explora las [recetas](../../tutorials/recipes.md) para escenarios más complejos como slot filling y validaciones.
- Lee la [arquitectura](../../internals/architecture.md) para entender los bloques principales.
- Sigue las novedades en la [hoja de ruta](../../community/roadmap.md).
