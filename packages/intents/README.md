# @nura/intents

Core primitives for building intent-driven AI workflows in Nura.js applications. This package provides the contracts, default adapters, and the `IntentService` orchestration to create and approve intents.

## Installation

```bash
pnpm add @nura/intents
```

## Quick start

```ts
import {
  AjvSchemaValidator,
  Hex36IdGenerator,
  InMemoryIntentRegistry,
  InMemoryIntentStore,
  IntentService,
  SimplePolicyEngine,
  ConsoleAuditLogger,
} from '@nura/intents';

const registry = new InMemoryIntentRegistry();
const validator = new AjvSchemaValidator();
const policies = new SimplePolicyEngine();
const store = new InMemoryIntentStore();
const log = new ConsoleAuditLogger();
const ids = new Hex36IdGenerator();

const intents = new IntentService(registry, validator, policies, store, log, ids);

registry.register({
  type: 'app.echo',
  schema: {
    type: 'object',
    properties: { message: { type: 'string' } },
    required: ['message'],
    additionalProperties: false,
  },
  executor: async payload => ({ type: 'app.echo.result', payload }),
});

const response = await intents.createIntent({
  type: 'app.echo',
  payload: { message: 'hello' },
});
```

### Registering new intent types

At application bootstrap you should register all supported intents. A simple helper is to export a function from your host module that wires the registry and receives new specs:

```ts
import type { IntentRegistry, NIntentSpec } from '@nura/intents';

export function registerType(registry: IntentRegistry, spec: NIntentSpec): void {
  registry.register(spec);
}
```

## API surface

Only the symbols exported from `src/index.ts` are considered public. Everything else is internal and may change without notice.
