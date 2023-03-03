import { createStore } from '@bublina/store'
import { Ref } from 'vue'
import { Fn, Store } from '../types'

describe('createStore', () => {
  test('dev', () => {
    const useTestStore = createTestStore('test', (name: string) => {
      const value = ref(0)

      return {
        value
      }
    })

    const a = useTestStore('a')
    const b = useTestStore('b')

    expect(a.value.value).toBe(0)
    expect(b.value.value).toBe(0)

    a.value.value = 1

    expect(a.value.value).toBe(1)
    expect(b.value.value).toBe(0)
  })

  test('dev', () => {
    const useTestStore = createTestStore('test', (name: string) => {
      const value = ref(0)

      return {
        value
      }
    })

    const a = useTestStore('a')
    const b = useTestStore('a')

    expect(a.value.value).toBe(0)
    expect(b.value.value).toBe(0)

    a.value.value = 1

    expect(a.value.value).toBe(1)
    expect(b.value.value).toBe(1)
  })

  test('dev', () => {
    const useTestStore = createTestStore('test', (name: string) => {
      const value = ref(0)

      return {
        value
      }
    })

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

  describe('type inference', () => {
    describe('returned function', () => {
      describe('when setupFn is without parameters', () => {
        it('should not require parameters', () => {
          expectTypeOf(createStore('ref', () => ref())).toMatchTypeOf<() => unknown>()
          expectTypeOf(createStore('state and actions', () => ({}))).toMatchTypeOf<() => unknown>()
        })
      })

      describe('when setupFn is with parameters', () => {
        it('should require parameters in either value or ref form', () => {
          type A = 'a'
          type B = 'b'

          expectTypeOf(createStore('that returns ref', (a: A, b: B) => ref()))
            .toMatchTypeOf<(a: A | Ref<A>, b: B | Ref<B>) => unknown>()

          expectTypeOf(createStore('that returns state and actions', (a: A, b: B) => ({})))
            .toMatchTypeOf<(a: A | Ref<A>, b: B | Ref<B>) => unknown>()
        })
      })

      describe('when setupFn returns simple ref', () => {
        it('return a simple ref', () => {
          type A = 'a'
          type B = 'b'
          type Result = 'result'

          expectTypeOf(createStore('without parameters', () => ref('result' as Result)))
            .toMatchTypeOf<() => Ref<Result>>()

          expectTypeOf(createStore('with parameters', (a: A, b: B) => ref('result' as Result)))
            .toMatchTypeOf<(a: A | Ref<A>, b: B | Ref<B>) => Ref<Result>>()
        })
      })

      describe('when setupFn returns actions and refs', () => {
        it('return actions and refs', () => {
          type A = 'a'
          type B = 'b'
          type Result = 'result'
          type Action = () => void

          const store = ({
            r: ref<Result>('result'),
            a: () => ({}) as Action
          })

          expectTypeOf(createStore('without parameters', () => store))
            .toMatchTypeOf<() => typeof store>()

          expectTypeOf(createStore('with parameters', (a: A, b: B) => store))
            .toMatchTypeOf<(a: A | Ref<A>, b: B | Ref<B>) => typeof store>()
        })
      })
    })
  })
})

const createTestStore = <TStore extends Store, TArgs extends unknown[]>(name: string, setupFn: Fn<TArgs, TStore>) => {
  return createStore<TStore, TArgs>(name, setupFn)
}
