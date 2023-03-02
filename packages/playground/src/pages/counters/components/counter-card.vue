<script setup lang="ts">
import { useCounterStore } from '../composables/stores'
import UiCard from '../../../components/ui-card.vue'
import UiButton from '../../../components/ui-button.vue'

const props = defineProps<{
  name: string
}>()

const counter = useCounterStore(computed(() => props.name))
</script>

<template>
  <ui-card>
    <div>
      {{ name }}
    </div>
    <div class="w-full flex items-center justify-around gap-4">
      <ui-button @click="counter--">
        -
      </ui-button>
      {{ counter }}
      <ui-button @click="counter++">
        +
      </ui-button>
    </div>
  </ui-card>
</template>

<style scoped>

</style>
