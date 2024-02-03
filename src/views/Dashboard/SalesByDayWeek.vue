<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import CardComponent from "../../components/CardComponent.vue";
import { Chart } from "highcharts-vue";
import Highcharts from "highcharts";
import highchartsMore from "highcharts/highcharts-more";

highchartsMore(Highcharts);

const { t } = useI18n();
const chartOptions = ref({
  chart: {
    type: "columnpyramid",
    height: 250,
  },
  title: {
    text: "Sales by day of the week",
    style: {
      fontWeight: "bold",
      color: "#4b5563",
      fontSize: "19px",
      fontFamily: "Poppins",
      textTransform: "Uppercase",
    },
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
      data: [
        ["Sunday", 538.32],
        ["Monday", 1458.72],
        ["Tuesday", 500.0],
        ["Wednesday", 500.0],
        ["Thursday", 500.0],
        ["Friday", 3039.72],
        ["Saturday", 500.0],
      ],
      showInLegend: false,
    },
  ],
});
</script>

<template>
  <CardComponent>
    <template #content>
      <Chart :options="chartOptions"></Chart>
    </template>
  </CardComponent>
</template>
