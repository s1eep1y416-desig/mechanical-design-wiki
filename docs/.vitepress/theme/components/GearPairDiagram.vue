<script setup lang="ts">
import { useId } from 'vue'
import { involuteGearPath } from '../utils/gear'

withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })
const uid = useId().replace(/:/g, '')
const pinion = involuteGearPath(210, 160, 24, 65)
const wheel = involuteGearPath(405, 160, 48, 130, Math.PI / 48)
const holes = Array.from({ length: 6 }, (_, i) => {
  const angle = i * Math.PI / 3
  return { x: 405 + Math.cos(angle) * 77, y: 160 + Math.sin(angle) * 77 }
})
</script>

<template>
  <div class="gear-pair" data-gear-pair :class="{ 'gear-pair--compact': compact }">
    <svg viewBox="0 0 660 354" role="img" :aria-labelledby="`${uid}-title ${uid}-desc`">
      <title :id="`${uid}-title`">24 齿主动小齿轮与 48 齿从动大齿轮的外啮合</title>
      <desc :id="`${uid}-desc`">同模数直齿圆柱齿轮，分度圆在节点 P 相切，转向相反，传动比为 2。虚线表示分度圆，齿廓为渐开线示意。</desc>
      <defs>
        <linearGradient :id="`${uid}-steel`" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" class="steel-light" />
          <stop offset="1" class="steel-dark" />
        </linearGradient>
        <linearGradient :id="`${uid}-blue`" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" class="blue-light" />
          <stop offset="1" class="blue-dark" />
        </linearGradient>
        <marker :id="`${uid}-arrow`" viewBox="0 0 8 8" refX="6.5" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M1 1 7 4 1 7" class="arrow-head" />
        </marker>
      </defs>

      <path d="M80 160H570M210 66V249M405 14V307" class="center-line" />
      <g class="wheel">
        <path :d="wheel" :fill="`url(#${uid}-steel)`" class="outline" />
        <circle cx="405" cy="160" r="99" class="rim" />
        <circle v-for="(hole, i) in holes" :key="i" :cx="hole.x" :cy="hole.y" r="18" class="cutout" />
        <circle cx="405" cy="160" r="40" class="hub" />
        <path d="M397 137v-9h16v9a25 25 0 1 1-16 0Z" class="bore" />
      </g>
      <g class="pinion">
        <path :d="pinion" :fill="`url(#${uid}-blue)`" class="outline" />
        <circle cx="210" cy="160" r="43" class="rim" />
        <circle cx="210" cy="160" r="29" class="hub" />
        <path d="M205 145v-7h10v7a16 16 0 1 1-10 0Z" class="bore" />
      </g>

      <circle cx="210" cy="160" r="65" class="pitch" />
      <circle cx="405" cy="160" r="130" class="pitch" />
      <circle cx="210" cy="160" r="61.08" class="base" />
      <circle cx="405" cy="160" r="122.16" class="base" />
      <path d="M202 160h16M210 152v16M397 160h16M405 152v16" class="center-mark" />

      <g class="rotation" :marker-end="`url(#${uid}-arrow)`">
        <path d="M164 90A84 84 0 0 1 239 80" />
        <path d="M459 300A151 151 0 0 0 509 267" />
      </g>
      <text x="168" y="64" class="symbol">n₁</text>
      <text x="491" y="308" class="symbol">n₂</text>

      <g v-if="!compact" class="forces" :marker-end="`url(#${uid}-arrow)`">
        <path d="M275 160V86" />
        <path d="M275 160H228" />
      </g>
      <g v-if="!compact" class="annotations">
        <path d="M242 69 309 254" class="action-line" />
        <text x="282" y="83" class="symbol">Fₜ₁</text>
        <text x="239" y="183" class="symbol">Fᵣ₁</text>
        <path d="M274 125a35 35 0 0 0-12 2" class="angle" />
        <text x="247" y="112" class="angle-label">20°</text>
        <path d="M497 68H578V91" class="leader" />
        <text x="547" y="112" class="note">分度圆</text>
        <path d="M540.4 160H589" class="leader" />
        <text x="547" y="184" class="note">齿顶圆</text>
      </g>
      <circle cx="275" cy="160" r="5" class="pitch-point" />
      <text x="286" y="149" class="point-label">P</text>

      <g class="dimension">
        <path d="M210 249v82M405 302v29" />
        <path d="M210 320H405" :marker-start="`url(#${uid}-arrow)`" :marker-end="`url(#${uid}-arrow)`" />
        <text x="307.5" y="344" text-anchor="middle">中心距 a = 72 mm</text>
      </g>
      <text x="110" y="227" class="gear-label">z₁ = 24</text>
      <text x="426" y="25" class="gear-label">z₂ = 48</text>
    </svg>
    <div class="gear-pair__key">
      <span><i class="key-line" />分度圆</span>
      <span><i class="key-dot" />节点 P</span>
      <span>m = 2 mm · α = 20°</span>
    </div>
    <div v-if="!compact" class="gear-pair__facts">
      <div><small>主动小齿轮</small><strong>d₁ = 48 mm</strong></div>
      <div><small>从动大齿轮</small><strong>d₂ = 96 mm</strong></div>
      <div><small>减速传动 · 转向相反</small><strong>i = z₂ / z₁ = 2</strong></div>
    </div>
    <p v-if="!compact" class="gear-pair__hint">箭头表示主动轮所受的啮合力；渐开线齿廓用于原理说明，齿根过渡已简化。</p>
  </div>
