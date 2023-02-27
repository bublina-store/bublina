import { createStore, createContextProvider } from '@bublina/store'

describe('createStore', () => {
  test('dev', () => {
    const contextProvider = createContextProvider()

    const useTestStore = createStore('test', (name: string) => {
      const value = ref(0)

      return {
        value
      }
    }, { contextProvider })

    const a = useTestStore('a')
    const b = useTestStore('b')

    expect(a.value.value).toBe(0)
    expect(b.value.value).toBe(0)

    a.value.value = 1

    expect(a.value.value).toBe(1)
    expect(b.value.value).toBe(0)
  })

  test('dev', () => {
    const contextProvider = createContextProvider()

    const useTestStore = createStore('test', (name: string) => {
      const value = ref(0)

      return {
        value
      }
    }, { contextProvider })

    const a = useTestStore('a')
    const b = useTestStore('a')

    expect(a.value.value).toBe(0)
    expect(b.value.value).toBe(0)

    a.value.value = 1

    expect(a.value.value).toBe(1)
    expect(b.value.value).toBe(1)
  })

  test('dev', () => {
    const contextProvider = createContextProvider()

    const useTestStore = createStore('test', (name: string) => {
      const value = ref(0)

      return {
        value
      }
    }, { contextProvider })

    const name = ref<'a' | 'b'>('a')

    const a = useTestStore('a')
    const b = useTestStore('b')
    const c = useTestStore(name)

    expect(a.value.value).toBe(0)
    expect(b.value.value).toBe(0)
    expect(c.value.value).toBe(0)

    a.value.value = 1

    expect(a.value.value).toBe(1)
    expect(b.value.value).toBe(0)
    expect(c.value.value).toBe(1)

    name.value = 'b'

    expect(a.value.value).toBe(1)
    expect(b.value.value).toBe(0)
    expect(c.value.value).toBe(0)

    c.value.value = 2

    expect(a.value.value).toBe(1)
    expect(b.value.value).toBe(2)
    expect(c.value.value).toBe(2)
  })
})
