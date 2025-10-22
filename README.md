# Nura.js

[![CI](https://github.com/nura-dev/nura/actions/workflows/ci.yml/badge.svg)](https://github.com/nura-dev/nura/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@nura/core?label=%40nura%2Fcore)](https://www.npmjs.com/package/@nura/core)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-ffa500.svg)](https://www.conventionalcommits.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)

> **Make your app breathe.** Nura.js is a TypeScript-first framework for shipping AI-friendly, accessible, and automation-ready web experiences across frameworks.

## ✨ Highlights

- **Semantic AI Layer** – Describe UI intent with structured metadata that agents and automation tools understand.
- **Framework Adapters** – First-party packages for React, Vue, and Svelte built on a shared core.
- **Voice & Multimodal Ready** – Optional voice plugin and lexicon tooling for natural language commands.
- **DX-Focused** – Strict TypeScript, SOLID-friendly architecture, and ergonomic developer tools.
- **Accessible by Design** – Encourages ARIA-aligned semantics and inclusive interactions.

## 🚀 Install in 60 Seconds

Pick your package manager:

```bash
# pnpm
pnpm add @nura/core

# npm
npm install @nura/core

# bun
bun add @nura/core
```

### Hello Nura (React)

```tsx
import { NuraProvider, useNuraCommand } from '@nura/react'

function App() {
  useNuraCommand('open-cart', ({ context }) => {
    console.log('Opening cart for', context.userId)
  })

  return (
    <NuraProvider>
      <button data-nura-command="open-cart">Open cart</button>
    </NuraProvider>
  )
}
```

More examples and framework-specific guides live in [`docs/recipes.md`](./docs/recipes.md).

## ✅ Compatibility

- **Runtime:** Node.js 18.18+ (ESM only)
- **Languages:** TypeScript 5.x with `strict` mode enabled
- **Frameworks:** Core works with any DOM environment. Official adapters exist for React 18+/19, Vue 3, and Svelte 4/5.

## 📚 Documentation

- [Getting Started](./docs/getting-started.md)
- [Architecture Overview](./docs/architecture.md)
- [Recipes & Examples](./docs/recipes.md)
- [Architecture Decision Records](./docs/adr)

Generated API documentation (via TypeDoc) will be published under `docs/api/` during releases.

Generate local API docs with:

```bash
pnpm run build:docs
```

## 🧭 Roadmap & Project Status

- Project maturity: **Alpha** – APIs may change, feedback welcome.
- See [`docs/roadmap.md`](./docs/roadmap.md) for quarterly goals including i18n, fuzzy matching, devtools, and framework adapters.

## 🧑‍💻 Contributing

We welcome contributions! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for branch strategy, Conventional Commits, and local development instructions. Issues and feature ideas should start with a Discussion or issue using our templates.

## 🔐 Security

Report vulnerabilities privately to [security@nura.dev](mailto:security@nura.dev). See [SECURITY.md](./SECURITY.md) for supported versions and disclosure timelines.

## 🤝 Support

If you have questions, open a Discussion or issue. See [SUPPORT.md](./SUPPORT.md) for details.

## 📄 License

Released under the [MIT License](./LICENSE) © Nura.js Maintainers.
