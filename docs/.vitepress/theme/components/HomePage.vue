<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import GearPairDiagram from './GearPairDiagram.vue'
import StudyProgress from './StudyProgress.vue'
import FormulaQuickSearch from './FormulaQuickSearch.vue'

const parts = [
  {
    id: 'I',
    name: '总论',
    en: 'FOUNDATIONS',
    desc: '先建立共同语言：失效、准则、强度与摩擦。',
    chapters: [
      { n: '01', t: '绪论', k: '机械与设计' },
      { n: '02', t: '机械设计总论', k: '失效 · 准则' },
      { n: '03', t: '机械零件的强度', k: '疲劳 · 接触' },
      { n: '04', t: '摩擦、磨损及润滑概述', k: '摩擦学基础' }
    ]
  },
  {
    id: 'II',
    name: '连接',
    en: 'JOINTS',
    desc: '从螺纹到过盈：让零件可靠地连接在一起。',
    chapters: [
      { n: '05', t: '螺纹连接和螺旋传动', k: '预紧 · 防松' },
      { n: '06', t: '键、花键、无键连接和销连接', k: '键 · 花键' },
      { n: '07', t: '铆接、焊接、胶接和过盈连接', k: '不可拆连接' }
    ]
  },
  {
    id: 'III',
    name: '机械传动',
    en: 'TRANSMISSIONS',
    desc: '在速度、转矩与效率之间，选择一条传动链。',
    chapters: [
      { n: '08', t: '带传动', k: '摩擦 · 打滑' },
      { n: '09', t: '链传动', k: '啮合 · 多边形效应' },
      { n: '10', t: '齿轮传动', k: '接触 · 弯曲' },
      { n: '11', t: '蜗杆传动', k: '大传动比 · 发热' }
    ]
  },
  {
    id: 'IV',
    name: '轴系零、部件',
    en: 'SHAFTING',
    desc: '把旋转的零件支撑起来，并让它们协同工作。',
    chapters: [
      { n: '12', t: '滑动轴承', k: '油膜 · pv' },
      { n: '13', t: '滚动轴承', k: '寿命 · 组合' },
      { n: '14', t: '联轴器和离合器', k: '连接 · 离合' },
      { n: '15', t: '轴', k: '结构 · 弯扭' }
    ]
  },
  {
    id: 'V',
    name: '其他零、部件',
    en: 'SYSTEMS',
    desc: '弹簧、箱体与减速器：从零件回到整机。',
    chapters: [
      { n: '16', t: '弹簧', k: '刚度 · 稳定性' },
      { n: '17', t: '机座和箱体简介', k: '刚度 · 工艺' },
      { n: '18', t: '减速器和变速器', k: '系统 · 传动比' }
    ]
  }
]

const routes = [
  {
    tag: '路线 A · 系统学习',
    title: '从零建立知识框架',
    desc: '按“总论 → 连接 → 传动 → 轴系”的顺序读，先把失效形式和设计准则吃透。',
    steps: ['02 设计总论', '03 零件强度', '10 齿轮传动', '15 轴'],
    link: '/guide/roadmap',
    action: '查看完整路线',
    icon: 'map'
  },
  {
    tag: '路线 B · 考前复习',
    title: '用公式反查知识点',
    desc: '从计算题最常考的五个模块切入，先会套公式，再回头补概念和适用条件。',
    steps: ['螺栓连接', '带传动', '齿轮传动', '轴承寿命'],
    link: '/appendix/formulas',
    action: '打开公式速查',
    icon: 'bolt'
  },
  {
    tag: '路线 C · 课程设计',
    title: '走一遍减速器设计链',
    desc: '从传动方案与电动机选择开始，依次完成带/齿轮、轴、轴承和箱体的设计闭环。',
    steps: ['传动方案', '齿轮参数', '轴系结构', '箱体与润滑'],
    link: '/guide/roadmap#课程设计路线',
    action: '查看设计流程',
    icon: 'gear'
  }
]

