import { unstable_cache } from "next/cache";
import { getAdminSupabaseClient } from "@/lib/loyalty/db";
import { getCurrentMembershipContext } from "@/lib/loyalty/user-membership";

export type XYDataPoint = {
  x: string;
  y: number;
};

export type PaymentsOverviewData = {
  revenueEur: XYDataPoint[];
  redeemedPoints: XYDataPoint[];
};

export type WeeksProfitData = {
  sales: XYDataPoint[];
  revenue: XYDataPoint[];
};

export type TransactionMixData = {
  name: string;
  amount: number;
};

export type CampaignVisitorsData = {
  total_visitors: number;
  performance: number;
  chart: XYDataPoint[];
};

export type OverviewKpis = {
  revenueEur: number;
  activeCustomers: number;
  redeemRate: number;
  avgPointsPerEarn: number;
};

type TransactionRow = {
  transaction_type: "earn" | "redeem";
  points: number;
  eur_amount: number;
  created_at: string;
  profile_id: string;
};

type ProfileRow = {
  id: string;
  external_customer_id: string;
};

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WEEK_BUCKETS = ["W1", "W2", "W3", "W4"];
const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function normalizeRangeTimeFrame(timeFrame?: string): "weekly" | "monthly" | "yearly" {
  if (timeFrame === "weekly" || timeFrame === "yearly") {
    return timeFrame;
  }

  return "monthly";
}

