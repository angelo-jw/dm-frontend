<script setup>
import Card from "primevue/card";
const props = defineProps({
  height: {
    type: String,
    default: "h-17rem",
  },
});
</script>

<template>
  <Card :class="`mt-3 ${height}`">
    <template #title><slot name="title"></slot></template>
    <template #content>
      <slot name="content"></slot>
    </template>
  </Card>
</template>
