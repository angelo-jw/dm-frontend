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
import CreateActivitiyType from "../Activities/CreateActivitiyType.vue";

import { useActivityTracker } from "../../services/ActivityTrackerService";

import { required } from "../../../node_modules/@vuelidate/validators";
import { useVuelidate } from "../../../node_modules/@vuelidate/core";

import day from "dayjs";
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  activitiesTypeOptions: {
    type: Array,
    default: () => [],
  },
  isLoadingActivitiesModal: {
    type: Boolean,
    default: false,
  },
  currentRowData: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits([
  "onGetPage",
  "onChangeVisibleState",
  "onGetActivitiesTypeOptions",
]);

const { t } = useI18n();
const activityTracker = useActivityTracker();
const toast = useToast();

const isCreateActivityTypeVisible = ref(false);
const form = ref({
  date: day().format("YYYY-MM-DD"),
  activity: props.activitiesTypeOptions.length
    ? props.activitiesTypeOptions[1]
    : null,
  quantity: 0,
});
const rules = {
  quantity: {
    required,
  },
};
const result = ref(false);
const v$ = useVuelidate(rules, form);
const isLoading = ref(props.isLoadingActivitiesModal);

//METHODS
const onChangeOption = (event) => {
  if (event.value.text == "Create Custom") {
    isCreateActivityTypeVisible.value = true;
    form.value.activity = props.currentRowData?.id
      ? {
          text: props.currentRowData?.activity,
          value: props.currentRowData?.activity,
        }
      : props.activitiesTypeOptions[1];
  }
};

const onSubmit = async (e) => {
  e.preventDefault();
  result.value = await v$.value.$validate();
  if (result.value) {
    const activityData = {
      created_time: day(form.value.date).format("YYYY-MM-DD"),
      activity_type: form.value.activity?.value,
      quantity: form.value?.quantity,
    };
    try {
      isLoading.value = true;
      if (props.currentRowData?.id) {
        await activityTracker.putActivity(
          props.currentRowData?.id,
          activityData
        );
      } else {
        await activityTracker.postActivities({ ...activityData, id: null });
      }

      emit("onGetPage", {
        page: 0,
        per_page: 10,
        last_doc_id: null,
        start_date: day().format("YYYY-MM-DD"),
      });
      emit("onChangeVisibleState", false);
    } catch (err) {
      toast.add({
        severity: "error",
        detail:
          err?.response?.data?.message ||
          `${t("There was an error, please try again")}.`,
        sticky: true,
        styleClass: "error",
        closable: false,
        life: 3000,
      });
    } finally {
      isLoading.value = false;
    }
  }
};

const addDefaultFormData = () => {
  if (props.currentRowData?.id) {
    const { id, activity, date, quantity } = props.currentRowData;
    form.value = {
      id,
      activity: {
        text: activity,
        value: activity,
      },
      date,
      quantity,
    };
  } else {
    form.value = {
      date: day().format("YYYY-MM-DD"),
      activity: props.activitiesTypeOptions.length
        ? props.activitiesTypeOptions[1]
        : null,
      quantity: 0,
    };
  }
};
</script>

<template>
  <CustomDialog
    :visible="props.visible"
    customClass="create-activities"
    :header="props.currentRow?.id ? t('Update activity') : t('Create activity')"
    @onChangeVisibleState="emit('onChangeVisibleState', false)"
    @show="addDefaultFormData"
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
          :options="props.activitiesTypeOptions"
          :placeholder="t('Select activity')"
          @change="onChangeOption"
        >
          <template #option="slotProps">
            <h4
              v-if="slotProps.option.text == 'Create Custom'"
              class="font-semibold text-color"
            >
              {{ slotProps.option.text }}
            </h4>
            <h4 v-else>{{ slotProps.option.text }}</h4>
          </template>
        </Dropdown>
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
          props.currentRowData.id ? t("Update") : t("Create")
        }}</Button>
      </div>
    </form>
  </CustomDialog>
  <CreateActivitiyType
    :visible="isCreateActivityTypeVisible"
    @onChangeVisibleState="isCreateActivityTypeVisible = $event"
    @onLoading="isLoading = $event"
    @onGetPage="emit('onGetActivitiesTypeOptions')"
  />
</template>
