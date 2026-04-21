import { CustomerDataTable } from "@/components/dashboard/CustomerDataTable";
import { getCurrentMembershipContext } from "@/lib/loyalty/user-membership";
import { getAnalyticsMetricCardsData } from "@/services/charts.services";
import { DashboardOverviewCharts, DashboardOverviewHeader } from "./overview";
import { LoyaltyConsole } from "./tenant-console";
import { AnalyticsMetricCards } from "./analytics-metric-cards";

type DashboardPageProps = {
  searchParams?: Promise<{
    selected_time_frame?: string;
  }>;
};

function parseSelectedTimeFrame(input?: string) {
  const result: Record<string, string> = {};

  if (!input) {
    return result;
  }

  for (const pair of input.split(",")) {
    const [key, value] = pair.split(":");

    if (key && value) {
      result[key] = value;
    }
  }

  return result;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const selectedTimeFrames = parseSelectedTimeFrame(params?.selected_time_frame);
  const globalTimeFrame = selectedTimeFrames.global ?? "monthly";
  const analyticsMetricCardsData = await getAnalyticsMetricCardsData(globalTimeFrame);
  let currentRole: "admin" | "member" | null = null;

  try {
    const membership = await getCurrentMembershipContext();
    currentRole = membership.role;
  } catch {
    currentRole = null;
  }

  const isMember = currentRole === "member";

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:px-8 md:py-8">
      <DashboardOverviewHeader timeFrames={{
        global: selectedTimeFrames.global,
        paymentsOverview: selectedTimeFrames.payments_overview,
        weeksProfit: selectedTimeFrames.weeks_profit,
        campaignVisitors: selectedTimeFrames.campaign_visitors,
        transactionMix: selectedTimeFrames.transaction_mix ?? selectedTimeFrames.used_devices,
      }} />
      <AnalyticsMetricCards
        customersCount={analyticsMetricCardsData.customersCount}
        totalTransactions={analyticsMetricCardsData.totalTransactions}
        totalRevenueEur={analyticsMetricCardsData.totalRevenueEur}
        earnedPoints={analyticsMetricCardsData.earnedPoints}
        redeemedPoints={analyticsMetricCardsData.redeemedPoints}
      />
      
      <DashboardOverviewCharts timeFrames={{
        global: selectedTimeFrames.global,
        paymentsOverview: selectedTimeFrames.payments_overview,
        weeksProfit: selectedTimeFrames.weeks_profit,
        campaignVisitors: selectedTimeFrames.campaign_visitors,
        transactionMix: selectedTimeFrames.transaction_mix ?? selectedTimeFrames.used_devices,
      }} />
      {!isMember ? <CustomerDataTable /> : null}
      <LoyaltyConsole compact />
    </main>
  );
}