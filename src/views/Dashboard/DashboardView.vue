<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";

import ActivitiesToTrack from "./ActivitiesToTrack.vue";
import PerActivity from "./PerActivity.vue";
import SalesDayByWeek from "./SalesByDayWeek.vue";
import TotalSales from "./TotalSales.vue";

import Filter from "../../components/Filter.vue";

const { t } = useI18n();
</script>

<template>
  <div>
    <h1 class="uppercase text-color font-bold text-center mt-5 mb-2">
      {{ t("Dashboard") }}
    </h1>
    <Filter />
    <div class="grid">
      <div class="col-12 md:col-3">
        <ActivitiesToTrack />
      </div>
      <div class="col-12 md:col-3">
        <PerActivity />
      </div>
      <div class="col-12 md:col-6">
        <SalesDayByWeek />
      </div>
      <div class="col-12">
        <TotalSales />
      </div>
    </div>
  </div>
</template>
