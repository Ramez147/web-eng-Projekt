"use client";

import { ChangeEvent, Dispatch, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";

type CustomerRow = {
  id: string;
  externalCustomerId: string;
  pointsBalance: number;
  totalSpentEur: number;
  createdAt: string;
};

type CustomerResponse = {
  totalCount: number;
  rows: CustomerRow[];
  page: number;
  pageSize: number;
};

type CustomerDataTableProps = {
  pageSize?: number;
};

type PaginationState = {
  page: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  pageNumbers: number[];
  setPage: Dispatch<SetStateAction<number>>;
  goToPage: (page: number) => void;
  goToPrevious: () => void;
  goToNext: () => void;
};

function useDebouncedValue<T>(value: T, delay = 250) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [delay, value]);

  return debouncedValue;
}

export function usePagination(totalCount: number, pageSize: number): PaginationState {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = totalCount === 0 ? 0 : (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalCount);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const pageNumbers = useMemo(() => Array.from({ length: totalPages }, (_, index) => index + 1), [totalPages]);

  return {
    page: safePage,
    totalPages,
    startIndex,
    endIndex,
    pageNumbers,
    setPage,
    goToPage: (nextPage: number) => setPage(Math.min(Math.max(1, nextPage), totalPages)),
    goToPrevious: () => setPage((currentPage) => Math.max(1, currentPage - 1)),
    goToNext: () => setPage((currentPage) => Math.min(totalPages, currentPage + 1)),
  };
}

const avatarClasses = [
  "bg-lime-300 text-slate-950",
  "bg-rose-300 text-slate-950",
  "bg-cyan-300 text-slate-950",
  "bg-amber-300 text-slate-950",
  "bg-emerald-300 text-slate-950",
  "bg-fuchsia-300 text-slate-950",
  "bg-sky-300 text-slate-950",
  "bg-violet-300 text-slate-950",
] as const;

function getAvatarClassName(value: string, index: number) {
  const hash = value.split("").reduce((accumulator, character) => accumulator + character.charCodeAt(0), index);
  return avatarClasses[hash % avatarClasses.length];
}

function getInitial(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "?";
}

function formatRange(startIndex: number, endIndex: number, totalCount: number) {
  if (totalCount === 0) {
    return "Showing 0-0 out of 0 data";
  }

  return `Showing ${startIndex + 1}-${endIndex} out of ${totalCount} data`;
}

