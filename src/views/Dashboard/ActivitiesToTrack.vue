<script setup>
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import CardComponent from "../../components/CardComponent.vue";
const { t } = useI18n();
</script>

<template>
  <CardComponent>
    <template #title>
      <h5 class="font-bold uppercase">{{ t("Activities to track") }}</h5>
    </template>
    <template #content>
      <h4 class="mb-2 mt-2">1. {{ t("Dials") }}</h4>
      <h4 class="mb-2">2. {{ t("DoorKnocks") }}</h4>
      <h4 class="mb-2">3. {{ t("Appointments") }}</h4>
      <h4 class="mb-2">4. {{ t("Presentations") }}</h4>
      <h4>5. {{ t("Recruiting interview") }}</h4>
    </template>
  </CardComponent>
</template>
