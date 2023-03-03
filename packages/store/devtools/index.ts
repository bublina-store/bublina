import type { App } from 'vue'
import { StoreProvider } from '@bublina/store'
import { setupDevtoolsPlugin } from '@vue/devtools-api'

type SetupDevtoolsOptions = {
  contextProvider: StoreProvider
}

const storeInspectorId = '@bublina/store:inspector'

const prettyPrint = (store: string, key: string) => `${store}(${key.substring(1, key.length - 1)})`

export const setupDevtools = (app: App, { contextProvider }: SetupDevtoolsOptions) => {
  // setupDevtoolsPlugin({
  //   id: '@bublina/store',
  //   label: 'Bublina',
  //   app: app as unknown
  // }, (api) => {
  //   api.addInspector({
  //     id: storeInspectorId,
  //     label: 'Bublina',
  //     icon: 'bubble_chart'
  //   })
  //
  //   api.on.getInspectorTree((payload) => {
  //     if (payload.inspectorId !== storeInspectorId) {
  //       return
  //     }
  //
  //     payload.rootNodes = contextProvider.entries().map(([context]) => ({
  //       id: JSON.stringify({ type: 'store', storeName: context.name }),
  //       label: context.name,
  //       tags: [],
  //       children: context.entries().map(([instanceKey, instance]) => ({
  //         id: JSON.stringify({ type: 'instance', storeName: context.name, instanceName: instanceKey }),
  //         label: prettyPrint(context.name, instanceKey),
  //         tags: [
  //           // { label: `Components: ${instance.referencedComponentsCount}`, textColor: 0xffffff, backgroundColor: 0x4203ab },
  //           { label: `Dependencies: ${contextProvider.dependencyTracker.getDependencies(instance).length}`, textColor: 0xffffff, backgroundColor: 0x0342ab },
  //           { label: `Dependants: ${contextProvider.dependencyTracker.getDependents(instance).length}`, textColor: 0xffffff, backgroundColor: 0xab0342 }
  //         ]
  //       }))
  //     }))
  //   })
  //
  //   api.on.getInspectorState((payload) => {
  //     if (payload.inspectorId !== storeInspectorId) {
  //       return
  //     }
  //
  //     const { type, storeName, instanceName } = JSON.parse(payload.nodeId)
  //
  //     const context = contextProvider.getContext(storeName)
  //     const instance = context?.entries().find(([name]) => name === instanceName)?.[1]
  //
  //     switch (type) {
  //       case 'store':
  //         payload.state = {
  //           '': [
  //             { key: 'Setup', value: storeName }
  //           ]
  //         }
  //         break
  //       case 'instance':
  //         payload.state = {
  //           ' Values': Object
  //             .entries(instance.store)
  //             .filter(([, value]) => isRef(value))
  //             .map(([key, value]) => ({
  //               key,
  //               value: unref(value),
  //               objectType: 'ref'
  //             })),
  //           Actions: Object
  //             .entries(instance.store)
  //             .filter(([, value]) => typeof value === 'function')
  //             .map(([key, value]) => ({
  //               key,
  //               value,
  //               objectType: 'other'
  //             })),
  //           Parameters: (JSON.parse(instanceName) as unknown[]).map((value, index) => ({
  //             key: index.toString(),
  //             value
  //           })),
  //           Dependencies: instance.dependencyTracker.dependencies
  //             .map((dependency, key) => ({
  //               key: key.toString(),
  //               value: `${dependency.name}(${dependency.key.substring(1, dependency.key.length - 1)})`,
  //               objectType: 'other'
  //             }))
  //         }
  //         break
  //     }
  //   })
  // })
}
