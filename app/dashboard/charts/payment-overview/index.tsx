import { PeriodPicker } from "@/components/period-picker";
import { standardFormat } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import { getPaymentsOverviewData } from "@/services/charts.services";
import { PaymentsOverviewChart } from "./chart";

type PropsType = {
  timeFrame?: string;
  className?: string;
};

export async function PaymentsOverview({
  timeFrame = "monthly",
  className,
}: PropsType) {
  const data = await getPaymentsOverviewData(timeFrame);

  return (
    <div
      className={cn(
        "grid gap-2 rounded-3xl border border-white/8 bg-[#07140d] px-7.5 pb-6 pt-7.5 shadow-[0_16px_50px_rgba(0,0,0,0.35)]",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-white">
          Payments Overview
        </h2>

        <PeriodPicker defaultValue={timeFrame} sectionKey="payments_overview" />
      </div>

      <PaymentsOverviewChart data={data} />

      <dl className="grid divide-white/8 text-center sm:grid-cols-2 sm:divide-x [&>div]:flex [&>div]:flex-col-reverse [&>div]:gap-1">
        <div className="max-sm:mb-3 max-sm:border-b max-sm:border-white/8 max-sm:pb-3">
          <dt className="text-xl font-bold text-white">
            ${standardFormat(data.revenueEur.reduce((acc, { y }) => acc + y, 0))}
          </dt>
          <dd className="font-medium uppercase tracking-[0.16em] text-slate-400">Revenue (EUR)</dd>
        </div>

        <div>
          <dt className="text-xl font-bold text-white">
            {standardFormat(data.redeemedPoints.reduce((acc, { y }) => acc + y, 0))}
          </dt>
          <dd className="font-medium uppercase tracking-[0.16em] text-slate-400">Redeemed Points</dd>
        </div>
      </dl>
    </div>
  );
}