import { Nura, createRegistry, defineActionSpec } from '@nura/core'
import { seedLexicon } from '@nura/core/seeds/lexicon'
import { voiceAgent } from '@nura/plugin-voice'

type DemoContext = Parameters<ReturnType<typeof voiceAgent>['start']>[0]

const specs = [
  defineActionSpec({
    name: 'open_orders_menu',
    type: 'open',
    target: 'menu:orders',
    scope: 'ui',
    locale: 'es-CR',
    phrases: {
      'es-CR': {
        canonical: ['abre el menú de órdenes'],
        synonyms: ['abrir el menú de órdenes', 'mostrar órdenes'],
        labels: ['órdenes', 'menú'],
      },
      'en-US': {
        canonical: ['open orders menu'],
        synonyms: ['show orders', 'open the orders menu'],
        labels: ['orders', 'menu'],
      },
    },
  }),
  defineActionSpec({
    name: 'delete_order',
    type: 'delete',
    target: 'order',
    scope: 'orders',
    locale: 'es-CR',
    entities: [{ name: 'id', type: 'number' }],
    phrases: {
      'es-CR': {
        canonical: ['elimina la orden {id}'],
        synonyms: ['borra la orden {id}', 'eliminar orden {id}'],
        labels: ['orden', 'borrar'],
      },
      'en-US': {
        canonical: ['delete order {id}'],
        synonyms: ['remove order {id}'],
        labels: ['order', 'delete'],
      },
    },
    validate: (payload) => typeof payload?.id === 'number' && payload.id > 0,
  }),
]

const registry = createRegistry({
  config: { app: { id: 'demo-i18n', locale: 'es-CR' } },
  routes: {
    'open::menu:orders': async () => ({ ok: true }),
    'delete::order': async (payload) => ({ ok: true, message: `deleted ${payload?.id}` }),
  },
  specs,
  seedLexicon,
  i18n: {
    bundles: {
      'es-CR': {
        common: { ok: 'Aceptar', cancel: 'Cancelar' },
        ui: { orders_menu: 'Menú de Órdenes' },
      },
      'en-US': {
        common: { ok: 'OK', cancel: 'Cancel' },
        ui: { orders_menu: 'Orders Menu' },
      },
    },
  },
})

const nura = new Nura({ registry })
const agent = voiceAgent({ wakeWords: ['ok nura'], language: 'es-CR', keyWake: 'F2' })

nura.start()

const runtimeRegistry = (nura as any)['#registry'] ?? registry

agent.start({
  registry: runtimeRegistry,
  i18n: runtimeRegistry.i18n,
  lexicon: runtimeRegistry.lexicon,
  act: (action) => nura.act(action),
  select: (selector) => Array.from(document.querySelectorAll(selector)),
  audit: { log: () => {} },
} as DemoContext)
