<script setup>
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Dropdown from "primevue/dropdown";
import Column from "primevue/column"; // optional
import InputText from "primevue/inputtext";
import Row from "primevue/row";
import Calendar from "primevue/calendar";

import CreateActivities from "./CreateActivities.vue";
import Filter from "../../components/Filter.vue";

import { useActivityTracker } from "../../services/ActivityTrackerService";
import { useActivitiesService } from "../../services/ActivitiesService";

import { useToast } from "primevue/usetoast";

import day from "dayjs";

const activitiesService = useActivitiesService();

let oldRowData = {};
let startDate = day().format("YYYY-MM-DD");
let endDate = "";

const activityTracker = useActivityTracker();
const { t } = useI18n();
const toast = useToast();

const visible = ref(false);
const currentPage = ref(0);
const isLoading = ref(false);
const visibleAlert = ref(false);
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
const activitiesTypeOptions = ref([
  { text: t("Custom") },
  { text: t("Dials"), value: "Dials" },
  { text: t("DoorKnocks"), value: "DoorKnocks" },
  { text: t("Appointments"), value: "Appointments" },
  { text: t("Presentations"), value: "Presentations" },
  { text: t("Recruiting interviews"), value: "Recruiting interviews" },
]);
const tableData = ref({
  content: [],
  rows: 10,
  rowsPerPagination: [10, 20, 50],
});
const isLoadingActivitiesModal = ref(false);
const currentRowData = ref({});

//METHODS
const getPage = async (paginationOptions) => {
  const result = "?" + new URLSearchParams(paginationOptions).toString();
  try {
    const res = await activityTracker.getActivities(result);
    tableData.value.content = res.data.activities.map((activity) => {
      const { created_time, id, quantity, activity_type } = activity;
      return {
        date: day(created_time).format("YYYY-MM-DD"),
        activity: activity_type,
        quantity,
        id,
      };
    });
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

const getStartEndDate = (event) => {
  startDate = event.startDate;
  endDate = event.endDate;
  isLoading.value = true;
  getPage({
    page: 0,
    per_page: 10,
    last_doc_id: null,
    start_date: startDate || day().format("YYYY-MM-DD"),
    end_date: endDate,
  });
};

const getActivitiesTypeOptions = async () => {
  try {
    isLoadingActivitiesModal.value = true;
    const res = await activitiesService.getActivitiesType();
    if (res.data?.activity_types?.length) {
      const activityTypes = res.data.activity_types.map((activityType) => {
        const { id, name } = activityType;
        return {
          text: name,
          value: name,
        };
      });
      activitiesTypeOptions.value = [
        ...activitiesTypeOptions.value,
        ...activityTypes,
      ];
    }
  } catch (err) {
    if (err.response) {
      toast.add({
        severity: "error",
        detail: t(err.response?.data?.message),
        sticky: true,
        styleClass: "error",
        closable: false,
        life: 3000,
      });
    }
  } finally {
    isLoadingActivitiesModal.value = false;
  }
};
const editRow = (data) => {
  visible.value = true;
  currentRowData.value = data;
};

const showDeleteAlert = (data) => {
  toast.add({
    severity: "custom",
    summary: t("Are you sure to delete", { name: data.activity }),
    group: "headless",
  });
  visibleAlert.value = true;
};

const deleteActivity = async (id, closeCallback) => {
  try {
    await activityTracker.deleteActivity(id);
    getPage({
      page: 0,
      per_page: 10,
      last_doc_id: null,
      start_date: day().format("YYYY-MM-DD"),
    });
    closeCallback();
    toast.add({
      severity: "",
      summary: "",
      detail: `${t("Activity deleted successfully")}.`,
      sticky: true,
      styleClass: "success",
      closable: false,
      life: 5000,
    });
  } catch (err) {
    if (err.response) {
      toast.add({
        severity: "error",
        detail: t(err.response?.data?.message),
        sticky: true,
        styleClass: "error",
        closable: false,
        life: 3000,
      });
    }
  }
};

watch(visible, (isVisible) => {
  if (!isVisible) {
    currentRowData.value = {};
  }
});

onMounted(async () => {
  isLoading.value = true;
  await getActivitiesTypeOptions();
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
      <template #header>
        <div class="flex justify-content-end">
          <Button
            class="h-2rem"
            type="button"
            :label="t('Create')"
            @click="visible = true"
          />
        </div>
      </template>
      <template #empty>
        <h4 class="flex justify-content-center">
          {{ t("No activities recorded on this day") }}
        </h4>
      </template>
      <Column field="date" :header="t('Date')" class="w-1 text-sm"> </Column>
      <Column field="activity" :header="t('Activity')" class="w-1 text-sm">
      </Column>
      <Column
        field="quantity"
        :header="t('Quantity')"
        class="w-1 text-sm"
      ></Column>
      <Column field="actions" :header="t('Actions')" class="w-1 text-sm">
        <template #body="{ data }">
          <div>
            <i
              class="pi pi-pencil mr-3 cursor-pointer"
              @click="editRow(data)"
            ></i>
            <i
              class="pi pi-trash cursor-pointer"
              @click="showDeleteAlert(data)"
            ></i>
            <Toast
              position="center"
              group="headless"
              @close="visibleAlert = false"
              class="custom-toast"
            >
              <template #container="{ message, closeCallback }">
                <section
                  class="flex p-3 gap-3 w-full wrapper-section"
                  style="border-radius: 10px"
                >
                  <div
                    class="flex flex-column gap-3 w-full justify-content-center align-items-center"
                  >
                    <p class="m-0 font-semibold text-base text-color">
                      {{ message.summary }}
                    </p>
                    <p class="m-0 text-base text-700">{{ message.detail }}</p>
                    <div class="flex gap-3 mb-3">
                      <Button
                        label="Yes"
                        text
                        class="py-1 px-2 primary"
                        @click="deleteActivity(data?.id, closeCallback)"
                      ></Button>
                      <Button
                        label="No"
                        text
                        class="text-white py-1 px-2"
                        @click="closeCallback"
                      ></Button>
                    </div>
                  </div>
                </section>
              </template>
            </Toast>
          </div>
        </template>
      </Column>
    </DataTable>
    <CreateActivities
      :currentRowData="currentRowData"
      :isLoadingActivitiesModal="isLoadingActivitiesModal"
      :visible="visible"
      :activitiesTypeOptions="activitiesTypeOptions"
      @onChangeVisibleState="visible = $event"
      @onGetPage="getPage($event)"
      @onGetActivitiesTypeOptions="getActivitiesTypeOptions"
    />
  </div>
</template>
