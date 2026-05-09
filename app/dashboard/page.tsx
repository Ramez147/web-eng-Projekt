import { CustomerDataTable } from "@/components/dashboard/CustomerDataTable";
import { getCurrentMembershipContextOptional } from "@/lib/loyalty/user-membership";
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

const emptyMetricCards = {
  customersCount: 0,
  totalTransactions: 0,
  totalRevenueEur: 0,
  earnedPoints: 0,
  redeemedPoints: 0,
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const selectedTimeFrames = parseSelectedTimeFrame(params?.selected_time_frame);
  const globalTimeFrame = selectedTimeFrames.global ?? "monthly";

  let analyticsMetricCardsData = emptyMetricCards;
  let dashboardError: string | null = null;
  let currentRole: "admin" | "member" | null = null;
  let hasOrganization = false;

  try {
    const membership = await getCurrentMembershipContextOptional();
    if (membership) {
      currentRole = membership.role;
      hasOrganization = true;
    }
  } catch {
    currentRole = null;
    hasOrganization = false;
  }

  if (!hasOrganization) {
    return (
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:px-8 md:py-8">
        <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-sm text-blue-300">
          ℹ Willkommen! Bitte erstelle zunächst eine Organisation, um zu beginnen.
        </div>
        <LoyaltyConsole compact />
      </main>
    );
  }

  try {
    analyticsMetricCardsData = await getAnalyticsMetricCardsData(globalTimeFrame);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message.includes("Missing required environment variable")) {
      dashboardError = "Server configuration incomplete — check your .env.local file (SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_ANON_KEY are required).";
    } else if (message.includes("Unauthorized")) {
      dashboardError = null; // handled by auth redirect elsewhere
    } else {
      dashboardError = `Could not load dashboard data: ${message}`;
    }
  }

  const isMember = currentRole === "member";

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 md:py-8">
      {dashboardError ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 mb-8">
          ⚠ {dashboardError}
        </div>
      ) : null}

      {/* Dashboard Section */}
      <section id="dashboard-top" className="mb-8 space-y-4">
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
      </section>

      {/* Analytics Section */}
      <section id="dashboard-analytics" className="mb-8">
        <DashboardOverviewCharts timeFrames={{
          global: selectedTimeFrames.global,
          paymentsOverview: selectedTimeFrames.payments_overview,
          weeksProfit: selectedTimeFrames.weeks_profit,
          campaignVisitors: selectedTimeFrames.campaign_visitors,
          transactionMix: selectedTimeFrames.transaction_mix ?? selectedTimeFrames.used_devices,
        }} />
      </section>

      {/* Customers Section */}
      <section id="dashboard-customers" className="mb-8">
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-xl font-bold text-white mb-6">Customers</h2>
          {!isMember ? <CustomerDataTable /> : (
            <p className="text-slate-400">Nur Admins können die Kundenliste einsehen.</p>
          )}
        </div>
      </section>

      <LoyaltyConsole compact />
    </main>
  );
}