<script setup lang="ts">
import UiCard from '../components/ui-card.vue'
import { RouteRecord } from 'vue-router'

const pages = ref<RouteRecord[]>([])

import('~pages')
  .then((p: { default: RouteRecord[]}) => { pages.value = p.default })

const router = useRouter()

</script>

<template>
  <div class="max-w-240 mx-auto h-screen flex flex-wrap justify-center content-center grid-cols-2 gap-16">
    <ui-card
      v-for="page in pages.filter(p => p.name !== 'index')"
      :key="page.name"
      class="w-80 pa-4 !items-start hover:bg-dark-300 group hover:cursor-pointer"
      @click="router.push({ name: page.name })"
    >
      <h2 class="text-8 group-hover:text-green">
        {{ page.meta?.title ?? page.name }}
      </h2>

      <div>
        {{ page.meta?.description }}
      </div>
    </ui-card>
  </div>
</template>

<style scoped>

</style>
