import type { Store } from '../context'
import { createContext } from '../context'

export type StoreName = string
export type Context = ReturnType<typeof createContext>

export const createContextProvider = () => {
  const contexts = new Map<StoreName, Context>()

  const getContext = <TStore extends Store>(name: StoreName) => {
    if (contexts.has(name)) {
      return contexts.get(name)
    }

    const context = createContext<TStore>()

    contexts.set(name, context)

    return context
  }

  return {
    getContext,
    entries: () => [...contexts.entries()]
  }
}

export type ContextProvider = ReturnType<typeof createContextProvider>
