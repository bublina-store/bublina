// noinspection ES6UnusedImports
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Ref, ComputedRef } from 'vue'
import type { Store, StoreName } from '../types'
import type { CreateStoreDefinitionOptions, StoreId, StoreInstance } from './storeDefinition'
import { createDependencyTracker } from './dependencyTracker'
import { createStoreDefinition } from './storeDefinition'
import { createEvent } from '../utilities/createEvent'

type StoreDefinitionId = symbol

type StoreDefinitionOptions<TArgs extends readonly unknown[], TStore> = {
  name: StoreName,
  setupFn: (...args: TArgs) => TStore,
  cacheTime?: number
}

type CreateStoreProviderOptions = {
  cacheTime?: number
}

export const createStoreProvider = (providerOptions?: CreateStoreProviderOptions) => {
  const componentContext = Symbol('Component')

  const instances = new Map<StoreId, StoreInstance>()
  const storeDefinitions = new Map<StoreDefinitionId, unknown>()
  const dependencyTracker = createDependencyTracker<StoreId>(componentContext)

  const changedEvent = createEvent()

  const createStoreDefinitionOptions: CreateStoreDefinitionOptions = {
    dependencyTracker,
    getInstance: (id) => instances.get(id) as StoreInstance,
    hasInstance: (id) => instances.has(id),
    setInstance: (id, instance) => { instances.set(id, instance) },
    deleteInstance: (id) => { instances.delete(id) }
  }

  dependencyTracker.on.emptyDependants((id) => { handleEmptyDependants(id) })
  dependencyTracker.on.dependenciesChanged(() => changedEvent.dispatch())

  const handleEmptyDependants = (id: StoreId) => {
    instances.get(id)?.onRemoved()
  }

  const useStoreDefinition = <TArgs extends readonly unknown[], TStore extends Store>(
    storeDefinitionId: StoreDefinitionId,
    options: StoreDefinitionOptions<TArgs, TStore>
  ) => {
    if (!storeDefinitions.has(storeDefinitionId)) {
      const definition = createStoreDefinition(
        options.name,
        options.setupFn,
        {
          cacheTime: options.cacheTime ?? providerOptions?.cacheTime
        },
        createStoreDefinitionOptions
      )

      storeDefinitions.set(storeDefinitionId, definition)
    }

    return storeDefinitions.get(storeDefinitionId) as ReturnType<typeof createStoreDefinition<TArgs, TStore>>
  }

  const getStoreDefinitions = () => {
    return [...storeDefinitions.values()] as ReturnType<typeof createStoreDefinition>[]
  }

  return {
    on: {
      changed: changedEvent.on
    },
    getStoreDefinitions,
    useStoreDefinition
  }
}

export type StoreProvider = ReturnType<typeof createStoreProvider>
