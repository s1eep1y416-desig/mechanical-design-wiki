<script setup lang="ts">
import FigureFrame from './FigureFrame.vue'
import { computed, useId } from 'vue'
import { involuteGearPath } from '../utils/gear'

type ForceType = 'spur' | 'helical' | 'bevel' | 'worm' | 'belt' | 'chain' | 'bolts' | 'shaft'
const props = defineProps<{ type: ForceType }>()
const uid = `force-${useId().replace(/:/g, '')}`
const gear = involuteGearPath(160, 185, 24, 78)
const meta = computed(() => ({
  spur: {
    title: '直齿轮：把法向力分成圆周力与径向力',
    relation: 'Fₜ = 2T / d　　Fᵣ = Fₜ tan α　　Fₙ = Fₜ / cos α',
    steps: ['取主动轮为研究对象，图示为顺时针转动。', '节点处速度向下，主动轮所受圆周力 Fₜ 向上，阻碍其转动。', '径向力 Fᵣ 指向轮心；从动轮受到大小相等、方向相反的作用力。'],
    note: '忽略齿面摩擦的外啮合直齿轮。右侧为力的矢量分解，α = 20°；T 用 N·mm、d 用 mm 时，力的单位为 N。'
  },
  helical: {
    title: '斜齿轮：还要考虑沿轴线的轴向力',
    relation: 'Fᵣ = Fₜ tan αₙ / cos β　　|Fₐ| = Fₜ tan |β|',
    steps: ['端面图中的 Fₜ、Fᵣ 与直齿轮相对应。', '轴向力 Fₐ 垂直端面，⊙ 表示出纸面，⊗ 表示入纸面。', 'Fₐ 的正负取决于左／右旋、转向及主从动关系；右侧为三维方向示意。'],
    note: '忽略齿面摩擦。图示选取 Fₐ 出纸面的一种工况，不代表所有斜齿轮的轴向力方向；αₙ 为法面压力角，β 为螺旋角。'
  },
  bevel: {
    title: '直齿锥齿轮：分离力在轴向和径向上再分解',
    relation: 'Fᵣ = Fₜ tan α cos δ　　Fₐ = Fₜ tan α sin δ',
    steps: ['在齿宽中点 P 处取力，左图为通过轴线的剖面。', 'Fₜ 垂直此剖面；剖面内分离力 F′ = Fₜ tan α。', '将 F′ 分解：Fᵣ 指向轴线，Fₐ 沿轴线背离锥顶。'],
    note: '外啮合直齿锥齿轮、忽略摩擦；δ 为分锥角。图形只画分锥及分力，不是实体齿形。'
  },
  worm: {
    title: '蜗杆与蜗轮：同一对作用力，在两根轴上名称不同',
    relation: '|Fₐ₁| = |Fₜ₂|　　|Fₜ₁| = |Fₐ₂|　　|Fᵣ₁| = |Fᵣ₂|',
    steps: ['将啮合的两个零件拆开，分别画它们受到的力。', '蜗杆轴沿左右方向，蜗轮轴垂直纸面，轴交角为 90°。', '左右分力在蜗杆上叫轴向力，在蜗轮上叫圆周力；每对作用力方向相反。'],
    note: '1 为蜗杆，2 为蜗轮；⊙ 出纸面，⊗ 入纸面。箭头是一个工况的方向示例，具体正负仍须结合旋向和转向判断。'
  },
  belt: {
    title: '带轮：传递转矩看拉力差，轴的载荷看矢量和',
    relation: 'Fₑ = F₁ − F₂　　T = (F₁ − F₂)d / 2　　R = F₁ + F₂',
    steps: ['图示为顺时针主动轮，下边为紧边，上边为松边。', '带只能拉带轮，两条带边对带轮的拉力都指向右侧。', '紧边与松边的力矩方向相反；支承反力 R 平衡两者的合力。'],
    note: '平行带边的简化模型，忽略离心力等影响。R = F₁ + F₂ 只适用于图示平行方向；一般情况应作矢量合成。'
  },
  chain: {
    title: '链轮：紧边传力，松边仍然存在张力',
    relation: 'Fₑ = 1000P / v　　F₁ ≈ Fₑ + Fc + Ff　　F₂ ≈ Fc + Ff',
    steps: ['图示为顺时针主动链轮，下边为紧边，上边为松边。', '有效拉力对应两边张力的差；松边张力不能直接当作零。', '轴载荷由链条两边的拉力矢量合成，不能只取有效拉力 Fₑ。'],
    note: '平行链边、准静态简化示意。Fc 为离心拉力，Ff 为悬垂拉力；实际还需考虑动载荷和布置角度。'
  },
  bolts: {
    title: '螺栓组受转矩：各螺栓沿绕形心圆的切线方向受力',
    relation: 'Fᵢ = Trᵢ / Σrⱼ²　　ΣFᵢrᵢ = T',
    steps: ['先找到螺栓组形心 O，再量各螺栓到 O 的距离 rᵢ。', '图中画连接板受到螺栓的反力，力矩方向抵抗外加顺时针转矩 T。', '半径越大，分配到的力越大；本图四个螺栓半径相同，因此受力相同。'],
    note: '铰制孔螺栓承剪的弹性简化模型，板视为刚性、各螺栓剪切刚度相同。普通预紧螺栓靠接合面摩擦传力，应另作防滑校核。'
  },
  shaft: {
    title: '轴的受力简图：先求支反力，再画弯矩',
    relation: 'Rₐ = F·b / L　　Rᵦ = F·a / L　　Mₚ = F·a·b / L　　L = a + b',
    steps: ['将轴承简化为 A、B 两个支点，将齿轮的某一横向分力记作 F。', '由 ΣF = 0 和 ΣM = 0 求支反力；图中只分析一个弯曲平面。', '另一个平面同样计算，随后合成弯矩 M = √(My² + Mz²)，并单独处理转矩与轴向力。'],
    note: '单个集中横向载荷作用于两支点之间的简支梁模型。a、b 为集中力到左右支点的距离。'
  }
}[props.type]))
const arrow = (kind: string) => `url(#${uid}-${kind})`
</script>

