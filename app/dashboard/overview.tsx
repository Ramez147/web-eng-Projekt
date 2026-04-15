import { PeriodPicker } from "@/components/period-picker";
import { standardFormat } from "@/lib/format-number";
import { getOverviewKpis } from "@/services/charts.services";
import { CampaignVisitors } from "./charts/campiagn-visitors";
import { PaymentsOverview } from "./charts/payment-overview";
import { LogoutButton } from "./logout-button";
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

function resolveTimeFrames(timeFrames?: PropsType["timeFrames"]) {
  const globalTimeFrame = timeFrames?.global ?? "monthly";

  return {
    globalTimeFrame,
    paymentsOverviewTimeFrame: timeFrames?.paymentsOverview ?? globalTimeFrame,
    campaignVisitorsTimeFrame: timeFrames?.campaignVisitors ?? globalTimeFrame,
    weeksProfitTimeFrame: timeFrames?.weeksProfit,
    transactionMixTimeFrame: timeFrames?.transactionMix ?? globalTimeFrame,
  };
}

export function DashboardOverviewHeader({ timeFrames }: PropsType) {
  const { globalTimeFrame } = resolveTimeFrames(timeFrames);

  return (
    <section className="space-y-4">
      <div className="rounded-3xl border border-white/8 bg-[#07140d] p-5 shadow-[0_16px_50px_rgba(0,0,0,0.35)] md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-4xl">
            <p className="inline-flex items-center rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
              Multi-Tenant Dashboard
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h1 className="text-xl font-bold tracking-tight text-white md:text-2xl">
                Overview & Live-Kennzahlen
              </h1>
              <LogoutButton />
            </div>
            <p className="mt-3 inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
              Dashboard-Daten geladen
            </p>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
              Kennzahlen oben, Charts in der Mitte, Verwaltung unten.
            </p>

            <div className="mt-3 inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm">
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-300">
                Globaler Zeitraum
              </span>
              <PeriodPicker defaultValue={globalTimeFrame} sectionKey="global" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export async function DashboardOverviewCharts({ timeFrames }: PropsType) {
  const {
    globalTimeFrame,
    paymentsOverviewTimeFrame,
    campaignVisitorsTimeFrame,
    weeksProfitTimeFrame,
    transactionMixTimeFrame,
  } = resolveTimeFrames(timeFrames);

  const kpis = await getOverviewKpis(globalTimeFrame);

  return (
    <section className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-white/8 bg-white/3 p-3.5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Revenue</p>
          <p className="mt-1.5 text-xl font-bold text-white">
            ${standardFormat(kpis.revenueEur)}
          </p>
        </div>
        <div className="rounded-xl border border-white/8 bg-white/3 p-3.5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Aktive Kunden</p>
          <p className="mt-1.5 text-xl font-bold text-white">
            {standardFormat(kpis.activeCustomers)}
          </p>
        </div>
        <div className="rounded-xl border border-white/8 bg-white/3 p-3.5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Redeem-Quote</p>
          <p className="mt-1.5 text-xl font-bold text-white">
            {kpis.redeemRate}%
          </p>
        </div>
        <div className="rounded-xl border border-white/8 bg-white/3 p-3.5">
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-400">Avg. Points / Earn</p>
          <p className="mt-1.5 text-xl font-bold text-white">
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

export async function DashboardOverview({ timeFrames }: PropsType) {
  return (
    <section className="space-y-4">
      <DashboardOverviewHeader timeFrames={timeFrames} />
      <DashboardOverviewCharts timeFrames={timeFrames} />
    </section>
  );
}