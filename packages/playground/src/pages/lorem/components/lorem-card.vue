<script setup lang="ts">
import { useLoremStore } from '../composables/store'
import UiCard from '../../../components/ui-card.vue'

const props = defineProps<{
  id: number
}>()

const { id } = toRefs(props)

const { isLoading, data } = useLoremStore(id)

</script>

<template>
  <ui-card class="h-48 !grid place-items-center text-center flex-1 relative">
    <span class="absolute top-2 left-2 text-green-700">
      #{{ id }}
    </span>

    <div v-if="isLoading">
      Loading...
    </div>
    <div v-else>
      {{ data }}
    </div>
  </ui-card>
</template>

<style scoped>

</style>
