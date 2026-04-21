import {
  ArrowDownLeft,
  ArrowUpRight,
  LineChart,
  Percent,
  Users,
  Wallet,
} from "lucide-react";

type AnalyticsMetricCardsProps = {
  customersCount: number;
  totalTransactions: number;
  totalRevenueEur: number;
  earnedPoints: number;
  redeemedPoints: number;
};

type MetricCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
};

function MetricCard({ title, value, icon }: MetricCardProps) {
  return (
    <article className="dashboard-widget-glow rounded-2xl border border-white/8 bg-white/3 p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm uppercase tracking-[0.14em] text-slate-400">{title}</p>
        {icon}
      </div>
      <p className="mt-2 text-xl font-semibold text-white md:text-2xl">
        {value}
      </p>
    </article>
  );
}

export function AnalyticsMetricCards({
  customersCount,
  totalTransactions,
  totalRevenueEur,
  earnedPoints,
  redeemedPoints,
}: AnalyticsMetricCardsProps) {
  const redeemRatio = earnedPoints === 0 ? 0 : (redeemedPoints / earnedPoints) * 100;

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
      <MetricCard
        title="Kundenprofile"
        value={String(customersCount)}
        icon={<Users className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />}
      />
      <MetricCard
        title="Transaktionen"
        value={String(totalTransactions)}
        icon={<LineChart className="h-4 w-4 text-fuchsia-700 dark:text-fuchsia-400" />}
      />
      <MetricCard
        title="Gesamtumsatz"
        value={`${totalRevenueEur.toFixed(2)} EUR`}
        icon={<Wallet className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />}
      />
      <MetricCard
        title="Punkte Earn"
        value={String(earnedPoints)}
        icon={<ArrowUpRight className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />}
      />
      <MetricCard
        title="Punkte Redeem"
        value={String(redeemedPoints)}
        icon={<ArrowDownLeft className="h-4 w-4 text-orange-700 dark:text-orange-400" />}
      />
      <MetricCard
        title="Redeem Ratio"
        value={`${redeemRatio.toFixed(1)}%`}
        icon={<Percent className="h-4 w-4 text-sky-700 dark:text-sky-400" />}
      />
    </section>
  );
}
