import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import VitePluginMd from 'vite-plugin-md' // Import vite-plugin-md

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),          // React plugin for Vite
    VitePluginMd()     // Add the markdown plugin here
  ],
})
