# @nura/dom

> Indexador y escáner del DOM para descubrir verbos, scopes y metadatos de Nura directamente en el navegador.

## Instalación

```bash
npm i @nura/dom
# o
pnpm add @nura/dom
```

## Uso mínimo

```ts
import { DOMIndexer, scanDOM } from '@nura/dom'

const indexer = new DOMIndexer({ autoScan: true })
const indexed = indexer.getAll()
console.log('elementos indexados', indexed.length)

const snapshot = scanDOM(document.body)
console.log(snapshot.stats.byScope.orders)
```

## APIs principales

* `DOMIndexer` — Observa el DOM y mantiene un índice reactivo de elementos con `data-nu-*`.
* `scanDOM(root?)` — Realiza un escaneo puntual del árbol y devuelve métricas por scope y verbo.
* `findElementsByScope(scope)` — Busca nodos que pertenezcan a un scope concreto.
* `findElementsByVerb(verb)` — Devuelve elementos que escuchan o accionan un verbo dado.

## Tipos

* `DOMIndexerOptions` — Configuración para auto-scan y observación.
* `ScanResult` — Resultado completo de `scanDOM` con estadísticas y colecciones.
* `NuraElement` — Modelo del elemento indexado compatible con `@nura/core`.

## Enlaces

* Repo: [https://github.com/nura-dev/nura](https://github.com/nura-dev/nura)
* Issues: [https://github.com/nura-dev/nura/issues](https://github.com/nura-dev/nura/issues)
