# Integración MCP en la demo de Nura

Esta guía describe cómo la demo de Vue conecta con servidores MCP mediante un gateway WebSocket y cómo validar la integración extremo a extremo.

## Arquitectura

```text
┌──────────────┐      wss://<gateway>/mcp       ┌─────────────────────┐
│ Navegador    │ ─────────────────────────────► │ Gateway WebSocket   │
│ (Vue + Nura) │ ◄───────────────────────────── │ (proxy MCP)         │
└─────┬────────┘                                └─────────┬───────────┘
      │                                                ┌──▼──────────────┐
      │  window.__nura.act()                          │ Servidor MCP    │
      └──────────────────────────────┐                │ (filesystem,    │
                                      ▼               │ órdenes, etc.)  │
                               Registro de Nura       └─────────────────┘
```

- El cliente MCP (`src/nura/mcp/client.ts`) abre la conexión WebSocket y expone utilidades para listar resources/tools y ejecutar tools.
- `src/nura/mcp/registry.ts` mantiene el mapeo seguro entre intents de Nura y herramientas MCP.
- `src/nura/bootstrap.ts` intercepta `nura.act(...)`, intenta resolver el intent vía MCP y, si falla, vuelve al manejador local.
- `App.vue` ofrece la UI para conectar, listar y visualizar telemetría.

## Puesta en marcha

1. Instala dependencias en la raíz del repositorio:
   ```bash
   pnpm install
   ```
2. Arranca la demo de Vue:
   ```bash
   pnpm --filter nura-vue-demo dev
   ```
3. Inicia tu servidor MCP y expón un gateway WebSocket accesible (por defecto `wss://localhost:8787/mcp`).
4. Abre la demo y establece la URL del gateway en el campo **Gateway WS URL** antes de conectar.

## Mapeos Nura ↔ MCP

| Intent Nura (`type::target`) | Tool MCP            | Argumentos                                     |
| ---------------------------- | ------------------- | ---------------------------------------------- |
| `open::menu:orders`          | `filesystem.readFile` | `{ path: './data/orders.json' }`               |
| `delete::order`              | `orders.delete`       | `{ id: <ID numérico proveniente del payload> }` |

> Los argumentos se sanitizan antes de invocar herramientas y sólo se permite ejecutar tools listados en `NURA_TO_MCP`.

## Telemetría relevante

- `mcp.client.connecting` / `mcp.client.connected` / `mcp.client.disconnected`
- `mcp.tool.called { name, args, ms }`
- `mcp.tool.error { name, message }`
- `nura.act.completed { via: 'mcp' | 'local' }`

Todos los eventos aparecen en el panel lateral de la demo y se pueden consumir vía `window.__nura.telemetry`.

## Checklist de pruebas manuales

- [ ] **Conexión:** ingresar `wss://localhost:8787/mcp`, pulsar **Conectar MCP** y confirmar el evento `mcp.client.connected`.
- [ ] **Listado:** con la conexión activa, ejecutar **Listar resources** y **Listar tools** sin errores; validar que se muestra el JSON resultante.
- [ ] **Intent → Tool (`open`)**: hacer clic en “Órdenes” → verificar evento `mcp.tool.called` con `filesystem.readFile` y latencia registrada.
- [ ] **Intent → Tool (`delete`)**: enviar “Eliminar orden” con un ID válido → confirmar `mcp.tool.called` (`orders.delete`) y el indicador `via: 'mcp'`.
- [ ] **Fallback:** detener el gateway MCP y repetir los intents; la telemetría debe indicar `via: 'local'` sin romper la UI.
- [ ] **Latencia:** revisar los valores `ms` en `mcp.tool.called` (p95 objetivo < 800 ms en local).
- [ ] **Seguridad:** disparar un intent no mapeado; debe ignorarse o resolverse localmente sin invocar MCP.

## Consideraciones de seguridad

- Los argumentos enviados a MCP se filtran para aceptar sólo valores primitivos, arrays y objetos simples.
- `NURA_TO_MCP` actúa como whitelist estricta: no se ejecutan tools que no estén registrados.
- Las acciones destructivas (`delete::order`) solicitan confirmación mediante `window.confirm` antes de enviarse.
- Si una tool falla, se emite `mcp.tool.error` y la ejecución vuelve al manejador local, evitando estados inconsistentes.

## Compatibilidad con la demo existente

Si MCP no está disponible, `maybeRunMcp` devuelve `undefined` y `nura.act` continúa con la lógica original. Los componentes existentes siguen funcionando gracias al fallback local y a la re-asignación de `nura.act` en `installNuraBridge`.
