import type { Ref } from 'vue'
import type { ContextProvider, StoreName } from '../contextProvider'
import type { Store } from '../context'
import { useContext } from '../plugin'

type MaybeRef<T> = T | Ref<T>

type StoreSetup<TArgs extends readonly unknown[], TStore extends Store> = (...args: TArgs) => TStore

type MapArgs<TArgs extends readonly unknown[]> = {
  [K in keyof TArgs]: MaybeRef<TArgs[K]>
}

const mapObjectValues = <TFrom, TTo>(obj: Record<string, TFrom>, fn: (value: TFrom, key: string) => TTo): Record<string, TTo> => {
  return Object.fromEntries(
    Object
      .entries(obj)
      .map(([key, value]) => [key, fn(value, key)])
  )
}

type CreateStoreOptions = {
  contextProvider?: ContextProvider
}

export const createStore = <TStore extends Store, TArgs extends readonly unknown[]>(
  name: StoreName,
  storeFn: StoreSetup<TArgs, TStore>,
  options: CreateStoreOptions = { }
) => {
  return (...mappedArgs: MapArgs<TArgs>) => {
    const context = options.contextProvider?.getContext<TStore>(name) ?? useContext<TStore>(name)

    const args = computed(() => mappedArgs.map(unref) as unknown as TArgs)
    const store = context.getInstance(args, storeFn)

    return mapObjectValues(unref(store), (value, key) => {
      if (typeof value === 'function') {
        return (...args: unknown[]) => (unref(store)[key] as typeof value)(...args)
      }

      if (isRef(value)) {
        return computed({
          get: () => (unref(store)[key] as typeof value).value,
          set: (newValue) => {
            (unref(store)[key] as typeof value).value = newValue
          }
        })
      }

      throw new Error(`Unexpected value for store "${name}" and key "${key}"`)
    }) as TStore
  }
}
