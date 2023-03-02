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

const mapRef = <T>(from: () => Ref<T>) => computed({
  get: () => from().value,
  set: (newValue) => {
    from().value = newValue
  }
})

const mapFunction = <TArgs extends readonly unknown[], TReturn>(from: (...args: TArgs) => TReturn) => (...args: TArgs) => from(...args)

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

    const store = context.getStore(mappedArgs, storeFn)

    const storeDefinition = unref(store)

    if (isRef(storeDefinition)) {
      return mapRef(() => unref(store) as Ref<unknown>) as Ref<unknown> as TStore
    }

    return mapObjectValues(storeDefinition, (value, key) => {
      if (typeof value === 'function') {
        return mapFunction(() => unref(store)[key])
      }

      if (isRef(value)) {
        return mapRef(() => unref(store)[key])
      }

      throw new Error(`Unexpected value for store "${name}" and key "${key}"`)
    }) as TStore
  }
}