<template>
  <FigureFrame :title="meta.title">
  <figure class="force-diagram" :data-force-type="type">
    <header><span>FORCE ANALYSIS</span><h4>{{ meta.title }}</h4></header>
    <svg viewBox="0 0 720 380" role="img" :aria-labelledby="`${uid}-title ${uid}-desc`">
      <title :id="`${uid}-title`">{{ meta.title }}</title>
      <desc :id="`${uid}-desc`">{{ meta.steps.join(' ') }} {{ meta.note }}</desc>
      <defs>
        <marker v-for="kind in ['t', 'r', 'a', 'n']" :key="kind" :id="`${uid}-${kind}`" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M1 1 9 5 1 9Z" :class="`arrow-${kind}`" />
        </marker>
      </defs>

      <template v-if="type === 'spur'">
        <text x="66" y="32" class="panel-title">① 主动轮端面</text>
        <path :d="gear" class="body" />
        <circle cx="160" cy="185" r="78" class="guide" />
        <circle cx="160" cy="185" r="22" class="body" />
        <path d="M60 185H285M160 85V285" class="axis" />
        <path d="M112 91A105 105 0 0 1 195 87" class="normal" :marker-end="arrow('n')" />
        <text x="128" y="66">n₁ ↻</text>
        <path d="M238 185V95" class="tangent" :marker-end="arrow('t')" />
        <path d="M238 185H205.2" class="radial" :marker-end="arrow('r')" />
        <path d="M238 185 205.2 95" class="normal" :marker-end="arrow('n')" />
        <circle cx="238" cy="185" r="4" class="point" />
        <text x="245" y="112" class="text-t">Fₜ</text><text x="212" y="207" class="text-r">Fᵣ</text><text x="184" y="88">Fₙ</text>
        <text x="251" y="183">P</text>
        <text x="70" y="326" class="small">Fₜ 阻碍主动轮转动 · Fᵣ 指向轮心</text>
        <text x="418" y="32" class="panel-title">② 力的矢量分解</text>
        <path d="M540 272V112" class="tangent" :marker-end="arrow('t')" />
        <path d="M540 272H481.8" class="radial" :marker-end="arrow('r')" />
        <path d="M540 272 481.8 112" class="normal" :marker-end="arrow('n')" />
        <path d="M481.8 272V112H540" class="guide" />
        <path d="M540 230A42 42 0 0 0 525.6 232.5" class="axis" />
        <text x="550" y="192" class="text-t">Fₜ</text><text x="500" y="295" class="text-r">Fᵣ</text><text x="453" y="181">Fₙ</text>
        <text x="512" y="222" class="small">α</text>
        <text x="407" y="326" class="small">压力角 α 是 Fₙ 与切线方向的夹角</text>
      </template>

      <template v-else-if="type === 'helical'">
        <text x="70" y="32" class="panel-title">① 端面：轴线垂直纸面</text>
        <path :d="gear" class="body" />
        <circle cx="160" cy="185" r="22" class="body" />
        <path d="M60 185H280M160 85V285" class="axis" />
        <path d="M238 185V90" class="tangent" :marker-end="arrow('t')" />
        <path d="M238 185H201" class="radial" :marker-end="arrow('r')" />
        <circle cx="238" cy="185" r="10" class="axial" /><circle cx="238" cy="185" r="2.8" class="arrow-a" />
        <text x="246" y="102" class="text-t">Fₜ</text><text x="194" y="209" class="text-r">Fᵣ</text><text x="254" y="190" class="text-a">Fₐ ⊙</text>
        <text x="67" y="326" class="small">⊙ 出纸面　　⊗ 入纸面</text>
        <text x="413" y="32" class="panel-title">② 三个相互垂直的分力</text>
        <path d="M512 195 430 113" class="tangent" :marker-end="arrow('t')" />
        <path d="M512 195 412 245" class="radial" :marker-end="arrow('r')" />
        <path d="M512 195H646" class="axial" :marker-end="arrow('a')" />
        <circle cx="512" cy="195" r="4" class="point" />
        <text x="414" y="100" class="text-t">Fₜ · 切向</text><text x="397" y="270" class="text-r">Fᵣ · 径向</text><text x="564" y="178" class="text-a">Fₐ · 轴向</text>
        <text x="417" y="326" class="small">空间投影：屏幕夹角不代表实际夹角</text>
      </template>

      <template v-else-if="type === 'bevel'">
        <text x="60" y="32" class="panel-title">① 轴向剖面与齿宽中点 P</text>
        <path d="M78 223 348 125V321Z" class="body" />
        <path d="M45 223H390" class="axis" />
        <text x="45" y="249" class="small">锥顶</text><text x="358" y="244" class="small">轴线</text>
        <circle cx="270" cy="153" r="9" class="tangent" /><circle cx="270" cy="153" r="2.5" class="arrow-t" />
        <path d="M270 153V233" class="radial" :marker-end="arrow('r')" />
        <path d="M270 153H299.1" class="axial" :marker-end="arrow('a')" />
        <path d="M270 153 299.1 233" class="normal" :marker-end="arrow('n')" />
        <text x="246" y="135" class="text-t">Fₜ ⊙</text><text x="248" y="209" class="text-r">Fᵣ</text><text x="301" y="147" class="text-a">Fₐ</text><text x="308" y="219">F′</text>
        <path d="M137 223A59 59 0 0 0 133.5 203" class="axis" /><text x="144" y="214" class="small">δ</text>
        <text x="60" y="350" class="small">径向分力指向轴线 · 轴向分力背离锥顶</text>
        <text x="445" y="32" class="panel-title">② 剖面内分力</text>
        <path d="M495 120V270" class="radial" :marker-end="arrow('r')" />
        <path d="M495 120H549.6" class="axial" :marker-end="arrow('a')" />
        <path d="M495 120 549.6 270" class="normal" :marker-end="arrow('n')" />
        <path d="M549.6 120V270H495" class="guide" />
        <path d="M495 162A42 42 0 0 0 509.4 159.5" class="axis" /><text x="508" y="182" class="small">δ</text>
        <text x="468" y="215" class="text-r">Fᵣ</text><text x="510" y="105" class="text-a">Fₐ</text><text x="557" y="234">F′</text>
        <text x="443" y="326" class="small">F′ = Fₜ tan α</text>
      </template>

      <template v-else-if="type === 'worm'">
        <text x="67" y="32" class="panel-title">① 蜗杆受力（拆开看）</text>
        <rect x="78" y="200" width="248" height="64" rx="15" class="body" />
        <path v-for="x in [110,145,180,215,250,285]" :key="x" :d="`M${x} 202l-22 60`" class="structure" />
        <path d="M42 232H348" class="axis" />
        <path d="M205 200H118" class="axial" :marker-end="arrow('a')" />
        <path d="M205 200V258" class="radial" :marker-end="arrow('r')" />
        <circle cx="205" cy="200" r="10" class="tangent" /><circle cx="205" cy="200" r="2.8" class="arrow-t" />
        <text x="128" y="184" class="text-a">Fₐ₁</text><text x="219" y="249" class="text-r">Fᵣ₁</text><text x="220" y="188" class="text-t">Fₜ₁ ⊙</text>
        <text x="100" y="301" class="small">蜗杆轴：左右方向</text>
        <text x="439" y="32" class="panel-title">② 蜗轮受力（拆开看）</text>
        <circle cx="520" cy="140" r="70" class="body" /><circle cx="520" cy="140" r="19" class="body" />
        <path d="M440 140H600M520 60V218" class="axis" />
        <path d="M520 210H620" class="tangent" :marker-end="arrow('t')" />
        <path d="M520 210V152" class="radial" :marker-end="arrow('r')" />
        <circle cx="520" cy="210" r="10" class="axial" /><path d="M514 204l12 12M526 204l-12 12" class="axial" />
        <text x="567" y="234" class="text-t">Fₜ₂</text><text x="534" y="177" class="text-r">Fᵣ₂</text><text x="443" y="238" class="text-a">Fₐ₂ ⊗</text>
        <text x="434" y="301" class="small">蜗轮轴：垂直纸面</text>
        <text x="146" y="352" class="small">同一颜色表示同类分力；作用力配对需按实际空间方向判断。</text>
      </template>

      <template v-else-if="type === 'belt' || type === 'chain'">
        <text x="64" y="32" class="panel-title">① 主动轮的受力简图</text>
        <circle v-if="type === 'belt'" cx="160" cy="185" r="78" class="body" /><path v-else :d="gear" class="body" />
        <circle cx="160" cy="185" r="20" class="body" />
        <path d="M160 107H358M160 263H358" class="structure" />
        <path d="M160 107H238" class="tangent" :marker-end="arrow('t')" />
        <path d="M160 263H302" class="tangent" :marker-end="arrow('t')" />
        <path d="M160 185H50" class="radial" :marker-end="arrow('r')" />
        <path d="M109 91A105 105 0 0 1 193 86" class="normal" :marker-end="arrow('n')" />
        <text x="127" y="65">n ↻</text><text x="258" y="98" class="text-t">F₂ · 松边</text><text x="257" y="287" class="text-t">F₁ · 紧边</text><text x="57" y="171" class="text-r">R</text>
        <text x="62" y="332" class="small">R：轴对轮的支承反力</text>
        <text x="422" y="32" class="panel-title">② 拉力差与拉力和</text>
        <path d="M432 126H642" class="tangent" :marker-end="arrow('t')" /><text x="448" y="110" class="text-t">紧边 F₁</text>
        <path d="M432 202H518" class="tangent" :marker-end="arrow('t')" /><text x="448" y="186" class="text-t">松边 F₂</text>
        <text x="424" y="269">传矩：F₁ − F₂</text><text x="424" y="300">轴载荷：两边拉力的矢量和</text>
        <text x="424" y="332" class="small">箭头长度仅示意大小关系</text>
      </template>

      <template v-else-if="type === 'bolts'">
        <text x="59" y="32" class="panel-title">① 连接板的平面受力</text>
        <rect x="96" y="79" width="220" height="220" rx="14" class="body" />
        <path d="M206 64V314M80 189H330" class="axis" />
        <g v-for="(p,i) in [[151,134],[261,134],[261,244],[151,244]]" :key="i">
          <circle :cx="p[0]" :cy="p[1]" r="12" class="body" />
          <path :d="`M${p[0]} ${p[1]}l${(p[1]-189)*.7} ${-(p[0]-206)*.7}`" class="tangent" :marker-end="arrow('t')" />
        </g>
        <path d="M206 189 261 134" class="guide" /><text x="218" y="156" class="small">rᵢ</text><text x="211" y="208">O</text>
        <text x="220" y="88" class="text-t">Fᵢ</text>
        <path d="M345 154A145 145 0 0 1 315 283" class="axial" :marker-end="arrow('a')" /><text x="358" y="217" class="text-a">T ↻</text>
        <text x="60" y="349" class="small">板受螺栓反力 ↺　螺栓受板的力反向</text>
        <text x="432" y="32" class="panel-title">② 平衡与分配</text>
        <text x="429" y="119">各力方向：垂直 O 到螺栓的连线</text>
        <text x="429" y="165">分配规律：Fᵢ ∝ rᵢ</text>
        <text x="429" y="211">力矩平衡：ΣFᵢrᵢ = T</text>
        <text x="429" y="257">同一圆周上：Fᵢ = T / (zr)</text>
        <text x="429" y="320" class="small">z 为螺栓数量，r 为共同半径</text>
      </template>

      <template v-else-if="type === 'shaft'">
        <text x="62" y="32" class="panel-title">① 一个弯曲平面内的受力</text>
        <path d="M83 164H637" class="shaft-line" />
        <path d="M120 168l-14 22h28ZM590 168l-14 22h28Z" class="body" />
        <path d="M103 195H137M573 195H607" class="structure" />
        <path d="M330 75V164" class="tangent" :marker-end="arrow('t')" />
        <path d="M120 252V164M590 252V164" class="radial" :marker-end="arrow('r')" />
        <text x="342" y="98" class="text-t">F</text><text x="83" y="232" class="text-r">Rₐ</text><text x="602" y="232" class="text-r">Rᵦ</text>
        <text x="109" y="151">A</text><text x="579" y="151">B</text><text x="339" y="151">P</text>
        <path d="M120 98V123M330 98V123M590 98V123M120 115H590" class="guide" />
        <text x="222" y="105" class="small">a</text><text x="455" y="105" class="small">b</text>
        <text x="62" y="298" class="panel-title">② 弯矩大小图</text>
        <path d="M120 352H590L330 287Z" class="moment-area" />
        <path d="M120 352 330 287 590 352" class="normal" />
        <text x="343" y="289" class="small">Mₚ = F·a·b / L</text>
        <text x="102" y="371" class="small">0</text><text x="585" y="371" class="small">0</text>
      </template>
    </svg>
    <div class="force-relation">{{ meta.relation }}</div>
    <ol><li v-for="step in meta.steps" :key="step">{{ step }}</li></ol>
    <figcaption>{{ meta.note }}</figcaption>
  </figure>
  </FigureFrame>
