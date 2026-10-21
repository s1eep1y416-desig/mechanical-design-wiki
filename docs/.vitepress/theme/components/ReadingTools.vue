<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useData } from 'vitepress'

type BgMode = 'default' | 'white' | 'black'

const { isDark } = useData()
const bg = ref<BgMode>('default')
const scrolled = ref(false)
const storageKey = 'mdwiki-bg'
let syncing = false

const showTop = computed(() => scrolled.value)

function clearBg() {
  bg.value = 'default'
  document.documentElement.removeAttribute('data-bg')
  localStorage.removeItem(storageKey)
}

function setBg(mode: 'white' | 'black') {
  if (bg.value === mode) {
    clearBg()
    return
  }
  bg.value = mode
  document.documentElement.dataset.bg = mode
  localStorage.setItem(storageKey, mode)
  syncing = true
  isDark.value = mode === 'black'
  document.documentElement.classList.toggle('dark', mode === 'black')
  localStorage.setItem('vitepress-theme-appearance', mode === 'black' ? 'dark' : 'light')
  nextTick(() => {
    syncing = false
  })
}

function scrollTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function onScroll() {
  scrolled.value = window.scrollY > 260
}

onMounted(() => {
  const saved = localStorage.getItem(storageKey)
  if (saved === 'white' || saved === 'black') {
    bg.value = saved
    document.documentElement.dataset.bg = saved
    syncing = true
    isDark.value = saved === 'black'
    document.documentElement.classList.toggle('dark', saved === 'black')
    nextTick(() => {
      syncing = false
    })
  }
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

watch(isDark, (dark) => {
  if (syncing) return
  if ((bg.value === 'white' && dark) || (bg.value === 'black' && !dark)) {
    clearBg()
  }
})
</script>

<template>
  <div class="reading-tools" aria-label="阅读工具">
    <div class="bg-buttons" role="group" aria-label="阅读背景">
      <button
        class="bg-dot bg-dot--white"
        :class="{ active: bg === 'white' }"
        title="白色背景"
        aria-label="白色背景"
        @click="setBg('white')"
      />
      <button
        class="bg-dot bg-dot--black"
        :class="{ active: bg === 'black' }"
        title="黑色背景"
        aria-label="黑色背景"
        @click="setBg('black')"
      />
    </div>

    <button
      class="to-top"
      :class="{ visible: showTop }"
      title="回到顶部"
      aria-label="回到顶部"
      @click="scrollTop"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 19V5M6.5 10.5 12 5l5.5 5.5" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.reading-tools {
  position: fixed;
  right: 18px;
  bottom: 20px;
  z-index: 70;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 9px;
  padding: 7px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: color-mix(in srgb, var(--vp-c-bg) 88%, transparent);
  box-shadow: 0 8px 28px rgba(8, 24, 48, 0.12);
  backdrop-filter: blur(12px);
}

.bg-buttons {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.bg-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid var(--vp-c-divider);
  cursor: pointer;
  transition:
    transform 0.16s,
    box-shadow 0.16s,
    border-color 0.16s;
}

.bg-dot:hover {
  transform: scale(1.12);
}

.bg-dot.active {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 0 0 2px var(--vp-c-brand-soft);
}

.bg-dot--white {
  background: #fff;
}

.bg-dot--black {
  background: #000;
}

.to-top {
  display: grid;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  color: #fff;
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transform: translateY(5px);
  transition:
    opacity 0.2s,
    transform 0.2s,
    background 0.2s;
  place-items: center;
}

.to-top.visible {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

.to-top:hover {
  background: var(--vp-c-brand-2);
}

.to-top svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

@media (max-width: 640px) {
  .reading-tools {
    right: 12px;
    bottom: 14px;
  }
}
</style>
