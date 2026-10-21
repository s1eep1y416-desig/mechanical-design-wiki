<script setup lang="ts">
import { computed } from 'vue'
import { involuteGearPath } from '../utils/gear'

const props = withDefaults(
  defineProps<{
    chapter: string | number
    part: string
    title: string
    en?: string
    desc: string
    tags?: string
    pages?: string
  }>(),
  { en: '', tags: '核心概念|工程公式|工程直觉', pages: '' }
)

const tagList = computed(() => props.tags.split('|').filter(Boolean))
const padded = computed(() => String(props.chapter).padStart(2, '0'))
const gearBody = computed(() => involuteGearPath(130, 130, 24, 86))
const bores = Array.from({ length: 6 }, (_, i) => {
  const angle = (i * Math.PI) / 3
  return { x: 130 + Math.cos(angle) * 40, y: 130 + Math.sin(angle) * 40 }
})
</script>

<template>
  <section class="chapter-hero">
    <div class="chapter-hero__content">
      <div class="chapter-hero__crumb">
        <span>{{ part }}</span>
        <i />
        <span>第 {{ chapter }} 章</span>
      </div>
      <h1>{{ title }}</h1>
      <p v-if="en" class="chapter-hero__en">{{ en }}</p>
      <p class="chapter-hero__desc">{{ desc }}</p>
      <div class="chapter-hero__tags">
        <span v-for="tag in tagList" :key="tag">{{ tag }}</span>
        <span v-if="pages" class="chapter-hero__pages">教材 p.{{ pages }}</span>
      </div>
    </div>

    <div class="chapter-hero__visual" aria-hidden="true">
      <span class="chapter-hero__number">{{ padded }}</span>
      <svg class="chapter-hero__gear" viewBox="0 0 260 260">
        <defs>
          <radialGradient id="chGearFill" cx="35%" cy="28%" r="80%">
            <stop offset="0%" stop-color="rgba(82, 213, 255, 0.24)" />
            <stop offset="65%" stop-color="rgba(30, 112, 210, 0.1)" />
            <stop offset="100%" stop-color="rgba(8, 32, 62, 0.04)" />
          </radialGradient>
        </defs>
        <g class="ch-gear">
          <path :d="gearBody" class="ch-gear__body" />
          <circle cx="130" cy="130" r="86" class="ch-gear__pitch" />
          <circle cx="130" cy="130" r="58" class="ch-gear__ring" />
          <circle cx="130" cy="130" r="27" class="ch-gear__ring" />
          <circle cx="130" cy="130" r="13" class="ch-gear__bore" />
          <circle
            v-for="(bore, i) in bores"
            :key="'bore' + i"
            :cx="bore.x"
            :cy="bore.y"
            r="6.5"
            class="ch-gear__bore"
          />
          <path d="M123 104h14v17h-14z" class="ch-gear__keyway" />
          <path d="M130 52v156M52 130h156" class="ch-gear__cross" />
          <path d="M130 34v12M130 214v12M34 130h12M214 130h12" class="ch-gear__cross ch-gear__cross--strong" />
          <text x="150" y="224" class="ch-gear__label">z = 24 · α = 20°</text>
          <text x="150" y="238" class="ch-gear__label ch-gear__label--dim">m = 2 · STANDARD GEAR</text>
        </g>
      </svg>
      <span class="chapter-hero__axis chapter-hero__axis--x" />
      <span class="chapter-hero__axis chapter-hero__axis--y" />
    </div>
  </section>
</template>

<style scoped>
.chapter-hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 190px;
  gap: 18px;
  margin: 8px 0 36px;
  padding: 38px 36px;
  overflow: hidden;
  border: 1px solid rgba(11, 99, 206, 0.14);
  border-radius: 18px;
  background:
    radial-gradient(120% 180% at 100% 0%, rgba(53, 182, 255, 0.18), transparent 55%),
    linear-gradient(135deg, rgba(11, 99, 206, 0.08), rgba(11, 99, 206, 0.02) 55%, rgba(255, 176, 32, 0.06));
}

