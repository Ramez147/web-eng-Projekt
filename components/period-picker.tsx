"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

type PropsType = {
  defaultValue: string;
  sectionKey: string;
  items?: string[];
};

function parseSelectedTimeFrame(input: string | null): Record<string, string> {
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

function serializeSelectedTimeFrame(value: Record<string, string>): string {
  return Object.entries(value)
    .map(([key, selected]) => `${key}:${selected}`)
    .join(",");
}

export function PeriodPicker({ defaultValue, sectionKey, items }: PropsType) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const options = items ?? ["weekly", "monthly", "yearly"];

  const onChange = (nextValue: string) => {
    const next = parseSelectedTimeFrame(searchParams.get("selected_time_frame"));
    next[sectionKey] = nextValue;

    const params = new URLSearchParams(searchParams.toString());
    params.set("selected_time_frame", serializeSelectedTimeFrame(next));

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <label className="inline-flex items-center gap-2 text-sm text-slate-400">
      <span className="sr-only">Select period</span>
      <select
        className="rounded-xl border border-white/12 bg-white/6 px-2.5 py-1.5 text-sm text-slate-200 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300/25"
        defaultValue={defaultValue}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
