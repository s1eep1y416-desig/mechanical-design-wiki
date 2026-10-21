<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import ReadingProgress from './components/ReadingProgress.vue'
import ReadingTools from './components/ReadingTools.vue'
import ReadingSidebar from './components/ReadingSidebar.vue'
</script>

<template>
  <DefaultTheme.Layout>
    <template #sidebar-nav-before>
      <div class="sidebar-heading">
        <strong>知识目录</strong>
        <span>五篇 · 十八章 · 基础专题</span>
      </div>
    </template>
    <template #layout-top>
      <ReadingProgress />
      <ReadingSidebar />
    </template>
    <template #aside-bottom>
      <div class="aside-end">
        <span />
        <em>END OF PAGE</em>
      </div>
    </template>
    <template #layout-bottom>
      <ReadingTools />
    </template>
  </DefaultTheme.Layout>
</template>

<style scoped>
.sidebar-heading {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 8px 18px;
  margin-bottom: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
}
.sidebar-heading strong { font-size: 14px; color: var(--vp-c-text-1); }
.sidebar-heading span { font-size: 11px; color: var(--vp-c-text-3); }
.aside-end {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  padding-top: 36px;
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 7.5px;
  letter-spacing: 0.12em;
}

.aside-end span {
  width: 22px;
  height: 1px;
  background: var(--vp-c-divider);
}

.aside-end em {
  font-style: normal;
}
</style>
