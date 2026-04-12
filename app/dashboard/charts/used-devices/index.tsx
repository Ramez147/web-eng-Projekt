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
        "grid grid-cols-1 grid-rows-[auto_1fr] gap-9 rounded-[10px] bg-white p-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-black">
          Transaction Mix
        </h2>

        <PeriodPicker defaultValue={timeFrame} sectionKey="transaction_mix" />
      </div>

      <div className="grid place-items-center">
        <DonutChart data={data} centerLabel="Volume" />
      </div>
    </div>
  );
}