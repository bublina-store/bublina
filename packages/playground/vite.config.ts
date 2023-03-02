import path from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import AutoImport from 'unplugin-auto-import/vite'
import Unocss from 'unocss/vite'

export default defineConfig({
  resolve: {
    alias: {
      '@': `${path.resolve(__dirname, 'src')}/`,
      '@bublina/store': path.resolve(__dirname, '../store/index.ts')
    }
  },
  plugins: [
    Vue(),
    Pages({
      extensions: ['vue'],
      exclude: ['**/components/*.vue']
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-router'
      ],
      dts: true,
      dirs: [
        './src/composables'
      ],
      vueTemplate: true
    }),

    Unocss()
  ]
})
