<script setup lang="ts">
import { computed, ref } from "vue";
import {
  bearingLifeModel,
  beltForceModel,
  boltJointModel,
  shaftEquivalent,
} from "../utils/design-models.mjs";

const props = defineProps<{ type: "bolt" | "bearing" | "belt" | "shaft" }>();
const preload = ref(15);
const workLoad = ref(10);
const stiffnessRatio = ref(4);
const rating = ref(30);
const bearingLoad = ref(5);
const speed = ref(1500);
const power = ref(5.5);
const beltSpeed = ref(12);
const friction = ref(0.3);
const wrap = ref(165);
const shaftDiameter = ref(45);
const moment = ref(400);
const shaftTorque = ref(300);

const bolt = computed(() =>
  boltJointModel({
    preload: preload.value * 1000,
    workLoad: workLoad.value * 1000,
    memberStiffness: stiffnessRatio.value,
  }),
);
const bearing = computed(() =>
  bearingLifeModel({
    dynamicRating: rating.value,
    equivalentLoad: bearingLoad.value,
    speed: speed.value,
  }),
);
const belt = computed(() =>
  beltForceModel({
    power: power.value,
    speed: beltSpeed.value,
    friction: friction.value,
    wrap: wrap.value,
  }),
);
const shaft = computed(() =>
  shaftEquivalent({
    diameter: shaftDiameter.value,
    moment: moment.value * 1000,
    torque: shaftTorque.value * 1000,
    alpha: 0.6,
  }),
);
const meta = computed(
  () =>
    ({
      bolt: [
        "预紧螺栓载荷分配",
        "改变外载荷与刚度比，观察螺栓总拉力和残余预紧力",
      ],
      bearing: [
        "滚动轴承寿命",
        "改变额定动载荷、当量载荷与转速，观察 L₁₀ 寿命",
      ],
      belt: ["带传动拉力", "改变功率、带速、摩擦和包角，观察紧边与松边拉力"],
      shaft: ["轴的弯扭合成", "改变轴径、弯矩和转矩，比较第三与第四强度理论"],
    })[props.type],
);
const f = (value: number, digits = 1) => value.toFixed(digits);
</script>

