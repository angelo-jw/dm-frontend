<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";

import DataTable from "primevue/datatable";
import Dropdown from "primevue/dropdown";
import Column from "primevue/column"; // optional
import InputText from "primevue/inputtext";
import Row from "primevue/row";
import Calendar from "primevue/calendar";

import day from "dayjs";

const { t } = useI18n();
const columns = ref([
  {
    field: t("Date"),
    header: t("Date"),
  },
  {
    field: t("Activity"),
    header: t("Activity"),
  },
  {
    field: t("Quantity"),
    header: t("Quantity"),
  },
]);
const customers = ref([
  {
    date: day().format("YYYY-MM-DD"),
    activity: { text: t("Dials"), value: "dials" },
    quantity: 10,
  },
]);
const activeRow = ref("");
const activitiesOption = ref([
  { text: t("Dials"), value: "dials" },
  { text: t("DoorKnocks"), value: "doorknocks" },
  { text: t("Appointments"), value: "appointments" },
]);
const onCellClick = (field, index) => {
  activeRow.value = `${field}-${index}`;
};
const addRow = () => {
  customers.value.push({
    date: day().format("YYYY-MM-DD"),
    activity: activitiesOption.value[0],
    quantity: 0,
  });
};
const outsideClick = (event) => {
  if (event.target.classList.length && activeRow.value) {
    activeRow.value = "";
  }
};
</script>

<style scoped></style>
<template>
  <div @click="outsideClick" class="h-full">
    <h1 class="uppercase text-color font-bold text-center mt-5 mb-2">
      {{ t("Activity tracking") }}
    </h1>
    <DataTable
      :value="customers"
      paginator
      :rows="10"
      :rowsPerPageOptions="[10, 20, 50]"
    >
      <Column field="date" :header="t('Date')" class="w-1 text-sm">
        <template #body="{ index, field, data }">
          <div v-if="activeRow === `${field}-${index}`">
            <Calendar v-model="data.date" />
          </div>
          <div v-else @click="onCellClick(field, index)">
            {{ data.date }}
          </div>
        </template>
      </Column>
      <Column field="activity" :header="t('Activity')" class="w-1 text-sm">
        <template #body="{ field, index, data }">
          <div v-if="activeRow === `${field}-${index}`">
            <Dropdown
              v-model="data.activity"
              optionLabel="text"
              :options="activitiesOption"
              :placeholder="t('Select activity')"
            />
          </div>
          <div v-else @click="onCellClick(field, index)">
            {{ data.activity?.text }}
          </div>
        </template>
      </Column>
      <Column field="quantity" :header="t('Quantity')" class="w-1 text-sm">
        <template #body="{ field, index, data }">
          <div v-if="activeRow === `${field}-${index}`">
            <InputText
              id="email"
              v-model="data.quantity"
              :placeholder="t('Enter quantity')"
              class="w-8 md:w-full"
            />
          </div>
          <div v-else @click="onCellClick(field, index)">
            {{ data.quantity }}
          </div>
        </template>
      </Column>
      <template #footer>
        <div class="flex justify-content-end cursor-pointer" @click="addRow">
          <i class="pi pi-plus-circle" style="font-size: 2rem"></i></div
      ></template>
    </DataTable>
  </div>
</template>
