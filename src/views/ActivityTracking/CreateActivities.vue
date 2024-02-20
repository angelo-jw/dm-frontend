<script setup>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";

import Button from "primevue/button";
import Calendar from "primevue/calendar";
import Dropdown from "primevue/dropdown";
import InputText from "primevue/inputtext";
import { useToast } from "primevue/usetoast";
import Skeleton from "primevue/skeleton";

import CustomDialog from "../../components/CustomDialog.vue";

import { useActivityTracker } from "../../services/ActivityTrackerService";

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
});

const emit = defineEmits(["onGetPage", "onChangeVisibleState"]);

const { t } = useI18n();
const activityTracker = useActivityTracker();
const toast = useToast();

const form = ref({
  date: day().format("YYYY-MM-DD"),
  activity: props.activitiesTypeOptions.length
    ? props.activitiesTypeOptions[0]
    : null,
  quantity: 0,
});
const isLoading = ref(false);

//METHODS
const onSubmit = async (e) => {
  e.preventDefault();
  const newRowData = {
    id: null,
    created_time: day(form.value.date).format("YYYY-MM-DD"),
    activity_type: form.value.activity.value,
    quantity: form.value.quantity,
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
          :options="props.activitiesTypeOptions"
          :placeholder="t('Select activity')"
        />
        <InputText
          id="quantity"
          v-model="form.quantity"
          :placeholder="t('Enter quantity')"
          class="w-8 md:w-full mb-3"
        />
      </div>
      <div class="flex justify-content-center">
        <Button type="submit" class="h-2rem" :disabled="isLoading">{{
          t("Create")
        }}</Button>
      </div>
    </form>
  </CustomDialog>
</template>
