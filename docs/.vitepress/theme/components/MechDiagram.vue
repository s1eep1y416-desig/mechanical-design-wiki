<script setup lang="ts">
import DesignFigure from "./DesignFigure.vue";
defineProps<{ type: string; caption?: string }>();
</script>
<template>
  <DesignFigure
    :id="type === 'thread' ? 'thread-geometry' : 'overview-' + type"
    :caption="caption"
  />
</template>
