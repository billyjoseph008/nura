# @nura/client

TypeScript SDK for interacting with the Nura intents HTTP API. Includes a minimal `AiClient` wrapper and a UI dispatcher to route `NIntentResult` payloads to UI handlers.

## Installation

```bash
pnpm add @nura/client
```

## Usage

```ts
import { AiClient, UiDispatcher } from '@nura/client';

const client = new AiClient('https://api.example.com');
const dispatcher = new UiDispatcher();

dispatcher.register('app.echo.result', payload => {
  console.log('Render payload', payload);
});

const response = await client.createIntent({
  type: 'app.echo',
  payload: { message: 'Hello from the SDK' },
});

if (response.result) {
  dispatcher.dispatch(response.result);
}
```

See `@nura/intents` and `@nura/transport-http` for server-side integration details.
