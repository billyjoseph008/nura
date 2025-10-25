# @nura/plugin-fuzzy

> Utilidades de coincidencia difusa, fonética y tokenizada utilizadas por Nura.js y sus plugins de voz.

## Instalación

```bash
npm i @nura/plugin-fuzzy
# o
pnpm add @nura/plugin-fuzzy
```

## Uso mínimo

```ts
import { matchFuzzy, tokenizeAndScore, compareWakeWord } from '@nura/plugin-fuzzy'

const brands = ['Nura', 'Núria', 'Nero']
const match = matchFuzzy('nura', brands, { locale: 'es' })

const tokens = tokenizeAndScore('abre el modo noche', ['modo noche', 'modo día'])

const wake = compareWakeWord('hey nura', { canonical: 'hey nura', aliases: ['hola nura'] })
```

## APIs principales

* `matchFuzzy` — Puntúa candidatos y devuelve la mejor coincidencia según la estrategia seleccionada.
* `tokenizeAndScore` — Evalúa token por token contra una lista de candidatos y devuelve los mejores empates.
* `compareWakeWord` — Compara entradas de audio/texto contra palabras de activación canonizadas.
* `damerauLevenshteinSimilarity` — Similaridad basada en ediciones transpuestas.

## Tipos

* `FuzzyMatchOpts` — Opciones de estrategia, locale y umbrales.
* `MatchResult` — Resultado de `matchFuzzy` con estrategia y tokens coincidentes.
* `TokenScore` — Resultado granular por token utilizado en `tokenizeAndScore`.
* `FuzzyStrategy` — Estrategias disponibles (`'hybrid'`, `'damerau'`, ...).

## Enlaces

* Repo: [https://github.com/nura-dev/nura](https://github.com/nura-dev/nura)
* Issues: [https://github.com/nura-dev/nura/issues](https://github.com/nura-dev/nura/issues)