.dark .chapter-hero {
  border-color: rgba(106, 169, 255, 0.22);
  background:
    radial-gradient(120% 180% at 100% 0%, rgba(53, 182, 255, 0.16), transparent 55%),
    linear-gradient(135deg, rgba(28, 71, 128, 0.48), rgba(17, 24, 39, 0.25));
}

.chapter-hero__content {
  position: relative;
  z-index: 1;
  min-width: 0;
}

.chapter-hero__crumb {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.chapter-hero__crumb i {
  width: 18px;
  height: 1px;
  background: currentColor;
  opacity: 0.5;
}

.chapter-hero h1 {
  margin: 14px 0 0;
  font-size: clamp(29px, 3.7vw, 40px);
  line-height: 1.12;
  letter-spacing: -0.035em;
  font-weight: 800;
}

.chapter-hero__en {
  margin: 8px 0 0;
  color: var(--vp-c-text-3);
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.chapter-hero__desc {
  max-width: 570px;
  margin: 18px 0 0;
  color: var(--vp-c-text-2);
  font-size: 15px;
  line-height: 1.75;
}

.chapter-hero__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
}

.chapter-hero__tags .chapter-hero__pages {
  border-color: rgba(11, 99, 206, 0.28);
  background: rgba(11, 99, 206, 0.08);
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 9.5px;
  letter-spacing: 0.02em;
}

.chapter-hero__tags span {
  padding: 4px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-size: 11px;
  font-weight: 600;
}

.chapter-hero__visual {
  position: relative;
  align-self: center;
  height: 220px;
  color: var(--vp-c-brand-1);
}

.chapter-hero__gear {
  position: absolute;
  right: -34px;
  bottom: -46px;
  width: 238px;
  height: 238px;
  opacity: 0.48;
}

.chapter-hero__number {
  position: absolute;
  top: -8px;
  right: 0;
  color: var(--vp-c-brand-1);
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 104px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.08em;
  opacity: 0.12;
}

.chapter-hero__axis {
  position: absolute;
  background: currentColor;
  opacity: 0.18;
}

.chapter-hero__axis--x {
  right: -10px;
  bottom: 26px;
  width: 210px;
  height: 1px;
}

.chapter-hero__axis--y {
  right: 26px;
  bottom: -10px;
  width: 1px;
  height: 190px;
}

.ch-gear__body {
  fill: url(#chGearFill);
  stroke: currentColor;
  stroke-width: 1.4;
  stroke-linejoin: round;
}

.ch-gear__pitch {
  fill: none;
  stroke: currentColor;
  stroke-width: 1;
  stroke-dasharray: 4 5;
  opacity: 0.7;
}

.ch-gear__ring {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.1;
  opacity: 0.7;
}

.ch-gear__bore,
.ch-gear__keyway {
  fill: var(--vp-c-bg-soft);
  stroke: currentColor;
  stroke-width: 1;
  opacity: 0.9;
}

.ch-gear__cross {
  fill: none;
  stroke: currentColor;
  stroke-width: 0.8;
  stroke-dasharray: 3 5;
  opacity: 0.35;
}

.ch-gear__cross--strong {
  stroke-dasharray: none;
  opacity: 0.6;
}

.ch-gear__label {
  fill: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 6px;
  letter-spacing: 0.08em;
  opacity: 0.75;
}

.ch-gear__label--dim {
  fill: var(--vp-c-text-3);
  font-size: 5px;
}

@keyframes gear-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 720px) {
  .chapter-hero {
    grid-template-columns: 1fr;
    padding: 26px 22px;
  }

  .chapter-hero__visual {
    position: absolute;
    inset: 0;
    height: 100%;
    opacity: 0.5;
  }

  .chapter-hero__gear {
    right: -70px;
    bottom: -50px;
  }

  .chapter-hero__number {
    top: auto;
    right: 14px;
    bottom: 6px;
    font-size: 80px;
  }

  .chapter-hero__axis {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .chapter-hero__gear {
    animation: none;
  }
}
</style>
