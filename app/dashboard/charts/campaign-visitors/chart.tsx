"use client";

import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

type PropsType = {
  data: {
    x: string;
    y: number;
  }[];
};

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export function CampaignVisitorsChart({ data }: PropsType) {
  const options: ApexOptions = {
    colors: ["#5750F1"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "bar",
      height: 200,
      foreColor: "#94a3b8",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "40%",
        borderRadius: 3,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 4,
      colors: ["transparent"],
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#94a3b8",
        },
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Satoshi",
      labels: {
        colors: ["#cbd5e1"],
      },
    },
    grid: {
      strokeDashArray: 7,
      borderColor: "rgba(148, 163, 184, 0.2)",
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      theme: "dark",
      cssClass: "chart-tooltip-readable",
      x: {
        show: false,
      },
    },
  };

  return (
    <div className="-ml-3.5 px-6 pb-1 pt-7.5">
      <Chart
        options={options}
        series={[
          {
            name: "Visitors",
            data,
          },
        ]}
        type="bar"
        height={230}
      />
    </div>
  );
}