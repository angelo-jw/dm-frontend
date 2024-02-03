<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import CardComponent from "../../components/CardComponent.vue";
import { Chart } from "highcharts-vue";

const { t } = useI18n();
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
    text: `${t("Total")}:${100}`,
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
        format: "{point.name}:<br/>{point.percentage:.2f} %",
        style: {
          fontSize: "8px",
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
      data: [
        {
          name: "Dials",
          y: 18,
        },
        {
          name: "Doorknocks",
          y: 60,
        },
        {
          name: "Appointments",
          y: 239,
        },
        {
          name: "Presentation",
          y: 4,
        },
      ],
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
