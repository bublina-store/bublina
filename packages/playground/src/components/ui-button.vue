<script setup lang="ts">
defineProps<{
  highlighted?: boolean
  disabled?: boolean
}>()
</script>

<template>
  <button
    class="py-2 px-4 rounded-2 flex items-center justify-center"
    :class="disabled ? 'bg-transparent text-dark-50' : highlighted ? 'bg-green-700 hover:bg-green-500' : 'bg-dark hover:bg-dark-300'"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style scoped>

</style>