const openSearch = () => {
  const button = document.querySelector<HTMLElement>('.DocSearch-Button')
  if (button) {
    button.click()
    return
  }
  document.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: navigator.platform.toLowerCase().includes('mac'),
      ctrlKey: !navigator.platform.toLowerCase().includes('mac'),
      bubbles: true
    })
  )
}

const year = new Date().getFullYear()
const totalFormulas = computed(() => 66)

const slugs: Record<string, string> = {
  '01': 'introduction',
  '02': 'design-fundamentals',
  '03': 'strength',
  '04': 'friction-wear-lubrication',
  '05': 'threaded-connections',
  '06': 'keys-splines-pins',
  '07': 'riveting-welding-bonding',
  '08': 'belt-drives',
  '09': 'chain-drives',
  '10': 'gear-drives',
  '11': 'worm-drives',
  '12': 'sliding-bearings',
  '13': 'rolling-bearings',
  '14': 'couplings-clutches',
  '15': 'shafts',
  '16': 'springs',
  '17': 'frames-housings',
  '18': 'reducers-variators'
}

function chapterSlug(n: string) {
  return slugs[n]
}
</script>

<template>
  <div class="home">
    <section class="home-hero">
      <div class="home-hero__grid" aria-hidden="true" />
      <div class="home-hero__copy">
        <div class="home-hero__eyebrow">
          <span class="pulse" />
          MECHANICAL DESIGN · KNOWLEDGE BASE
        </div>
        <h1>把机械设计，<br /><span>学成一棵知识树。</span></h1>
        <p class="home-hero__lead">
          以西北工业大学《机械设计》第十版十八章为骨架，把散落在公式、表格和工程经验里的知识，
          整理成一张可检索、可串联、可长期复习的地图。
        </p>
        <div class="home-hero__actions">
          <a class="btn btn--primary" :href="withBase('/figures/')">查看 82 张工程图解 ↗</a>
          <a class="btn btn--primary" :href="withBase('/guide/')">
            开始学习
            <span>→</span>
          </a>
          <button class="btn btn--ghost" @click="openSearch">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4.5 4.5" />
            </svg>
            搜索知识库
            <kbd>⌘ K</kbd>
          </button>
        </div>
        <dl class="home-hero__stats">
          <div><dt>18</dt><dd>章 · 完整目录</dd></div>
          <div><dt>82</dt><dd>张 · 工程图解</dd></div>
          <div><dt>{{ totalFormulas }}</dt><dd>个 · 核心公式</dd></div>
          <div><dt>5</dt><dd>个 · 高频计算链</dd></div>
        </dl>
      </div>

      <div class="blueprint">
        <div class="blueprint__head">
          <span>FIG. 00 — GEAR PAIR</span>
          <span>SPUR GEAR · 20°</span>
        </div>
        <div class="blueprint__drawing">
          <GearPairDiagram compact />
        </div>
        <div class="blueprint__summary">
          <span>外啮合 · 渐开线直齿轮</span>
          <strong>i = z₂ / z₁ = 2</strong>
          <p>同模数，转向相反；分度圆在节点 P 相切。</p>
        </div>
        <div class="blueprint__foot">
          <span>PINION → WHEEL</span>
          <span>MODULE m = 2</span>
          <span>z₁ = 24 / z₂ = 48</span>
        </div>
      </div>

      <div class="home-hero__ticker" aria-hidden="true">
        <span>FATIGUE</span><i />
        <span>PRELOAD</span><i />
        <span>CONTACT STRESS</span><i />
        <span>BEARING LIFE</span><i />
        <span>SHAFT DESIGN</span><i />
        <span>LUBRICATION</span>
      </div>
    </section>

    <section class="home-section">
      <div class="section-head">
        <div>
          <span class="section-eyebrow">START HERE</span>
          <h2>你现在处在哪一步？</h2>
        </div>
        <p>同一个知识库，可以有三种完全不同的读法。选一条与自己目标最接近的路线。</p>
      </div>

      <div class="route-grid">
        <article v-for="route in routes" :key="route.title" class="route-card">
          <div class="route-card__tag">{{ route.tag }}</div>
          <div class="route-card__icon">
            <svg v-if="route.icon === 'map'" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M5 8.5 12 5l8 3.5L27 5v18.5L19 27l-8-3.5L5 27z" />
              <path d="M12 5v18.5M19 8.5V27" />
            </svg>
            <svg v-else-if="route.icon === 'bolt'" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M11 5h10l2 5-4 3v14h-6V13L9 10z" />
              <path d="M13 18h6M13 22h6" />
            </svg>
            <svg v-else viewBox="0 0 32 32" aria-hidden="true">
              <circle cx="16" cy="16" r="7" />
              <circle cx="16" cy="16" r="2.3" />
              <path d="M16 5v4M16 23v4M5 16h4M23 16h4M8.2 8.2l2.8 2.8M21 21l2.8 2.8M23.8 8.2 21 11M11 21l-2.8 2.8" />
            </svg>
          </div>
          <h3>{{ route.title }}</h3>
          <p>{{ route.desc }}</p>
          <div class="route-card__steps">
            <span v-for="(step, i) in route.steps" :key="step">{{ step }}<i v-if="i < route.steps.length - 1">→</i></span>
          </div>
          <a :href="withBase(route.link)" class="route-card__link">{{ route.action }} <span>→</span></a>
        </article>
      </div>
    </section>

    <section class="home-section">
      <div class="section-head section-head--tight">
        <div>
          <span class="section-eyebrow">KNOWLEDGE MAP</span>
          <h2>五篇，十八章，一张地图</h2>
        </div>
        <p>先看全局，再进入局部。每一章都包含设计思路、失效防控、核心公式与计算选型。</p>
      </div>

      <div class="map">
        <div v-for="part in parts" :key="part.id" class="map-part">
          <div class="map-part__meta">
            <span class="map-part__roman">{{ part.id }}</span>
            <div>
              <h3>{{ part.name }}</h3>
              <span>{{ part.en }}</span>
            </div>
            <p>{{ part.desc }}</p>
          </div>
          <div class="map-part__chapters">
            <a
              v-for="chapter in part.chapters"
              :key="chapter.n"
              :href="withBase(`/chapters/${chapter.n}-${chapterSlug(chapter.n)}`)"
              class="chapter-tile"
            >
              <span class="chapter-tile__num">{{ chapter.n }}</span>
              <span class="chapter-tile__title">{{ chapter.t }}</span>
              <span class="chapter-tile__key">{{ chapter.k }}</span>
              <span class="chapter-tile__arrow">↗</span>
            </a>
          </div>
        </div>
      </div>

      <a class="map-all" :href="withBase('/chapters/')">
        查看十八章总览
        <span>→</span>
      </a>
    </section>

    <section class="home-section home-section--tinted">
      <FormulaQuickSearch compact :limit="6" />
    </section>

    <section class="home-section">
      <StudyProgress compact />
    </section>

    <section class="home-section how">
      <div class="how__intro">
        <span class="section-eyebrow">HOW TO USE</span>
        <h2>不要从头背到尾</h2>
        <p>
          一本 460 页的教材，真正的难点不是“记住”，而是知道一个公式从哪里来、什么条件下能用、失效时该检查哪一段。
          这个站点按“问题 → 模型 → 公式 → 校核”的顺序组织每一章。
        </p>
        <a :href="withBase('/guide/')">阅读使用指南 <span>→</span></a>
      </div>
      <ol class="how__steps">
        <li>
          <span>01</span>
          <div>
            <b>先问：它为什么会坏？</b>
            <p>点蚀、胶合、疲劳断裂、打滑……失效形式决定设计准则，也决定公式里的每一个修正系数。</p>
          </div>
        </li>
        <li>
          <span>02</span>
          <div>
            <b>再推：公式在算什么？</b>
            <p>不急着套数，先看清受力图、危险截面和单位。公式只是模型的压缩表达。</p>
          </div>
        </li>
        <li>
          <span>03</span>
          <div>
            <b>最后：用自己的话复述一遍</b>
            <p>能不看笔记讲清失效形式、公式来源和适用条件，才算真正掌握。学习进度自动保存在本地。</p>
          </div>
        </li>
      </ol>
    </section>

    <section class="home-cta">
      <div>
        <span>READY WHEN YOU ARE</span>
        <h2>从第一章，或者从最痛的那一章开始。</h2>
      </div>
      <div class="home-cta__actions">
        <a :href="withBase('/chapters/01-introduction')" class="btn btn--light">进入第一章 →</a>
        <a :href="withBase('/appendix/formulas')" class="btn btn--outline-light">直接查公式</a>
      </div>
    </section>

    <footer class="home-foot">
      <span>MECHANICAL DESIGN WIKI · {{ year }}</span>
      <span>以教材目录为框架的独立学习笔记，仅供学习交流。</span>
    </footer>
  </div>
