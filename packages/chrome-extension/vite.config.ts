import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { chromeExtension } from "vite-plugin-chrome-extension"

export default defineConfig({
  plugins: [react(), chromeExtension()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },

  build: {
    rollupOptions: {
      input: {
        input: "src/manifest.json",
        popup: "src/popup.html",
        background: "src/background.ts",
        contentScript: "src/contentScript.ts",
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
  },
})