function toMondayIndex(date: Date) {
  return (date.getDay() + 6) % 7;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfWeek(date: Date) {
  const start = startOfDay(date);
  start.setDate(start.getDate() - toMondayIndex(start));
  return start;
}

function getRangeStart(timeFrame: "weekly" | "monthly" | "yearly", now: Date) {
  const start = new Date(now);

  if (timeFrame === "weekly") {
    start.setDate(start.getDate() - 7);
    return start;
  }

  if (timeFrame === "yearly") {
    start.setFullYear(start.getFullYear() - 1);
    return start;
  }

  start.setMonth(start.getMonth() - 1);
  return start;
}

function bucketWeekLabel(date: Date) {
  return WEEKDAY_LABELS[toMondayIndex(date)];
}

function bucketMonthWeekLabel(date: Date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const diffDays = Math.floor((startOfDay(date).getTime() - start.getTime()) / 86400000);
  const week = Math.min(4, Math.floor(diffDays / 7) + 1);
  return `W${week}`;
}

const getDashboardSourceDataByOrg = unstable_cache(
  async (organizationId: string) => {
    const supabase = getAdminSupabaseClient();

    const [transactionsResult, profilesResult] = await Promise.all([
      supabase
        .from("points_transactions")
        .select("transaction_type, points, eur_amount, created_at, profile_id")
        .eq("organization_id", organizationId),
      supabase
        .from("customer_profiles")
        .select("id, external_customer_id")
        .eq("organization_id", organizationId),
    ]);

    if (transactionsResult.error) {
      throw new Error(transactionsResult.error.message);
    }

    if (profilesResult.error) {
      throw new Error(profilesResult.error.message);
    }

    return {
      transactions: (transactionsResult.data ?? []) as TransactionRow[],
      profiles: (profilesResult.data ?? []) as ProfileRow[],
    };
  },
  ["dashboard-source-data"],
  {
    revalidate: 45,
  },
);

async function getDashboardSourceData() {
  const membership = await getCurrentMembershipContext();
  return getDashboardSourceDataByOrg(membership.organizationId);
}

function buildSeriesByTimeFrame(
  transactions: TransactionRow[],
  timeFrame: "weekly" | "monthly" | "yearly",
  metric: "eurEarned" | "pointsRedeemed",
): XYDataPoint[] {
  const now = new Date();

  if (timeFrame === "yearly") {
    const values = Array.from({ length: 12 }, () => 0);

    for (const tx of transactions) {
      const date = new Date(tx.created_at);
      if (date.getFullYear() !== now.getFullYear()) {
        continue;
      }

      if (metric === "eurEarned" && tx.transaction_type === "earn") {
        values[date.getMonth()] += Number(tx.eur_amount);
      }

      if (metric === "pointsRedeemed" && tx.transaction_type === "redeem") {
        values[date.getMonth()] += tx.points;
      }
    }

    return MONTH_LABELS.map((label, index) => ({ x: label, y: Math.round(values[index]) }));
  }

  if (timeFrame === "weekly") {
    const start = startOfWeek(now);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    const map = new Map(WEEKDAY_LABELS.map((label) => [label, 0]));

    for (const tx of transactions) {
      const date = new Date(tx.created_at);
      if (date < start || date >= end) {
        continue;
      }

      const label = bucketWeekLabel(date);
      const current = map.get(label) ?? 0;

      if (metric === "eurEarned" && tx.transaction_type === "earn") {
        map.set(label, current + Number(tx.eur_amount));
      }

      if (metric === "pointsRedeemed" && tx.transaction_type === "redeem") {
        map.set(label, current + tx.points);
      }
    }

    return WEEKDAY_LABELS.map((label) => ({ x: label, y: Math.round(map.get(label) ?? 0) }));
  }

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const map = new Map(WEEK_BUCKETS.map((label) => [label, 0]));

  for (const tx of transactions) {
    const date = new Date(tx.created_at);
    if (date.getFullYear() !== currentYear || date.getMonth() !== currentMonth) {
      continue;
    }

    const label = bucketMonthWeekLabel(date);
    const current = map.get(label) ?? 0;

    if (metric === "eurEarned" && tx.transaction_type === "earn") {
      map.set(label, current + Number(tx.eur_amount));
    }

    if (metric === "pointsRedeemed" && tx.transaction_type === "redeem") {
      map.set(label, current + tx.points);
    }
  }

  return WEEK_BUCKETS.map((label) => ({ x: label, y: Math.round(map.get(label) ?? 0) }));
}

function buildUniqueVisitorsSeries(
  transactions: TransactionRow[],
  profileMap: Map<string, string>,
  timeFrame: "weekly" | "monthly" | "yearly",
): XYDataPoint[] {
  const now = new Date();

  if (timeFrame === "yearly") {
    const monthSets = Array.from({ length: 12 }, () => new Set<string>());

    for (const tx of transactions) {
      const date = new Date(tx.created_at);
      if (date.getFullYear() !== now.getFullYear()) {
        continue;
      }

      monthSets[date.getMonth()].add(profileMap.get(tx.profile_id) ?? tx.profile_id);
    }

    return MONTH_LABELS.map((label, index) => ({
      x: label,
      y: monthSets[index].size,
    }));
  }

  if (timeFrame === "weekly") {
    const start = startOfWeek(now);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);
    const daySets = new Map(WEEKDAY_LABELS.map((label) => [label, new Set<string>()]));

    for (const tx of transactions) {
      const date = new Date(tx.created_at);
      if (date < start || date >= end) {
        continue;
      }

      const label = bucketWeekLabel(date);
      daySets.get(label)?.add(profileMap.get(tx.profile_id) ?? tx.profile_id);
    }

    return WEEKDAY_LABELS.map((label) => ({
      x: label,
      y: daySets.get(label)?.size ?? 0,
    }));
  }

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const weekSets = new Map(WEEK_BUCKETS.map((label) => [label, new Set<string>()]));

  for (const tx of transactions) {
    const date = new Date(tx.created_at);
    if (date.getFullYear() !== currentYear || date.getMonth() !== currentMonth) {
      continue;
    }

    const label = bucketMonthWeekLabel(date);
    weekSets.get(label)?.add(profileMap.get(tx.profile_id) ?? tx.profile_id);
  }

  return WEEK_BUCKETS.map((label) => ({ x: label, y: weekSets.get(label)?.size ?? 0 }));
}

export async function getPaymentsOverviewData(
  timeFrame = "monthly",
): Promise<PaymentsOverviewData> {
  const { transactions } = await getDashboardSourceData();
  const normalizedTimeFrame = normalizeRangeTimeFrame(timeFrame);

  return {
    revenueEur: buildSeriesByTimeFrame(transactions, normalizedTimeFrame, "eurEarned"),
    redeemedPoints: buildSeriesByTimeFrame(transactions, normalizedTimeFrame, "pointsRedeemed"),
  };
}

