<script setup>
import { ref, computed, reactive, onMounted } from "vue";
import { useI18n } from "vue-i18n";

import Button from "primevue/button";
import Calendar from "primevue/calendar";
import Checkbox from "primevue/checkbox";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import { useToast } from "primevue/usetoast";
import Skeleton from "primevue/skeleton";

import CustomDialog from "../../components/CustomDialog.vue";

import { required } from "../../../node_modules/@vuelidate/validators";
import { useVuelidate } from "../../../node_modules/@vuelidate/core";

import { usePaymentsService } from "../../services/PaymentsService";
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
const paymentsService = usePaymentsService();
const carrierService = useCarrierService();
const toast = useToast();

const carrierOptions = ref([]);

const formData = reactive({
  date: day().format("YYYY-MM-DD"),
  amount: 0,
  carrier: null,
  comission: false,
});
const isLoading = ref(false);

const rules = {
  amount: {
    required,
  },
  carrier: {
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
        await paymentsService.updatePayment(props.currentRowData?.id, {
          created_time: formData.date,
          amount: formData.amount,
          carrier_id: formData.carrier,
          door_knock_commission: formData.comission,
        });
      } else {
        await paymentsService.createPayment({
          created_time: day(formData.date).format("YYYY-MM-DD"),
          amount: formData.amount,
          carrier_id: formData.carrier,
          door_knock_commission: formData.comission,
        });
      }
      emit("onChangeVisibleState", false);
      emit("onGetPage", {
        page: 1,
        per_page: 10,
        last_doc_id: null,
        start_date: day().format("YYYY-MM-DD"),
      });
      toast.add({
        severity: "",
        summary: "",
        detail: props.currentRowData.id
          ? `${t("Deposit updated successfully")}.`
          : `${t("Deposit created successfully")}.`,
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

const getCarriers = () => {
  const { date, amount, carrierRef, comission } = props.currentRowData;
  formData.date = day(date).format("YYYY-MM-DD");
  formData.amount = amount || 0;
  formData.carrier = carrierRef;
  formData.comission = comission || false;

  getCarrierOptions();
};
const getCarrierOptions = async () => {
  try {
    isLoading.value = true;
    const res = await carrierService.getCarriers();
    if (res.data.carriers.length) {
      carrierOptions.value = res.data.carriers.map((carrier) => {
        return {
          text: carrier.carrier_name,
          value: carrier.id,
        };
      });
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
    isLoading.value = false;
  }
};
</script>

<template>
  <CustomDialog
    :visible="props.visible"
    :header="t('Create deposit')"
    @onChangeVisibleState="emit('onChangeVisibleState', false)"
    @show="getCarriers"
  >
    <form @submit="onSubmit">
      <div class="w-full" v-if="isLoading">
        <Skeleton height="3rem" class="mb-2 w-full"></Skeleton>
        <Skeleton height="3rem" class="mb-2"></Skeleton>
        <Skeleton height="3rem" class="mb-2"></Skeleton>
      </div>
      <div v-else>
        <div>
          <label for="date">{{ t("Date") }}</label>
          <Calendar
            v-model="formData.date"
            class="w-full mb-3"
            id="date"
            dateFormat="yy-mm-dd"
          />
        </div>
        <div class="mb-1">
          <label for="amount">{{ t("Amount") }}</label>
          <InputText
            id="amount"
            v-model="formData.amount"
            class="w-8 md:w-full"
          />
          <h5 class="text-red-50 m-0" v-if="v$.amount.$error">
            {{ t("Amount is required") }}
          </h5>
        </div>
        <div class="mb-1">
          <label for="carrier">{{ t("Carrier") }}</label>
          <Dropdown
            v-model="formData.carrier"
            class="w-full"
            id="carrier"
            optionLabel="text"
            optionValue="value"
            :options="carrierOptions"
            :placeholder="t('Select carrier')"
          />
          <h5 class="text-red-50 m-0" v-if="v$.carrier.$error">
            {{ t("Carrier is required") }}
          </h5>
        </div>

        <div class="flex align-items-center">
          <Checkbox
            v-model="formData.comission"
            inputId="comission"
            name="comission"
            :binary="true"
          />
          <label for="comission" class="ml-2">
            {{ t("Doorknocks Comission") }}
          </label>
        </div>
      </div>
      <div class="flex justify-content-center">
        <Button type="submit" class="h-2rem mt-2" :disabled="isLoading">{{
          props.currentRowData.id ? t("Update") : t("Create")
        }}</Button>
      </div>
    </form>
  </CustomDialog>
</template>
