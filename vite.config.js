import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    port: 8080,
    host: '0.0.0.0',
    open: true,
    strictPort: false,
    https: false,
    proxy: {

      '/user': {
        target: 'http://localhost:7777',
        changeOrigin: true,
        secure: false
      },
      '/login': {
        target: 'http://localhost:7777',
        changeOrigin: true,
        secure: false
      },
      '/sale': {
        target: 'http://localhost:7777',
        changeOrigin: true,
        secure: false
      },

      '/post': {
        target: 'http://localhost:7777',
        changeOrigin: true,
        secure: false
      },
      '/ip?key=YHZBZ-7WPR4-AXQUK-FUHOR-5YQYH-NAFTH': {
        target: 'https://apis.map.qq.com/ws/location/v1',
        changeOrigin: true,
        secure: true
      }
    }
  },
})