</template>

<style scoped>
.home {
  max-width: 1180px;
  margin: 0 auto;
  padding: 24px 28px 0;
}

/* ---------- hero ---------- */
.home-hero {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.12fr) minmax(380px, 0.88fr);
  gap: 42px;
  overflow: hidden;
  padding: 58px 54px 0;
  border: 1px solid rgba(120, 175, 255, 0.16);
  border-radius: 26px;
  background:
    radial-gradient(90% 120% at 85% 0%, rgba(22, 96, 190, 0.5), transparent 55%),
    radial-gradient(80% 100% at 0% 100%, rgba(0, 190, 220, 0.14), transparent 55%),
    #07111f;
  color: #eaf3ff;
  box-shadow: 0 30px 80px rgba(3, 16, 36, 0.28);
}

.home-hero__grid {
  position: absolute;
  inset: 0;
  opacity: 0.45;
  background-image:
    linear-gradient(rgba(120, 175, 255, 0.09) 1px, transparent 1px),
    linear-gradient(90deg, rgba(120, 175, 255, 0.09) 1px, transparent 1px);
  background-size: 46px 46px;
  mask-image: radial-gradient(80% 80% at 50% 35%, #000, transparent 80%);
  pointer-events: none;
}

.home-hero__copy {
  position: relative;
  z-index: 2;
  padding-bottom: 84px;
}

.home-hero__eyebrow {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #78aef0;
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.15em;
}

.pulse {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #52d5ff;
  box-shadow: 0 0 0 4px rgba(82, 213, 255, 0.12);
  animation: hero-pulse 2.4s ease-out infinite;
}

@keyframes hero-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 3px rgba(82, 213, 255, 0.1);
  }
  50% {
    box-shadow: 0 0 0 7px rgba(82, 213, 255, 0.02);
  }
}

