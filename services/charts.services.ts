export type XYDataPoint = {
  x: string;
  y: number;
};

export type PaymentsOverviewData = {
  received: XYDataPoint[];
  due: XYDataPoint[];
};

export type WeeksProfitData = {
  sales: XYDataPoint[];
  revenue: XYDataPoint[];
};

export type DeviceUsage = {
  name: string;
  amount: number;
};

export type CampaignVisitorsData = {
  total_visitors: number;
  performance: number;
  chart: XYDataPoint[];
};

function monthSeries(multiplier = 1): XYDataPoint[] {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

  return months.map((month, index) => ({
    x: month,
    y: Math.round((index + 3) * 1200 * multiplier + (index % 2 === 0 ? 800 : 300)),
  }));
}

export async function getPaymentsOverviewData(
  timeFrame = "monthly",
): Promise<PaymentsOverviewData> {
  const factor = timeFrame === "yearly" ? 2.4 : timeFrame === "weekly" ? 0.35 : 1;

  return {
    received: monthSeries(factor),
    due: monthSeries(factor * 0.55),
  };
}

export async function getWeeksProfitData(
  timeFrame = "this week",
): Promise<WeeksProfitData> {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const factor = timeFrame === "last week" ? 0.9 : 1;

  return {
    sales: days.map((day, index) => ({ x: day, y: Math.round((index + 4) * 320 * factor) })),
    revenue: days.map((day, index) => ({
      x: day,
      y: Math.round((index + 3) * 260 * factor),
    })),
  };
}

export async function getDevicesUsedData(
  _timeFrame = "monthly",
): Promise<DeviceUsage[]> {
  return [
    { name: "Desktop", amount: 41120 },
    { name: "Mobile", amount: 28750 },
    { name: "Tablet", amount: 9360 },
    { name: "TV", amount: 2740 },
  ];
}

export async function getCampaignVisitorsData(): Promise<CampaignVisitorsData> {
  const chart = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
    (day, index) => ({
      x: day,
      y: 1400 + index * 280 + (index % 3) * 180,
    }),
  );
  const total = chart.reduce((acc, item) => acc + item.y, 0);

  return {
    total_visitors: total,
    performance: 8.4,
    chart,
  };
}
