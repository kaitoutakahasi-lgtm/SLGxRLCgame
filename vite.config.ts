import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Electron用：相対パスでビルド
  base: './',
  build: {
    outDir: 'dist',
    // Electron向け最適化
    target: 'chrome128', // Electronの内蔵Chromiumバージョン
    minify: 'esbuild',
  },
  server: {
    port: 5173,
  },
})
