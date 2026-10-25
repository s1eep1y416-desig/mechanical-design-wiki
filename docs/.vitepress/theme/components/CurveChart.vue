<script setup lang="ts">
import FigureFrame from './FigureFrame.vue'
import { computed } from 'vue'

type ChartType = 'sn' | 'limit' | 'contact' | 'stribeck' | 'wear' | 'bolt' | 'belt' | 'chain' | 'efficiency' | 'spring' | 'bearing'

const props = defineProps<{
  type: ChartType
  title?: string
  caption?: string
}>()

const meta = computed(() => {
  const map: Record<ChartType, { eyebrow: string; title: string; caption: string; x: string; y: string }> = {
    sn: {
      eyebrow: 'FATIGUE CURVE',
      title: 'σ–N 疲劳曲线',
      caption: '低周疲劳、有限寿命与无限寿命三个区域；N₀ 为循环基数，σ₋₁ 为对称循环疲劳极限。',
      x: '循环次数 N（对数坐标）',
      y: '应力 σ'
    },
    limit: {
      eyebrow: 'LIMIT STRESS',
      title: '三种疲劳判据对比',
      caption: '正平均应力区示意：三条曲线的纵轴截距均为 σ₋₁。Goodman 与 Gerber 的横轴截距为抗拉强度 σb，Soderberg 为屈服强度 σs；使用疲劳判据时仍需校核最大应力是否超过屈服极限。',
      x: '平均应力 σₘ',
      y: '应力幅 σₐ'
    },
    contact: {
      eyebrow: 'HERTZ CONTACT',
      title: '接触应力沿深度的分布',
      caption: '最大接触应力在表面，沿深度迅速衰减；反复接触会在表层或次表层萌生疲劳裂纹。',
      x: '距表面深度 z',
      y: 'σH / σHmax'
    },
    stribeck: {
      eyebrow: 'STRIBECK CURVE',
      title: '摩擦状态与 Stribeck 曲线',
      caption: '随 ηn/p 增大，摩擦状态由边界摩擦经混合摩擦过渡到流体摩擦，摩擦系数先降后升。',
      x: 'ηn / p',
      y: '摩擦系数 f'
    },
    wear: {
      eyebrow: 'WEAR CURVE',
      title: '磨损过程的三个阶段',
      caption: '跑合阶段磨损率快速下降，稳定阶段磨损缓慢而均匀，进入剧烈磨损阶段后间隙和温升迅速上升。',
      x: '工作时间 t',
      y: '磨损率'
    },
    bolt: {
      eyebrow: 'PRELOAD DIAGRAM',
      title: '螺栓连接的力–变形图',
      caption: '预紧后螺栓与被连接件共同受力；工作载荷 F 只有一部分使螺栓继续伸长，其余部分卸载被连接件。',
      x: '变形 δ',
      y: '力 F'
    },
    belt: {
      eyebrow: 'BELT STRESS',
      title: '带传动的应力分布',
      caption: '最大应力发生在紧边刚绕上小带轮处：σmax = σ₁ + σb₁ + σc。',
      x: '沿带周长位置',
      y: '应力 σ'
    },
    chain: {
      eyebrow: 'POLYGON EFFECT',
      title: '链速的周期性波动',
      caption: '链轮齿数越多，多边形效应越弱，瞬时链速波动越小；图中虚线为平均链速。',
      x: '链轮转角',
      y: '链速 v'
    },
    efficiency: {
      eyebrow: 'WORM EFFICIENCY',
      title: '蜗杆效率与导程角',
      caption: '导程角增大时效率提高；当量摩擦角越大，效率越低。γ 小于 φv 时接近自锁区。',
      x: '导程角 γ',
      y: '啮合效率 η₁'
    },
    spring: {
      eyebrow: 'SPRING CHARACTERISTIC',
      title: '弹簧的载荷–变形线',
      caption: '圆柱螺旋弹簧在弹性范围内近似线性，斜率为弹簧刚度 F′；工作段越陡，弹簧越硬。',
      x: '变形 λ',
      y: '载荷 F'
    },
    bearing: {
      eyebrow: 'BEARING LIFE',
      title: '滚动轴承的载荷–寿命关系',
      caption: 'L₁₀ = (C/P)^ε；双对数坐标下近似为直线，载荷越大，寿命下降越快。',
      x: '当量动载荷 P（对数）',
      y: '寿命 L₁₀（对数）'
    }
  }
  return { ...map[props.type], title: props.title || map[props.type].title, caption: props.caption || map[props.type].caption }
})
</script>

