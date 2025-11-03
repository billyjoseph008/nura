# @nura/transport-http

HTTP transport bindings for the Nura intents service. This package ships an Express router that exposes the generic `/ai/intents` endpoints with rate limiting, idempotency, and JSON-only responses.

## Installation

```bash
pnpm add @nura/transport-http
```

## Usage

```ts
import express from 'express';
import {
  AjvSchemaValidator,
  ConsoleAuditLogger,
  Hex36IdGenerator,
  InMemoryIntentRegistry,
  InMemoryIntentStore,
  IntentService,
  SimplePolicyEngine,
} from '@nura/intents';
import { createIntentRouter } from '@nura/transport-http';

const registry = new InMemoryIntentRegistry();
const service = new IntentService(
  registry,
  new AjvSchemaValidator(),
  new SimplePolicyEngine(),
  new InMemoryIntentStore(),
  new ConsoleAuditLogger(),
  new Hex36IdGenerator(),
);

registry.register({
  type: 'app.echo',
  schema: { type: 'object', properties: { message: { type: 'string' } }, required: ['message'] },
  executor: async payload => ({ type: 'app.echo.result', payload }),
});

const app = express();
app.use(createIntentRouter({ service }));
```

The host application is responsible for registering `NIntentSpec` definitions before mounting the router. See `@nura/intents` for more information on the registry contract.
