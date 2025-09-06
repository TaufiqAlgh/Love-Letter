import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VueDevTools from 'vite-plugin-vue-devtools';

export default defineConfig({
  define: {
    'process.env': {}
  },
  plugins: [
    vue(),
    VueDevTools()],
  build: {
    lib: {
      entry: 'src/main.js',
      name: 'kintone-vue'
    },
    rollupOptions: {
      output: {
        format: 'iife', // pastikan ke format iief agar hasil build menjadi vannila javascript
        entryFileNames: 'kintone-vue.js', // sesuaikan penamaan hasil build dengan nama file yang di inginkan
        assetFileNames: 'style-vue.css', // ignore karena kintone menyarankan css dan style di manage setiap view
        chunkFileNames: 'chunk-[name].js', // ignore karena belum ada support kintone build dengan split file
        manualChunks: undefined
      }
    },
    outDir: './dist' // definisi nama folder build
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});
