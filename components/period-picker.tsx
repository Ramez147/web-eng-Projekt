"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PeriodPickerBase } from "./period-picker-base";

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

  const onChange = (nextValue: string) => {
    const next = parseSelectedTimeFrame(searchParams.get("selected_time_frame"));
    next[sectionKey] = nextValue;

    const params = new URLSearchParams(searchParams.toString());
    params.set("selected_time_frame", serializeSelectedTimeFrame(next));

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <PeriodPickerBase
      defaultValue={defaultValue}
      sectionKey={sectionKey}
      items={items}
      onChange={onChange}
    />
  );
}
