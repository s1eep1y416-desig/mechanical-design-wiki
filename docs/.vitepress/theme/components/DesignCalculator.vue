<script setup lang="ts">
import { computed, ref, useId } from "vue";
import { gearForces, springModel } from "../utils/design-models.mjs";
import { gearGeometry, linePath } from "../utils/design-geometry.mjs";
const props = defineProps<{ type: "gear" | "spring" }>();
const wire = ref(5),
  diameter = ref(45),
  compression = ref(20),
  torque = ref(80),
  helix = ref(0),
  module = ref(4);
const spring = computed(() =>
  springModel({
    wire: wire.value,
    diameter: diameter.value,
    compression: compression.value,
  }),
);
const forces = computed(() =>
  gearForces({
    module: module.value,
    torque: torque.value,
    helix: helix.value,
  }),
);
const gearPath = gearGeometry(230, 240, 30, 8).path;
const coilPath = computed(() =>
  linePath(
    Array.from({ length: 401 }, (_, i) => ({
      x:
        165 +
        ((320 - compression.value * 2) * i) / 400 +
        8 * Math.sin((i / 400) * 16 * Math.PI),
      y: 220 + diameter.value * Math.cos((i / 400) * 16 * Math.PI),
    })),
  ),
);
const uid = "calculator-" + useId().replaceAll(":", "");
const n = (v: number) => v.toFixed(1);
</script>
<template>
  <section
    class="design-calculator"
    :aria-label="type === 'gear' ? '齿轮受力实验' : '弹簧刚度实验'"
  >
    <header>
      <span>参数实验</span>
      <h3>
        {{
          type === "gear"
            ? "改变转矩与螺旋角，观察齿轮载荷"
            : "改变簧丝与中径，比较所需压缩力"
        }}
      </h3>
    </header>
    <div class="calculator-controls" v-if="type === 'gear'">
      <label
        >输入转矩 T：{{ torque }} N·m<input
          type="range"
          min="20"
          max="200"
          step="5"
          v-model.number="torque"
          aria-label="输入转矩" /></label
      ><label
        >法面模数 mn：{{ module }} mm<input
          type="range"
          min="2"
          max="6"
          step="0.5"
          v-model.number="module"
          aria-label="法面模数" /></label
      ><label
        >螺旋角 β：{{ helix }}°<input
          type="range"
          min="0"
          max="35"
          step="1"
          v-model.number="helix"
          aria-label="螺旋角"
      /></label>
    </div>
    <div class="calculator-controls" v-else>
      <label
        >簧丝直径 d：{{ wire }} mm<input
          type="range"
          min="3"
          max="7"
          step="0.5"
          v-model.number="wire"
          aria-label="簧丝直径" /></label
      ><label
        >弹簧中径 D：{{ diameter }} mm<input
          type="range"
          min="35"
          max="70"
          step="1"
          v-model.number="diameter"
          aria-label="弹簧中径" /></label
      ><label
        >压缩量 λ：{{ compression }} mm<input
          type="range"
          min="0"
          max="40"
          step="1"
          v-model.number="compression"
          aria-label="压缩量"
      /></label>
    </div>
    <svg
      viewBox="0 0 800 450"
      role="img"
      :aria-label="
        type === 'gear'
          ? '齿轮端面力分解，读数随参数变化'
          : '压缩弹簧形状与载荷随参数变化'
      "
    >
      <defs>
        <marker
          :id="uid"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M1 1L9 5L1 9Z" fill="#d45b33" />
        </marker>
      </defs>
      <template v-if="type === 'gear'">
        <path :d="gearPath" class="body" />
        <circle cx="230" cy="240" r="120" class="guide" />
        <circle cx="230" cy="240" r="33" class="body" />
        <line x1="80" y1="240" x2="410" y2="240" class="guide" />
        <circle cx="350" cy="240" r="5" fill="#d45b33" />
        <line
          x1="350"
          y1="240"
          x2="350"
          :y2="240 - forces.tangential * 0.025"
          class="force"
          :marker-end="`url(#${uid})`"
        />
        <line
          x1="350"
          y1="240"
          :x2="350 - forces.radial * 0.025"
          y2="240"
          class="force"
          :marker-end="`url(#${uid})`"
        />
        <text x="363" :y="237 - forces.tangential * 0.025">Ft</text>
        <text x="285" y="270">Fr</text>
        <text x="380" y="290">{{ helix === 0 ? "Fa = 0" : "⊙ Fa" }}</text>
        <text x="480" y="135">分度圆直径 {{ n(forces.diameter) }} mm</text>
        <text x="480" y="185">圆周力 Ft = {{ n(forces.tangential) }} N</text>
        <text x="480" y="225">径向力 Fr = {{ n(forces.radial) }} N</text>
        <text x="480" y="265">轴向力 |Fa| = {{ n(forces.axial) }} N</text>
        <text x="480" y="320">β = 0 时回到直齿轮</text>
        <text x="100" y="405">箭头：当前参数下的力；齿轮端面归一化显示。</text>
      </template>
      <template v-else>
        <rect x="130" y="100" width="18" height="240" class="body" />
        <rect
          :x="500 - compression * 2"
          y="100"
          width="18"
          height="240"
          class="body"
        />
        <path
          :d="coilPath"
          fill="none"
          stroke="#4c7895"
          :stroke-width="wire * 1.8"
        />
        <line
          x1="80"
          y1="220"
          x2="128"
          y2="220"
          class="force"
          :marker-end="`url(#${uid})`"
        />
        <text x="560" y="175">k = {{ n(spring.stiffness) }} N/mm</text>
        <text x="560" y="225">F = {{ n(spring.force) }} N</text>
        <text x="560" y="275">有效圈数 n = 8</text>
        <text x="170" y="405">k ∝ d⁴；k ∝ 1/D³；F = kλ</text>
      </template>
    </svg>
    <p v-if="type === 'gear'">
      固定 z = 30，法面压力角 αn = 20°，忽略摩擦。d = mnz/cosβ，Ft = 2T/d，Fr =
      Ft tanαn/cosβ，|Fa| = Ft
      tanβ。轴向力出纸面只是一个方向示例；实际正负由旋向、转向和主从动关系决定。
    </p>
    <p v-else>
      圆截面、密圈圆柱压缩弹簧的小变形线弹性模型；G = 79,000 MPa，k =
      Gd⁴/(8D³n)。这里只比较刚度，不代替应力、疲劳或稳定性校核；图中端部省略支承圈。
    </p>
  </section>
</template>
<style scoped>
.design-calculator {
  margin: 24px 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}
header {
  padding: 20px;
}
header span {
  font-size: 12px;
  color: var(--vp-c-brand-1);
}
header h3 {
  margin: 5px 0 0;
  font-size: 17px;
}
.calculator-controls {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 0 20px 20px;
}
.calculator-controls label {
  font-size: 13px;
}
.calculator-controls input {
  display: block;
  width: 100%;
  margin-top: 12px;
  accent-color: var(--vp-c-brand-1);
}
svg {
  display: block;
  width: 100%;
  background: #fff;
}
svg text {
  fill: #233f53;
  font-size: 18px;
}
.body {
  fill: #c4d5df;
  stroke: #47697d;
  stroke-width: 2;
}
.guide {
  stroke: #8cb1a8;
  stroke-dasharray: 5 5;
  fill: none;
}
.force {
  stroke: #d45b33;
  stroke-width: 3;
}
p {
  padding: 16px 20px;
  margin: 0;
  font-size: 13px;
  line-height: 1.8;
  color: var(--vp-c-text-2);
}
@media (max-width: 620px) {
  .calculator-controls {
    grid-template-columns: 1fr;
    gap: 14px;
  }
}
</style>
