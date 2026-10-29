<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { withBase } from "vitepress";
import { illustrations } from "../../data/illustrations.mjs";
import DesignFigure from "./DesignFigure.vue";
import CurveChart from "./CurveChart.vue";
import ForceDiagram from "./ForceDiagram.vue";
import { targetWithSection } from "../utils/link-targets.mjs";
const query = ref(""),
  chapter = ref(""),
  limit = ref(24);
const selected = ref(illustrations.find((f) => f.id === "overview-chain")!);
const chapters = [...new Set(illustrations.map((f) => f.chapter))].sort();
const names: Record<string, string> = {
  fits: "公差与配合",
  "surface-treatment": "表面处理",
  "surface-heat-treatment": "表面热处理",
};
const filtered = computed(() =>
  illustrations.filter(
    (f) =>
      (!chapter.value || f.chapter === chapter.value) &&
      (!query.value ||
        `${f.title} ${f.note} ${f.id}`
          .toLowerCase()
          .includes(query.value.toLowerCase())),
  ),
);
watch([query, chapter], () => (limit.value = 24));
function choose(f: (typeof illustrations)[number]) {
  selected.value = f;
  document.getElementById("selected-figure")?.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
    block: "start",
  });
}
const selectedTarget = computed(() =>
  withBase(
    targetWithSection(selected.value.page, selected.value.section || ""),
  ),
);
</script>
<template>
  <div class="design-gallery">
    <div class="gallery-stats">
      <strong>{{ illustrations.length }}</strong
      ><span
        >张独立教学图解<br />63 张结构与原理图 · 8 张受力分析 · 11
        张关系曲线</span
      >
    </div>
    <section id="selected-figure" aria-label="当前图解">
      <div class="selected-title">
        <span
          >当前查看 ·
          {{
            names[selected.chapter] || "第 " + selected.chapter + " 章"
          }}</span
        ><a :href="selectedTarget">阅读对应知识点 →</a>
      </div>
      <DesignFigure
        v-if="selected.kind === 'svg'"
        :id="selected.id"
      /><ForceDiagram
        v-else-if="selected.kind === 'force'"
        :key="selected.id"
        :type="selected.type"
      /><CurveChart v-else :key="selected.id" :type="selected.type" />
      <a
        v-if="selected.kind !== 'svg'"
        class="selected-download"
        :href="withBase('/figures/' + selected.id + '.svg')"
        :download="selected.id + '.svg'"
        >下载此图 SVG</a
      >
    </section>
    <div class="gallery-filter">
      <label
        >搜索图解<input
          v-model="query"
          type="search"
          placeholder="例如：链、受力、配合、轴承" /></label
      ><label
        >按章节筛选<select v-model="chapter">
          <option value="">全部章节</option>
          <option v-for="c in chapters" :key="c" :value="c">
            {{ names[c] || "第 " + c + " 章" }}
          </option>
        </select></label
      ><span aria-live="polite">{{ filtered.length }} 张</span>
    </div>
    <div class="gallery-grid">
      <button
        v-for="f in filtered.slice(0, limit)"
        :key="f.id"
        class="gallery-card"
        :class="{ active: f.id === selected.id }"
        :aria-pressed="f.id === selected.id"
        @click="choose(f)"
      >
        <img
          :src="withBase('/figures/' + f.id + '.svg')"
          alt=""
          loading="lazy"
          width="1000"
          height="600"
        /><span class="card-text"
          ><small>{{ names[f.chapter] || "第 " + f.chapter + " 章" }}</small
          ><strong>{{ f.title }}</strong></span
        >
      </button>
    </div>
    <p v-if="!filtered.length">没有匹配的图解，请换一个关键词。</p>
    <button
      v-if="filtered.length > limit"
      class="load-more"
      @click="limit += 24"
    >
      继续显示（剩余 {{ filtered.length - limit }} 张）
    </button>
  </div>
</template>
<style scoped>
.gallery-stats {
  display: flex;
  align-items: center;
  gap: 24px;
  margin: 25px 0;
  padding: 24px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
}
.gallery-stats strong {
  font-size: 54px;
  line-height: 1;
  color: var(--vp-c-brand-1);
}
.gallery-stats span {
  font-size: 14px;
  line-height: 1.8;
}
.selected-title {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 13px;
}
#selected-figure {
  scroll-margin-top: 90px;
}
.selected-download {
  display: inline-block;
  margin: 10px 0 20px;
  font-size: 13px;
}
.gallery-filter {
  display: flex;
  align-items: end;
  gap: 18px;
  flex-wrap: wrap;
  margin: 28px 0;
}
.gallery-filter label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
}
.gallery-filter label:first-child {
  flex: 1;
  min-width: 200px;
}
input,
select {
  border: 1px solid var(--vp-c-divider);
  padding: 9px 12px;
  border-radius: 8px;
  background: var(--vp-c-bg);
  font: inherit;
  color: var(--vp-c-text-1);
}
.gallery-filter > span {
  font-size: 13px;
  padding-bottom: 10px;
}
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
.gallery-card {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  text-align: left;
  cursor: pointer;
  background: var(--vp-c-bg-soft);
  transition: border-color 0.15s;
}
.gallery-card:hover,
.gallery-card.active {
  border-color: var(--vp-c-brand-1);
}
.gallery-card:focus-visible {
  outline: 3px solid var(--vp-c-brand-1);
}
.gallery-card img {
  display: block;
  width: 100%;
  height: auto;
  background: white;
}
.card-text {
  display: block;
  padding: 14px;
}
.card-text small {
  display: block;
  color: var(--vp-c-text-2);
  font-size: 12px;
}
.card-text strong {
  display: block;
  font-size: 14px;
  margin-top: 4px;
}
.existing-preview {
  aspect-ratio: 5/3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--vp-c-bg-alt);
  font-size: 22px;
  color: var(--vp-c-brand-1);
}
.existing-preview small {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin-top: 15px;
}
.load-more {
  display: block;
  width: 100%;
  padding: 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  margin-top: 20px;
  cursor: pointer;
  color: var(--vp-c-brand-1);
}
@media (max-width: 540px) {
  .gallery-grid {
    grid-template-columns: 1fr;
  }
  .gallery-stats {
    gap: 15px;
    padding: 18px;
  }
  .gallery-stats strong {
    font-size: 42px;
  }
}
</style>
