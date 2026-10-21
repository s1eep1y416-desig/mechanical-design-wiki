<script setup lang="ts">
import { gearPath, involuteGearPath } from '../utils/gear'
import GearPairDiagram from './GearPairDiagram.vue'

const leftSprocket = gearPath(180, 165, 18, 72, 9, 0.3)
const rightSprocket = gearPath(540, 165, 12, 46, 7, 0.3)
const chainLoop = 'M180 93 L540 119 A46 46 0 0 1 540 211 L180 237 A72 72 0 0 1 180 93 Z'
const reducerGears = [
  involuteGearPath(184, 154, 24, 32),
  involuteGearPath(280, 154, 48, 64, Math.PI / 48),
  involuteGearPath(442, 154, 24, 28),
  involuteGearPath(526, 154, 48, 56, Math.PI / 48)
]
const springCoil = Array.from({ length: 401 }, (_, i) => {
  const t = i / 400 * Math.PI * 16
  return `${i ? 'L' : 'M'}${(166 + i / 400 * 340 + 10 * Math.sin(t)).toFixed(2)} ${(164 + 50 * Math.cos(t)).toFixed(2)}`
}).join(' ')

withDefaults(
  defineProps<{
    type: 'belt' | 'gear' | 'chain' | 'bolt' | 'key' | 'shaft' | 'bearing' | 'journal' | 'spring' | 'worm' | 'coupling' | 'reducer' | 'thread'
    caption?: string
  }>(),
  { caption: '' }
)
</script>

