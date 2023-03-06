import type { Fn, Store } from '../types'
import type { Ref } from 'vue'
import { mapObjectValues } from '../utilities/mapObjectValues'

export const createStoreProxy = <TStore extends Store>(
  store: Ref<TStore>
) => {
  const storeDefinition = unref(store)

  if (isRef(storeDefinition)) {
    return mapRef(() => unref(store) as typeof storeDefinition) as TStore
  }

  return mapObjectValues(storeDefinition, (value, key) => {
    if (typeof value === 'function') {
      return mapFunction(() => (unref(store) as Exclude<typeof storeDefinition, Ref>)[key] as typeof value)
    }

    if (isRef(value)) {
      return mapRef(() => (unref(store) as Exclude<typeof storeDefinition, Ref>)[key] as typeof value)
    }

    throw new Error(`Unexpected value for store "${storeDefinition.toString()}" and key "${key}"`)
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
>(proxy: Fn<never, Fn<TArgs, TReturn>>) => (...args: TArgs) => proxy()(...args)
