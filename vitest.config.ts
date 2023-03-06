import AutoImport from 'unplugin-auto-import/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    AutoImport({
      imports: [
        'vue',
        'vitest',
        // {
        //   from: 'vue',
        //   imports: ['App', 'Ref'],
        //   type: true
        // },
        {
          from: 'vitest',
          imports: ['expectTypeOf']
        },
        {
          from: '@vue/test-utils',
          imports: ['mount']
        }
      ],
      eslintrc: {
        enabled: true
      }
    })
  ],
  resolve: {
    alias: {
      '@bublina/store': './packages/store/index.ts'
    }
  },
  test: {
    globals: true,
    environment: 'happy-dom'
  }
})
