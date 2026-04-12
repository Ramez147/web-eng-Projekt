import { DashboardOverview } from "./overview";
import { LoyaltyConsole } from "./tenant-console";

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

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 md:px-8 md:py-8">
      <DashboardOverview timeFrames={{
        global: selectedTimeFrames.global,
        paymentsOverview: selectedTimeFrames.payments_overview,
        weeksProfit: selectedTimeFrames.weeks_profit,
        campaignVisitors: selectedTimeFrames.campaign_visitors,
        transactionMix: selectedTimeFrames.transaction_mix ?? selectedTimeFrames.used_devices,
      }} />
      <LoyaltyConsole compact />
    </main>
  );
}