import { CampaignVisitors } from "./charts/campiagn-visitors";
import { PaymentsOverview } from "./charts/payment-overview";
import { UsedDevices } from "./charts/used-devices";
import { WeeksProfit } from "./charts/weeks-profit";

type PropsType = {
  searchParams: Promise<{
    selected_time_frame?: string;
  }>;
};

type DashboardSection = "payments_overview" | "weeks_profit" | "used_devices";

function parseSelectedTimeFrame(value?: string): Record<DashboardSection, string> {
  const defaults: Record<DashboardSection, string> = {
    payments_overview: "monthly",
    weeks_profit: "this week",
    used_devices: "monthly",
  };

  if (!value) {
    return defaults;
  }

  const pairs = value.split(",").map((item) => item.trim());

  for (const pair of pairs) {
    const [section, selected] = pair.split(":");

    if (!section || !selected) {
      continue;
    }

    if (section in defaults) {
      defaults[section as DashboardSection] = selected;
    }
  }

  return defaults;
}

export default async function Home({ searchParams }: PropsType) {
  const { selected_time_frame } = await searchParams;
  const timeFrames = parseSelectedTimeFrame(selected_time_frame);

  return (
    <main className="relative overflow-hidden bg-background px-4 py-6 text-foreground md:px-6 md:py-8">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-br from-primary/10 via-background to-background" />

      <section className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="col-span-12 rounded-2xl border border-border bg-black p-6 text-card-foreground shadow-sm backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Analytics Workspace
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
            Dashboard Overview
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Live metrics in a responsive grid styled with the same shadcn design tokens.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
              <p className="text-xs text-muted-foreground">Payments</p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {timeFrames.payments_overview}
              </p>
            </div>
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
              <p className="text-xs text-muted-foreground">Profit Window</p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {timeFrames.weeks_profit}
              </p>
            </div>
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
              <p className="text-xs text-muted-foreground">Devices</p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {timeFrames.used_devices}
              </p>
            </div>
          </div>
        </div>

        <PaymentsOverview
          className="col-span-12 md:col-span-8"
          timeFrame={timeFrames.payments_overview}
        />

        <WeeksProfit
          timeFrame={timeFrames.weeks_profit}
          className="col-span-12 md:col-span-4"
        />

        <UsedDevices
          className="col-span-12 md:col-span-6"
          timeFrame={timeFrames.used_devices}
        />

        <CampaignVisitors className="col-span-12 md:col-span-6" />
      </section>
    </main>
  );
}