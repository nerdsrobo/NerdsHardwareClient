import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: "./out-web/main"
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      outDir: "./out-web/preload"
    }
  },
  renderer: {
    plugins: [svelte()],
    build: {
      outDir: "./out-web/renderer"
    }
  }
})
