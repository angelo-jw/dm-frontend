<script setup>
import SidebarLayout from './layout/SidebarLayout.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import Toast from "primevue/toast";

const route = useRoute()

const isShowLayout = computed(() => {
  if (route.name == 'sign-in' || route.name == 'sign-up') {
    return false
  }
  return true
})
</script>

<template>
  <Toast /> 
  <SidebarLayout v-if="isShowLayout">
    <RouterView />
  </SidebarLayout>
  <RouterView v-else />
</template>
<!-- <style src="primevue/resources/themes/lara-light-blue/theme.css"></style> -->
<style src="./assets/theme.css"></style>
<style src="primevue/resources/primevue.min.css"></style>
<style src="primeflex/primeflex.css"></style>
<style src="primeicons/primeicons.css"></style>

<style lang="less">
@import '@/assets/main.less';
</style>
