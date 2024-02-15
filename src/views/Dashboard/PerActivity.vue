<script setup>
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

import CardComponent from "../../components/CardComponent.vue";

import Skeleton from "primevue/skeleton";

import { Chart } from "highcharts-vue";

import { useDashboardService } from "../../services/DashboardService";

import day from "dayjs";

const props = defineProps({
  date: {
    type: Object,
    default: () => ({ startDate: day().format("YYYY-MM-DD"), endDate: "" }),
  },
});
const { t } = useI18n();
const dashboardService = useDashboardService();

const total = ref(0);
const isLoading = ref();
const chartOptions = ref({
  chart: {
    type: "pie",
    height: 200,
  },
  title: {
    text: t("Per activity"),
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
  tooltip: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    className: "tooltipPie",
    pointFormat: "{point.custom.extraInformation}",
  },
  accessibility: {
    point: {
      valueSuffix: "$",
    },
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: "pointer",
      colors: ["#234b71", "#31c866", "#619cf8", "#e9b40f"],
      dataLabels: {
        enabled: true,
        distance: 6,
        format: "<b>{point.name}</b>: ${point.y:.1f}",
        style: {
          fontSize: "12px",
          fontWeight: "500",
        },
        filter: {
          property: "percentage",
          operator: ">",
          value: 0,
        },
      },
      showInLegend: false,
    },
    responsive: {
      rules: [
        {
          condition: {
            minWidth: 1000,
          },
          chartOptions: {
            chart: {
              style: { padding: "1rem" },
            },
            plotOptions: {
              pie: {
                dataLabels: {
                  enabled: true,
                  distance: 10,
                  format: "{point.name}:&nbsp{point.percentage:.2f} %",
                  style: {
                    fontSize: "15px",
                    fontWeight: "500",
                  },
                },
              },
            },
          },
        },
      ],
    },
  },
  series: [
    {
      colorByPoint: true,
    },
  ],
});

const getPerActivityData = async () => {
  const result =
    "?" +
    new URLSearchParams({
      start_date: props.date.startDate,
      end_date: props.date.endDate,
    }).toString();
  try {
    isLoading.value = true;
    const res = await dashboardService.getActivityCount(result);
    const chartData = [
      {
        name: "Dials",
        y: res.data?.dials || 0,
      },
      {
        name: "Doorknocks",
        y: res.data?.doorknocks || 0,
      },
      {
        name: "Appointments",
        y: res.data?.appointments || 0,
      },
      {
        name: "Presentations",
        y: res.data?.presentations || 0,
      },
      {
        name: "Recruiting interview",
        y: res.data?.recruiting_interview || 0,
      },
    ];
    total.value = chartData.reduce((a, b) => a + b.y || 0, 0);
    chartOptions.value.series[0] = {
      ...chartOptions.value.series[0],
      data: chartData,
    };
    chartOptions.value.subtitle = {
      ...chartOptions.value.subtitle,
      text: `${t("Total")}:${total.value}`,
    };
  } catch (err) {
    toast.add({
      severity: "error",
      detail:
        response?.data?.message ||
        `${t("There was an error creating your account, please try again")}.`,
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
      getPerActivityData();
    }
  },
  { deep: true }
);

onMounted(() => {
  getPerActivityData();
});
</script>

<template>
  <CardComponent>
    <template #content>
      <div class="h-full">
        <h2 class="font-bold uppercase" v-if="isLoading || !total">
          {{ t("Per activity") }}
        </h2>
        <div
          v-if="isLoading"
          class="flex justify-content-center align-items-center flex-column mt-4"
        >
          <Skeleton class="" shape="circle" size="8rem"></Skeleton>
        </div>
        <h4 class="mt-4 text-center" v-else-if="!isLoading && !total">
          {{ t("No activities") }}
        </h4>
        <Chart :options="chartOptions" v-else></Chart>
      </div>
    </template>
  </CardComponent>
</template>
