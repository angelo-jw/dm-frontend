<script setup>
import { ref, computed, reactive } from "vue";
import { useI18n } from "vue-i18n";

import Button from "primevue/button";
import InputText from "primevue/inputtext";
import { useToast } from "primevue/usetoast";
import Skeleton from "primevue/skeleton";
import Textarea from "primevue/textarea";

import CustomDialog from "../../components/CustomDialog.vue";

import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";

import { useActivitiesService } from "../../services/ActivitiesService";

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
const activitiesService = useActivitiesService();
const toast = useToast();

const carrierOptions = [];

const formData = reactive({
  name: "",
  duration: "",
});
const isLoading = ref(false);

const rules = {
  name: {
    required,
  },
  duration: {
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
        await activitiesService.putActivityType(props.currentRowData.id, {
          ...formData,
        });
      } else {
        await activitiesService.createActivityType({
          ...formData,
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
        detail: `${t("Activity type created successfully")}.`,
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
  const { activityType, duration } = props.currentRowData;
  formData.name = activityType;
  formData.duration = duration;
};
</script>

<template>
  <CustomDialog
    :visible="props.visible"
    :header="t('Create Activity Type')"
    @onChangeVisibleState="emit('onChangeVisibleState', false)"
    @onShow="visibleDialog"
  >
    <form @submit="onSubmit">
      <div class="w-full" v-if="isLoading">
        <Skeleton height="3rem" class="mb-2 w-full"></Skeleton>
        <Skeleton height="4rem" class="mb-2 w-full"></Skeleton>
      </div>
      <div v-else>
        <div class="mb-1">
          <label for="activityType">{{ t("Activity type") }}</label>
          <InputText
            id="activityType"
            v-model="formData.name"
            class="w-8 md:w-full"
            :placeholder="t('Enter activity type')"
          />
          <h5 class="text-red-50 m-0" v-if="v$.name.$error">
            {{ t("Activity type is required") }}
          </h5>
        </div>
        <div class="mb-1">
          <label for="duration">{{ t("Duration") }}</label>
          <InputText
            id="activityType"
            v-model="formData.duration"
            class="w-8 md:w-full"
            type="number"
            placeholder="0"
          />
          <h5 class="text-red-50 m-0" v-if="v$.duration.$error">
            {{ t("Duration is required") }}
          </h5>
        </div>
      </div>
      <div class="flex justify-content-center">
        <Button type="submit" class="h-2rem mt-2" :disabled="isLoading">{{
          props.currentRowData?.id
            ? t("Update Activity Type")
            : t("Create Activity Type")
        }}</Button>
      </div>
    </form>
  </CustomDialog>
</template>
