<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";

import Button from "primevue/button";
import Card from "primevue/card";
import Calendar from "primevue/calendar";

import ActivitiesToTrack from "./ActivitiesToTrack.vue";
import PerActivity from "./PerActivity.vue";
import SalesDayByWeek from "./SalesByDayWeek.vue";
import TotalSales from "./TotalSales.vue";

const { t } = useI18n();

const startDate = ref("");
const endDate = ref("");
</script>

<template>
  <div>
    <h1 class="uppercase text-color font-bold text-center mt-5 mb-2">
      {{ t("Dashboard") }}
    </h1>
    <Card>
      <template #content>
        <div class="grid">
          <Calendar
            v-model="startDate"
            showIcon
            class="col-12 md:col-5"
            dateFormat="yy-mm-dd"
            :placeholder="t('Start date')"
          />
          <Calendar
            v-model="endDate"
            showIcon
            class="col-12 md:col-5"
            dateFormat="yy-mm-dd"
            :placeholder="t('End date')"
          />
          <div class="col-12 md:col-2 flex align-items-center">
            <Button
              icon="pi pi-filter-fill"
              class="h-3rem w-full"
              :label="t('Filter')"
            />
          </div>
        </div>
      </template>
    </Card>
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
