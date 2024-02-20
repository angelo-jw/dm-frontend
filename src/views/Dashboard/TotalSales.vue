<script setup>
import { ref, watch, onMounted } from "vue";
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

const { t } = useI18n();
const toast = useToast();

const props = defineProps({
  date: {
    type: Object,
    default: () => ({ startDate: day().format("YYYY-MM-DD"), endDate: "" }),
  },
});

const dashboardService = useDashboardService();

const isLoading = ref(false);
const chartOptions = ref({
  chart: {
    type: "column",
    height: 280,
  },
  title: {
    text: t("Total for each activity by Month"),
    style: {
      fontWeight: "bold",
      color: "#4b5563",
      fontSize: "19px",
      fontFamily: "Poppins",
      textTransform: "Uppercase",
    },
    align: "left",
  },
  colors: ["#2ec867", "#619cf9", "#e9b310", "#234a72"],
  xAxis: {
    categories: [
      "Jan",
      "Feb",
      "March",
      "April",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ],
  },
  yAxis: {
    min: 0,
    title: {
      text: "Amount",
    },
    stackLabels: {
      enabled: true,
    },
  },
  legend: {
    align: "left",
    x: 400,
    verticalAlign: "top",
    y: -4,
    floating: true,
    backgroundColor:
      Highcharts.defaultOptions.legend.backgroundColor || "white",
    borderColor: "#CCC",
    borderWidth: 1,
    shadow: false,
  },
  tooltip: {
    headerFormat: "<b>{point.x}</b><br/>",
    pointFormat: "{series.name}: {point.y}<br/>Total: {point.stackTotal}",
  },
  plotOptions: {
    column: {
      stacking: "normal",
      dataLabels: {
        enabled: true,
      },
    },
  },
  series: [],
});

const getTotalSalesData = async () => {
  const result =
    "?" +
    new URLSearchParams({
      year: day(props.date.startDate).format("YYYY"),
    }).toString();
  try {
    let chartData = {};
    isLoading.value = true;
    const res = await dashboardService.getActivityCountPerMonth(result);
    const convertDataToArray = Object.values(res.data);
    if (convertDataToArray.length) {
      convertDataToArray.forEach((chartItems) => {
        const keys = Object.keys(chartItems);
        const values = Object.values(chartItems);

        keys.forEach((key, index) => {
          if (!chartData[key]) {
            chartData[key] = {
              name: key,
              data: [values[index]],
            };
          } else {
            chartData[key] = {
              name: key,
              data: [...chartData[key].data, values[index]],
            };
          }
        });
      });
      chartOptions.value.series = Object.values(chartData);
    }
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
      getTotalSalesData();
    }
  },
  { deep: true }
);

onMounted(() => {
  getTotalSalesData();
});
</script>

<template>
  <CardComponent>
    <template #content>
      <div class="h-full">
        <h2
          class="font-bold uppercase"
          v-if="isLoading || !chartOptions.series.length"
        >
          {{ t("Total for each activity by Month") }}
        </h2>
        <div
          v-if="isLoading"
          class="flex justify-content-center align-items-center flex-column mt-4"
        >
          <Skeleton class="" shape="circle" size="8rem"></Skeleton>
        </div>
        <h4
          class="mt-4 text-center"
          v-else-if="!isLoading && !chartOptions.series.length"
        >
          {{ t("No activities") }}
        </h4>
        <Chart :options="chartOptions" v-else></Chart>
      </div>
    </template>
  </CardComponent>
</template>