</template>

<style scoped>
.gear-pair {
  --gear-outline: #5e7894;
  --gear-accent: var(--vp-c-brand-1);
  --gear-paper: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
}
.dark .gear-pair { --gear-outline: #8ca8c7; }
.gear-pair--compact { --gear-outline: #8baac9; --gear-accent: #63dbed; --gear-paper: #0c2036; color: #b5cbe1; }
svg { display: block; width: 100%; height: auto; overflow: visible; }
.steel-light { stop-color: var(--gear-outline); stop-opacity: .28; }
.steel-dark { stop-color: var(--gear-outline); stop-opacity: .06; }
.blue-light { stop-color: var(--gear-accent); stop-opacity: .3; }
.blue-dark { stop-color: var(--gear-accent); stop-opacity: .08; }
.outline { stroke: var(--gear-outline); stroke-width: 1.5; stroke-linejoin: round; }
.pinion .outline { stroke: var(--gear-accent); stroke-width: 1.8; }
.rim, .hub { fill: none; stroke: var(--gear-outline); stroke-width: 1; opacity: .75; }
.cutout, .bore { fill: var(--gear-paper); stroke: var(--gear-outline); stroke-width: 1.3; }
.pitch { fill: none; stroke: var(--gear-accent); stroke-width: 1; stroke-dasharray: 7 5; opacity: .7; }
.base { fill: none; stroke: var(--gear-outline); stroke-width: .7; stroke-dasharray: 2 5; opacity: .35; }
.center-line { fill: none; stroke: var(--gear-outline); stroke-width: .7; stroke-dasharray: 13 4 2 4; opacity: .3; }
.center-mark { fill: none; stroke: var(--gear-outline); stroke-width: 1; }
.rotation, .forces { fill: none; stroke: var(--gear-accent); stroke-width: 2; }
.arrow-head { fill: none; stroke: var(--gear-accent); stroke-width: 1.4; stroke-linecap: round; stroke-linejoin: round; }
.pitch-point { fill: var(--gear-accent); stroke: var(--gear-paper); stroke-width: 2; }
.symbol, .point-label { fill: var(--gear-accent); font: 600 16px var(--vp-font-family-mono); }
.gear-label { fill: currentColor; font: 600 15px var(--vp-font-family-mono); }
.action-line { fill: none; stroke: var(--gear-accent); stroke-width: 1; stroke-dasharray: 4 5; opacity: .5; }
.angle { fill: none; stroke: var(--gear-accent); stroke-width: 1; }
.angle-label { fill: var(--gear-accent); font: 11px var(--vp-font-family-mono); }
.leader, .dimension { fill: none; stroke: var(--gear-outline); stroke-width: .8; }
.note, .dimension text { fill: currentColor; stroke: none; font: 13px var(--vp-font-family-base); }
.gear-pair__key { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px 22px; margin-top: 8px; font-size: 11px; }
.gear-pair__key span { display: inline-flex; align-items: center; gap: 6px; }
.key-line { width: 20px; border-top: 1px dashed var(--gear-accent); }
.key-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--gear-accent); }
.gear-pair__facts { display: grid; grid-template-columns: 1fr 1fr 1.3fr; gap: 12px; padding-top: 18px; margin-top: 18px; border-top: 1px solid var(--vp-c-divider); }
.gear-pair__facts div { display: flex; flex-direction: column; gap: 4px; }
.gear-pair__facts small { font-size: 11px; color: var(--vp-c-text-3); }
.gear-pair__facts strong { font: 600 13px var(--vp-font-family-mono); }
.gear-pair .gear-pair__hint { margin: 12px 0 0; color: var(--vp-c-text-3); font-size: 11px; line-height: 1.7; }
@media (max-width: 520px) {
  .gear-pair__facts { grid-template-columns: 1fr 1fr; }
  .gear-pair__facts div:last-child { grid-column: 1 / -1; }
  .gear-pair__key { gap: 8px 12px; }
}
</style>
