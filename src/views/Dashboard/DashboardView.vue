<script setup>
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

import ActivitiesToTrack from "./ActivitiesToTrack.vue";
import PerActivity from "./PerActivity.vue";
import SalesDayByWeek from "./SalesByDayWeek.vue";
import TotalSales from "./TotalSales.vue";

import Filter from "../../components/Filter.vue";

import day from "dayjs";

const { t } = useI18n();

const startDate = ref(day().format("YYYY-MM-DD"));
const endDate = ref("");

const getStartEndDate = (event) => {
  startDate.value = event.startDate;
  endDate.value = event.endDate;
};
</script>

<template>
  <div class="h-full">
    <h1 class="uppercase text-color font-bold text-center md:mt-5 mb-2">
      {{ t("Dashboard") }}
    </h1>
    <Filter @onStartEndDate="getStartEndDate" />
    <div class="grid">
      <!-- <div class="col-12 md:col-3">
        <ActivitiesToTrack />
      </div> -->
      <div class="col-12 md:col-5">
        <PerActivity :date="{ startDate, endDate }" />
      </div>
      <div class="col-12 md:col-7">
        <SalesDayByWeek />
      </div>
      <div class="col-12 md:col-12">
        <TotalSales :date="{ startDate, endDate }" />
      </div>
    </div>
  </div>
</template>
