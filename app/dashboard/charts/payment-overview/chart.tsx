"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

type PropsType = {
  data: {
    revenueEur: { x: unknown; y: number }[];
    redeemedPoints: { x: unknown; y: number }[];
  };
};

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export function PaymentsOverviewChart({ data }: PropsType) {
  const isMobile = useIsMobile();

  const options: ApexOptions = {
    legend: {
      show: false,
    },
    colors: ["#5750F1", "#0ABEF9"],
    chart: {
      height: 310,
      type: "area",
      toolbar: {
        show: false,
      },
      fontFamily: "inherit",
      foreColor: "#94a3b8",
    },
    fill: {
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 320,
          },
        },
      },
    ],
    stroke: {
      curve: "smooth",
      width: isMobile ? 2 : 3,
    },
    grid: {
      strokeDashArray: 5,
      borderColor: "rgba(148, 163, 184, 0.2)",
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      theme: "dark",
      cssClass: "chart-tooltip-readable",
      marker: {
        show: true,
      },
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
    yaxis: [
      {
        title: {
          text: "Revenue (EUR)",
          style: {
            color: "#94a3b8",
          },
        },
        labels: {
          formatter: (value) => `€${Math.round(value)}`,
          style: {
            colors: ["#94a3b8"],
          },
        },
      },
      {
        opposite: true,
        title: {
          text: "Redeemed Points",
          style: {
            color: "#94a3b8",
          },
        },
        labels: {
          formatter: (value) => `${Math.round(value)} pt`,
          style: {
            colors: ["#94a3b8"],
          },
        },
      },
    ],
  };

  return (
    <div className="-ml-4 -mr-5 h-77.5">
      <Chart
        options={options}
        series={[
          {
            name: "Revenue (EUR)",
            data: data.revenueEur,
          },
          {
            name: "Redeemed Points",
            data: data.redeemedPoints,
          },
        ]}
        type="area"
        height={310}
      />
    </div>
  );
}