<script setup lang="ts">
  import { ref } from 'vue'  

  const canvas = ref<HTMLCanvasElement>()
</script>

<template>
  <canvas ref="canvas" width="320" height="320" />
</template>