.home-hero h1 {
  margin: 22px 0 0;
  font-size: clamp(40px, 5vw, 62px);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.045em;
}

.home-hero h1 span {
  background: linear-gradient(100deg, #fff 5%, #8ed4ff 48%, #52d5ff 95%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.home-hero__lead {
  max-width: 600px;
  margin: 24px 0 0;
  color: #9fb4ce;
  font-size: 15px;
  line-height: 1.85;
}

.home-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 11px;
  margin-top: 28px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  height: 44px;
  padding: 0 19px;
  border: 1px solid transparent;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  transition:
    transform 0.18s,
    background 0.18s,
    border-color 0.18s;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn--primary {
  background: #fff;
  color: #07111f;
  box-shadow: 0 10px 30px rgba(255, 255, 255, 0.12);
}

.btn--primary span {
  color: #0b63ce;
}

.btn--ghost {
  border-color: rgba(155, 190, 235, 0.28);
  background: rgba(12, 31, 54, 0.55);
  color: #c9dcf3;
}

.btn--ghost svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
}

.btn--ghost kbd {
  margin-left: 4px;
  padding: 1px 5px;
  border: 1px solid rgba(155, 190, 235, 0.26);
  border-radius: 4px;
  color: #7f9cbe;
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 9.5px;
}

