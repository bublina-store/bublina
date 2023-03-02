import type { Ref } from 'vue'
import hash from 'fast-json-stable-stringify'
import { StoreName } from '../contextProvider'

type Fn = (...args: unknown[]) => unknown
export type Store = Ref<unknown> | Record<string, Ref<unknown> | Fn>

type Dependency = {
  name: StoreName,
  key: string
}

const createDependencyTracker = () => {
  const dependencies: Dependency[] = []

  const addDependency = (name: StoreName, key: Ref<string>) => {
    dependencies.push({ key: unref(key), name })

    watch(key, (newKey, oldKey) => {
      changeDependency(name, oldKey, newKey)
    })
  }

  const changeDependency = (name: StoreName, oldKey: string, newKey: string) => {
    const index = dependencies.findIndex((dependency) => dependency.name === name && dependency.key === oldKey)

    if (index === -1) {
      throw new Error(`Dependency ${oldKey} for '${name}' was not found`)
    }

    dependencies[index] = { name, key: newKey }
  }

  return {
    dependencies,
    addDependency
  }
}

let currentDependencyTracker: ReturnType<typeof createDependencyTracker>

const componentDependencyTracker = createDependencyTracker()

const useDependencyTracker = () => {
  return currentDependencyTracker ?? componentDependencyTracker
}

type StoreMetadata<TStore> = ({
  store: TStore,
  dependencyTracker: ReturnType<typeof createDependencyTracker>
})

export const createContext = <TStore extends Store>(name: StoreName) => {
  const context = new Map<string, StoreMetadata<TStore>>()

  const getStore = <TArgs extends readonly unknown[]>(
    mappedArgs: TArgs,
    setupFn: (...args: TArgs) => TStore
  ) => {
    const args = computed(() => mappedArgs.map(unref) as unknown as TArgs)
    const key = computed(() => hash(unref(args)))

    const dependencyTracker = useDependencyTracker()

    dependencyTracker.addDependency(name, key)

    return computed(() => {
      const keyValue = unref(key)

      if (context.has(keyValue)) {
        return context.get(keyValue).store
      }

      currentDependencyTracker = createDependencyTracker()

      const store = setupFn(...unref(args))

      context.set(keyValue, {
        store,
        dependencyTracker: currentDependencyTracker
      })

      currentDependencyTracker = dependencyTracker

      return store
    })
  }

  return {
    getStore,
    entries: () => [...context.entries()]
  }
}
