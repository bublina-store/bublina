import { Store, StoreName } from '../types'
import hash from 'fast-json-stable-stringify'

type StoreDefinitionId = symbol
type StoreInstanceKey = string
type StoreId = symbol
type StoreInstance = {
  definitionId: StoreDefinitionId,
  key: StoreInstanceKey,
  store: Store
}

type DependencyChangeCallback = () => void

export const createStoreProvider = () => {
  const instances = new Map<StoreId, StoreInstance>()
  const storeIds = new Map<StoreDefinitionId, Map<StoreInstanceKey, StoreId>>()

  const dependencies = new Map<StoreId, StoreId[]>()
  const dependants = new Map<StoreId, StoreId[]>()

  const componentContext = Symbol('Component')
  let storeContext = componentContext

  let dependenciesChangedCallbacks: DependencyChangeCallback[] = []

  const has = (name: StoreName, definitionId: StoreDefinitionId, key: StoreInstanceKey) => {
    return instances.has(getStoreId(name, definitionId, key))
  }

  const get = <TStore extends Store>(name: StoreName, definitionId: StoreDefinitionId, key: StoreInstanceKey) => {
    const instance = instances.get(getStoreId(name, definitionId, key))

    if (!instance) {
      throw new Error(`Store "${definitionId.toString()}${key}" was not found`)
    }

    return instance.store as TStore
  }

  const add = <TStore extends Store>(name: StoreName, definitionId: StoreDefinitionId, key: StoreInstanceKey, storeFn: () => TStore) => {
    const previousContext = storeContext

    storeContext = getStoreId(name, definitionId, key)

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

    dependencies.delete(id)
    dependants.delete(id)

    storeIds.get(instance.definitionId)?.delete(instance.key)
  }

  const registerDependency = (name: StoreName, definitionId: StoreDefinitionId, args: Ref<readonly unknown[]>) => {
    const key = hash(unref(args))
    const previousContext = storeContext

    let storeId = getStoreId(name, definitionId, key)

    addDependency(previousContext, storeId)

    onScopeDispose(() => {
      removeDependency(previousContext, storeId)
    })

    watch(args, (newArgs, oldArgs) => {
      const oldStoreId = getStoreId(name, definitionId, hash(oldArgs))
      const newStoreId = getStoreId(name, definitionId, hash(newArgs))

      addDependency(previousContext, newStoreId)
      removeDependency(previousContext, oldStoreId)

      storeId = newStoreId
    })
  }

  const removeDependency = (from: StoreId, to: StoreId) => {
    const dependenciesFrom = dependencies.get(from)
    const dependantsTo = dependants.get(to)

    const oldDependencyIndex = dependenciesFrom?.findIndex(d => d === to)
    const oldDependantIndex = dependantsTo?.findIndex(d => d === from)

    dependenciesFrom?.splice(oldDependencyIndex as number, 1)
    dependantsTo?.splice(oldDependantIndex as number, 1)

    if (dependantsTo?.length === 0) {
      // TODO: Properly handle removal
      // remove(to)
    }

    dependenciesChangedCallbacks.forEach(callback => callback())
  }

  const addDependency = (from: StoreId, to: StoreId) => {
    dependencies.set(from, [...dependencies.get(from) ?? [], to])
    dependants.set(to, [...dependants.get(to) ?? [], from])

    dependenciesChangedCallbacks.forEach(callback => callback())
  }

  const getStoreId = (name: StoreName, definitionId: StoreDefinitionId, key: StoreInstanceKey) => {
    if (!storeIds.has(definitionId)) {
      storeIds.set(definitionId, new Map<StoreInstanceKey, StoreId>())
    }

    const i = storeIds.get(definitionId) as Map<StoreInstanceKey, StoreId>

    if (!i.has(key)) {
      const storeId = Symbol(`${name}${key}`)
      i.set(key, storeId)
    }

    return storeIds.get(definitionId)?.get(key) as StoreId
  }

  const onDependenciesChanged = (callbackFn: DependencyChangeCallback) => {
    dependenciesChangedCallbacks = [...dependenciesChangedCallbacks, callbackFn]
    return () => {
      dependenciesChangedCallbacks = dependenciesChangedCallbacks.filter(callback => callback !== callbackFn)
    }
  }

  return {
    has,
    get,
    add,
    remove,
    registerDependency,
    instances,
    dependencies,
    dependants,
    storeIds,
    onDependenciesChanged
  }
}

export type StoreProvider = ReturnType<typeof createStoreProvider>