export async function getWeeksProfitData(
  timeFrame = "this week",
): Promise<WeeksProfitData> {
  const { transactions } = await getDashboardSourceData();
  const now = new Date();
  const thisWeekStart = startOfWeek(now);
  const rangeStart = new Date(thisWeekStart);

  if (timeFrame === "last week") {
    rangeStart.setDate(rangeStart.getDate() - 7);
  }

  const rangeEnd = new Date(rangeStart);
  rangeEnd.setDate(rangeEnd.getDate() + 7);

  const salesMap = new Map(WEEKDAY_LABELS.map((label) => [label, 0]));
  const revenueMap = new Map(WEEKDAY_LABELS.map((label) => [label, 0]));

  for (const tx of transactions) {
    const date = new Date(tx.created_at);
    if (date < rangeStart || date >= rangeEnd) {
      continue;
    }

    const label = bucketWeekLabel(date);

    if (tx.transaction_type === "earn") {
      salesMap.set(label, (salesMap.get(label) ?? 0) + tx.points);
      revenueMap.set(label, (revenueMap.get(label) ?? 0) + Number(tx.eur_amount));
    }
  }

  return {
    sales: WEEKDAY_LABELS.map((label) => ({ x: label, y: Math.round(salesMap.get(label) ?? 0) })),
    revenue: WEEKDAY_LABELS.map((label) => ({
      x: label,
      y: Math.round(revenueMap.get(label) ?? 0),
    })),
  };
}

export async function getTransactionMixData(
  timeFrame = "monthly",
): Promise<TransactionMixData[]> {
  const { transactions, profiles } = await getDashboardSourceData();
  const now = new Date();
  const normalizedTimeFrame = normalizeRangeTimeFrame(timeFrame);
  const start = getRangeStart(normalizedTimeFrame, now);

  const transactionsInRange = transactions.filter((tx) => new Date(tx.created_at) >= start);

  const earnCount = transactionsInRange.filter((tx) => tx.transaction_type === "earn").length;
  const redeemCount = transactionsInRange.filter((tx) => tx.transaction_type === "redeem").length;
  const activeProfileIds = new Set(transactionsInRange.map((tx) => tx.profile_id));
  const activeCustomers = profiles.filter((profile) => activeProfileIds.has(profile.id)).length;

  return [
    { name: "Earn Tx", amount: earnCount },
    { name: "Redeem Tx", amount: redeemCount },
    { name: "Active Customers", amount: activeCustomers },
  ];
}

export async function getCampaignVisitorsData(
  timeFrame = "monthly",
): Promise<CampaignVisitorsData> {
  const { transactions, profiles } = await getDashboardSourceData();
  const profileMap = new Map(profiles.map((profile) => [profile.id, profile.external_customer_id]));
  const normalizedTimeFrame = normalizeRangeTimeFrame(timeFrame);

  const chart = buildUniqueVisitorsSeries(transactions, profileMap, normalizedTimeFrame);
  const total = chart.reduce((acc, item) => acc + item.y, 0);

  const midpoint = Math.ceil(chart.length / 2);
  const firstHalf = chart.slice(0, midpoint).reduce((acc, item) => acc + item.y, 0);
  const secondHalf = chart.slice(midpoint).reduce((acc, item) => acc + item.y, 0);
  const performance =
    firstHalf === 0 ? (secondHalf > 0 ? 100 : 0) : ((secondHalf - firstHalf) / firstHalf) * 100;

  return {
    total_visitors: total,
    performance: Math.round(performance * 10) / 10,
    chart,
  };
}

export async function getOverviewKpis(timeFrame = "monthly"): Promise<OverviewKpis> {
  const normalizedTimeFrame = normalizeRangeTimeFrame(timeFrame);
  const { transactions } = await getDashboardSourceData();
  const rangeStart = getRangeStart(normalizedTimeFrame, new Date());

  const inRange = transactions.filter((tx) => new Date(tx.created_at) >= rangeStart);
  const earnTransactions = inRange.filter((tx) => tx.transaction_type === "earn");
  const redeemTransactions = inRange.filter((tx) => tx.transaction_type === "redeem");

  const revenueEur = earnTransactions.reduce((sum, tx) => sum + Number(tx.eur_amount), 0);
  const activeCustomers = new Set(inRange.map((tx) => tx.profile_id)).size;
  const redeemRate = inRange.length === 0 ? 0 : (redeemTransactions.length / inRange.length) * 100;
  const totalEarnPoints = earnTransactions.reduce((sum, tx) => sum + tx.points, 0);
  const avgPointsPerEarn = earnTransactions.length === 0 ? 0 : totalEarnPoints / earnTransactions.length;

  return {
    revenueEur: Math.round(revenueEur * 100) / 100,
    activeCustomers,
    redeemRate: Math.round(redeemRate * 10) / 10,
    avgPointsPerEarn: Math.round(avgPointsPerEarn),
  };
}
