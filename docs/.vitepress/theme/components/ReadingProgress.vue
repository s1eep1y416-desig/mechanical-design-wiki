<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const progress = ref(0)
let frame = 0

function update() {
  cancelAnimationFrame(frame)
  frame = requestAnimationFrame(() => {
    const doc = document.documentElement
    const max = doc.scrollHeight - window.innerHeight
    progress.value = max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0
  })
}

onMounted(() => {
  update()
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update, { passive: true })
})

onUnmounted(() => {
  cancelAnimationFrame(frame)
  window.removeEventListener('scroll', update)
  window.removeEventListener('resize', update)
})

watch(
  () => route.path,
  async () => {
    await nextTick()
    update()
  }
)
</script>

<template>
  <div class="reading-progress" aria-hidden="true">
    <span :style="{ width: progress + '%' }" />
  </div>
</template>

<style scoped>
.reading-progress {
  position: fixed;
  inset: 0 0 auto;
  height: 2px;
  z-index: 100;
  pointer-events: none;
}

.reading-progress span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #0b63ce, #35b6ff 60%, #ffb020);
  transition: width 80ms linear;
  box-shadow: 0 0 8px rgba(53, 182, 255, 0.55);
}
</style>
