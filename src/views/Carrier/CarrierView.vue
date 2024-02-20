<script setup>
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column"; // optional
import Row from "primevue/row";

import CreateCarrier from "./CreateCarrier.vue";
import Filter from "../../components/Filter.vue";

import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";

import { useCarrierService } from "../../services/CarrierService";

import day from "dayjs";

const { t } = useI18n();
const toast = useToast();
const carrierService = useCarrierService();

let startDate = day().format("YYYY-MM-DD");
let endDate = "";

const visible = ref(false);
const visibleAlert = ref(false);
const currentPage = ref(0);
const isLoading = ref(false);
const currentRowId = ref(null);

const tableData = ref({
  content: [],
  rows: 10,
  rowsPerPagination: [10, 20, 50],
});

const currentRowData = ref({});
//METHODS
const getPage = async (paginationOptions) => {
  const result = "?" + new URLSearchParams(paginationOptions).toString();
  try {
    const res = await carrierService.getCarriers(result);
    tableData.value.content = res.data.carriers.map((carrier) => {
      const { id, notes, carrier_name } = carrier;
      return {
        id,
        notes,
        carrierName: carrier_name,
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
const onPageChange = async (paginationData) => {
  currentPage.value = paginationData?.page;
  const lastRowData = tableData?.content[tableData?.content?.length - 1];
  getPage({ page: currentPage.value, per_page: 10, last_doc_id: lastRowData });
};

const deleteCarrier = async (id, closeCallback) => {
  try {
    await carrierService.deleteCarrier(id);
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
      detail: `${t("Carrier deleted successfully")}.`,
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
const editRow = (data) => {
  visible.value = true;
  currentRowData.value = data;
};

const showDeleteAlert = (data) => {
  toast.add({
    severity: "custom",
    summary: t("Are you sure to delete carrier", { name: data.carrierName }),
    group: "headless",
  });
  visibleAlert.value = true;
};

watch(visible, (isVisible) => {
  if (!isVisible) {
    currentRowData.value = {};
  }
});

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

<template>
  <div class="h-full">
    <h1 class="uppercase text-color font-bold text-center mt-5 mb-2">
      {{ t("Carriers") }}
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
            class="h-2rem flex align-items-center"
            type="button"
            :label="t('Create carrier')"
            @click="visible = true"
          />
        </div>
      </template>
      <Column field="carrierName" :header="t('Name')" class="w-1 text-sm">
      </Column>
      <Column field="notes" :header="t('Notes')" class="w-1 text-sm"> </Column>
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
                        @click="deleteCarrier(data?.id, closeCallback)"
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
    <CreateCarrier
      :visible="visible"
      :currentRowData="currentRowData"
      @onChangeVisibleState="visible = $event"
      @onGetPage="getPage($event)"
    />
  </div>
</template>
