<script setup>
import Card from "primevue/card";
const props = defineProps({
  height: {
    type: String,
    default: "h-full",
  },
});
</script>

<style lang="less" scoped>
.card-component {
  min-height: 18rem;
  :deep(.p-card-body) {
    height: 100%;
    .p-card-content {
      height: inherit;
    }
  }
}
</style>

<template>
  <Card :class="`mt-3 ${height}`" class="card-component">
    <template #title><slot name="title"></slot></template>
    <template #content>
      <slot name="content"></slot>
    </template>
  </Card>
</template>
