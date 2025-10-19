# Contributing to Nura.js

Thank you for your interest in contributing to Nura.js! This document provides guidelines for contributing.

## Development Setup

1. Clone the repository:

\`\`\`bash
git clone https://github.com/nurajs/nura.git
cd nura
\`\`\`

2. Install dependencies:

\`\`\`bash
pnpm install
\`\`\`

3. Build all packages:

\`\`\`bash
pnpm build
\`\`\`

4. Start development:

\`\`\`bash
pnpm dev
\`\`\`

## Project Structure

\`\`\`
nura/
├── packages/
│   ├── core/          # Core registry and types
│   ├── dom/           # DOM indexing
│   ├── react/         # React adapter
│   ├── vue/           # Vue adapter
│   └── svelte/        # Svelte adapter
├── apps/
│   └── demo/          # Demo application
├── docs/              # Documentation
└── scripts/           # Build scripts
\`\`\`

## Development Workflow

1. Create a new branch:

\`\`\`bash
git checkout -b feature/your-feature-name
\`\`\`

2. Make your changes

3. Run tests:

\`\`\`bash
pnpm test
\`\`\`

4. Run linting:

\`\`\`bash
pnpm lint
\`\`\`

5. Build packages:

\`\`\`bash
pnpm build
\`\`\`

6. Commit your changes:

\`\`\`bash
git commit -m "feat: add new feature"
\`\`\`

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Build process or auxiliary tool changes

7. Push and create a pull request:

\`\`\`bash
git push origin feature/your-feature-name
\`\`\`

## Code Style

- Use TypeScript for all code
- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

## Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Aim for high test coverage

## Documentation

- Update documentation for new features
- Add JSDoc comments to public APIs
- Include examples in documentation
- Keep README files up to date

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Update the documentation
3. The PR will be merged once you have approval from maintainers

## Reporting Issues

When reporting issues, please include:

- Nura.js version
- Framework and version (React, Vue, Svelte)
- Browser and version
- Steps to reproduce
- Expected behavior
- Actual behavior
- Code example if possible

## Feature Requests

We welcome feature requests! Please:

- Check if the feature already exists
- Explain the use case
- Provide examples if possible
- Be open to discussion

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn

## Questions?

- Open an issue for questions
- Join our Discord community
- Check existing documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing to Nura.js!
