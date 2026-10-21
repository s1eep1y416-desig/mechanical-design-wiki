<script setup lang="ts">
import { computed, ref, useId, watch } from 'vue'

const uid = useId()
const examples = [
  { name: '间隙配合', lo: -20, hi: -10, note: '孔的最小尺寸仍大于轴的最大尺寸。' },
  { name: '过渡配合', lo: 10, hi: 25, note: '孔与轴的尺寸区间交叠，装配可能有间隙，也可能有过盈。' },
  { name: '过盈配合', lo: 30, hi: 45, note: '轴的最小尺寸仍大于孔的最大尺寸。' }
]
const selected = ref(0)
const current = computed(() => examples[selected.value])
const hole = ref(10)
const shaft = ref(-15)
watch(selected, () => { shaft.value = Math.round((current.value.lo + current.value.hi) / 2) })
const difference = computed(() => hole.value - shaft.value)
const result = computed(() => difference.value > 0 ? '间隙' : difference.value < 0 ? '过盈' : '尺寸恰好相等')
const y = (value: number) => 222 - (value + 25) * 2.5
const dimension = (deviation: number) => (20 + deviation / 1000).toFixed(3)
</script>

<template>
  <section class="fit-demo" data-fit-demo aria-label="三种配合的公差带对比">
    <div class="fit-tabs" aria-label="选择配合类型">
      <button v-for="(item, i) in examples" :key="item.name" :aria-pressed="selected === i" @click="selected = i">{{ item.name }}</button>
    </div>
    <p class="fit-note">{{ current.note }}</p>
    <svg viewBox="0 0 580 265" role="img" :aria-label="`${current.name}：孔尺寸偏差 0 至 20 微米，轴尺寸偏差 ${current.lo} 至 ${current.hi} 微米`">
      <g class="grid">
        <path v-for="value in [-20, 0, 20, 40]" :key="value" :d="`M100 ${y(value)}H530`" />
      </g>
      <path :d="`M100 ${y(0)}H530`" class="zero" />
      <g class="axis-label">
        <text v-for="value in [-20, 0, 20, 40]" :key="value" x="74" :y="y(value) + 5" text-anchor="end">{{ value > 0 ? '+' : '' }}{{ value }}</text>
        <text x="24" y="24">偏差 / μm</text>
      </g>
      <rect x="162" :y="y(20)" width="100" :height="y(0) - y(20)" class="hole-zone" />
      <rect x="362" :y="y(current.hi)" width="100" :height="y(current.lo) - y(current.hi)" class="shaft-zone" />
      <path :d="`M148 ${y(hole)}h128`" class="hole-actual" />
      <path :d="`M348 ${y(shaft)}h128`" class="shaft-actual" />
      <text x="212" y="247" text-anchor="middle" class="zone-label">孔 · 0～+20 μm</text>
      <text x="412" y="247" text-anchor="middle" class="zone-label">轴 · {{ current.lo }}～{{ current.hi }} μm</text>
      <text x="530" :y="y(0) - 8" text-anchor="end" class="zero-label">零线 · 公称尺寸 20 mm</text>
    </svg>
    <div class="fit-controls">
      <label :for="`${uid}-hole`">孔的实际尺寸 <strong>{{ dimension(hole) }} mm</strong>
        <input :id="`${uid}-hole`" v-model.number="hole" type="range" min="0" max="20" step="1" />
      </label>
      <label :for="`${uid}-shaft`">轴的实际尺寸 <strong>{{ dimension(shaft) }} mm</strong>
        <input :id="`${uid}-shaft`" v-model.number="shaft" type="range" :min="current.lo" :max="current.hi" step="1" />
      </label>
    </div>
    <div class="fit-result" aria-live="polite">
      <span>这一次装配</span><strong>{{ result }}{{ difference ? ` ${Math.abs(difference)} μm` : '' }}</strong>
      <span>孔 − 轴 = {{ difference }} μm</span>
    </div>
    <p class="fit-disclaimer">教学假设数据，用于理解尺寸区间；不对应某个标准公差带。拖动滑块可观察同一种配合下的不同装配结果。</p>
  </section>
</template>

<style scoped>
.fit-demo { margin: 24px 0; padding: 24px; border: 1px solid var(--vp-c-divider); border-radius: 16px; background: var(--vp-c-bg-soft); }
.fit-tabs { display: flex; gap: 6px; padding: 4px; border: 1px solid var(--vp-c-divider); border-radius: 9px; }
.fit-tabs button { flex: 1; padding: 9px 4px; border-radius: 6px; font-size: 13px; cursor: pointer; }
.fit-tabs button[aria-pressed='true'] { background: var(--vp-c-brand-soft); color: var(--vp-c-brand-1); font-weight: 650; }
.fit-tabs button:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 2px; }
.fit-demo .fit-note { min-height: 44px; margin: 16px 0 0; font-size: 13px; line-height: 1.7; }
svg { display: block; width: 100%; }
.grid path { stroke: var(--vp-c-divider); stroke-width: 1; }
.zero { stroke: var(--vp-c-text-3); stroke-dasharray: 5 5; }
.axis-label, .zero-label { fill: var(--vp-c-text-3); font: 12px var(--vp-font-family-base); }
.hole-zone { fill: color-mix(in srgb, var(--vp-c-brand-1) 24%, transparent); stroke: var(--vp-c-brand-1); }
.shaft-zone { fill: #d99b3733; stroke: #b78530; }
.hole-actual { stroke: var(--vp-c-brand-1); stroke-width: 3; }
.shaft-actual { stroke: #b78530; stroke-width: 3; }
.zone-label { fill: var(--vp-c-text-2); font: 13px var(--vp-font-family-base); }
.fit-controls { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 14px; }
.fit-controls label { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px; font-size: 11px; }
.fit-controls strong { font: 600 12px var(--vp-font-family-mono); }
.fit-controls input { width: 100%; accent-color: var(--vp-c-brand-1); cursor: pointer; }
.fit-result { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 10px; margin-top: 20px; padding: 14px; border-radius: 8px; background: var(--vp-c-brand-soft); font-size: 11px; }
.fit-result strong { color: var(--vp-c-brand-1); font-size: 15px; }
.fit-demo .fit-disclaimer { margin: 14px 0 0; color: var(--vp-c-text-3); font-size: 11px; line-height: 1.8; }
@media (max-width: 520px) { .fit-demo { padding: 16px; } .fit-controls { grid-template-columns: 1fr; gap: 16px; } }
</style>
