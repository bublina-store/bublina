import { Store, StoreName } from '../types'
import hash from 'fast-json-stable-stringify'
import { Ref } from 'vue'

type StoreDefinitionId = symbol
type StoreInstanceKey = string
type StoreId = symbol
type StoreInstance = {
  definitionId: StoreDefinitionId,
  key: StoreInstanceKey,
  store: Store
}

type DependencyChangeCallback = () => void

type StoreDefinitionOptions<TArgs extends readonly unknown[], TStore> = {
  name: StoreName,
  setupFn: (...args: TArgs) => TStore
}

export const createStoreProvider = () => {
  const instances = new Map<StoreId, StoreInstance>()
  const storeIds = new Map<StoreDefinitionId, Map<StoreInstanceKey, StoreId>>()

  const dependencies = new Map<StoreId, StoreId[]>()
  const dependants = new Map<StoreId, StoreId[]>()

  const componentContext = Symbol('Component')
  let storeContext = componentContext

  let dependenciesChangedCallbacks: DependencyChangeCallback[] = []

  const add = <TStore extends Store>(storeId: StoreId, definitionId: StoreDefinitionId, key: StoreInstanceKey, storeFn: () => TStore) => {
    const previousContext = storeContext

    storeContext = storeId

    const scope = effectScope()

    const store = scope.run(() => storeFn()) as TStore

    instances.set(storeContext, {
      definitionId,
      key,
      store
    })

    storeContext = previousContext ?? componentContext

    return store
  }

  const remove = (id: StoreId) => {
    const instance = instances.get(id) as StoreInstance

    instances.delete(id)

    ;([...(dependencies.get(id) ?? [])]).forEach(to => {
      removeDependency(id, to)
    })

    storeIds.get(instance.definitionId)?.delete(instance.key)
  }

  const removeDependency = (from: StoreId, to: StoreId) => {
    const dependenciesFrom = dependencies.get(from)
    const dependantsTo = dependants.get(to)

    const oldDependencyIndex = dependenciesFrom?.findIndex(d => d === to)
    const oldDependantIndex = dependantsTo?.findIndex(d => d === from)

    dependenciesFrom?.splice(oldDependencyIndex as number, 1)
    dependantsTo?.splice(oldDependantIndex as number, 1)

    if (dependantsTo?.length === 0) {
      dependants.delete(to)

      // TODO: Properly handle removal
      remove(to)
    }

    if (dependenciesFrom?.length === 0) {
      dependencies.delete(from)
    }

    dependenciesChangedCallbacks.forEach(callback => callback())
  }

  const addDependency = (from: StoreId, to: StoreId) => {
    dependencies.set(from, [...dependencies.get(from) ?? [], to])
    dependants.set(to, [...dependants.get(to) ?? [], from])

    dependenciesChangedCallbacks.forEach(callback => callback())
  }

  const onDependenciesChanged = (callbackFn: DependencyChangeCallback) => {
    dependenciesChangedCallbacks = [...dependenciesChangedCallbacks, callbackFn]
    return () => {
      dependenciesChangedCallbacks = dependenciesChangedCallbacks.filter(callback => callback !== callbackFn)
    }
  }

  const useStoreDefinition = <TArgs extends readonly unknown[], TStore extends Store>(
    storeDefinitionId: StoreDefinitionId,
    options: StoreDefinitionOptions<TArgs, TStore>
  ) => {
    const getStoreId = (key: StoreInstanceKey) => {
      if (!storeIds.has(storeDefinitionId)) {
        storeIds.set(storeDefinitionId, new Map<StoreInstanceKey, StoreId>())
      }

      const i = storeIds.get(storeDefinitionId) as Map<StoreInstanceKey, StoreId>

      if (!i.has(key)) {
        const storeId = Symbol(`${name}${key}`)
        i.set(key, storeId)
      }

      return storeIds.get(storeDefinitionId)?.get(key) as StoreId
    }

    const registerDependency = (args: Ref<readonly unknown[]>) => {
      const previousContext = storeContext

      onScopeDispose(() => {
        const storeId = storeIds.get(storeDefinitionId)?.get(hash(unref(args))) as StoreId
        removeDependency(previousContext, storeId)
      })

      watch(args, (newArgs, oldArgs) => {
        const newStoreId = getStoreId(hash(newArgs))
        addDependency(previousContext, newStoreId)

        if (!oldArgs) {
          return
        }

        const oldStoreId = getStoreId(hash(oldArgs))
        removeDependency(previousContext, oldStoreId)
      }, { immediate: true })
    }

    const get = (args: Ref<TArgs>) => {
      registerDependency(args)

      return computed(() => {
        const key = hash(unref(args))
        const storeId = getStoreId(key)

        if (instances.has(storeId)) {
          return instances.get(storeId)?.store as TStore
        }

        return add(storeId, storeDefinitionId, key, () => options.setupFn(...unref(args)))
      })
    }

    return {
      get
    }
  }

  return {
    instances,
    dependencies,
    dependants,
    storeIds,
    onDependenciesChanged,

    useStoreDefinition
  }
}

export type StoreProvider = ReturnType<typeof createStoreProvider>