<template>
  <FigureFrame :title="meta.title">
  <figure class="curve-chart" :data-chart-type="type">
    <header>
      <span>{{ meta.eyebrow }}</span>
      <h4>{{ meta.title }}</h4>
    </header>

    <svg viewBox="0 0 720 360" role="img" :aria-label="meta.title">
      <g class="grid">
        <path d="M80 60H680M80 120H680M80 180H680M80 240H680M80 300H680" />
        <path d="M140 50V300M260 50V300M380 50V300M500 50V300M620 50V300" />
      </g>

      <g class="axes">
        <path d="M80 300H690M80 300V42" />
        <path d="M690 300l-11-5v10zM80 42l-5 11h10z" />
        <text x="360" y="340">{{ meta.x }}</text>
        <text x="24" y="178" transform="rotate(-90 24 178)">{{ meta.y }}</text>
      </g>

      <g v-if="type === 'sn'" class="series">
        <path d="M110 92C190 105 260 160 340 223C380 253 430 270 500 277H660" class="curve-main" />
        <path d="M500 60V300" class="guide" stroke-dasharray="5 5" />
        <path d="M80 277H660" class="guide" stroke-dasharray="3 5" />
        <path d="M80 92H115" class="guide" stroke-dasharray="3 5" />
        <circle cx="340" cy="223" r="4" class="dot" />
        <text x="515" y="76" class="tag">N₀</text>
        <text x="636" y="294" class="small">N</text>
        <text x="92" y="82" class="small">σₛ</text>
        <text x="92" y="294" class="small">σ₋₁</text>
        <text x="130" y="62" class="small">低周</text>
        <text x="250" y="62" class="small">有限寿命</text>
        <text x="540" y="62" class="small">无限寿命</text>
        <text x="404" y="254" class="small">σᵐN = C</text>
      </g>

      <g v-else-if="type === 'limit'" class="series">
        <path d="M80 120L620 300" class="curve-main" />
        <path d="M80 120Q350 120 620 300" class="curve-alt" />
        <path d="M80 120L450 300" class="curve-alt2" />
        <circle cx="80" cy="120" r="4.5" class="dot" />
        <circle cx="450" cy="300" r="4.5" class="dot" />
        <circle cx="620" cy="300" r="4.5" class="dot" />
        <text x="96" y="106" class="small">A (0, σ₋₁)</text>
        <text x="414" y="322" class="small">C (σₛ, 0)</text>
        <text x="580" y="322" class="small">B (σb, 0)</text>
        <text x="438" y="78" class="small">— Goodman</text>
        <text x="438" y="96" class="small curve-alt-text">— Gerber</text>
        <text x="438" y="114" class="small curve-alt2-text">— Soderberg</text>
        <text x="92" y="64" class="small">σₐ</text>
        <text x="64" y="316" class="small">O</text>
      </g>

      <g v-else-if="type === 'contact'" class="series">
        <path d="M110 88C180 150 260 220 340 258C430 286 540 296 650 298" class="curve-main" />
        <path d="M110 88H190" class="guide" stroke-dasharray="4 4" />
        <path d="M80 88H660" class="guide" stroke-dasharray="3 5" />
        <text x="92" y="78" class="small">σHmax</text>
        <text x="620" y="286" class="small">z ↑</text>
        <text x="196" y="104" class="small">接触区</text>
        <text x="420" y="225" class="small">应力迅速衰减</text>
      </g>

      <g v-else-if="type === 'stribeck'" class="series">
        <path d="M100 104C150 116 180 148 230 180C270 205 305 226 345 225C395 223 420 186 470 166C530 142 590 120 660 92" class="curve-main" />
        <path d="M290 60V300M430 60V300" class="guide" stroke-dasharray="5 5" />
        <path d="M80 225H660" class="guide" stroke-dasharray="3 5" />
        <text x="130" y="70" class="small">边界摩擦</text>
        <text x="328" y="70" class="small">混合摩擦</text>
        <text x="520" y="70" class="small">流体摩擦</text>
        <text x="618" y="218" class="small">fmin</text>
        <text x="120" y="84" class="tag">f 高</text>
      </g>

      <g v-else-if="type === 'wear'" class="series">
        <path d="M110 92C140 130 165 210 210 235C290 255 430 252 500 258C570 264 610 190 650 92" class="curve-main" />
        <path d="M210 60V300M510 60V300" class="guide" stroke-dasharray="5 5" />
        <text x="126" y="74" class="small">跑合</text>
        <text x="330" y="74" class="small">稳定磨损</text>
        <text x="548" y="74" class="small">剧烈磨损</text>
        <text x="216" y="282" class="small">t₁</text>
        <text x="515" y="282" class="small">t₂</text>
      </g>

      <g v-else-if="type === 'bolt'" class="series">
        <path d="M160 280V160" class="guide" />
        <path d="M160 160H585" class="guide" stroke-dasharray="5 5" />
        <path d="M160 160L515 92" class="curve-main" />
        <path d="M160 160L470 246" class="curve-alt" />
        <path d="M160 160L470 160" class="guide" />
        <path d="M470 160V246" class="accent-line" />
        <path d="M470 246h48" class="guide" stroke-dasharray="4 4" />
        <path d="M470 92h48" class="guide" stroke-dasharray="4 4" />
        <path d="M535 246v-154" class="accent-line" />
        <path d="M535 246l-5-10h10zM535 92l-5 10h10z" class="accent-fill" />
        <text x="92" y="166" class="small">F₀</text>
        <text x="498" y="86" class="small">F₂</text>
        <text x="498" y="262" class="small">F₁</text>
        <text x="545" y="174" class="small">F</text>
        <text x="330" y="104" class="small">螺栓（C_b）</text>
        <text x="270" y="264" class="small">被连接件（C_m）</text>
        <circle cx="160" cy="160" r="4" class="dot" />
      </g>

      <g v-else-if="type === 'belt'" class="series">
        <path d="M96 156H206V82L300 196H500V140L600 156H664" class="curve-main" />
        <path d="M80 156H664" class="guide" stroke-dasharray="4 5" />
        <path d="M80 196H664" class="guide" stroke-dasharray="4 5" />
        <text x="93" y="146" class="small">σ₁</text>
        <text x="518" y="186" class="small">σ₂</text>
        <text x="230" y="74" class="small">σmax</text>
        <text x="226" y="320" class="small">小带轮</text>
        <text x="510" y="320" class="small">大带轮</text>
        <text x="336" y="320" class="small">松边</text>
        <text x="92" y="320" class="small">紧边</text>
        <text x="350" y="236" class="small">σc 沿全长近似恒定</text>
      </g>

      <g v-else-if="type === 'chain'" class="series">
        <path d="M80 190H670" class="guide" stroke-dasharray="4 5" />
        <path d="M100 190C125 155 175 155 200 190S275 225 300 190S375 155 400 190S475 225 500 190S575 155 600 190S655 216 670 190" class="curve-main" />
        <path d="M100 190C120 175 155 175 175 190S230 205 250 190S305 175 325 190S380 205 400 190S455 175 475 190S530 205 550 190S605 175 625 190" class="curve-alt" />
        <text x="490" y="164" class="small">少齿数</text>
        <text x="560" y="212" class="small">多齿数</text>
        <text x="608" y="180" class="small">v平均</text>
        <text x="294" y="150" class="small">vmax</text>
        <text x="294" y="238" class="small">vmin</text>
      </g>

      <g v-else-if="type === 'efficiency'" class="series">
        <path d="M110 296C180 220 250 150 330 116C420 84 540 70 650 64" class="curve-main" />
        <path d="M110 300C180 250 250 196 330 166C420 138 540 126 650 122" class="curve-alt" />
        <path d="M110 300C180 276 250 238 330 214C420 190 540 182 650 178" class="curve-alt2" />
        <text x="552" y="58" class="small">φᵥ 小</text>
        <text x="552" y="116" class="small">φᵥ 中</text>
        <text x="552" y="172" class="small">φᵥ 大</text>
        <text x="486" y="250" class="small">γ &lt; φᵥ：接近自锁</text>
      </g>

      <g v-else-if="type === 'spring'" class="series">
        <path d="M120 290L600 90" class="curve-main" />
        <path d="M240 290V240M420 290V185M600 290V90" class="guide" stroke-dasharray="4 4" />
        <path d="M80 240H240M80 185H420" class="guide" stroke-dasharray="4 4" />
        <circle cx="240" cy="240" r="4" class="dot" />
        <circle cx="420" cy="185" r="4" class="dot" />
        <text x="250" y="234" class="small">工作点 1</text>
        <text x="430" y="180" class="small">工作点 2</text>
        <text x="476" y="132" class="small">斜率 F′</text>
        <text x="86" y="232" class="small">F₁</text>
        <text x="86" y="177" class="small">F₂</text>
        <text x="232" y="314" class="small">λ₁</text>
        <text x="410" y="314" class="small">λ₂</text>
      </g>

      <g v-else-if="type === 'bearing'" class="series">
        <path d="M140 76C240 112 350 170 470 236C540 272 600 288 660 296" class="curve-main" />
        <path d="M200 60V300M420 60V300" class="guide" stroke-dasharray="4 5" />
        <path d="M80 140H660" class="guide" stroke-dasharray="3 5" />
        <circle cx="420" cy="208" r="4.5" class="dot" />
        <text x="432" y="202" class="small">工作点</text>
        <text x="150" y="128" class="small">C/P &gt; 1</text>
        <text x="150" y="88" class="small">L₁₀ ↑</text>
        <text x="590" y="284" class="small">P ↑</text>
      </g>

      <g class="legend">
        <text x="80" y="28">{{ meta.eyebrow }}</text>
        <text x="630" y="28">SCHEMATIC</text>
      </g>
    </svg>

    <figcaption>{{ meta.caption }} <em>（按公式关系重绘，非精确刻度）</em></figcaption>
  </figure>
  </FigureFrame>
