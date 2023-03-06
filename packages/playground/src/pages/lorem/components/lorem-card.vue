<script setup lang="ts">
import { useLoremStore } from '../composables/store'
import UiCard from '../../../components/ui-card.vue'
import UiButton from '../../../components/ui-button.vue'

const props = defineProps<{
  id: number
}>()

const { id } = toRefs(props)

const { isLoading, data, load } = useLoremStore(id)

</script>

<template>
  <ui-card class="h-48 !grid place-items-center text-center flex-1 relative">
    <span class="absolute top-2 left-2 text-green-700">
      #{{ id }}
    </span>

    <button
      class="absolute top-2 right-2 opacity-40 disabled:opacity-10 active:opacity-20 transition-opacity duration-200 disabled:animate-spin h-6"
      :disabled="isLoading"
      @click="load"
    >
      <i class="i-material-symbols-refresh" />
    </button>

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
