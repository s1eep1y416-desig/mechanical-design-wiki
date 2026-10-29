<script setup lang="ts">
import { ref, nextTick, onBeforeUnmount } from "vue";
const props = withDefaults(defineProps<{ title?: string }>(), {
  title: "教学图解",
});
const expanded = ref(false),
  zoom = ref(100),
  root = ref<HTMLElement>(),
  oldFocus = ref<HTMLElement>();
let previousOverflow = "",
  height = 0;
async function open() {
  height = root.value?.offsetHeight || 300;
  oldFocus.value = document.activeElement as HTMLElement;
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  expanded.value = true;
  await nextTick();
  root.value?.querySelector<HTMLButtonElement>("button")?.focus();
}
function close() {
  expanded.value = false;
  zoom.value = 100;
  document.body.style.overflow = previousOverflow;
  nextTick(() => oldFocus.value?.focus());
}
function keydown(e: KeyboardEvent) {
  if (!expanded.value) return;
  if (e.key === "Escape") {
    e.preventDefault();
    close();
  }
  if (e.key === "Tab") {
    const els = root.value?.querySelectorAll<HTMLElement>(
      "button,select,a[href],input",
    );
    if (!els?.length) return;
    const first = els[0],
      last = els[els.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}
onBeforeUnmount(() => {
  if (expanded.value) document.body.style.overflow = previousOverflow;
});
</script>
<template>
  <div
    class="figure-position"
    :style="expanded ? { height: height + 'px' } : undefined"
  >
    <Teleport to="body" :disabled="!expanded">
      <div
        ref="root"
        class="figure-frame"
        :class="{ 'is-expanded': expanded }"
        :role="expanded ? 'dialog' : undefined"
        :aria-modal="expanded ? 'true' : undefined"
        :aria-label="expanded ? props.title : undefined"
        @keydown="keydown"
      >
        <div class="figure-tools">
          <span>{{ expanded ? props.title : "高清矢量图 · 可放大" }}</span>
          <div>
            <label v-if="expanded"
              >比例
              <select v-model="zoom" aria-label="图解缩放">
                <option :value="100">100%</option>
                <option :value="150">150%</option>
                <option :value="200">200%</option>
              </select></label
            ><button type="button" @click="expanded ? close() : open()">
              {{ expanded ? "关闭 ×" : "放大查看 ↗" }}
            </button>
          </div>
        </div>
        <div class="figure-scroll">
          <div
            :style="
              expanded
                ? { width: zoom + '%', minWidth: 'min(1000px, 100%)' }
                : undefined
            "
          >
            <slot />
          </div>
        </div></div
    ></Teleport>
  </div>
</template>
<style scoped>
.figure-position {
  margin: 24px 0;
}
.figure-frame {
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  overflow: hidden;
  background: var(--vp-c-bg-soft);
}
.figure-tools {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 12px;
  color: var(--vp-c-text-2);
}
.figure-tools > div {
  display: flex;
  align-items: center;
  gap: 16px;
}
.figure-tools button,
.figure-tools select {
  min-height: 44px;
  font: inherit;
  color: var(--vp-c-brand-1);
  padding: 6px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 7px;
  background: var(--vp-c-bg);
  cursor: pointer;
}
.figure-frame :deep(figure) {
  margin: 0;
  border: 0;
  border-radius: 0;
}
.is-expanded {
  position: fixed;
  inset: 18px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 0 100vmax #061321d9;
  background: var(--vp-c-bg);
}
.figure-scroll {
  overflow: auto;
}
.is-expanded .figure-scroll {
  flex: 1;
  padding: 16px;
}
.is-expanded .figure-scroll > div {
  max-width: none;
  margin: 0 auto;
}
.is-expanded :deep(svg) {
  width: 100%;
  max-height: none;
}
.is-expanded :deep(img) {
  width: 100%;
  max-width: none;
}
.is-expanded .figure-tools {
  font-size: 14px;
}
.figure-tools button:focus-visible,
.figure-tools select:focus-visible {
  outline: 3px solid var(--vp-c-brand-1);
  outline-offset: 2px;
}
@media (max-width: 600px) {
  .is-expanded {
    inset: 6px;
  }
  .figure-tools {
    padding: 9px;
    align-items: start;
  }
  .figure-tools > span {
    max-width: 55%;
  }
  .figure-tools > div {
    gap: 5px;
    flex-wrap: wrap;
    justify-content: end;
  }
  .is-expanded .figure-scroll {
    padding: 4px;
  }
}
</style>
