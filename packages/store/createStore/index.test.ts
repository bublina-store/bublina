import { createStore, createContextProvider } from '@bublina/store'
import { Ref } from 'vue'

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

  describe('types', () => {
    it('infers useStore parameters from setup', () => {
      expectTypeOf(createStore('without parameters', () => ({}))).toMatchTypeOf<() => Record<string, never>>()
      expectTypeOf(createStore('without parameters', () => ({}))).not.toMatchTypeOf<() => Ref<unknown>>()

      expectTypeOf(createStore('without parameters', () => ref())).toMatchTypeOf<() => Ref<unknown>>()
      expectTypeOf(createStore('without parameters', () => ref())).not.toMatchTypeOf<() => Record<string, never>>()

      type A = 'a'
      type B = 'b'

      expectTypeOf(createStore('without parameters', (a: A, b: B) => ({}))).toMatchTypeOf<(a: Ref<A>, b: Ref<B>) => Record<string, never>>()
      expectTypeOf(createStore('without parameters', (a: A, b: B) => ({}))).toMatchTypeOf<(a: A, b: B) => Record<string, never>>()
    })
  })
})
