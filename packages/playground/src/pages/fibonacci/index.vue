<route lang="yaml">
meta:
  title: Fibonacci
  description: "An example showing the memoization capabilities with nested stores"
</route>

<script setup lang="ts">
import UiCard from '../../components/ui-card.vue'
import AppLayout from '../../components/app-layout.vue'
import { useFibonacciStore } from './composables/stores'
import UiButton from '../../components/ui-button.vue'

const i = ref(10)
const { text, value } = useFibonacciStore(i)

const { text: text1 } = useFibonacciStore(0)
const { text: text2 } = useFibonacciStore(1)

</script>

<template>
  <app-layout
    title="Fibonacci"
    class="max-w-160 mx-auto"
  >
    <section class="flex gap-4 justify-center">
      <ui-card class="!h-12">
        <input
          v-model="text1"
          class="bg-transparent h-full text-center align-middle"
        >
      </ui-card>
      <ui-card class="!h-12">
        <input
          v-model="text2"
          class="bg-transparent h-full text-center align-middle"
        >
      </ui-card>
    </section>

    <section class="grid place-items-center">
      <div class="flex gap-4">
        <ui-button
          :disabled="i <= 0"
          @click="i--"
        >
          <i class="i-material-symbols-remove-rounded" />
        </ui-button>
        <ui-card class="pa-8">
          <div><strong>{{ i + 1 }}.</strong> element of Fibonacci sequence</div>

          <div>
            {{ value }}
          </div>

          <textarea
            v-model="text"
            class="bg-transparent w-full h-32 disabled:text-gray-400"
            :disabled="i >= 2"
          />
        </ui-card>
        <ui-button @click="i++">
          <i class="i-material-symbols-add-rounded" />
        </ui-button>
      </div>
    </section>
  </app-layout>
</template>
