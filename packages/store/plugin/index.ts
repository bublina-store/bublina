import type { App } from 'vue'
import type { StoreProvider } from '../storeProvider'
import { createStoreProvider } from '../storeProvider'
import { setupDevtools } from '../devtools'

const __STORE_PROVIDER_SYMBOL = Symbol('storeProvider')

export type PluginOptions = {
  storeProvider?: StoreProvider,
  devtools?: boolean,
  cacheTime?: number
}

const defaultOptions = {
  devtools: true
}

export default {
  install: (app: App, pluginOptions?: PluginOptions) => {
    const options = {
      ...defaultOptions,
      ...pluginOptions
    }

    const storeProvider = options.storeProvider ?? createStoreProvider({ cacheTime: options.cacheTime })

    app.provide(__STORE_PROVIDER_SYMBOL, storeProvider)

    if (options.devtools && (process.env.NODE_ENV === 'development' || __VUE_PROD_DEVTOOLS__)) {
      setupDevtools(app, { contextProvider: storeProvider })
    }
  }
}

export const useStoreProvider = () => inject(__STORE_PROVIDER_SYMBOL) as StoreProvider
