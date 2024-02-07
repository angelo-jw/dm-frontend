<script setup>
import { ref, computed, reactive } from "vue";
import { useI18n } from "vue-i18n";

import Button from "primevue/button";
import InputText from "primevue/inputtext";
import { useToast } from "primevue/usetoast";
import Skeleton from "primevue/skeleton";
import Textarea from "primevue/textarea";

import CustomDialog from "../../components/CustomDialog.vue";

import { required } from "../../../node_modules/@vuelidate/validators";
import { useVuelidate } from "../../../node_modules/@vuelidate/core";

import { useCarrierService } from "../../services/CarrierService";

import day from "dayjs";
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  currentRowData: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["onGetPage", "onChangeVisibleState"]);

const { t } = useI18n();
const carrierService = useCarrierService();
const toast = useToast();

const carrierOptions = [];

const formData = reactive({
  carrierName: "",
  notes: "",
});
const isLoading = ref(false);

const rules = {
  carrierName: {
    required,
  },
};
const v$ = useVuelidate(rules, formData);
const result = ref(true);

//METHODS
const onSubmit = async (e) => {
  e.preventDefault();
  result.value = await v$.value.$validate();
  if (result.value) {
    try {
      isLoading.value = true;
      if (props.currentRowData?.id) {
        await carrierService.updateCarrier(props.currentRowData.id, {
          carrier_name: formData.carrierName,
          notes: formData.notes,
        });
      } else {
        await carrierService.createCarrier({
          carrier_name: formData.carrierName,
          notes: formData.notes,
        });
      }
      emit("onChangeVisibleState", false);
      emit("onGetPage", {
        page: 0,
        per_page: 10,
        last_doc_id: null,
        start_date: day().format("YYYY-MM-DD"),
      });
      toast.add({
        severity: "",
        summary: "",
        detail: `${t("Carrier created successfully")}.`,
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
    } finally {
      isLoading.value = false;
    }
  }
};
const visibleDialog = () => {
  const { carrierName, notes } = props.currentRowData;
  formData.carrierName = carrierName;
  formData.notes = notes;
};
</script>

<template>
  <CustomDialog
    :visible="props.visible"
    :header="t('Carrier information')"
    @onChangeVisibleState="emit('onChangeVisibleState', false)"
    @onShow="visibleDialog"
  >
    <form @submit="onSubmit">
      <div class="w-full" v-if="isLoading">
        <Skeleton height="3rem" class="mb-2 w-full"></Skeleton>
        <Skeleton height="10rem" class="mb-2"></Skeleton>
      </div>
      <div v-else>
        <div class="mb-1">
          <label for="carrier">{{ t("Carrier") }}</label>
          <InputText
            id="carrier"
            v-model="formData.carrierName"
            class="w-8 md:w-full"
            :placeholder="t('Enter carrier')"
          />
          <h5 class="text-red-50 m-0" v-if="v$.carrierName.$error">
            {{ t("Carrier is required") }}
          </h5>
        </div>
        <div class="mb-1">
          <label for="notes">{{ t("Notes") }}</label>
          <Textarea
            v-model="formData.notes"
            rows="5"
            class="w-full"
            id="notes"
            :placeholder="t('Enter note')"
          />
        </div>
      </div>
      <div class="flex justify-content-center">
        <Button
          type="submit"
          class="h-2rem mt-2"
          :disabled="isLoading || !result"
          >{{
            props.currentRowData?.carrierName
              ? t("Update carrier")
              : t("Create carrier")
          }}</Button
        >
      </div>
    </form>
  </CustomDialog>
</template>
