import { defineConfig } from 'vite'
import path from 'path'
import compression from 'vite-plugin-compression'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@data': path.resolve(__dirname, './src/data'),
      '@images': path.resolve(__dirname, './src/assets/images')
    }
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          if (id.includes('/src/utils/')) {
            return 'utils';
          }
          if (id.includes('/src/data/')) {
            return 'data';
          }
        }
      }
    },
    assetsDir: 'assets',
    copyPublicDir: true  // S'assure que les fichiers publics sont copiés
  },
  plugins: [
    compression(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'HTTP Code Game',
        short_name: 'HTTPCode',
        theme_color: '#ffffff'
      }
    })
  ]
})