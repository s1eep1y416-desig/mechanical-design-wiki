<script setup lang="ts">
withDefaults(
  defineProps<{
    note?: string
  }>(),
  { note: '' }
)
</script>

<template>
  <aside class="unit-convention">
    <header>
      <span>UNIT CONVENTION</span>
      <b>公式单位约定</b>
    </header>

    <div class="unit-chips">
      <span><em>F</em> N</span>
      <span><em>L / d</em> mm</span>
      <span><em>σ / τ / p</em> MPa</span>
      <span><em>T</em> N·mm</span>
      <span><em>P</em> kW</span>
      <span><em>n</em> r/min</span>
      <span><em>v</em> m/s</span>
      <span><em>α</em> °</span>
    </div>

    <p>
      上述为本章公式默认单位；传动比、效率、系数、应力比等为无量纲量。
      强度公式中的转矩统一换算为 N·mm 后再代入。若某公式采用 N·m、rad、μm
      等不同单位，会在该公式旁单独说明。
      <template v-if="note"> {{ note }}</template>
    </p>

    <a href="/appendix/units">完整换算表 →</a>
  </aside>
</template>

<style scoped>
.unit-convention {
  margin: 0 0 22px;
  padding: 13px 15px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
}

.unit-convention header {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 8px;
}

.unit-convention header span {
  color: var(--vp-c-brand-1);
  font-family: var(--vp-font-family-mono);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.unit-convention header b {
  color: var(--vp-c-text-1);
  font-size: 11.5px;
}

.unit-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.unit-chips span {
  padding: 3px 7px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 5px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-2);
  font-family: var(--vp-font-family-mono);
  font-size: 9px;
}

.unit-chips em {
  margin-right: 3px;
  color: var(--vp-c-brand-1);
  font-style: normal;
}

.unit-convention p {
  margin: 8px 0 0;
  color: var(--vp-c-text-3);
  font-size: 10.5px;
  line-height: 1.7;
}

.unit-convention a {
  display: inline-block;
  margin-top: 6px;
  color: var(--vp-c-brand-1);
  font-size: 10px;
  font-weight: 600;
  text-decoration: none;
}

@media (max-width: 640px) {
  .unit-convention {
    padding: 11px 12px;
  }

  .unit-chips span {
    font-size: 8.5px;
  }
}
</style>
