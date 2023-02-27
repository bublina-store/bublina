import type { App } from 'vue'
import type { ContextProvider } from '../contextProvider'
import { createContextProvider, StoreName } from '../contextProvider'
import { setupDevtools } from '../devtools'
import { Store } from '../context'

const __CONTEXT_PROVIDER_SYMBOL = Symbol('contextProvider')

export type PluginOptions = {
  contextProvider?: ContextProvider,
  devtools?: boolean
}

export default {
  install: (app: App, options: PluginOptions = { devtools: true }) => {
    const contextProvider = options.contextProvider ?? createContextProvider()

    app.provide(__CONTEXT_PROVIDER_SYMBOL, contextProvider)

    if (options.devtools && (process.env.NODE_ENV === 'development' || __VUE_PROD_DEVTOOLS__)) {
      setupDevtools(app, { contextProvider })
    }
  }
}

export const useContextProvider = () => inject<ContextProvider>(__CONTEXT_PROVIDER_SYMBOL)

export const useContext = <TStore extends Store>(name: StoreName) => useContextProvider().getContext<TStore>(name)
