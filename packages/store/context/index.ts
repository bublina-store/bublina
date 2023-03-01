import type { Ref } from 'vue'
import hash from 'fast-json-stable-stringify'

type Fn = (...args: unknown[]) => unknown
export type Store = Ref<unknown> | Record<string, Ref<unknown> | Fn>

export const createContext = <TStore extends Store>() => {
  const context = new Map<string, TStore>()

  const getInstance = <TArgs extends readonly unknown[]>(
    args: Ref<TArgs>,
    setupFn: (...args: TArgs) => TStore
  ) => {
    const key = computed(() => hash(unref(args)))

    return computed(() => {
      if (context.has(key.value)) {
        return context.get(key.value)
      }

      const store = setupFn(...unref(args))
      context.set(key.value, store)

      return store
    })
  }

  return {
    getInstance,
    entries: () => [...context.entries()]
  }
}
