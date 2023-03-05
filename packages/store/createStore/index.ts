import type { Ref } from 'vue'
import type { Fn, Store, StoreName } from '../types'
import { StoreProvider } from '../storeProvider'
import { useStoreProvider } from '../plugin'
import { createStoreProxy } from './createStoreProxy'

type StoreSetup<TArgs extends readonly unknown[], TStore extends Store> = Fn<TArgs, TStore>

type MapArgs<TArgs extends readonly unknown[]> = {
  [K in keyof TArgs]: TArgs[K] | Ref<TArgs[K]>
}

type StoreOptions = {
  storeProvider?: StoreProvider,
  cacheTime?: number
}

export const createStore = <TStore extends Store, TArgs extends readonly unknown[]>(
  name: StoreName,
  setupFn: StoreSetup<TArgs, TStore>,
  storeOptions?: StoreOptions
) => {
  const storeDefinitionId = Symbol(name)

  const storeDefinitionOptions = {
    name,
    setupFn,
    cacheTime: storeOptions?.cacheTime
  }

  return (...mappedArgs: MapArgs<TArgs>) => {
    const { useStoreDefinition } = storeOptions?.storeProvider ?? useStoreProvider()

    const storeDefinition = useStoreDefinition(storeDefinitionId, storeDefinitionOptions)

    const args = computed(() => mappedArgs.map(unref) as unknown as TArgs)

    return createStoreProxy(storeDefinition.getStore(args))
  }
}
