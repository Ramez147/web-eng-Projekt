import { PeriodPicker } from "@/components/period-picker";
import { cn } from "@/lib/utils";
import { getTransactionMixData } from "@/services/charts.services";
import { DonutChart } from "./chart";

type PropsType = {
  timeFrame?: string;
  className?: string;
};

export async function TransactionMix({
  timeFrame = "monthly",
  className,
}: PropsType) {
  const data = await getTransactionMixData(timeFrame);

  return (
    <div
      className={cn(
        "grid grid-cols-1 grid-rows-[auto_1fr] gap-9 rounded-3xl border border-white/8 bg-[#07140d] p-7.5 shadow-[0_16px_50px_rgba(0,0,0,0.35)]",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-white">
          Engagement Mix
        </h2>

        <PeriodPicker defaultValue={timeFrame} sectionKey="transaction_mix" />
      </div>

      <div className="grid place-items-center">
        <DonutChart data={data} centerLabel="Kunden" />
      </div>
    </div>
  );
}