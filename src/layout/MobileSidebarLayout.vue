<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";

import Avatar from "primevue/avatar";

import mobileLogo from "../assets/logo1.png";
import MobileMenu from "../components/MobileMenu.vue";

const { t } = useI18n();

const menuItems = [
  { icon: "pi pi-list", label: "", route: "/" },
  { icon: "pi pi-wallet", label: "", route: "/payments" },
  { icon: "pi pi-chart-line", label: "", route: "/dashboard" },
];
const isShowDropdown = ref(false);
const outsideClick = (e) => {
  console.log(
    "adfaffd",
    e.target,
    e.target.offsetParent?.classList?.contains("p-avatar")
  );
  if (
    !e.target.classList.contains("dropdown-item") &&
    !e.target.offsetParent?.classList?.contains("p-avatar")
  )
    isShowDropdown.value = false;
};
</script>
<style lang="less" scoped>
.user-text {
  z-index: -1;
  position: relative;
  left: 2px;
}
.wrapper-logout {
  top: 61px;
  right: 21px;
}
</style>

<template>
  <div
    class="flex justify-content-around flex-column h-full"
    @click="outsideClick"
  >
    <div class="flex justify-content-between px-3 pt-2">
      <img :src="mobileLogo" width="50" />
      <div class="flex align-items-center">
        <small
          class="user-text pr-2 background-primary text-white px-2 border-round-left"
          >{{ t("Happy Tracking,", { name: "Adalkis" }) }}</small
        >
        <Avatar
          image="https://primefaces.org/cdn/primevue/images/avatar/asiyajavayant.png"
          class="cursor-pointer relative"
          size="large"
          shape="circle"
          @click="isShowDropdown = true"
        />
        <div
          class="wrapper-logout shadow-1 absolute w-10rem py-2"
          v-if="isShowDropdown"
        >
          <router-link to="/sign-in">
            <div
              class="flex cursor-pointer justify-content-center align-items-center dropdown-item"
            >
              <font-awesome-icon
                :icon="['fa', 'right-from-bracket']"
                class="logout-icon fa-1x mr-1 dropdown-item"
              />
              <small class="dropdown-item">{{ t("Logout") }}</small>
            </div>
          </router-link>
        </div>
      </div>
    </div>
    <div class="pt-4 h-full">
      <slot></slot>
    </div>
    <div>
      <MobileMenu class="absolute bottom-0 w-full" :items="menuItems" />
    </div>
  </div>
</template>