<template>
  <figure class="mech-diagram" :data-diagram-type="type">
    <GearPairDiagram v-if="type === 'gear'" />
    <svg v-else viewBox="0 0 720 330" role="img" :aria-label="caption || '机械设计原理示意图'">
      <g class="ink" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
        <template v-if="type === 'belt'">
          <path d="M180 90 L540 116 A44 44 0 0 1 540 204 L180 230 A70 70 0 0 1 180 90 Z" stroke-width="3" />
          <circle cx="180" cy="160" r="70" stroke-width="2.5" />
          <circle cx="540" cy="160" r="44" stroke-width="2.5" />
          <circle cx="180" cy="160" r="9" class="accent-fill" />
          <circle cx="540" cy="160" r="9" class="accent-fill" />
          <path d="M112 160h-28M126 104l-18-18M640 160h28" stroke-dasharray="4 5" />
          <path d="M147 95a70 70 0 0 1 44 39" class="accent" stroke-width="2.5" />
          <path d="M297 103v114" class="accent" stroke-width="2" />
          <path d="M291 209l6 9 6-9" class="accent-fill" />
          <text x="256" y="84" class="label accent-text">F₁（紧边）</text>
          <text x="256" y="252" class="label">F₂（松边）</text>
          <text x="168" y="285" class="label">主动轮 d₁ / n₁</text>
          <text x="488" y="285" class="label">从动轮 d₂ / n₂</text>
          <text x="195" y="52" class="small">包角 α₁</text>
        </template>

        <template v-else-if="type === 'chain'">
          <path :d="leftSprocket" class="sprocket-body" stroke-width="2" />
          <path :d="rightSprocket" class="sprocket-body" stroke-width="2" />
          <circle cx="180" cy="165" r="72" class="pitch-circle" />
          <circle cx="540" cy="165" r="46" class="pitch-circle" />
          <path :d="chainLoop" class="chain-outer" />
          <path :d="chainLoop" class="chain-inner" />
          <circle cx="180" cy="165" r="20" class="sprocket-hub" />
          <circle cx="540" cy="165" r="14" class="sprocket-hub" />
          <path d="M174 139h12v10h-12z" class="sprocket-key" />
          <path d="M534 145h12v8h-12z" class="sprocket-key" />
          <path d="M148 165h-24M588 165h24" class="guide" stroke-dasharray="4 4" />
          <path d="M180 52v-18M540 70v-18M180 278v18M540 260v18" class="guide" stroke-dasharray="4 4" />
          <path d="M276 92v16M346 100v16M416 108v16M486 116v16" class="accent" stroke-width="2" />
          <path d="M300 54h46M300 54l7-4M300 54l7 4" class="accent" stroke-width="1.4" />
          <text x="300" y="46" class="label accent-text">链节距 p</text>
          <text x="118" y="286" class="label">主动链轮 z₁</text>
          <text x="492" y="286" class="label">从动链轮 z₂</text>
          <text x="574" y="158" class="small">i = z₂ / z₁</text>
          <text x="284" y="144" class="small">滚子链</text>
        </template>

        <template v-else-if="type === 'bolt'">
          <rect x="220" y="100" width="280" height="56" rx="4" stroke-width="2.2" />
          <rect x="220" y="156" width="280" height="56" rx="4" stroke-width="2.2" />
          <path d="M342 82h36v130h-36z" stroke-width="2.2" />
          <path d="M330 82h60v-14h-60z" stroke-width="2.2" />
          <path d="M330 212h60v22h-60z" stroke-width="2.2" />
          <path d="M340 224h40M340 230h40" class="accent" stroke-width="2" />
          <path d="M360 244v34M360 278l-7-10M360 278l7-10" class="accent" stroke-width="2" />
          <path d="M292 244v24M292 268l-7-10M292 268l7-10" class="accent" stroke-width="2" />
          <path d="M428 244v24M428 268l-7-10M428 268l7-10" class="accent" stroke-width="2" />
          <text x="405" y="86" class="label">螺栓</text>
          <text x="505" y="134" class="label">被连接件</text>
          <text x="397" y="290" class="label accent-text">预紧力 F₀</text>
          <text x="206" y="76" class="small">拧紧力矩 T ≈ 0.2 F₀ d</text>
        </template>

        <template v-else-if="type === 'key'">
          <circle cx="330" cy="165" r="112" stroke-width="2.2" />
          <circle cx="330" cy="165" r="82" stroke-dasharray="5 5" stroke-width="1.5" />
          <path d="M298 53h64v22h-64z" class="accent" stroke-width="2.5" />
          <path d="M298 253h64v22h-64z" class="accent" stroke-width="2.5" />
          <rect x="298" y="75" width="64" height="180" rx="2" stroke-width="2" />
          <path d="M314 75v180M346 75v180" stroke-dasharray="4 5" stroke-width="1" />
          <circle cx="330" cy="165" r="8" class="accent-fill" />
          <path d="M420 130h86M506 130v70M506 200h-86" class="accent" stroke-width="2" />
          <text x="422" y="118" class="label accent-text">键的工作长度 l</text>
          <text x="442" y="222" class="small">挤压高度 k ≈ h/2</text>
          <text x="244" y="305" class="label">轴</text>
          <text x="188" y="140" class="label">轮毂</text>
        </template>

        <template v-else-if="type === 'shaft'">
          <path d="M76 148h96v-20h86v-16h150v16h82v20h104v34h-104v20h-82v16h-150v-16h-86v-20H76z" stroke-width="2.4" />
          <path d="M64 165h592" stroke-dasharray="8 5 2 5" stroke-width="1.2" class="muted" />
          <rect x="202" y="94" width="38" height="142" rx="3" stroke-width="2" />
          <rect x="464" y="94" width="38" height="142" rx="3" stroke-width="2" />
          <rect x="338" y="84" width="58" height="162" rx="3" stroke-width="2" />
          <rect x="296" y="118" width="30" height="12" class="accent" stroke-width="2" />
          <path d="M290 100v-30M290 70l-6 10M290 70l6 10" class="accent" stroke-width="1.7" />
          <text x="190" y="268" class="label">轴承</text>
          <text x="326" y="278" class="label">齿轮</text>
          <text x="469" y="268" class="label">轴承</text>
          <text x="265" y="108" class="small accent-text">键槽</text>
          <text x="130" y="122" class="label">轴肩</text>
          <text x="558" y="122" class="small">轴段直径逐级变化</text>
        </template>

        <template v-else-if="type === 'journal'">
          <circle cx="302" cy="158" r="112" class="metal-surface" stroke-width="2" />
          <circle cx="302" cy="158" r="94" class="oil-film" stroke-width="1.5" />
          <circle cx="317" cy="177" r="65" class="metal-surface" stroke-width="2" />
          <path d="M302 43v230M187 158h230M317 102v150M241 177h153" class="guide" />
          <circle cx="302" cy="158" r="3" class="accent-fill" />
          <circle cx="317" cy="177" r="3" class="accent-fill" />
          <path d="M302 158 317 177" class="accent" stroke-width="2" />
          <path d="M317 110v-48M311 72l6-10 6 10" class="accent" stroke-width="2" />
          <text x="329" y="78" class="label accent-text">载荷 F</text>
          <path d="M398 90h54l16-20M377 193h76M354 236h99" class="leader" />
          <text x="473" y="73" class="label">轴承座与轴瓦</text>
          <text x="465" y="198" class="label">偏心轴颈</text>
          <text x="465" y="235" class="label accent-text">油膜 · 无滚动体</text>
          <text x="266" y="147" class="small">O</text>
          <text x="328" y="186" class="small">O₁</text>
          <text x="281" y="190" class="small accent-text">e</text>
          <text x="195" y="301" class="small">h_min = δ − e · 间隙与偏心量放大示意</text>
        </template>

        <template v-else-if="type === 'bearing'">
          <circle cx="300" cy="164" r="112" class="metal-surface" stroke-width="2" />
          <circle cx="300" cy="164" r="93" class="paper-surface" stroke-width="2" />
          <circle cx="300" cy="164" r="72" stroke-width="1" stroke-dasharray="5 5" class="accent" />
          <circle cx="300" cy="164" r="51" class="metal-surface" stroke-width="2" />
          <circle cx="300" cy="164" r="32" class="paper-surface" stroke-width="2" />
          <g v-for="i in 10" :key="i" :transform="`rotate(${i * 36} 300 164)`">
            <circle cx="300" cy="92" r="20" class="rolling-ball" stroke-width="1.8" />
          </g>
          <path d="M300 39v250M175 164h250" class="guide" />
          <path d="M390 100h66M371 142h85M339 195h117M360 231h96" class="leader" />
          <text x="468" y="105" class="label">外圈</text>
          <text x="468" y="147" class="label">滚动体</text>
          <text x="468" y="200" class="label">内圈</text>
          <text x="468" y="236" class="label accent-text">保持架（节线示意）</text>
          <text x="218" y="303" class="small">深沟球轴承 · 正视结构示意</text>
        </template>

        <template v-else-if="type === 'spring'">
          <path d="M166 214v-100M506 214v-100" stroke-width="3" />
          <path :d="springCoil" class="spring-wire" />
          <path d="M94 164h62M578 164h-62M147 158l9 6-9 6M525 158l-9 6 9 6" class="accent" stroke-width="2" />
          <text x="100" y="149" class="label accent-text">F</text>
          <text x="559" y="149" class="label accent-text">F</text>
          <path d="M540 114h48M540 214h48M576 114v100M571 122l5-8 5 8M571 206l5 8 5-8" class="accent" stroke-width="1.4" />
          <text x="590" y="168" class="label accent-text">中径 D</text>
          <path d="M304 114V72h-66" class="leader" />
          <text x="172" y="64" class="label">簧丝直径 d</text>
          <path d="M166 235v34M506 235v34M166 258h340" class="leader" />
          <text x="274" y="284" class="label">工作长度 L</text>
          <text x="225" y="308" class="small">轴向受压 · 变形 λ = L₀ − L · 有效圈数 n</text>
        </template>

        <template v-else-if="type === 'worm'">
          <rect x="124" y="216" width="310" height="48" rx="24" stroke-width="2.4" />
          <path d="M150 216c18 48 42 48 60 0M230 216c18 48 42 48 60 0M310 216c18 48 42 48 60 0M390 216c18 48 42 48 60 0" stroke-width="1.6" />
          <circle cx="476" cy="160" r="92" stroke-width="2.4" />
          <g v-for="i in 20" :key="'w' + i" :transform="`rotate(${i * 18} 476 160)`">
            <path d="M470 60h12" stroke-width="5" />
          </g>
          <circle cx="476" cy="160" r="20" stroke-width="2" />
          <path d="M442 216v52M510 216v52" stroke-dasharray="5 5" />
          <path d="M410 205v-40" class="accent" stroke-width="2" />
          <path d="M403 171l7-11 7 11" class="accent-fill" />
          <text x="136" y="294" class="label">蜗杆（主动，z₁）</text>
          <text x="500" y="276" class="label">蜗轮（从动，z₂）</text>
          <text x="338" y="182" class="small accent-text">导程角 γ</text>
          <text x="424" y="152" class="small">i = z₂ / z₁</text>
        </template>

        <template v-else-if="type === 'coupling'">
          <rect x="112" y="118" width="196" height="94" rx="8" stroke-width="2.4" />
          <rect x="392" y="118" width="196" height="94" rx="8" stroke-width="2.4" />
          <rect x="308" y="96" width="84" height="138" rx="6" class="accent" stroke-width="2.5" />
          <path d="M82 165h30M590 165h30" stroke-width="2.5" />
          <path d="M324 120v90M348 120v90M372 120v90" stroke-dasharray="5 5" stroke-width="1.2" />
          <circle cx="350" cy="80" r="5" class="accent-fill" />
          <text x="146" y="282" class="label">主动轴</text>
          <text x="500" y="282" class="label">从动轴</text>
          <text x="312" y="292" class="label accent-text">补偿两轴相对位移</text>
          <text x="125" y="92" class="small">传递转矩 T</text>
        </template>

        <template v-else-if="type === 'reducer'">
          <rect x="108" y="56" width="258" height="202" rx="12" class="stage-panel" />
          <rect x="392" y="56" width="228" height="202" rx="12" class="stage-panel" />
          <path :d="reducerGears[0]" class="gear-body" />
          <path :d="reducerGears[1]" class="gear-body" />
          <path :d="reducerGears[2]" class="gear-body" />
          <path :d="reducerGears[3]" class="gear-body" />
          <circle cx="184" cy="154" r="10" class="sprocket-hub" />
          <circle cx="280" cy="154" r="18" class="sprocket-hub" />
          <circle cx="442" cy="154" r="9" class="sprocket-hub" />
          <circle cx="526" cy="154" r="16" class="sprocket-hub" />
          <path d="M70 154h70M347 154h61M591 154h66M130 148l10 6-10 6M398 148l10 6-10 6M647 148l10 6-10 6" class="accent" stroke-width="2" />
          <text x="183" y="85" class="label">高速级 i₁</text>
          <text x="450" y="85" class="label">低速级 i₂</text>
          <text x="124" y="239" class="small">输入轴 I → 中间轴 II</text>
          <text x="414" y="239" class="small">中间轴 II → 输出轴 III</text>
          <text x="244" y="291" class="label accent-text">i = i₁ × i₂ · 逐级降速增矩</text>
          <text x="183" y="314" class="small">按传动级展开示意；中间轴上的两齿轮同轴固连</text>
        </template>

        <template v-else-if="type === 'thread'">
          <path d="M110 118h380l72 46-72 46H110z" stroke-width="2.4" />
          <path d="M150 118v92M200 118v92M250 118v92M300 118v92M350 118v92M400 118v92M450 118v92" stroke-width="1.5" opacity="0.55" />
          <path d="M110 165h380" stroke-dasharray="6 5" stroke-width="1.2" class="muted" />
          <path d="M520 112v80M520 112l-8 12M520 112l8 12" class="accent" stroke-width="2" />
          <text x="304" y="96" class="label">螺纹</text>
          <text x="540" y="156" class="small accent-text">F</text>
          <text x="104" y="244" class="small">自锁条件：ψ ≤ φᵥ</text>
          <text x="104" y="268" class="small">传动效率：η = tanψ / tan(ψ + φᵥ)</text>
        </template>
      </g>
    </svg>
    <figcaption v-if="caption">{{ caption }}</figcaption>
  </figure>
