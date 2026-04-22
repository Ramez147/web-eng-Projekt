"use client";

import { FormEvent } from "react";
import { RefreshCw, RotateCcw } from "lucide-react";

type AdminRatioControlsProps = {
  isAdmin: boolean;
  pointsRatio: string;
  currentRatio?: number;
  onChangeRatio: (value: string) => void;
  onSave: (event: FormEvent<HTMLFormElement>) => void;
  onRevert: () => void;
};

export function AdminRatioControls({
  isAdmin,
  pointsRatio,
  currentRatio,
  onChangeRatio,
  onSave,
  onRevert,
}: AdminRatioControlsProps) {
  if (!isAdmin) {
    return (
      <p className="text-sm text-slate-300">
        Aktuelle Ratio: 1 EUR = {currentRatio ?? "-"} Punkte
      </p>
    );
  }

  return (
    <form onSubmit={onSave} className="mt-5 border-t border-white/8 pt-5">
      <label className="block text-sm font-medium text-slate-300">
        Ratio aktualisieren
      </label>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <input
          value={pointsRatio}
          onChange={(event) => onChangeRatio(event.target.value)}
          className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-white outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:border-slate-700 dark:bg-slate-950 dark:focus:border-emerald-400 dark:focus:ring-emerald-900"
          type="number"
          min="0.01"
          step="0.01"
        />
        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500">
          <RefreshCw className="h-4 w-4" />
          Speichern
        </button>
        <button
          type="button"
          onClick={onRevert}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-transparent px-4 py-2.5 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/10"
        >
          <RotateCcw className="h-4 w-4" />
          Zurueckkehren
        </button>
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Aktuelle gespeicherte Ratio: 1 EUR = {currentRatio ?? "-"} Punkte
      </p>
    </form>
  );
}
