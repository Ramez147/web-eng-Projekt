import { PeriodPicker } from "@/components/period-picker";
import { TrendingUpIcon } from "@/assets/icons";
import { compactFormat } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import { getCampaignVisitorsData } from "@/services/charts.services";
import { CampaignVisitorsChart } from "./chart";

type PropsType = {
  className?: string;
  timeFrame?: string;
};

export async function CampaignVisitors({ className, timeFrame = "monthly" }: PropsType) {
  const data = await getCampaignVisitorsData(timeFrame);

  return (
    <div
      className={cn(
        "rounded-3xl border border-white/8 bg-[#07140d] shadow-[0_16px_50px_rgba(0,0,0,0.35)]",
        className,
      )}
    >
      <div className="border-b border-white/8 px-6 py-5.5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="mb-1.5 text-2xl font-bold text-white">
            Campaign Visitors
          </h2>

          <div className="flex items-center gap-3">
            <PeriodPicker defaultValue={timeFrame} sectionKey="campaign_visitors" />
            <div className="mb-0.5 text-2xl font-bold text-white">
              {compactFormat(data.total_visitors)}
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="text-sm font-medium uppercase tracking-[0.16em] text-slate-400">Last Campaign Performance</div>

          <div
            className={cn(
              "flex items-center gap-1.5 ",
              data.performance > 0 ? "text-green" : "text-red",
            )}
          >
            <TrendingUpIcon
              className={`${data.performance > 0 ? "-rotate-6 " : "scale-y-[-1]"}`}
            />

            <span className="text-sm font-medium text-white">{data.performance}%</span>
          </div>
        </div>
      </div>

      <CampaignVisitorsChart data={data.chart} />
    </div>
  );
}