.home-hero__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  margin: 40px 0 0;
  padding: 0;
}

.home-hero__stats div {
  padding: 0 22px;
  border-left: 1px solid rgba(155, 190, 235, 0.18);
}

.home-hero__stats div:first-child {
  padding-left: 0;
  border-left: 0;
}

.home-hero__stats dt {
  color: #fff;
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 23px;
  font-weight: 700;
}

.home-hero__stats dd {
  margin: 2px 0 0;
  color: #7892ae;
  font-size: 10.5px;
}

.home-hero__ticker {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 54px;
  border-top: 1px solid rgba(120, 175, 255, 0.14);
  background: rgba(4, 13, 25, 0.38);
  color: #577795;
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 8.5px;
  letter-spacing: 0.13em;
}

.home-hero__ticker i {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, rgba(120, 175, 255, 0.22), transparent);
}

/* ---------- blueprint ---------- */
.blueprint {
  position: relative;
  z-index: 1;
  align-self: stretch;
  margin: 0 -10px -1px 0;
  padding: 16px 16px 48px;
  border-left: 1px solid rgba(120, 175, 255, 0.14);
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.blueprint__head,
.blueprint__foot {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  color: #547696;
  font-size: 8px;
  letter-spacing: 0.1em;
}

.blueprint__drawing {
  margin: 30px -14px 12px;
}

.blueprint__summary {
  padding: 16px 18px;
  margin: 18px 0;
  border: 1px solid rgba(120, 175, 255, 0.18);
  border-radius: 10px;
  background: rgba(8, 27, 47, 0.6);
}

.blueprint__summary > span {
  display: block;
  margin-bottom: 8px;
  color: #8ca9c5;
  font-size: 11px;
}

.blueprint__summary strong {
  color: #74deed;
  font-size: 18px;
  font-weight: 600;
}

.blueprint__summary p {
  margin: 8px 0 0;
  color: #91aac2;
  font-size: 11px;
  line-height: 1.7;
}

.blueprint__foot {
  margin-top: 4px;
  padding-top: 10px;
  border-top: 1px solid rgba(120, 175, 255, 0.12);
}

/* ---------- sections ---------- */
.home-section {
  padding: 78px 0 0;
}

.home-section--tinted {
  margin-top: 78px;
  padding: 40px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 22px;
  background:
    radial-gradient(100% 100% at 100% 0%, rgba(11, 99, 206, 0.07), transparent 55%),
    var(--vp-c-bg-soft);
}

.section-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 40px;
  margin-bottom: 26px;
}

.section-head--tight {
  align-items: flex-start;
}

.section-eyebrow {
  color: var(--vp-c-brand-1);
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.16em;
}

.section-head h2,
.how h2 {
  margin: 5px 0 0;
  font-size: clamp(25px, 3vw, 34px);
  font-weight: 800;
  letter-spacing: -0.03em;
}

.section-head > p {
  max-width: 380px;
  margin: 0;
  color: var(--vp-c-text-3);
  font-size: 13px;
  line-height: 1.75;
}

/* ---------- route cards ---------- */
.route-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.route-card {
  position: relative;
  padding: 24px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg);
  transition:
    border-color 0.2s,
    transform 0.2s,
    box-shadow 0.2s;
}

.route-card:hover {
  border-color: rgba(11, 99, 206, 0.45);
  transform: translateY(-3px);
  box-shadow: 0 16px 40px rgba(15, 40, 80, 0.08);
}

.route-card__tag {
  color: var(--vp-c-text-3);
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 9px;
  letter-spacing: 0.08em;
}

.route-card__icon {
  display: grid;
  width: 42px;
  height: 42px;
  margin-top: 18px;
  border-radius: 11px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  place-items: center;
}

.route-card__icon svg {
  width: 22px;
  height: 22px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.5;
}

