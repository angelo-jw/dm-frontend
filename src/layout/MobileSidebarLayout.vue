<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";

import Avatar from "primevue/avatar";

import mobileLogo from "../assets/mobileLogo.png";
import MobileMenu from "../components/MobileMenu.vue";

const { t } = useI18n();

const menuItems = [
  { icon: "pi pi-list", label: "", route: "/" },
  { icon: "pi pi-wallet", label: "", route: "/payments" },
  { icon: "pi pi-chart-line", label: "", route: "/dashboard" },
];
</script>
<style lang="less" scoped>
.user-text {
  z-index: -1;
  position: relative;
  left: 2px;
}
</style>

<template>
  <div class="flex justify-content-around flex-column">
    <div class="flex justify-content-between px-3 pt-2">
      <img :src="mobileLogo" />
      <div class="flex align-items-center">
        <small
          class="user-text pr-2 background-primary text-white px-2 border-round-left"
          >{{ t("Happy Tracking,", { name: "Adalkis" }) }}</small
        >
        <Avatar
          image="https://primefaces.org/cdn/primevue/images/avatar/asiyajavayant.png"
          class="cursor-pointer"
          size="large"
          shape="circle"
        />
      </div>
    </div>
    <div class="pt-4">
      <slot></slot>
    </div>
    <div>
      <MobileMenu class="absolute bottom-0 w-full" :items="menuItems" />
    </div>
  </div>
</template>