export function CustomerDataTable({ pageSize = 4 }: CustomerDataTableProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query);
  const [rows, setRows] = useState<CustomerRow[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selection, setSelection] = useState<Set<string>>(() => new Set());
  const selectAllRef = useRef<HTMLInputElement | null>(null);

  const { page, totalPages, startIndex, endIndex, pageNumbers, setPage, goToPage, goToPrevious, goToNext } =
    usePagination(totalCount, pageSize);

  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, setPage]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCustomers() {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          q: debouncedQuery,
          page: String(page),
          pageSize: String(pageSize),
        });

        const response = await fetch(`/api/v1/dashboard/customers?${params.toString()}`, {
          credentials: "include",
          signal: controller.signal,
        });

        const payload = (await response.json()) as CustomerResponse | { error?: string };

        if (!response.ok) {
          throw new Error(
            typeof payload === "object" && payload !== null && "error" in payload && payload.error
              ? payload.error
              : "Kundendaten konnten nicht geladen werden."
          );
        }

        const data = payload as CustomerResponse;
        setRows(data.rows);
        setTotalCount(data.totalCount);
      } catch (fetchError) {
        if (fetchError instanceof DOMException && fetchError.name === "AbortError") {
          return;
        }

        setRows([]);
        setTotalCount(0);
        setError(fetchError instanceof Error ? fetchError.message : "Kundendaten konnten nicht geladen werden.");
      } finally {
        setIsLoading(false);
      }
    }

    void loadCustomers();
    return () => controller.abort();
  }, [debouncedQuery, page, pageSize]);

  useEffect(() => {
    const visibleIds = new Set(rows.map((row) => row.id));
    const selectedVisibleCount = rows.filter((row) => selection.has(row.id)).length;

    if (selectAllRef.current) {
      selectAllRef.current.checked = rows.length > 0 && selectedVisibleCount === rows.length;
      selectAllRef.current.indeterminate = selectedVisibleCount > 0 && selectedVisibleCount < rows.length;
    }

    setSelection((currentSelection) => {
      let changed = false;
      const nextSelection = new Set<string>();

      for (const rowId of currentSelection) {
        if (visibleIds.has(rowId) || !visibleIds.size) {
          nextSelection.add(rowId);
        }
      }

      if (nextSelection.size !== currentSelection.size) {
        changed = true;
      }

      return changed ? nextSelection : currentSelection;
    });
  }, [rows, selection]);

  const selectedRows = useMemo(() => rows.filter((row) => selection.has(row.id)), [rows, selection]);
  const selectedCustomerIds = useMemo(
    () => selectedRows.map((row) => row.externalCustomerId),
    [selectedRows]
  );
  const selectedCount = selection.size;

  function toggleRowSelection(rowId: string) {
    setSelection((currentSelection) => {
      const nextSelection = new Set(currentSelection);

      if (nextSelection.has(rowId)) {
        nextSelection.delete(rowId);
      } else {
        nextSelection.add(rowId);
      }

      return nextSelection;
    });
  }

  function toggleAllVisibleRows() {
    const visibleIds = rows.map((row) => row.id);

    setSelection((currentSelection) => {
      const nextSelection = new Set(currentSelection);
      const allVisibleSelected = visibleIds.every((rowId) => nextSelection.has(rowId));

      if (allVisibleSelected) {
        visibleIds.forEach((rowId) => nextSelection.delete(rowId));
      } else {
        visibleIds.forEach((rowId) => nextSelection.add(rowId));
      }

      return nextSelection;
    });
  }

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    setPage(1);
  }

  function copySelectedCustomerIds() {
    if (selectedCustomerIds.length === 0) {
      return;
    }

    navigator.clipboard.writeText(selectedCustomerIds.join("\n")).catch(() => undefined);
  }

  return (
    <main className="rounded-[32px] border border-white/8 bg-[#050816] px-4 py-5 shadow-[0_30px_120px_rgba(0,0,0,0.45)] sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 border-b border-white/8 pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-white">Customers</h2>
          <p className="mt-1 text-sm text-slate-400">
            Markiere Kunden für Massenaktionen und blättere serverseitig durch die vorhandenen Kundendaten.
          </p>
        </div>

        <label className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-lime-300/50 focus:bg-white/8 focus:ring-2 focus:ring-lime-300/20"
          />
        </label>
      </header>

      <div className="mt-5 overflow-hidden rounded-3xl border border-white/8 bg-white/[0.03]">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left">
            <thead className="bg-white/[0.02] text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              <tr>
                <th className="w-12 px-4 py-4">
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    onChange={toggleAllVisibleRows}
                    className="h-4 w-4 rounded border-white/20 bg-transparent text-lime-300 focus:ring-lime-300"
                    aria-label="Select all customers on this page"
                  />
                </th>
                <th className="px-4 py-4">Customer ID</th>
                <th className="px-4 py-4">Points Balance</th>
                <th className="px-4 py-4">Total Spent</th>
                <th className="px-4 py-4">Created At</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                Array.from({ length: pageSize }).map((_, index) => (
                  <tr key={`skeleton-${index}`} className="border-t border-white/6">
                    <td className="px-4 py-5">
                      <div className="h-4 w-4 rounded border border-white/10 bg-white/5" />
                    </td>
                    <td className="px-4 py-5" colSpan={4}>
                      <div className="h-4 w-full max-w-3xl rounded bg-white/5" />
                    </td>
                  </tr>
                ))
              ) : error ? (
                <tr className="border-t border-white/6">
                  <td className="px-4 py-8 text-sm text-red-300" colSpan={5}>
                    {error}
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr className="border-t border-white/6">
                  <td className="px-4 py-8 text-sm text-slate-400" colSpan={5}>
                    Keine Customer-Daten gefunden.
                  </td>
                </tr>
              ) : (
                rows.map((row, index) => {
                  const customerId = row.externalCustomerId;
                  const avatarClassName = getAvatarClassName(customerId, index);
                  const isSelected = selection.has(row.id);

                  return (
                    <tr key={row.id} className="border-t border-white/6 transition hover:bg-white/[0.03]">
                      <td className="px-4 py-5 align-middle">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRowSelection(row.id)}
                          className="h-4 w-4 rounded border-white/20 bg-transparent text-lime-300 focus:ring-lime-300"
                          aria-label={`Select ${customerId}`}
                        />
                      </td>
                      <td className="px-4 py-5 align-middle">
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${avatarClassName}`}
                          >
                            {getInitial(customerId)}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-white">{customerId}</p>
                            <p className="text-xs text-slate-500">Profile ID: {row.id.slice(0, 8).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-5 text-sm text-white">{row.pointsBalance}</td>
                      <td className="px-4 py-5 text-sm text-white">{row.totalSpentEur.toFixed(2)} EUR</td>
                      <td className="px-4 py-5 text-sm text-white">
                        {new Date(row.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="mt-5 flex flex-col gap-4 border-t border-white/8 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-400">
          {formatRange(startIndex, endIndex, totalCount)}
          {selectedCount > 0 ? ` • ${selectedCount} selected` : ""}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3 sm:justify-end">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goToPrevious}
              disabled={page === 1 || isLoading}
              className="rounded-full px-3 py-2 text-sm text-slate-400 transition hover:bg-white/6 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => goToPage(pageNumber)}
                disabled={isLoading}
                className={
                  pageNumber === page
                    ? "flex h-9 w-9 items-center justify-center rounded-full bg-lime-300 text-sm font-semibold text-slate-950 shadow-[0_0_0_6px_rgba(190,242,100,0.1)]"
                    : "flex h-9 w-9 items-center justify-center rounded-full text-sm text-slate-400 transition hover:bg-white/6 hover:text-white"
                }
              >
                {pageNumber}
              </button>
            ))}

            <button
              type="button"
              onClick={goToNext}
              disabled={page === totalPages || isLoading}
              className="rounded-full px-3 py-2 text-sm text-slate-400 transition hover:bg-white/6 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>

          <button
            type="button"
            onClick={copySelectedCustomerIds}
            disabled={selectedCustomerIds.length === 0}
            className="rounded-full border border-lime-300/30 bg-lime-300 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-lime-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Copy selected IDs
          </button>
        </div>
      </footer>
    </main>
  );
}
