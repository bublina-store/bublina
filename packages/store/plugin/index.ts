import type { App } from 'vue'
import type { StoreProvider } from '../storeProvider'
import { createStoreProvider } from '../storeProvider'
import { setupDevtools } from '../devtools'

const __CONTEXT_PROVIDER_SYMBOL = Symbol('contextProvider')

export type PluginOptions = {
  storeProvider?: StoreProvider,
  devtools?: boolean
}

export default {
  install: (app: App, options: PluginOptions = { devtools: true }) => {
    const storeProvider = options.storeProvider ?? createStoreProvider()

    app.provide(__CONTEXT_PROVIDER_SYMBOL, storeProvider)

    if (options.devtools && (process.env.NODE_ENV === 'development' || __VUE_PROD_DEVTOOLS__)) {
      setupDevtools(app, { contextProvider: storeProvider })
    }
  }
}

export const useStoreProvider = () => inject(__CONTEXT_PROVIDER_SYMBOL) as StoreProvider
