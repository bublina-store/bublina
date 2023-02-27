<script setup lang="ts">
import { useCounterStore } from '../composables/counterStore'

const foo = useCounterStore('foo')
const bar = useCounterStore('bar')
</script>

<template>
  $END$
</template>

<style scoped>

</style>
