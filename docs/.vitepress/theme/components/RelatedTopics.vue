<script setup lang="ts">
import { computed } from "vue";
import { useRoute, withBase } from "vitepress";

const pages = {
  "01": ["绪论", "/chapters/01-introduction"],
  "02": ["机械设计总论", "/chapters/02-design-fundamentals"],
  "03": ["机械零件的强度", "/chapters/03-strength"],
  "04": ["摩擦、磨损及润滑", "/chapters/04-friction-wear-lubrication"],
  "05": ["螺纹连接和螺旋传动", "/chapters/05-threaded-connections"],
  "06": ["键、花键和销连接", "/chapters/06-keys-splines-pins"],
  "07": ["铆、焊、胶接和过盈连接", "/chapters/07-riveting-welding-bonding"],
  "08": ["带传动", "/chapters/08-belt-drives"],
  "09": ["链传动", "/chapters/09-chain-drives"],
  "10": ["齿轮传动", "/chapters/10-gear-drives"],
  "11": ["蜗杆传动", "/chapters/11-worm-drives"],
  "12": ["滑动轴承", "/chapters/12-sliding-bearings"],
  "13": ["滚动轴承", "/chapters/13-rolling-bearings"],
  "14": ["联轴器和离合器", "/chapters/14-couplings-clutches"],
  "15": ["轴", "/chapters/15-shafts"],
  "16": ["弹簧", "/chapters/16-springs"],
  "17": ["机座和箱体", "/chapters/17-frames-housings"],
  "18": ["减速器和变速器", "/chapters/18-reducers-variators"],
  fits: ["公差与配合", "/fundamentals/fits"],
  surface: ["表面处理", "/fundamentals/surface-treatment"],
  heat: ["表面热处理", "/fundamentals/surface-heat-treatment"],
  standards: ["国家标准与手册", "/appendix/standards"],
} as const;

const related: Record<string, Array<keyof typeof pages>> = {
  "01": ["02", "18", "standards"],
  "02": ["03", "17", "18"],
  "03": ["10", "15", "16"],
  "04": ["08", "11", "12"],
  "05": ["07", "15", "standards"],
  "06": ["07", "15", "fits"],
  "07": ["05", "17", "surface"],
  "08": ["04", "15", "18"],
  "09": ["04", "10", "18"],
  "10": ["03", "13", "18"],
  "11": ["04", "13", "18"],
  "12": ["04", "13", "15"],
  "13": ["10", "12", "15"],
  "14": ["05", "15", "18"],
  "15": ["03", "06", "13"],
  "16": ["03", "heat", "standards"],
  "17": ["02", "07", "18"],
  "18": ["08", "10", "13"],
};

const route = useRoute();
const chapter = computed(
  () => route.path.match(/\/chapters\/(\d{2})-/)?.[1] || "",
);
const items = computed(() =>
  (related[chapter.value] || []).map((id) => ({
    id,
    title: pages[id][0],
    link: pages[id][1],
  })),
);
</script>

<template>
  <section
    v-if="items.length"
    class="related-topics"
    aria-labelledby="related-title"
  >
    <div>
      <span>KNOWLEDGE LINKS</span>
      <h2 id="related-title">继续把知识连起来</h2>
    </div>
    <nav aria-label="相关知识">
      <a v-for="item in items" :key="item.id" :href="withBase(item.link)">
        <small>{{ item.id.toUpperCase() }}</small>
        <strong>{{ item.title }}</strong>
        <i aria-hidden="true">→</i>
      </a>
    </nav>
  </section>
</template>

<style scoped>
.related-topics {
  margin-top: 42px;
  padding-top: 24px;
  border-top: 1px solid var(--vp-c-divider);
}
.related-topics > div span {
  color: var(--vp-c-brand-1);
  font: 700 10px/1.4 var(--vp-font-family-mono);
  letter-spacing: 0.14em;
}
.related-topics h2 {
  margin: 5px 0 16px;
  padding: 0;
  border: 0;
  font-size: 18px;
}
.related-topics nav {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}
.related-topics a {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 4px 10px;
  min-height: 76px;
  padding: 13px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  text-decoration: none;
}
.related-topics small {
  grid-column: 1 / -1;
  color: var(--vp-c-text-3);
  font: 9px var(--vp-font-family-mono);
}
.related-topics strong {
  color: var(--vp-c-text-1);
  font-size: 13px;
}
.related-topics i {
  color: var(--vp-c-brand-1);
  font-style: normal;
}
.related-topics a:hover,
.related-topics a:focus-visible {
  border-color: var(--vp-c-brand-1);
}
@media (max-width: 640px) {
  .related-topics nav {
    grid-template-columns: 1fr;
  }
  .related-topics a {
    min-height: 64px;
  }
}
</style>
