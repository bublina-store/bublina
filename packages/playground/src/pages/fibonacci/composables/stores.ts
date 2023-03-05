import { createStore } from '@bublina/store'
import { Ref } from 'vue'

type FibonacciStore = {
  text: Ref<string>,
  value: Ref<number>
}

export const useFibonacciStore = createStore('fibonacci', (i: number): FibonacciStore => {
  if (i < 2) {
    return {
      value: computed(() => i),
      text: ref(i === 0 ? 'a' : 'b')
    }
  }

  const { value: value1, text: text1 } = useFibonacciStore(i - 1)
  const { value: value2, text: text2 } = useFibonacciStore(i - 2)

  return {
    value: computed(() => value1.value + value2.value),
    text: computed(() => `${text1.value}${text2.value}`)
  }
})
