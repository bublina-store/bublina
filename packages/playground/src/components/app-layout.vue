<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="grid place-items-center min-h-screen">
    <main class="flex flex-col gap-4 mb-20 w-full">
      <header class="mb-8 flex items-center">
        <button
          class="rounded-12 grid place-items-center hover:bg-dark-300"
          @click="$router.push({ name: 'index' })"
        >
          <i class="i-material-symbols-chevron-left-rounded h-12 w-12" />
        </button>
        <h1 class="text-12 text-center flex-1 mr-12">
          {{ title }}
        </h1>
      </header>

      <slot />
    </main>
  </div>
</template>

<style scoped>

</style>
