import plugin, { createStoreProvider, useStoreProvider } from '@bublina/store'

describe('plugin', () => {
  describe('when contextProvider is passed in options', () => {
    describe('useContextProvider', () => {
      it('return provider passed in options', () => {
        const contextProvider = createStoreProvider()

        mount(() => {
          const componentContextProvider = useStoreProvider()

          expect(componentContextProvider).toBe(contextProvider)
        }, {
          global: {
            plugins: [(app) => app.use(plugin, { contextProvider, devtools: false })]
          }
        })
      })

      it('always returns the same provider', () => {
        const contextProvider = createStoreProvider()

        mount(() => {
          const componentContextProvider1 = useStoreProvider()
          const componentContextProvider2 = useStoreProvider()

          expect(componentContextProvider1).toBe(componentContextProvider2)
        }, {
          global: {
            plugins: [(app) => app.use(plugin, { contextProvider, devtools: false })]
          }
        })
      })
    })
  })

  describe('useContextProvider', () => {
    it('always returns the same provider', () => {
      mount(() => {
        const componentContextProvider1 = useStoreProvider()
        const componentContextProvider2 = useStoreProvider()

        expect(componentContextProvider1).toBe(componentContextProvider2)
      }, {
        global: {
          plugins: [(app) => app.use(plugin, { devtools: false })]
        }
      })
    })
  })
})