</template>

<style scoped>
.mech-diagram {
  margin: 28px 0;
  padding: 22px 24px 16px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background-color: var(--vp-c-bg-soft);
  background-image:
    linear-gradient(color-mix(in srgb, var(--vp-c-brand-1) 4%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--vp-c-brand-1) 4%, transparent) 1px, transparent 1px);
  background-size: 24px 24px;
}

.metal-surface, .gear-body { fill: color-mix(in srgb, var(--vp-c-text-3) 12%, var(--vp-c-bg-soft)); }
.paper-surface { fill: var(--vp-c-bg-soft); }
.gear-body { stroke: var(--vp-c-brand-1); stroke-width: 1.4; }
.oil-film { fill: color-mix(in srgb, #37bfb5 24%, var(--vp-c-bg-soft)); stroke: #389b92; }
.rolling-ball { fill: color-mix(in srgb, var(--vp-c-brand-1) 15%, var(--vp-c-bg-soft)); stroke: var(--vp-c-brand-1); }
.leader { fill: none; stroke: var(--vp-c-text-3); stroke-width: 1; }
.guide { fill: none; stroke: var(--vp-c-text-3); stroke-width: .8; stroke-dasharray: 10 4 2 4; opacity: .6; }
.spring-wire { stroke: var(--vp-c-brand-1); stroke-width: 5; fill: none; }
.stage-panel { fill: var(--vp-c-bg-soft); stroke: var(--vp-c-divider); }
@media (max-width: 520px) { .mech-diagram { padding: 16px 10px 12px; } }

svg {
  display: block;
  width: 100%;
  height: auto;
  color: var(--vp-c-text-2);
}

.ink {
  fill: none;
}

.accent {
  stroke: var(--vp-c-brand-1);
}

.sprocket-body {
  fill: color-mix(in srgb, var(--vp-c-bg-soft) 82%, var(--vp-c-brand-soft));
  stroke: currentColor;
  stroke-linejoin: round;
}

.pitch-circle {
  fill: none;
  stroke: var(--vp-c-brand-1);
  stroke-width: 1;
  stroke-dasharray: 4 5;
  opacity: 0.6;
}

.chain-outer {
  fill: none;
  stroke: var(--vp-c-brand-1);
  stroke-width: 9;
  stroke-dasharray: 12 5;
  stroke-linecap: round;
  opacity: 0.9;
}

.chain-inner {
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-dasharray: 12 5;
  opacity: 0.75;
}

.sprocket-hub {
  fill: var(--vp-c-bg-soft);
  stroke: currentColor;
  stroke-width: 1.6;
}

.sprocket-key {
  fill: var(--vp-c-bg-soft);
  stroke: currentColor;
  stroke-width: 1;
}

.accent-fill {
  fill: var(--vp-c-brand-1);
  stroke: var(--vp-c-brand-1);
}

.accent-text {
  fill: var(--vp-c-brand-1);
}

.muted {
  stroke: var(--vp-c-text-3);
}

.label {
  fill: var(--vp-c-text-2);
  font-size: 14px;
  font-weight: 600;
  stroke: none;
}

.small {
  fill: var(--vp-c-text-3);
  font-size: 11.5px;
  stroke: none;
}

figcaption {
  margin-top: 8px;
  color: var(--vp-c-text-3);
  font-size: 12px;
  text-align: center;
}
</style>
