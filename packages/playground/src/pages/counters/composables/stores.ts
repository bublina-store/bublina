import { createStore } from '@bublina/store'

export const useCounterStore = createStore('counter', (name: string) => {
  return ref(0)
})

export const useResultStore = createStore('results', (a: string, op: 'add' | 'sub' | 'mul' | 'div', b: string) => {
  const counterA = useCounterStore(a)
  const counterB = useCounterStore(b)

  return {
    comment: ref(''),
    result: computed(() => {
      switch (op) {
        case 'add':
          return counterA.value + counterB.value
        case 'sub':
          return counterA.value - counterB.value
        case 'mul':
          return counterA.value * counterB.value
        case 'div':
          return counterA.value / counterB.value
      }
    })
  }
})
