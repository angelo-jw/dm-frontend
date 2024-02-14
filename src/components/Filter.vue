<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";

import Button from "primevue/button";
import Card from "primevue/card";
import Calendar from "primevue/calendar";

import day from "dayjs";

const { t } = useI18n();

const startDate = ref(day().format("YYYY-MM-DD"));
const endDate = ref("");
const maxDate = ref(new Date());

const emit = defineEmits(["startEndDate"]);

const filter = () => {
  emit("onStartEndDate", {
    startDate: day(startDate.value).format("YYYY-MM-DD"),
    endDate: endDate.value ? day(endDate.value).format("YYYY-MM-DD") : "",
  });
};
</script>
<template>
  <Card class="mb-2">
    <template #content>
      <div class="grid">
        <Calendar
          v-model="startDate"
          showIcon
          class="col-12 md:col-5"
          dateFormat="yy-mm-dd"
          :placeholder="t('Start date')"
          :maxDate="maxDate"
        />
        <Calendar
          v-model="endDate"
          showIcon
          class="col-12 md:col-5"
          dateFormat="yy-mm-dd"
          :placeholder="t('End date')"
          :maxDate="maxDate"
        />
        <div class="col-12 md:col-2 flex align-items-center">
          <Button
            icon="pi pi-filter-fill"
            class="h-3rem w-full"
            :label="t('Filter')"
            @click="filter"
          />
        </div>
      </div>
    </template>
  </Card>
</template>
