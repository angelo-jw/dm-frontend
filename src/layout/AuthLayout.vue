<script setup>
import { onMounted } from "vue";

import logo1 from "../assets/logo1.png";

import Card from "primevue/card";

import { useHelper } from "../helpers/helper";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const helper = useHelper();

const isMobile = helper.isMobile();

onMounted(() => {
  let googleLink = document.createElement("script");
  googleLink.setAttribute("src", "https://accounts.google.com/gsi/client");
  document.head.appendChild(googleLink);
});
</script>

<template>
  <div
    class="login-view-wrapper flex flex-column align-items-center w-full h-full relative px-3 md:justify-content-between md:px-0 sm:flex-row"
  >
    <h6
      class="text-color font-light absolute top-0 w-full text-center mt-3"
      v-if="!isMobile"
    >
      {{ t("A") }}
      <i class="font-bold">{{ t("John Wetmore") }} </i>

      {{ t("App") }}
    </h6>
    <div class="wrapper-logo">
      <img class="logo" :src="logo1" />
    </div>
    <slot></slot>
    <Card class="login-card w-full md:w-30rem primary-color md:mr-5 py-0">
      <template #title>
        <slot name="title"></slot>
      </template>
      <template #content>
        <slot name="content"></slot>
      </template>
    </Card>
    <div
      class="flex justify-content-between absolute bottom-0 w-full px-3 pb-4"
    >
      <h6
        class="font-light w-8rem md:w-27rem wrapper-legal-text"
        v-if="!isMobile"
      >
        {{ t("Copyright @ 2024 Wetmore Enterprises. All rights reserved") }}
      </h6>
      <h6 class="font-light w-8rem md:w-27rem wrapper-legal-text" v-else>
        {{ t("Copyright @ 2024 Wetmore Enterprises") }}
      </h6>
      <div class="flex" v-if="!isMobile">
        <h6 class="mr-2 font-light">{{ t("Terms of use") }}</h6>
        <h6 class="mr-2 font-light">{{ t("License Agreement") }}</h6>
        <h6 class="mr-2 font-light">{{ t("Privacy Policy") }}</h6>
        <h6 class="mr-2 font-light">
          {{ t("Copyright Information") }}
        </h6>
        <h6 class="font-light">{{ t("Cookies") }}</h6>
      </div>
      <div v-else class="flex flex-column">
        <h6 class="font-light wrapper-legal-text">
          {{ t("Legal Information") }}
        </h6>
        <h6 class="font-light wrapper-legal-text">
          {{ t("All rights reserve") }}
        </h6>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.login-view-wrapper {
  background-image: url("../assets/success.jpg");
  background-position: center;
  background-size: 100vw 100vh;
  background-repeat: no-repeat;
  overflow: hidden;
  .logo {
    width: 300px;
    height: 300px;
    margin-left: 226px;
  }
  .login-card {
    background-color: var(--primary-color);
  }
}
@media (max-width: 600px) {
  .login-view-wrapper.register-auth-layout {
    background-image: none;
  }
  .login-view-wrapper {
    background-size: 100vw 40vh;
    background-position: bottom;
    .logo {
      width: 100px;
      height: 100px;
      margin-left: 0px;
      margin-top: 10px;
      margin-bottom: 10px;
    }
    .login-card {
      background-color: var(--primary-color);
    }
    .wrapper-legal-text {
      font-size: 7px;
    }
  }
}
</style>