<template>
  <section class="engineering-calculator" :aria-label="meta[0]">
    <header>
      <span>ENGINEERING LAB</span>
      <h3>{{ meta[0] }}</h3>
      <p>{{ meta[1] }}</p>
    </header>

    <div v-if="type === 'bolt'" class="controls">
      <label
        >预紧力 F₀：{{ preload }} kN<input
          v-model.number="preload"
          aria-label="螺栓预紧力"
          type="range"
          min="5"
          max="35"
          step="1"
      /></label>
      <label
        >轴向外载 F：{{ workLoad }} kN<input
          v-model.number="workLoad"
          aria-label="螺栓轴向外载"
          type="range"
          min="0"
          max="40"
          step="1"
      /></label>
      <label
        >刚度比 Cₘ/Cᵦ：{{ stiffnessRatio
        }}<input
          v-model.number="stiffnessRatio"
          aria-label="被连接件与螺栓刚度比"
          type="range"
          min="1"
          max="9"
          step="0.5"
      /></label>
    </div>
    <div v-else-if="type === 'bearing'" class="controls">
      <label
        >额定动载荷 C：{{ rating }} kN<input
          v-model.number="rating"
          aria-label="轴承额定动载荷"
          type="range"
          min="10"
          max="80"
          step="2"
      /></label>
      <label
        >当量载荷 P：{{ bearingLoad }} kN<input
          v-model.number="bearingLoad"
          aria-label="轴承当量载荷"
          type="range"
          min="2"
          max="20"
          step="1"
      /></label>
      <label
        >转速 n：{{ speed }} r/min<input
          v-model.number="speed"
          aria-label="轴承转速"
          type="range"
          min="200"
          max="3000"
          step="100"
      /></label>
    </div>
    <div v-else-if="type === 'belt'" class="controls controls--four">
      <label
        >功率 P：{{ power }} kW<input
          v-model.number="power"
          aria-label="带传动功率"
          type="range"
          min="1"
          max="15"
          step="0.5"
      /></label>
      <label
        >带速 v：{{ beltSpeed }} m/s<input
          v-model.number="beltSpeed"
          aria-label="带速"
          type="range"
          min="5"
          max="25"
          step="1"
      /></label>
      <label
        >摩擦系数 f：{{ friction
        }}<input
          v-model.number="friction"
          aria-label="带轮摩擦系数"
          type="range"
          min="0.15"
          max="0.5"
          step="0.01"
      /></label>
      <label
        >小轮包角 α：{{ wrap }}°<input
          v-model.number="wrap"
          aria-label="小带轮包角"
          type="range"
          min="120"
          max="180"
          step="2"
      /></label>
    </div>
    <div v-else class="controls">
      <label
        >轴径 d：{{ shaftDiameter }} mm<input
          v-model.number="shaftDiameter"
          aria-label="轴径"
          type="range"
          min="30"
          max="70"
          step="1"
      /></label>
      <label
        >弯矩 M：{{ moment }} N·m<input
          v-model.number="moment"
          aria-label="轴上弯矩"
          type="range"
          min="100"
          max="800"
          step="20"
      /></label>
      <label
        >转矩 T：{{ shaftTorque }} N·m<input
          v-model.number="shaftTorque"
          aria-label="轴上传递转矩"
          type="range"
          min="50"
          max="700"
          step="10"
      /></label>
    </div>

    <div v-if="type === 'bolt'" class="result-grid" aria-live="polite">
      <div>
        <small>载荷分配系数</small
        ><strong>C = {{ f(bolt.loadFraction, 2) }}</strong>
      </div>
      <div>
        <small>螺栓总拉力</small
        ><strong>F₂ = {{ f(bolt.boltLoad / 1000) }} kN</strong>
      </div>
      <div :class="{ danger: bolt.separated }">
        <small>{{ bolt.separated ? "接合面状态" : "残余预紧力" }}</small
        ><strong>{{
          bolt.separated ? "已分离" : `F₁ = ${f(bolt.residual / 1000)} kN`
        }}</strong>
      </div>
      <div>
        <small>接合面分离外载</small
        ><strong>{{ f(bolt.separationLoad / 1000) }} kN</strong>
      </div>
    </div>
    <div v-else-if="type === 'bearing'" class="result-grid" aria-live="polite">
      <div>
        <small>基本额定寿命</small
        ><strong>L₁₀ = {{ f(bearing.millionRevolutions) }}×10⁶ r</strong>
      </div>
      <div>
        <small>小时寿命</small><strong>{{ f(bearing.hours, 0) }} h</strong>
      </div>
      <div>
        <small>载荷比</small
        ><strong>C/P = {{ f(rating / bearingLoad, 2) }}</strong>
      </div>
    </div>
    <div v-else-if="type === 'belt'" class="result-grid" aria-live="polite">
      <div>
        <small>有效拉力</small><strong>Fₑ = {{ f(belt.effective) }} N</strong>
      </div>
      <div>
        <small>紧边拉力</small><strong>F₁ = {{ f(belt.tight) }} N</strong>
      </div>
      <div>
        <small>松边拉力</small><strong>F₂ = {{ f(belt.slack) }} N</strong>
      </div>
      <div>
        <small>平行带边压轴力</small><strong>R ≈ {{ f(belt.radial) }} N</strong>
      </div>
    </div>
    <div v-else class="result-grid" aria-live="polite">
      <div>
        <small>弯曲应力</small><strong>σᵦ = {{ f(shaft.bending) }} MPa</strong>
      </div>
      <div>
        <small>扭转切应力</small><strong>τ = {{ f(shaft.shear) }} MPa</strong>
      </div>
      <div>
        <small>第三强度理论</small><strong>{{ f(shaft.third) }} MPa</strong>
      </div>
      <div>
        <small>第四强度理论</small><strong>{{ f(shaft.fourth) }} MPa</strong>
      </div>
    </div>

    <p v-if="type === 'bolt'">
      分离前使用
      C=Cᵦ/(Cᵦ+Cₘ)、F₂=F₀+CF、F₁=F₀−(1−C)F；接合面分离后，示意模型改为外载直接由螺栓承担。
    </p>
    <p v-else-if="type === 'bearing'">
      球轴承、稳定载荷简化：L₁₀=(C/P)³。实际选型还要确定
      X、Y、可靠度、润滑和静强度。
    </p>
    <p v-else-if="type === 'belt'">
      采用欧拉关系 F₁/F₂=eᶠᵅ，α
      必须换算为弧度；忽略离心拉力和弯曲损失，仅用于理解参数趋势。
    </p>
    <p v-else>
      实心圆轴、α=0.6。第三强度理论系数为4，第四强度理论系数为3；重要轴仍需进行疲劳、刚度与临界转速校核。
    </p>
  </section>
</template>

<style scoped>
.engineering-calculator {
  margin: 24px 0;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
}
header {
  padding: 20px 20px 16px;
}
header span {
  color: var(--vp-c-brand-1);
  font: 700 10px var(--vp-font-family-mono);
  letter-spacing: 0.12em;
}
header h3 {
  margin: 5px 0;
  font-size: 18px;
}
header p {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 13px;
}
.controls {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
  padding: 0 20px 20px;
}
.controls--four {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}
.controls label {
  color: var(--vp-c-text-2);
  font-size: 12px;
}
.controls input {
  display: block;
  width: 100%;
  min-height: 44px;
  margin-top: 5px;
  accent-color: var(--vp-c-brand-1);
}
.result-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border-top: 1px solid var(--vp-c-divider);
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
}
.result-grid > div {
  min-width: 0;
  padding: 18px;
  border-right: 1px solid var(--vp-c-divider);
}
.result-grid > div:last-child {
  border-right: 0;
}
.result-grid small,
.result-grid strong {
  display: block;
}
.result-grid small {
  color: var(--vp-c-text-3);
  font-size: 10px;
}
.result-grid strong {
  margin-top: 7px;
  color: var(--vp-c-text-1);
  font: 650 15px var(--vp-font-family-mono);
  overflow-wrap: anywhere;
}
.result-grid .danger strong {
  color: #d45b33;
}
.engineering-calculator > p {
  margin: 0;
  padding: 15px 20px;
  color: var(--vp-c-text-2);
  font-size: 12px;
  line-height: 1.75;
}
@media (max-width: 700px) {
  .controls,
  .controls--four {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  .result-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .result-grid > div:nth-child(2) {
    border-right: 0;
  }
  .result-grid > div:nth-child(-n + 2) {
    border-bottom: 1px solid var(--vp-c-divider);
  }
}
</style>
