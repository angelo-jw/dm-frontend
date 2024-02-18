<script setup>
import { ref, computed, reactive } from "vue";
import { useI18n } from "vue-i18n";

import Button from "primevue/button";
import Calendar from "primevue/calendar";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import { useToast } from "primevue/usetoast";
import Skeleton from "primevue/skeleton";

import CustomDialog from "../../components/CustomDialog.vue";

import { useActivityTracker } from "../../services/ActivityTrackerService";

import { required } from "../../../node_modules/@vuelidate/validators";
import { useVuelidate } from "../../../node_modules/@vuelidate/core";

import day from "dayjs";
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["onGetPage", "onChangeVisibleState"]);

const { t } = useI18n();
const activityTracker = useActivityTracker();
const toast = useToast();

const activitiesOption = [
  { text: t("Dials"), value: "dials" },
  { text: t("DoorKnocks"), value: "doorknocks" },
  { text: t("Appointments"), value: "appointments" },
  { text: t("Recruiting interviews"), value: "recruiting_interviews" },
  { text: t("Presentations"), value: "presentations" },
];

const form = reactive({
  date: day().format("YYYY-MM-DD"),
  activity: activitiesOption[0],
  quantity: null,
});
const rules = {
  quantity: {
    required,
  },
};
const result = ref(false);
const v$ = useVuelidate(rules, form);
const isLoading = ref(false);

//METHODS
const onSubmit = async (e) => {
  e.preventDefault();
  result.value = await v$.value.$validate();
  if (result.value) {
    const newRowData = {
      id: null,
      created_time: day(form.date).format("YYYY-MM-DD"),
      activity_type: form.activity.value,
      quantity: form.quantity,
    };
    try {
      isLoading.value = true;
      await activityTracker.postActivities(newRowData);
      emit("onGetPage", {
        page: 0,
        per_page: 10,
        last_doc_id: null,
        start_date: day().format("YYYY-MM-DD"),
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
    } finally {
      isLoading.value = false;
      emit("onChangeVisibleState", false);
    }
  }
};
</script>

<template>
  <CustomDialog
    :visible="props.visible"
    customClass="create-activities"
    :header="t('Create activity')"
    @onChangeVisibleState="emit('onChangeVisibleState', false)"
  >
    <form @submit="onSubmit">
      <div class="w-full" v-if="isLoading">
        <Skeleton height="3rem" class="mb-2 w-full"></Skeleton>
        <Skeleton height="3rem" class="mb-2"></Skeleton>
        <Skeleton height="3rem" class="mb-2"></Skeleton>
      </div>
      <div v-else>
        <Calendar
          v-model="form.date"
          class="w-full mb-3"
          dateFormat="yy-mm-dd"
        />
        <Dropdown
          v-model="form.activity"
          class="w-full mb-3"
          optionLabel="text"
          :options="activitiesOption"
          :placeholder="t('Select activity')"
        />
        <div class="mb-3">
          <InputText
            id="quantity"
            v-model="form.quantity"
            placeholder="0"
            class="w-8 md:w-full"
            type="number"
          />
          <h5 class="text-red-50 m-0" v-if="v$.quantity.$error">
            {{ t("Quantity is required") }}
          </h5>
        </div>
      </div>
      <div class="flex justify-content-center">
        <Button type="submit" class="h-2rem" :disabled="isLoading">{{
          t("Create")
        }}</Button>
      </div>
    </form>
  </CustomDialog>
</template>
