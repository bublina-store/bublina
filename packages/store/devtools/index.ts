import type { App } from 'vue'
import { StoreProvider } from '@bublina/store'
import { setupDevtoolsPlugin } from '@vue/devtools-api'

type SetupDevtoolsOptions = {
  contextProvider: StoreProvider
}

const storeInspectorId = '@bublina/store:inspector'

const storeTagColors = {
  active: { textColor: 0xffffff, backgroundColor: 0x2563eb },
  cached: { textColor: 0x000000, backgroundColor: 0x9ca3af },
  stores: { textColor: 0xffffff, backgroundColor: 0x9d174d }
}

const instanceTagColors = {
  dependencies: { textColor: 0xffffff, backgroundColor: 0x2563eb },
  dependants: { textColor: 0xffffff, backgroundColor: 0x65a30d },
  cached: { textColor: 0x000000, backgroundColor: 0x9ca3af },
  ref: { textColor: 0x000000, backgroundColor: 0xfde68a }
}

const pluralize = (count: number, singular: string, plural: string) => count === 1 ? singular : plural

export const setupDevtools = (app: App, { contextProvider }: SetupDevtoolsOptions) => {
  setupDevtoolsPlugin({
    id: '@bublina/store',
    label: 'Bublina',
    app: app as unknown as []
  }, (api) => {
    api.addInspector({
      id: storeInspectorId,
      label: 'Bublina',
      icon: 'bubble_chart'
    })

    type StoreDefinition = ReturnType<typeof contextProvider.getStoreDefinitions>[number]
    type StoreInstance = ReturnType<StoreDefinition['getInstances']>[number]

    const storeMap = uniqueMap<StoreDefinition>()
    const instanceMap = uniqueMap<StoreInstance>()

    let clearWatcher: () => void

    contextProvider.on.changed(() => {
      api.sendInspectorTree(storeInspectorId)
      api.sendInspectorState(storeInspectorId)
    })

    api.on.getInspectorTree((payload) => {
      if (payload.inspectorId !== storeInspectorId) {
        return
      }

      storeMap.clear()
      instanceMap.clear()

      payload.rootNodes = contextProvider.getStoreDefinitions().map(storeDefinition => {
        const instances = storeDefinition.getInstances()

        const active = instances.filter(instance => instance.dependants.length).length
        const cached = instances.length - active

        return {
          id: storeMap.add(storeDefinition.name, storeDefinition),
          label: storeDefinition.name,
          tags: [
            active && { label: `${active} active`, ...storeTagColors.active },
            cached && { label: `${cached} cached`, ...storeTagColors.cached }
          ].filter(Boolean) as [],
          children: instances.map(store => {
            const dependencies = store.dependencies.length
            const dependants = store.dependants.length

            return {
              id: instanceMap.add(`${storeDefinition.name}(${store.key})`, store),
              label: `${storeDefinition.name}(${store.key})`,
              tags: [
                isRef(store.store) && { label: 'Ref', ...instanceTagColors.ref },
                store.dependencies.length && { label: `${dependencies} ${pluralize(dependencies, 'dependency', 'dependencies')}`, ...instanceTagColors.dependencies },
                store.dependants.length
                  ? { label: `${dependants} ${pluralize(dependants, 'dependant', 'dependants')}`, ...instanceTagColors.dependants }
                  : { label: 'Cached', ...instanceTagColors.cached }
              ].filter(Boolean) as []
            }
          })
        }
      })
    })

    api.on.getInspectorState((payload) => {
      clearWatcher?.()

      if (payload.inspectorId !== storeInspectorId) {
        return
      }

      const storeDefinition = storeMap.get(payload.nodeId)
      if (storeDefinition) {
        payload.state = {
          Options: [
            { key: 'Name', value: storeDefinition.name },
            { key: 'Cache Time', value: storeDefinition.cacheTime ?? Infinity }
          ]
        }
        return
      }

      const instance = instanceMap.get(payload.nodeId)
      if (instance) {
        const dependencies = instance.dependencies
        const dependants = instance.dependants

        const storeEntries = Object.entries(instance.store)
        const refs = storeEntries.filter(([, value]) => isRef(value))
        const actions = storeEntries.filter(([, value]) => typeof value === 'function')

        clearWatcher = isRef(instance.store)
          ? watch(instance.store, () => {
            api.sendInspectorState(storeInspectorId)
          })
          : watch(refs.map(([, value]) => value), () => {
            api.sendInspectorState(storeInspectorId)
          })

        const exposed = isRef(instance.store)
          ? {
              '  Exposed Ref': [{
                key: 'value',
                value: unref(instance.store),
                objectType: 'ref' as const
              }]
            }
          : {
              [`  Exposed Refs (${refs.length})`]: refs.map(([key, value]) => ({
                key,
                value: unref(value),
                objectType: 'ref' as const
              })),
              [` Exposed Actions (${actions.length})`]: actions.map(([key, value]) => ({
                key,
                value,
                objectType: 'other' as const
              }))
            }

        payload.state = {
          ...exposed,
          Arguments: instance.getArguments().map((argument, i) => ({
            key: i.toString(),
            value: argument
          })),
          [`Dependencies (${dependencies.length})`]: dependencies.map((dependency, i) => ({
            key: i.toString(),
            value: dependency
          })),
          [`Dependants (${dependants.length})`]: dependants.map((dependant, i) => ({
            key: i.toString(),
            value: dependant
          }))
        }
      }
    })
  })
}

const uniqueMap = <TValue = unknown>() => {
  const map = new Map<string, TValue>()

  const add = (key: string, value: TValue) => {
    if (!map.has(key)) {
      map.set(key, value)
      return key
    }

    let index = 0
    while (map.has(`${key}(${index})`)) {
      index++
    }
    map.set(`${key}(${index})`, value)
    return `${key}(${index})`
  }

  return {
    get: (key: string) => map.get(key) as TValue,
    clear: () => map.clear(),
    add
  }
}