</template>

<style scoped>
.curve-chart {
  margin: 24px 0;
  padding: 16px 18px 13px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
}

.curve-chart header {
  display: flex;
  align-items: baseline;
  gap: 9px;
  margin-bottom: 4px;
}

.curve-chart header span {
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 8px;
  letter-spacing: 0.1em;
}

.curve-chart header h4 {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 13px;
}

svg {
  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}

.grid path {
  fill: none;
  stroke: var(--vp-c-divider);
  stroke-width: 0.7;
}

.axes path {
  fill: none;
  stroke: var(--vp-c-text-3);
  stroke-width: 1.2;
}

.axes text {
  fill: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 10px;
  letter-spacing: 0.02em;
  stroke: none;
}

.series path {
  fill: none;
}

.curve-main {
  stroke: var(--vp-c-brand-1);
  stroke-width: 2.4;
}

.curve-alt {
  stroke: #d28a1f;
  stroke-width: 1.8;
}

.curve-alt2 {
  stroke: #8a7bd8;
  stroke-width: 1.6;
}

.guide {
  stroke: var(--vp-c-text-3);
  stroke-width: 1;
  opacity: 0.55;
}

.accent-line {
  stroke: #22a06b;
  stroke-width: 1.8;
}

.accent-fill {
  fill: #22a06b;
  stroke: #22a06b;
}

.dot {
  fill: var(--vp-c-brand-1);
  stroke: var(--vp-c-bg-soft);
  stroke-width: 2;
}

.dot-accent {
  fill: #d28a1f;
  stroke: var(--vp-c-bg-soft);
  stroke-width: 2;
}

.small {
  fill: var(--vp-c-text-2);
  font-size: 10px;
  stroke: none;
}

.tag {
  fill: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 10px;
  font-weight: 700;
  stroke: none;
}

.curve-alt-text {
  fill: #d28a1f;
}

.curve-alt2-text {
  fill: #8a7bd8;
}

.legend text {
  fill: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 8px;
  letter-spacing: 0.1em;
}

figcaption {
  margin-top: 7px;
  color: var(--vp-c-text-3);
  font-size: 11px;
  line-height: 1.6;
}

figcaption em {
  color: var(--vp-c-text-3);
  font-style: normal;
  opacity: 0.8;
}
</style>
