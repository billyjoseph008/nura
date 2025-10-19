import { createApp } from 'vue'
import App from './App.vue'
import { Nura, createRegistry } from '@nura/core'
import { withVue } from '@nura/vue'

const registry = createRegistry({
  config: { app: { id: 'demo-nura' } },
  actionCatalog: {
    async dispatch(action) {
      console.info('[demo] ejecutando acción', action)
      return { ok: true }
    },
  },
})

const nura = new Nura({ registry })

const app = createApp(App)
withVue(nura).install(app)
nura.start()

app.mount('#app')
