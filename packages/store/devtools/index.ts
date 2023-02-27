import type { App } from 'vue'
import { ContextProvider } from '@bublina/store'
import { setupDevtoolsPlugin } from '@vue/devtools-api'

type SetupDevtoolsOptions = {
  contextProvider: ContextProvider
}

const storeInspectorId = '@bublina/store:inspector'

export const setupDevtools = (app: App, { contextProvider }: SetupDevtoolsOptions) => {
  setupDevtoolsPlugin({
    id: '@bublina/store',
    label: 'Bublina',
    app: app as unknown
  }, (api) => {
    api.addInspector({
      id: storeInspectorId,
      label: 'Bublina',
      icon: 'bubble_chart'
    })

    api.on.getInspectorTree((payload) => {
      if (payload.inspectorId !== storeInspectorId) {
        return
      }

      payload.rootNodes = contextProvider.entries().map(([storeName, context]) => ({
        id: JSON.stringify({ type: 'store', storeName }),
        label: storeName,
        children: context.entries().map(([instanceName]) => ({
          id: JSON.stringify({ type: 'instance', storeName, instanceName }),
          label: instanceName
        }))
      }))
    })

    api.on.getInspectorState((payload) => {
      if (payload.inspectorId !== storeInspectorId) {
        return
      }

      const { type, storeName, instanceName } = JSON.parse(payload.nodeId)

      const context = contextProvider.getContext(storeName)
      const instance = context?.entries().find(([name]) => name === instanceName)?.[1]

      switch (type) {
        case 'store':
          payload.state = {
            '': [
              { key: 'Store', value: storeName }
            ]
          }
          break
        case 'instance':
          payload.state = {
            ' Values': Object
              .entries(instance)
              .filter(([, value]) => isRef(value))
              .map(([key, value]) => ({
                key,
                value: unref(value),
                objectType: 'ref'
              })),
            Actions: Object
              .entries(instance)
              .filter(([, value]) => typeof value === 'function')
              .map(([key, value]) => ({
                key,
                value,
                objectType: 'other'
              }))
          }
          break
      }
    })
  })
}
