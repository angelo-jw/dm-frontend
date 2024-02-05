<script setup>
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

import DataTable from "primevue/datatable";
import Dropdown from "primevue/dropdown";
import Column from "primevue/column"; // optional
import InputText from "primevue/inputtext";
import Row from "primevue/row";
import Calendar from "primevue/calendar";

import Filter from "../components/Filter.vue";

import { useActivityTracker } from "../services/ActivityTrackerService";

import { useToast } from "primevue/usetoast";

import day from "dayjs";

let oldRowData = {};
let startDate = day().format("YYYY-MM-DD");
let endDate = "";

const activityTracker = useActivityTracker();
const { t } = useI18n();
const toast = useToast();

const currentPage = ref(0);
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
  content: [],
  rows: 10,
  rowsPerPagination: [10, 20, 50],
});

let defaultRows = {
  [`dials-${day().format("YYYY-MM-DD")}`]: {
    date: day().format("YYYY-MM-DD"),
    activity: { text: t("Dials"), value: "dials" },
    quantity: 0,
  },
  [`doorknocks-${day().format("YYYY-MM-DD")}`]: {
    date: day().format("YYYY-MM-DD"),
    activity: { text: t("DoorKnocks"), value: "doorknocks" },
    quantity: 0,
  },
  [`appointments-${day().format("YYYY-MM-DD")}`]: {
    date: day().format("YYYY-MM-DD"),
    activity: { text: t("Appointments"), value: "appointments" },
    quantity: 0,
  },
};

//METHODS
const getPage = async (paginationOptions) => {
  const result = "?" + new URLSearchParams(paginationOptions).toString();
  try {
    const res = await activityTracker.getActivities(result);
    if (res.data?.activities?.length) {
      const modifyDefaultRows = { ...defaultRows };
      res.data?.activities?.forEach((activity) => {
        const { activity_type, created_time, id, quantity } = activity;
        const formatDate = day(created_time).format("YYYY-MM-DD");
        modifyDefaultRows[`${activity_type}-${formatDate}`] = {
          ...modifyDefaultRows[`${activity_type}-${formatDate}`],
          id,
          quantity,
          date: formatDate,
        };
      });
      tableData.value.content = Object.values(modifyDefaultRows);
      tableData.value.content = tableData.value.content.sort(
        (a, b) => a.date - b.date
      );
    } else {
      if (startDate == day().format("YYYY-MM-DD")) {
        tableData.value.content = Object.values(defaultRows);
      } else {
        tableData.value.content = [];
      }
    }
  } catch (err) {
    if (err.response) {
      toast.add({
        severity: "error",
        detail: `${t(err?.response?.data?.message)}.`,
        sticky: true,
        styleClass: "error",
        closable: false,
        life: 3000,
      });
    }
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
    !event.target?.classList?.contains("p-dropdown-label") &&
    !event.target?.classList.contains("p-inputtext")
  ) {
    activeRow.value = "";
  }
};
const increaseQuantity = (index) => {
  const currentRowData = { ...tableData.value.content[index] };
  oldRowData = currentRowData;
  tableData.value.content.splice(index, 1, {
    ...currentRowData,
    quantity: currentRowData.quantity + 1,
  });
  !currentRowData?.id ? createActivity(index) : updateActivity(index);
};
const decreaseQuantity = (index) => {
  const currentRowData = { ...tableData.value.content[index] };
  oldRowData = currentRowData;
  tableData.value.content.splice(index, 1, {
    ...currentRowData,
    quantity: currentRowData.quantity - 1,
  });
  !currentRowData?.id ? createActivity(index) : updateActivity(index);
};

const createActivity = async (index) => {
  const newRowData = {
    id: null,
    created_time: tableData.value.content[index]?.datel,
    activity_type: tableData.value.content[index]?.activity?.value,
    quantity: tableData.value.content[index].quantity,
  };
  try {
    await activityTracker.postActivities(newRowData);
    getPage({
      page: 0,
      per_page: 10,
      last_doc_id: null,
      start_date: startDate || day().format("YYYY-MM-DD"),
      end_date: endDate,
    });
  } catch (err) {
    toast.add({
      severity: "error",
      detail: `${t(err.response?.data?.message)}.`,
      sticky: true,
      styleClass: "error",
      closable: false,
      life: 3000,
    });
    tableData.value.content.splice(index, 1, oldRowData);
  }
};

const updateActivity = async (index) => {
  const updateRow = {
    activity_type: tableData.value.content[index]?.activity?.value,
    quantity: tableData.value.content[index]?.quantity,
  };
  try {
    await activityTracker.putActivity(
      tableData.value.content[index]?.id,
      updateRow
    );
    getPage({
      page: 0,
      per_page: 10,
      last_doc_id: null,
      start_date: startDate || day().format("YYYY-MM-DD"),
      end_date: endDate,
    });
  } catch (err) {
    toast.add({
      severity: "error",
      detail: `${t(err.response?.data?.message)}.`,
      sticky: true,
      styleClass: "error",
      closable: false,
      life: 3000,
    });
    tableData.value.content.splice(index, 1, oldRowData);
  }
};

const getStartEndDate = (event) => {
  startDate = event.startDate;
  endDate = event.endDate;
  defaultRows = {
    ...defaultRows,
    [`dials-${startDate}`]: {
      ...defaultRows.dials,
      date: startDate,
    },
    [`doorknocks-${startDate}`]: {
      ...defaultRows.doorknocks,
      date: startDate,
    },
    [`appointments-${startDate}`]: {
      ...defaultRows.appointments,
      date: startDate,
    },
  };
  isLoading.value = true;
  getPage({
    page: 0,
    per_page: 10,
    last_doc_id: null,
    start_date: startDate || day().format("YYYY-MM-DD"),
    end_date: endDate,
  });
};
onMounted(() => {
  isLoading.value = true;
  getPage({
    page: 0,
    per_page: 10,
    last_doc_id: null,
    start_date: day().format("YYYY-MM-DD"),
  });
});
</script>

<style scoped></style>
<template>
  <div @click="outsideClick" class="h-full">
    <h1 class="uppercase text-color font-bold text-center mt-5 mb-2">
      {{ t("Activity tracking") }}
    </h1>
    <Filter @onStartEndDate="getStartEndDate" />
    <DataTable
      :value="tableData.content"
      paginator
      currentPageReportTemplate="{ currentPage }"
      :rows="tableData.rows"
      :rowsPerPageOptions="tableData.rowsPerPageOptions"
      :loading="isLoading"
      @page="onPageChange"
    >
      <template #empty>
        <h4 class="flex justify-content-center">
          {{ t("No activities recorded on this day") }}
        </h4>
      </template>
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
          <div class="flex align-items-center">
            <i
              class="pi pi-minus-circle mr-1"
              style="font-size: 1.3rem"
              @click="decreaseQuantity(index)"
            ></i>
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

            <i
              class="pi pi-plus-circle ml-1"
              style="font-size: 1.3rem"
              @click="increaseQuantity(index)"
            ></i>
          </div>
        </template>
      </Column>
      <!-- <template #footer>
        <div class="flex justify-content-end cursor-pointer" @click="addRow">
          <i class="pi pi-plus-circle" style="font-size: 1.3rem"></i></div
      ></template> -->
    </DataTable>
  </div>
</template>
