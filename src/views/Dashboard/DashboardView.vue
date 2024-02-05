<script setup>
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

import ActivitiesToTrack from "./ActivitiesToTrack.vue";
import PerActivity from "./PerActivity.vue";
import SalesDayByWeek from "./SalesByDayWeek.vue";
import TotalSales from "./TotalSales.vue";

import Filter from "../../components/Filter.vue";

import { useDashboardService } from "../../services/DashboardService";

const { t } = useI18n();
const dashboardService = useDashboardService();

const getStartEndDate = (event) => {
  startDate = event.startDate;
  endDate = event.endDate;
};
</script>

<template>
  <div>
    <h1 class="uppercase text-color font-bold text-center mt-5 mb-2">
      {{ t("Dashboard") }}
    </h1>
    <Filter @onStartEndDate="getStartEndDate" />
    <div class="grid">
      <div class="col-12 md:col-3">
        <ActivitiesToTrack />
      </div>
      <div class="col-12 md:col-3">
        <PerActivity :startDate="startDate" :endDate="endDate" />
      </div>
      <div class="col-12 md:col-6">
        <SalesDayByWeek />
      </div>
      <div class="col-12">
        <TotalSales :startDate="startDate" :endDate="endDate" />
      </div>
    </div>
  </div>
</template>
