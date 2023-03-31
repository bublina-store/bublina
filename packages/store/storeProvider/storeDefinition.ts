import type { Ref } from 'vue'
import type { Store, StoreName } from '../types'
import hash from 'fast-json-stable-stringify'
import { createDependencyTracker } from './dependencyTracker'

type StoreInstanceKey = string

export type StoreId = symbol

export type StoreInstance = {
  store: Store,
  onRemoved: () => void
}

export type CreateStoreDefinitionOptions = {
  dependencyTracker: ReturnType<typeof createDependencyTracker<StoreId>>,
  hasInstance: (id: StoreId) => boolean,
  getInstance: (id: StoreId) => StoreInstance,
  setInstance: (id: StoreId, instance: StoreInstance) => void,
  deleteInstance: (id: StoreId) => void
}

export type StoreDefinitionOptions = {
  cacheTime?: number
}

export const createStoreDefinition = <TArgs extends readonly unknown[], TStore extends Store>(
  name: StoreName,
  setupFn: (...args: TArgs) => TStore,
  {
    cacheTime
  }: StoreDefinitionOptions,
  {
    dependencyTracker,
    hasInstance,
    getInstance,
    setInstance,
    deleteInstance
  }: CreateStoreDefinitionOptions
) => {
  const storeIds = new Map<StoreInstanceKey, StoreId>()
  const timers = new Map<StoreId, ReturnType<typeof setTimeout>>()

  const getStoreId = (key: StoreInstanceKey) => {
    if (!storeIds.has(key)) {
      const storeId = Symbol(`${name}${key}`)
      storeIds.set(key, storeId)
    }

    return storeIds.get(key) as StoreId
  }

  const registerDependency = (context: StoreId, args: Ref<readonly unknown[]>) => {
    onScopeDispose(() => {
      const storeId = storeIds.get(hash(unref(args))) as StoreId
      dependencyTracker.removeDependency(context, storeId)
    })

    watch(args, (newArgs, oldArgs) => {
      const newStoreId = getStoreId(hash(newArgs))
      dependencyTracker.addDependency(context, newStoreId)

      if (!oldArgs) {
        return
      }

      const oldStoreId = getStoreId(hash(oldArgs))
      dependencyTracker.removeDependency(context, oldStoreId)
    }, { immediate: true })
  }

  function getStore(args: Ref<TArgs>) {
    registerDependency(dependencyTracker.currentDependency(), args)

    return computed(() => {
      const argsValue = unref(args)
      const key = hash(argsValue)
      const storeId = getStoreId(key)

      if (hasInstance(storeId)) {
        clearTimeout(timers.get(storeId))
        return getInstance(storeId)?.store as TStore
      }

      const scope = effectScope(true)

      const store = dependencyTracker.withCurrentDependency(storeId, () => {
        return scope.run(() => setupFn(...argsValue)) as TStore
      })

      setInstance(storeId, {
        store,
        onRemoved: () => {
          if (cacheTime === undefined || cacheTime === Infinity) {
            return
          }

          const timeout = setTimeout(() => {
            storeIds.delete(key)
            dependencyTracker.removeAllDependencies(storeId)
            deleteInstance(storeId)
            scope.stop()
            timers.delete(storeId)
          }, cacheTime)

          timers.set(storeId, timeout)
        }
      })

      return store
    })
  }

  const getInstances = () => {
    return [...storeIds.entries()].map(([key, storeId]) => {
      return {
        key,
        getArguments: () => JSON.parse(key) as TArgs,
        store: getInstance(storeId)?.store,
        dependencies: dependencyTracker.dependencies.get(storeId) || [],
        dependants: dependencyTracker.dependants.get(storeId) || []
      }
    })
  }

  return {
    name,
    cacheTime,
    getInstances,
    getStore
  }
}

export type StoreDefinition<TArgs extends readonly unknown[], TStore extends Store> = ReturnType<typeof createStoreDefinition<TArgs, TStore>>
