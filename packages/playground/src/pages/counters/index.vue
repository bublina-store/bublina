<route lang="yaml">
meta:
  title: Counters
  description: "An example of how to compose multiple stores with a store instance depending on `ref` variable"
</route>

<script setup lang="ts">
import { useResultStore } from './composables/stores'
import CounterCard from './components/counter-card.vue'
import UiCard from '../../components/ui-card.vue'
import UiButton from '../../components/ui-button.vue'
import AppLayout from '../../components/app-layout.vue'

const variables = ['A', 'B', 'C']
const operations = ['add', 'sub', 'mul', 'div'] as const

const first = ref<typeof variables[number]>(variables[0])
const second = ref<typeof variables[number]>(variables[1])

const op = ref<typeof operations[number]>(operations[0])

const { result, comment } = useResultStore(first, op, second)

</script>

<template>
  <app-layout
    title="Counters"
    class="max-w-160 mx-auto"
  >
    <section class="grid grid-cols-3 gap-4">
      <counter-card
        v-for="v in variables"
        :key="v"
        :name="v"
      />
    </section>

    <section class="flex gap-4 items-center justify-center">
      <ui-card>
        <ui-button
          v-for="v in variables"
          :key="v"
          :highlighted="first === v"
          @click="first = v"
        >
          {{ v }}
        </ui-button>
      </ui-card>

      <ui-card>
        <ui-button
          v-for="o in operations"
          :key="o"
          :highlighted="op === o"
          @click="op = o"
        >
          {{ o }}
        </ui-button>
      </ui-card>

      <ui-card>
        <ui-button
          v-for="v in variables"
          :key="v"
          :highlighted="second === v"
          @click="second = v"
        >
          {{ v }}
        </ui-button>
      </ui-card>

      <div class="flex flex-col gap-4">
        <ui-card>
          <div class="w-full min-w-24 flex justify-between pa-2">
            <span> = </span>
            <span> {{ result }} </span>
          </div>
        </ui-card>
        <ui-card>
          <input
            v-model="comment"
            class="bg-transparent"
          >
        </ui-card>
      </div>
    </section>
  </app-layout>
</template>