</template>

<style scoped>
.force-diagram { --ft: #176cc4; --fr: #b06b0c; --fa: #8353c8; margin: 28px 0; padding: 22px; border: 1px solid var(--vp-c-divider); border-radius: 14px; background: var(--vp-c-bg-soft); }
:global(.dark) .force-diagram { --ft: #81b6ff; --fr: #e9b461; --fa: #be9af5; }
header > span { color: var(--vp-c-text-3); font: 10px var(--vp-font-family-mono); letter-spacing: .12em; }
.force-diagram header h4 { margin: 6px 0 12px; font-size: 17px; line-height: 1.6; }
svg { display: block; width: 100%; height: auto; }
svg text { fill: var(--vp-c-text-1); font: 15px var(--vp-font-family-base); }
svg .small { fill: var(--vp-c-text-2); font-size: 12px; }
svg .panel-title { font-size: 13px; font-weight: 600; }
.body { fill: var(--vp-c-bg); stroke: var(--vp-c-text-3); stroke-width: 1.3; }
.structure { fill: none; stroke: var(--vp-c-text-3); stroke-width: 1.4; }
.axis, .guide { fill: none; stroke: var(--vp-c-text-3); stroke-width: 1; }
.guide { stroke-dasharray: 5 5; opacity: .7; }
.axis { stroke-dasharray: 10 4 2 4; }
.tangent, .radial, .axial, .normal { fill: none; stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
.tangent { stroke: var(--ft); }.radial { stroke: var(--fr); }.axial { stroke: var(--fa); }.normal { stroke: var(--vp-c-text-1); }
.arrow-t, svg .text-t { fill: var(--ft); }.arrow-r, svg .text-r { fill: var(--fr); }.arrow-a, svg .text-a { fill: var(--fa); }.arrow-n, .point { fill: var(--vp-c-text-1); }
.shaft-line { stroke: var(--vp-c-text-2); stroke-width: 7; stroke-linecap: round; }
.moment-area { fill: var(--vp-c-brand-soft); stroke: var(--vp-c-divider); }
.force-relation { padding: 13px 16px; border-radius: 8px; background: var(--vp-c-bg); color: var(--vp-c-brand-1); font: 600 13px/1.9 var(--vp-font-family-mono); }
.force-diagram ol { padding-left: 22px; margin: 16px 0 12px; font-size: 13px; line-height: 1.9; }
.force-diagram li + li { margin-top: 4px; }
figcaption { border-top: 1px solid var(--vp-c-divider); padding-top: 12px; color: var(--vp-c-text-3); font-size: 11px; line-height: 1.8; }
@media (max-width: 520px) { .force-diagram { padding: 14px; } .force-diagram header h4 { font-size: 15px; } svg { min-width: 570px; } .force-diagram { overflow-x: auto; } }
</style>
