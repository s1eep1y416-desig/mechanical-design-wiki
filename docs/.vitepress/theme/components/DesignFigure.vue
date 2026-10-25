<script setup lang="ts">
import { computed } from "vue";
import { withBase } from "vitepress";
import { illustrations } from "../../data/illustrations.mjs";
import FigureFrame from "./FigureFrame.vue";
const props = defineProps<{ id: string; caption?: string }>();
const item = computed(() => illustrations.find((f) => f.id === props.id));
</script>
<template>
  <FigureFrame v-if="item" :title="item.title"
    ><figure class="design-figure" :data-figure-id="id">
      <img
        :src="withBase('/figures/' + id + '.svg')"
        :alt="item.title + '。' + item.note"
        width="1000"
        height="600"
        loading="lazy"
        decoding="async"
      />
      <figcaption>
        <strong>{{ item.title }}</strong>
        <p>{{ item.note }}</p>
        <a :href="withBase('/figures/' + id + '.svg')" :download="id + '.svg'"
          >下载 SVG 原图</a
        >
      </figcaption>
    </figure></FigureFrame
  >
</template>
<style scoped>
.design-figure {
  margin: 0;
  background: var(--vp-c-bg-soft);
}
img {
  display: block;
  width: 100%;
  height: auto;
  background: #fff;
}
figcaption {
  padding: 16px 20px;
  font-size: 14px;
  line-height: 1.8;
  color: var(--vp-c-text-2);
}
figcaption strong {
  color: var(--vp-c-text-1);
  font-size: 15px;
}
figcaption p {
  margin: 5px 0 8px;
}
figcaption a {
  font-size: 12px;
}
</style>
