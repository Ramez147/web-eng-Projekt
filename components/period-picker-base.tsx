"use client";

type PropsType = {
  defaultValue: string;
  sectionKey: string;
  items?: string[];
  onChange?: (value: string) => void;
};

export function PeriodPickerBase({
  defaultValue,
  sectionKey,
  items,
  onChange,
}: PropsType) {
  const options = items ?? ["weekly", "monthly", "yearly"];

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <label className="inline-flex items-center gap-2 text-sm text-slate-400">
      <span className="sr-only">Select period</span>
      <select
        className="rounded-xl border border-white/12 bg-white/6 px-2.5 py-1.5 text-sm text-slate-200 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300/25"
        defaultValue={defaultValue}
        onChange={handleChange}
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
