import { PeriodPicker } from "@/components/period-picker";
import { standardFormat } from "@/lib/format-number";
import { getOverviewKpis } from "@/services/charts.services";
import { CampaignVisitors } from "./charts/campiagn-visitors";
import { PaymentsOverview } from "./charts/payment-overview";
import { TransactionMix } from "./charts/used-devices";
import { WeeksProfit } from "./charts/weeks-profit";

type PropsType = {
  timeFrames?: {
    global?: string;
    paymentsOverview?: string;
    weeksProfit?: string;
    campaignVisitors?: string;
    transactionMix?: string;
  };
};

export async function DashboardOverview({ timeFrames }: PropsType) {
  const globalTimeFrame = timeFrames?.global ?? "monthly";
  const paymentsOverviewTimeFrame = timeFrames?.paymentsOverview ?? globalTimeFrame;
  const campaignVisitorsTimeFrame = timeFrames?.campaignVisitors ?? globalTimeFrame;
  const weeksProfitTimeFrame = timeFrames?.weeksProfit;
  const transactionMixTimeFrame = timeFrames?.transactionMix ?? globalTimeFrame;
  const kpis = await getOverviewKpis(globalTimeFrame);

  return (
    <section className="space-y-4">
      <div className="rounded-3xl border border-slate-200 bg-linear-to-br from-white via-slate-50 to-cyan-50 p-5 shadow-sm dark:border-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950/40 md:p-6">
        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <p className="inline-flex items-center rounded-full border border-sky-300/50 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700 dark:border-sky-800 dark:bg-slate-900/70 dark:text-sky-300">
              Multi-Tenant Dashboard
            </p>
            <p className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-600 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
              Dashboard-Daten geladen
            </p>
          </div>
          <h1 className="mt-3 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-2xl">
            Overview & Live-Kennzahlen
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
            Kennzahlen oben, Charts in der Mitte, Verwaltung unten.
          </p>

          <div className="mt-3 inline-flex items-center gap-3 rounded-xl border border-cyan-200 bg-white/80 px-3 py-2 text-sm dark:border-cyan-900 dark:bg-slate-900/70">
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-700 dark:text-slate-200">
              Globaler Zeitraum
            </span>
            <PeriodPicker defaultValue={globalTimeFrame} sectionKey="global" />
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Revenue</p>
          <p className="mt-1.5 text-xl font-bold text-slate-900 dark:text-slate-100">
            ${standardFormat(kpis.revenueEur)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Aktive Kunden</p>
          <p className="mt-1.5 text-xl font-bold text-slate-900 dark:text-slate-100">
            {standardFormat(kpis.activeCustomers)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Redeem-Quote</p>
          <p className="mt-1.5 text-xl font-bold text-slate-900 dark:text-slate-100">
            {kpis.redeemRate}%
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Avg. Points / Earn</p>
          <p className="mt-1.5 text-xl font-bold text-slate-900 dark:text-slate-100">
            {standardFormat(kpis.avgPointsPerEarn)}
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="h-full">
          <PaymentsOverview timeFrame={paymentsOverviewTimeFrame} className="h-full" />
        </div>
        <div className="h-full">
          <CampaignVisitors className="h-full" timeFrame={campaignVisitorsTimeFrame} />
        </div>
        <div className="h-full">
          <TransactionMix timeFrame={transactionMixTimeFrame} className="h-full" />
        </div>
        <div className="h-full">
          <WeeksProfit timeFrame={weeksProfitTimeFrame} className="h-full" />
        </div>
      </div>
    </section>
  );
}