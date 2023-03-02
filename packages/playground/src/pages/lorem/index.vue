<route lang="yaml">
meta:
  title: Lorem cards
  description: "An example of caching capabilities in async scenarios"
</route>

<script setup lang="ts">
import AppLayout from '../../components/app-layout.vue'
import UiButton from '../../components/ui-button.vue'
import LoremCard from './components/lorem-card.vue'

const count = 3
const start = ref(0)

</script>

<template>
  <app-layout
    title="Lorem cards"
    class="max-w-160 mx-auto"
  >
    <section class="flex gap-2 items-center w-full">
      <ui-button
        class="!pa-0 rounded-4"
        :disabled="start <= 0"
        @click="start--"
      >
        <i class="i-material-symbols-chevron-left-rounded h-16 w-8" />
      </ui-button>

      <div class="flex-1 flex gap-4">
        <lorem-card
          v-for="i in count"
          :id="i + start"
          :key="i"
        />
      </div>

      <ui-button
        class="!pa-0 rounded-4"
        @click="start++"
      >
        <i class="i-material-symbols-chevron-right-rounded h-16 w-8" />
      </ui-button>
    </section>
  </app-layout>
</template>

<style scoped>
  .slide-leave-active {
    position: absolute;
    width: calc((100% - 2rem) / 3);
  }

  .move-right .slide-leave-active {
    left: calc((100% - 2rem) * 2 / 3 + 2rem);
  }

  .move-left .slide-leave-to,
  .move-right .slide-enter-from {
    transform: translateX(calc(-100% - 1rem));
  }

  .move-left .slide-enter-from,
  .move-right .slide-leave-to {
    transform: translateX(calc(100% + 1rem));
  }

</style>
