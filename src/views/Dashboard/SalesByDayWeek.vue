<script setup>
import { ref, onMounted, watch } from "vue";
import { useI18n } from "vue-i18n";

import CardComponent from "../../components/CardComponent.vue";

import { Chart } from "highcharts-vue";
import Highcharts from "highcharts";
import highchartsMore from "highcharts/highcharts-more";

import { useDashboardService } from "../../services/DashboardService";

import Skeleton from "primevue/skeleton";
import { useToast } from "primevue/usetoast";

import day from "dayjs";

highchartsMore(Highcharts);

const props = defineProps({
  date: {
    type: Object,
    default: () => ({ startDate: day().format("YYYY-MM-DD"), endDate: "" }),
  },
});

const { t } = useI18n();
const toast = useToast();
const dashboardService = useDashboardService();

const total = ref(0);

const isLoading = ref(true);
const chartOptions = ref({
  chart: {
    type: "columnpyramid",
    height: 250,
  },
  title: {
    text: t("Sales by day of the week"),
    style: {
      fontWeight: "bold",
      color: "#4b5563",
      fontSize: "19px",
      fontFamily: "Poppins",
      textTransform: "Uppercase",
    },
    align: "left",
  },
  subtitle: {
    style: { fontSize: "12px" },
    align: "left",
  },
  colors: [
    "#234A72",
    "#346da7f7",
    "#306091f7",
    "#4c8cccf7",
    "#56a0e9f7",
    "#399dfff7",
    "#E9EEF9",
  ],
  xAxis: {
    crosshair: true,
    labels: {
      style: {
        fontSize: "14px",
      },
    },
    type: "category",
  },
  yAxis: {
    min: 0,
    title: {
      text: `${t("Amount")} ($)`,
    },
  },
  tooltip: {
    valueSuffix: " $",
  },
  series: [
    {
      name: t("Amount"),
      colorByPoint: true,
      data: [],
      showInLegend: false,
    },
  ],
});

const getSalesByDayWeek = async () => {
  const result =
    "?" +
    new URLSearchParams({
      start_date: props.date.startDate,
      end_date: props.date.endDate,
    }).toString();
  try {
    isLoading.value = true;
    const res = await dashboardService.getSalesByWeekDay(result);
    const weekDays = {
      Sunday: ["Sunday", 0],
      Monday: ["Monday", 0],
      Tuesday: ["Tuesday", 0],
      Wednesday: ["Wednesday", 0],
      Thursday: ["Thursday", 0],
      Friday: ["Friday", 0],
      Saturday: ["Saturday", 0],
    };
    if (Object.values(res.data)) {
      const keys = Object.keys(res.data);
      keys.forEach((key) => {
        if (weekDays[key]) {
          const value = res.data[key];
          weekDays[key] = [key, value];
          total.value += value;
        }
      });
    }
    chartOptions.value.series[0] = {
      ...chartOptions.value.series[0],
      data: Object.values(weekDays),
    };
    chartOptions.value.subtitle = {
      ...chartOptions.value.subtitle,
      text: `${t("Total")}:${total.value}`,
    };
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
};

watch(
  () => props.date,
  (newDate, oldDate) => {
    if (JSON.stringify(newDate) !== JSON.stringify(oldDate)) {
      getSalesByDayWeek();
    }
  },
  { deep: true }
);

onMounted(() => {
  getSalesByDayWeek();
});
</script>

<template>
  <CardComponent>
    <template #content>
      <div class="h-full">
        <h2 class="font-bold uppercase" v-if="isLoading || !total">
          {{ t("Sales by day of the week") }}
        </h2>
        <div
          v-if="isLoading"
          class="flex justify-content-center align-items-center flex-column mt-4"
        >
          <Skeleton class="" shape="circle" size="8rem"></Skeleton>
        </div>
        <h4 class="mt-4 text-center" v-else-if="!isLoading && !total">
          {{ t("No sales by day of the week") }}
        </h4>
        <Chart :options="chartOptions" v-else></Chart>
      </div>
    </template>
  </CardComponent>
</template>
