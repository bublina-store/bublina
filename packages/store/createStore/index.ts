import type { ComputedRef, Ref } from 'vue'
import type { Fn, Store, StoreName } from '../types'
import hash from 'fast-json-stable-stringify'
import { mapObjectValues } from '../utilities/mapObjectValues'
import { StoreProvider } from '../storeProvider'

type StoreSetup<TArgs extends readonly unknown[], TStore extends Store> = Fn<TArgs, TStore>

type MapArgs<TArgs extends readonly unknown[]> = {
  [K in keyof TArgs]: TArgs[K] | Ref<TArgs[K]>
}

type StoreOptions = {
  storeProvider?: StoreProvider
}

export const createStore = <TStore extends Store, TArgs extends readonly unknown[]>(
  name: StoreName,
  setupFn: StoreSetup<TArgs, TStore>,
  storeOptions?: StoreOptions
) => {
  const id = Symbol(name)
  const instances = new Map<string, TStore>()

  return (...mappedArgs: MapArgs<TArgs>) => {
    const storeRef = computed(() => {
      const args = mappedArgs.map(unref) as unknown as TArgs
      const key = hash(args)

      if (instances.has(key)) {
        return instances.get(key) as TStore
      }

      const storeId = Symbol(`${name}${key}`)
      const store = setupFn(...args)

      instances.set(key, store)

      return store
    })

    return createStoreProxy(name, storeRef)
  }
}

const createStoreProxy = <TStore extends Store>(
  name: StoreName,
  store: ComputedRef<TStore>
) => {
  const storeDefinition = unref(store)

  if (isRef(storeDefinition)) {
    return mapRef(() => unref(store) as typeof storeDefinition) as TStore
  }

  return mapObjectValues(storeDefinition, (value, key) => {
    if (typeof value === 'function') {
      return mapFunction(() => (unref(store) as Exclude<typeof storeDefinition, Ref>)[key])
    }

    if (isRef(value)) {
      return mapRef(() => (unref(store) as Exclude<typeof storeDefinition, Ref>)[key] as typeof value)
    }

    throw new Error(`Unexpected value for store "${name}" and key "${key}"`)
  }) as TStore
}

const mapRef = <T>(proxy: Fn<never, Ref<T>>) => computed({
  get: () => proxy().value,
  set: (newValue) => {
    proxy().value = newValue
  }
}) as Ref<T>

const mapFunction = <
  TArgs extends readonly unknown[],
  TReturn
>(proxy: Fn<TArgs, TReturn>) => (...args: TArgs) => proxy(...args)
