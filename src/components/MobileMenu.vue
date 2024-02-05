<script setup>
import Menubar from "primevue/menubar";
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  size: {
    type: String,
    default: "1.5rem",
  },
});
</script>
<style lang="less" scoped>
.mobile-menu-wrapper {
  box-shadow: 1px 1px 6px 1px #000000;
  background: white;
}
:deep(.p-menubar-mobile) {
  .p-menubar-button {
    .p-icon {
      color: var(--text-color);
    }
  }
}
.router-link-active {
  background: var(--primary-color);
  .pi {
    line-height: 1;
  }
}
</style>
<template>
  <div
    class="mobile-menu-wrapper flex align-items-center justify-content-around pt-3 pb-1 border-round-top-xl h-4rem"
  >
    <div class="flex" v-for="(item, index) in items" :key="index">
      <router-link
        :to="item.route"
        class="d-flex align-items-center px-3 pt-2 pb-1"
      >
        <i :class="item.icon" :style="`font-size: ${props.size}`" />
        <small>{{ item.label }}</small>
      </router-link>
    </div>
  </div>
</template>