.route-card h3 {
  margin: 16px 0 0;
  font-size: 18px;
  letter-spacing: -0.02em;
}

.route-card p {
  margin: 8px 0 0;
  color: var(--vp-c-text-3);
  font-size: 12.5px;
  line-height: 1.72;
}

.route-card__steps {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 15px;
}

.route-card__steps span {
  color: var(--vp-c-text-2);
  font-size: 10.5px;
}

.route-card__steps i {
  margin-left: 4px;
  color: var(--vp-c-text-3);
  font-style: normal;
}

.route-card__link {
  display: inline-block;
  margin-top: 20px;
  color: var(--vp-c-brand-1);
  font-size: 12px;
  font-weight: 700;
  text-decoration: none;
}

.route-card__link span {
  display: inline-block;
  transition: transform 0.18s;
}

.route-card__link:hover span {
  transform: translateX(3px);
}

/* ---------- map ---------- */
.map {
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  background: var(--vp-c-bg);
}

.map-part {
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr);
  gap: 26px;
  padding: 24px 28px;
  border-top: 1px solid var(--vp-c-divider);
}

.map-part:first-child {
  border-top: 0;
}

.map-part__meta {
  position: relative;
  padding-left: 46px;
}

.map-part__roman {
  position: absolute;
  top: 0;
  left: 0;
  color: var(--vp-c-brand-1);
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 13px;
  font-weight: 700;
  opacity: 0.65;
}

.map-part__meta h3 {
  margin: 0;
  font-size: 17px;
  letter-spacing: -0.01em;
}

.map-part__meta > div > span {
  color: var(--vp-c-text-3);
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 8px;
  letter-spacing: 0.14em;
}

.map-part__meta p {
  margin: 11px 0 0;
  color: var(--vp-c-text-3);
  font-size: 11.5px;
  line-height: 1.65;
}

.map-part__chapters {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 7px;
}

.chapter-tile {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr) auto;
  gap: 2px 8px;
  align-items: center;
  padding: 11px 12px;
  border: 1px solid transparent;
  border-radius: 9px;
  color: inherit;
  text-decoration: none;
  transition:
    background 0.17s,
    border-color 0.17s;
}

