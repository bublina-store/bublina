<script setup lang="ts">
  import { ref, computed, watchEffect } from 'vue'  
  import { useMouse } from '@vueuse/core'
  
  const body = ref<HTMLElement>()
  const highlight = ref<HTMLElement>()
  const leftEye = ref<HTMLElement>()
  const rightEye = ref<HTMLElement>()

  const { x, y } = useMouse()
    
  const offset = computed(() => {
    const bbox = highlight.value?.getBoundingClientRect()
    if (!bbox) {
      return [0, 0, 0]
    }
    
    const centerX = bbox.left + bbox.width / 2
    const centerY = bbox.top + bbox.height / 2
    
    const offsetX = x.value - centerX
    const offsetY = y.value - centerY
    
    const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY)
    
    return [offsetX / distance, offsetY / distance, distance]
  })
  
  watchEffect(() => {
    if (!leftEye.value || !rightEye.value || !offset.value || !body.value || !highlight.value) {
      return
    }
    
    const [offsetX, offsetY, distance] = offset.value
    
    const relativeDistance = Math.min(distance, 1000) / 1000
    
    const bodyDistance = relativeDistance * 120    
    body.value.style.left = `${offsetX * bodyDistance}px`
    body.value.style.top = `${offsetY * bodyDistance}px`    
    
    const highlightDistance = relativeDistance * 10
    highlight.value.style.left = `${offsetX * highlightDistance}px` 
    highlight.value.style.top = `${offsetY * highlightDistance}px` 
    
    const eyeHorizontalDistance = relativeDistance * 80    
    const eyeVerticalDistance = relativeDistance * 100    
    leftEye.value.style.left = `${offsetX * eyeHorizontalDistance}px`
    leftEye.value.style.top = `${offsetY * eyeVerticalDistance + offsetX * relativeDistance * 16}px`

    rightEye.value.style.left = `${offsetX * eyeHorizontalDistance}px`
    rightEye.value.style.top = `${offsetY * eyeVerticalDistance - offsetX * relativeDistance * 16}px`
  })
  
</script>

<template>
  <div class="logo">
    <div ref="body" class="body">
      <div ref="highlight" class="highlight">
        <div ref="leftEye" class="left eye"></div>
        <div ref="rightEye" class="right eye"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.logo {
  --ink-color: #001e2d;
  --border-color: #007fb0;
  --highlight-color: #81cfff;
  --body-size: 320px;
  --ink-size: 16px;
  --eye-size: 32px;
}

.body {
  position: relative;
  width: var(--body-size);
  height: var(--body-size);
  border: var(--ink-size) solid var(--ink-color);
  border-radius: 50%;
  background: var(--border-color);
  box-shadow: #81cfff 0 0 64px 0;
  padding: calc(var(--ink-size) / 2);
} 

.highlight {
  position: relative;
  display: grid;
  place-items: center;
  grid-template-columns: 1fr 1fr;
  padding: 25%;
  width: 100%;
  height: 100%;
  background: var(--highlight-color);
  border-radius: 50%;
}

.eye {
  position: relative;
  width: var(--eye-size);
  height: var(--eye-size);
  border-radius: 50%;
  background: var(--ink-color);
  transition: top 0.05s ease, left 0.05s ease;
}
</style>