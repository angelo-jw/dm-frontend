<script setup>
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

import DataTable from "primevue/datatable";
import Dropdown from "primevue/dropdown";
import Column from "primevue/column"; // optional
import InputText from "primevue/inputtext";
import Row from "primevue/row";
import Calendar from "primevue/calendar";

import { useActivityTracker } from "../services/ActivityTrackerService";

import day from "dayjs";

const activityTracker = useActivityTracker();
const { t } = useI18n();

const isLoading = ref(false);
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
const activeRow = ref("");
const activitiesOption = ref([
  { text: t("Dials"), value: "dials" },
  { text: t("DoorKnocks"), value: "doorknocks" },
  { text: t("Appointments"), value: "appointments" },
]);
const tableData = ref({
  content: [
    {
      date: day().format("YYYY-MM-DD"),
      activity: { text: t("Dials"), value: "dials" },
      quantity: 10,
    },
    {
      date: day().format("YYYY-MM-DD"),
      activity: { text: t("Dials"), value: "dials" },
      quantity: 10,
    },
  ],
  rows: 10,
  rowsPerPagination: [10, 20, 50],
});

//METHODS
const addRow = async () => {
  const newRowData = {
    activity: activitiesOption.value[0],
    quantity: 0,
  };
  tableData.value.content.push({
    ...newRowData,
    date: day().format("YYYY-MM-DD"),
  });

  try {
    isLoading.value = true;
    const res = await activityTracker.postActivities(newRowData);
    // tableData.value = res;
  } catch {
    toast.add({
      severity: "error",
      detail: `${t(response?.data?.message)}.`,
      sticky: true,
      styleClass: "error",
      closable: false,
      life: 3000,
    });
    tableData.value.splice(tableData.content.length - 1, 1);
  } finally {
    isLoading.value = false;
  }
};

const getPage = async (paginationOptions) => {
  const result = "?" + new URLSearchParams(paginationOptions).toString();
  try {
    isLoading.value = true;
    const res = await activityTracker.getActivities(result);
    // tableData.value = res;
  } catch {
    toast.add({
      severity: "error",
      detail: `${t(response?.data?.message)}.`,
      sticky: true,
      styleClass: "error",
      closable: false,
      life: 3000,
    });
  } finally {
    isLoading.value = false;
  }
};

const onCellClick = (field, index) => {
  activeRow.value = `${field}-${index}`;
};

const onPageChange = async (paginationData) => {
  currentPage.value = paginationData?.page;
  const lastRowData = tableData?.content[tableData?.content?.length - 1];
  getPage({ page: currentPage.value, per_page: 10, last_doc_id: lastRowData });
};

const outsideClick = (event) => {
  if (
    !event.target?.classList?.contains("rowVal") &&
    !event.target?.classList?.contains("p-dropdown-label")
  ) {
    activeRow.value = "";
  }
};

onMounted(() => {
  getPage({ page: 0, per_page: 10, last_doc_id: null });
});
</script>

<style scoped></style>
<template>
  <div @click="outsideClick" class="h-full">
    <h1 class="uppercase text-color font-bold text-center mt-5 mb-2">
      {{ t("Activity tracking") }}
    </h1>
    <DataTable
      :value="tableData.content"
      paginator
      currentPageReportTemplate="{ currentPage }"
      :rows="tableData.rows"
      :rowsPerPageOptions="tableData.rowsPerPageOptions"
      :loading="isLoading"
      @page="onPageChange"
    >
      <Column field="date" :header="t('Date')" class="w-1 text-sm">
        <template #body="{ index, field, data }">
          <div v-if="activeRow === `${field}-${index}`" class="rowVal w-full">
            <Calendar
              v-model="data.date"
              class="w-full rowVal"
              dateFormat="yy-mm-dd"
            />
          </div>
          <div v-else @click="onCellClick(field, index)" class="rowVal">
            {{ day(data.date)?.format("YYYY-MM-DD") }}
          </div>
        </template>
      </Column>
      <Column field="activity" :header="t('Activity')" class="w-1 text-sm">
        <template #body="{ field, index, data }">
          <div v-if="activeRow === `${field}-${index}`" class="rowVal w-full">
            <Dropdown
              v-model="data.activity"
              class="w-full rowVal"
              optionLabel="text"
              :options="activitiesOption"
              :placeholder="t('Select activity')"
            />
          </div>
          <div v-else @click="onCellClick(field, index)" class="rowVal">
            {{ data.activity?.text }}
          </div>
        </template>
      </Column>
      <Column field="quantity" :header="t('Quantity')" class="w-1 text-sm">
        <template #body="{ field, index, data }">
          <div v-if="activeRow === `${field}-${index}`" class="rowVal">
            <InputText
              id="email"
              v-model="data.quantity"
              :placeholder="t('Enter quantity')"
              class="w-8 md:w-full rowVal"
            />
          </div>
          <div v-else @click="onCellClick(field, index)" class="rowVal">
            {{ data.quantity }}
          </div>
        </template>
      </Column>
      <template #footer>
        <div class="flex justify-content-end cursor-pointer" @click="addRow">
          <i class="pi pi-plus-circle" style="font-size: 1.3rem"></i></div
      ></template>
    </DataTable>
  </div>
</template>