.chapter-tile:hover {
  border-color: var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.chapter-tile__num {
  color: var(--vp-c-brand-1);
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 10px;
  font-weight: 700;
  grid-row: span 2;
}

.chapter-tile__title {
  overflow: hidden;
  color: var(--vp-c-text-1);
  font-size: 12.5px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chapter-tile__key {
  color: var(--vp-c-text-3);
  font-size: 10px;
  grid-column: 2;
}

.chapter-tile__arrow {
  color: var(--vp-c-text-3);
  font-size: 10px;
  grid-column: 3;
  grid-row: 1 / span 2;
  opacity: 0;
  transition: opacity 0.17s;
}

.chapter-tile:hover .chapter-tile__arrow {
  opacity: 1;
}

.map-all {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
  padding: 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  transition:
    border-color 0.18s,
    color 0.18s;
}

.map-all:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

/* ---------- how ---------- */
.how {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: 64px;
  padding-top: 84px;
}

.how__intro p {
  margin: 15px 0 0;
  color: var(--vp-c-text-3);
  font-size: 13px;
  line-height: 1.85;
}

.how__intro a {
  display: inline-block;
  margin-top: 18px;
  color: var(--vp-c-brand-1);
  font-size: 12.5px;
  font-weight: 700;
  text-decoration: none;
}

.how__steps {
  margin: 0;
  padding: 0;
  list-style: none;
}

.how__steps li {
  display: flex;
  gap: 18px;
  padding: 17px 0;
  border-top: 1px solid var(--vp-c-divider);
}

.how__steps li:first-child {
  padding-top: 0;
  border-top: 0;
}

.how__steps > li > span {
  flex: none;
  color: var(--vp-c-brand-1);
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 10px;
  font-weight: 700;
  line-height: 24px;
}

.how__steps b {
  display: block;
  color: var(--vp-c-text-1);
  font-size: 14px;
}

.how__steps p {
  margin: 5px 0 0;
  color: var(--vp-c-text-3);
  font-size: 12px;
  line-height: 1.7;
}

/* ---------- cta ---------- */
.home-cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  margin-top: 84px;
  padding: 38px 42px;
  border-radius: 20px;
  background:
    radial-gradient(90% 180% at 100% 0%, rgba(82, 213, 255, 0.24), transparent 55%),
    linear-gradient(120deg, #08203f, #0b3a6d);
  color: #fff;
}

.home-cta span {
  color: #6ea8df;
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 9px;
  letter-spacing: 0.14em;
}

.home-cta h2 {
  max-width: 550px;
  margin: 7px 0 0;
  font-size: clamp(22px, 2.6vw, 30px);
  letter-spacing: -0.025em;
}

.home-cta__actions {
  display: flex;
  flex: none;
  flex-wrap: wrap;
  gap: 9px;
}

.btn--light {
  background: #fff;
  color: #08203f;
}

.btn--outline-light {
  border-color: rgba(255, 255, 255, 0.25);
  color: #d7e8fa;
}

.home-foot {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 36px;
  padding: 18px 0 26px;
  border-top: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-3);
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 9px;
  letter-spacing: 0.06em;
}

/* ---------- responsive ---------- */
@media (max-width: 1040px) {
  .home-hero {
    grid-template-columns: 1fr;
    padding: 46px 40px 0;
  }

  .home-hero__copy {
    padding-bottom: 20px;
  }

  .blueprint {
    display: none;
  }

  .home-hero__ticker {
    padding: 12px 40px;
  }

  .route-grid {
    grid-template-columns: 1fr;
  }

  .route-card {
    display: grid;
    grid-template-columns: 54px 1fr;
    gap: 0 16px;
  }

  .route-card__tag {
    grid-column: 2;
  }

  .route-card__icon {
    grid-row: 1 / span 2;
    margin-top: 0;
  }

  .route-card h3,
  .route-card p,
  .route-card__steps,
  .route-card__link {
    grid-column: 2;
  }

  .how {
    grid-template-columns: 1fr;
    gap: 30px;
  }
}

@media (max-width: 760px) {
  .home {
    padding: 16px 16px 0;
  }

  .home-hero {
    padding: 32px 22px 0;
    border-radius: 18px;
  }

  .home-hero h1 {
    font-size: clamp(36px, 10vw, 48px);
  }

  .home-hero__lead {
    font-size: 14px;
  }

  .home-hero__stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 18px 0;
    margin-top: 30px;
  }

  .home-hero__stats div {
    padding: 0 16px;
  }

  .home-hero__stats div:nth-child(3) {
    padding-left: 0;
    border-left: 0;
  }

  .home-hero__ticker {
    position: static;
    margin: 26px -22px 0;
    padding: 10px 22px;
    overflow: hidden;
    font-size: 7.5px;
  }

  .home-hero__ticker span:nth-of-type(n + 4),
  .home-hero__ticker i:nth-of-type(n + 3) {
    display: none;
  }

  .home-section {
    padding-top: 54px;
  }

  .home-section--tinted {
    margin-top: 54px;
    padding: 22px 18px;
  }

  .section-head {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }

  .section-head h2,
  .how h2 {
    font-size: 25px;
  }

  .map-part {
    grid-template-columns: 1fr;
    gap: 14px;
    padding: 20px 18px;
  }

  .map-part__chapters {
    grid-template-columns: 1fr;
  }

  .route-card {
    display: block;
    padding: 20px;
  }

  .route-card__icon {
    margin-top: 14px;
  }

  .home-cta {
    align-items: flex-start;
    flex-direction: column;
    margin-top: 54px;
    padding: 26px 22px;
  }

  .home-foot {
    flex-direction: column;
    gap: 7px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pulse {
    animation: none;
  }

  .btn,
  .route-card,
  .chapter-tile {
    transition: none;
  }
}
</style>
