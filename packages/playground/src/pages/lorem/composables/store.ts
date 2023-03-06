import { createStore } from '@bublina/store'
import { faker } from '@faker-js/faker'

const delay = <T>(value: T, ms: number): Promise<T> => new Promise((resolve) => setTimeout(() => resolve(value), ms))

export const useLoremStore = createStore('lorem', (id: number) => {
  const isLoading = ref(true)
  const data = ref<string>()

  const load = async () => {
    isLoading.value = true
    data.value = await delay(faker.lorem.sentence(8), faker.datatype.number({ min: 2000, max: 5000 }))
    isLoading.value = false
  }

  load().catch()

  return {
    id: computed(() => id),
    isLoading,
    data,
    load
  }
})
