# Nura.js

> **Haz que tu app respire.** Nura.js es un framework creado en TypeScript para entregar experiencias web accesibles, compatibles con IA y preparadas para automatización sin importar el framework que uses.

## ✨ Destacados

- **Capa semántica para IA** – Describe la intención de la interfaz con metadatos estructurados que agentes y herramientas de automatización entienden.
- **Adaptadores por framework** – Paquetes oficiales para React, Vue y Svelte construidos sobre un núcleo compartido.
- **Listo para voz y multimodalidad** – Plugin opcional de voz y tooling léxico para comandos en lenguaje natural.
- **DX ante todo** – TypeScript estricto, arquitectura orientada a SOLID y herramientas ergonómicas para desarrolladores.
- **Accesibilidad incorporada** – Promueve semántica alineada con ARIA e interacciones inclusivas.

## 🚀 Instalación en 60 segundos

Elige tu gestor de paquetes:

```bash
# pnpm
pnpm add @nura/core

# npm
npm install @nura/core

# bun
bun add @nura/core
```

### Hola Nura (React)

```tsx
import { NuraProvider, useNuraCommand } from '@nura/react'

function App() {
  useNuraCommand('open-cart', ({ context }) => {
    console.log('Abriendo carrito para', context.userId)
  })

  return (
    <NuraProvider>
      <button data-nura-command="open-cart">Abrir carrito</button>
    </NuraProvider>
  )
}
```

Más ejemplos y guías específicas por framework viven en [`docs/tutorials/recipes.md`](../../tutorials/recipes.md).

## ✅ Compatibilidad

- **Runtime:** Node.js 18.18+ (solo ESM)
- **Lenguajes:** TypeScript 5.x con `strict` activado
- **Frameworks:** El núcleo funciona en cualquier entorno DOM. Hay adaptadores oficiales para React 18+/19, Vue 3 y Svelte 4/5.

## 📚 Documentación

- [Inicio rápido](./getting-started.md)
- [Resumen de arquitectura](../../internals/architecture.md)
- [Recetas y ejemplos](../../tutorials/recipes.md)
- [Registros de decisiones de arquitectura](../../adr)

La documentación de API generada con TypeDoc se publica bajo `docs/api/` durante los releases.

Genera la documentación de API localmente con:

```bash
pnpm run build:docs
```

## 🧭 Hoja de ruta y estado

- Madurez del proyecto: **Alfa** – Las APIs pueden cambiar, feedback bienvenido.
- Consulta [`docs/community/roadmap.md`](../../community/roadmap.md) para ver los objetivos trimestrales incluyendo i18n, fuzzy matching, devtools y adaptadores.

## 🧑‍💻 Contribuir

¡Las contribuciones son bienvenidas! Lee [CONTRIBUTING.md](../../community/contributing.md) para conocer la estrategia de ramas, Conventional Commits e instrucciones de desarrollo local. Las ideas y propuestas deben iniciar en una Discusión o issue usando nuestros templates.

## 🔐 Seguridad

Reporta vulnerabilidades en privado a [security@nura.dev](mailto:security@nura.dev). Revisa [SECURITY.md](../../community/security.md) para versiones soportadas y tiempos de divulgación.

## 🤝 Soporte

Si tienes preguntas, abre una Discusión o issue. Revisa [SUPPORT.md](../../SUPPORT.md) para más detalles.

## 📄 Licencia

Distribuido bajo la [licencia MIT](../../LICENSE) © Mantenedores de Nura.js.
