import { createStore } from '@bublina/store'

export const useCounterStore = createStore('counter', (key: string) => {
  const value = ref(0)

  return {
    value,
    increment: () => {
      return value.value++
    },
    decrement: () => {
      return value.value--
    }
  }
})
