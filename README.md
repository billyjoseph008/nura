# Nura.js

**Haz que tu app respire** / **Make your app breathe**

Nura.js is a framework for making web applications AI-friendly by adding semantic markup that AI agents, voice assistants, analytics tools, and RPA bots can understand and interact with.

## 🌟 Features

- **AI-Friendly Markup**: Semantic data attributes that describe your UI's intent
- **Framework Agnostic**: Core library works with vanilla JS, with adapters for React, Vue, and Svelte
- **Action Registry**: Centralized system for routing AI commands to your app
- **Voice Plugin**: Built-in voice interaction capabilities
- **DevTools**: Visual overlay for development and debugging
- **Type-Safe**: Full TypeScript support

## 📦 Packages

- `@nura/core` - Core registry and types
- `@nura/dom` - DOM indexing and scanning
- `@nura/react` - React hooks and components
- `@nura/vue` - Vue directives and composables
- `@nura/svelte` - Svelte actions and stores
- `@nura/plugin-voice` - Voice interaction plugin
- `@nura/devtools` - Development tools overlay

## 🚀 Quick Start

\`\`\`bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Build all packages
pnpm build
\`\`\`

## 📖 Documentation

See the [documentation](./docs) for detailed guides and API references.

## 🛠️ CI/CD

- Pull requests run linting, testing, and build checks through GitHub Actions.
- Preview deployments on Vercel have been fully disabled—PRs no longer trigger Vercel checks or comments.
- No Vercel credentials or configuration files are required for local development.

## 🎨 Branding

- **Primary Color**: `#00D9FF` (Cyan)
- **Secondary Color**: `#FF006B` (Magenta)
- **Slogan**: "Haz que tu app respire" / "Make your app breathe"

## 📄 License

MIT
