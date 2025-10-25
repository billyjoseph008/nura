# @nura/core

> Núcleo de Nura.js con runtime, entidades y utilidades lingüísticas para interfaces guiadas por agentes.

## Instalación

```bash
npm i @nura/core
# o
pnpm add @nura/core
```

## Uso mínimo

```ts
import {
  Nura,
  ContextManager,
  createRegistry,
  defineActionSpec,
  stripWake,
  detectLocale,
  parseNumeral,
  normalizeSynonyms,
} from '@nura/core'

const registry = createRegistry({
  actions: [
    defineActionSpec({
      name: 'open_orders',
      type: 'open',
      target: 'orders',
      phrases: {
        'es-CR': { canonical: ['abre órdenes'] },
      },
    }),
  ],
})

const nura = new Nura({ registry })

const context = new ContextManager({ locale: 'es-CR' })
context.set('customerId', 42)

const input = 'hey nura abre órdenes'
const withoutWake = stripWake(input, { wakeWords: ['hey nura'] })
const locale = detectLocale(withoutWake, ['es-CR', 'en-US'])
const amount = parseNumeral('quince', locale)
const normalized = normalizeSynonyms('Árbol', locale)

await nura.act({ type: 'open', target: 'orders', meta: { desc: `Abrir ${normalized}` } })
```

## APIs principales

* `Nura` — Orquesta ejecución de acciones registradas con permisos y telemetría.
* `createRegistry` — Construye un registro con acciones, entidades y agentes conectados.
* `ContextManager` — Administra contexto conversacional (locale, sesión, atributos).
* `stripWake` — Limpia frases detectando palabras de activación configuradas.
* `detectLocale` — Determina el locale más probable a partir de un texto.
* `parseNumeral` — Convierte tokens numéricos en valores `number`.
* `normalizeSynonyms` — Normaliza sinónimos para búsquedas y coincidencias.

## Tipos

* `NAction` — Representa una acción ejecutable por el runtime.
* `NRegistry` — Registro central con acciones, plugins y permisos.
* `NLocale` — Identificador de locale BCP 47 (`'es-CR'`, `'en-US'`, ...).
* `NAgent` — Plugin que aporta capacidades adicionales al registro.

## Enlaces

* Repo: [https://github.com/nura-dev/nura](https://github.com/nura-dev/nura)
* Issues: [https://github.com/nura-dev/nura/issues](https://github.com/nura-dev/nura/issues)
