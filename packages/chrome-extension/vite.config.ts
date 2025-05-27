import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest })],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        // Auth iframe for handling authentication
        // Has to load a separate unchanged html file
        auth: resolve(__dirname, 'auth.html'),
      },
    },
  },
  server: {
    origin: 'http://localhost:5173', // ensures the dev server uses this origin
    cors: {
      origin: '*', // loosen CORS policy during development
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
})
