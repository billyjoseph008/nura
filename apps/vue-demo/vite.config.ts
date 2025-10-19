import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@nura/core': fileURLToPath(new URL('../../packages/core/src', import.meta.url)),
      '@nura/vue': fileURLToPath(new URL('../../packages/vue/src', import.meta.url)),
    },
  },
})
