"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  CheckSquare,
  Square,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilamentColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  className?: string;
  render: (row: T) => React.ReactNode;
}

export interface FilamentFilterTab {
  id: string;
  label: string;
  badge?: number | string;
  badgeTone?: "danger" | "warning" | "success" | "gray";
}

export function FilamentTable<T extends { id: string | number }>({
  columns,
  data,
  searchPlaceholder = "Search records...",
  searchFields,
  filterTabs,
  activeFilterTab,
  onFilterTabChange,
  bulkActions,
  emptyMessage = "No records found.",
  defaultSortKey,
  defaultSortOrder = "desc",
}: {
  columns: FilamentColumn<T>[];
  data: T[];
  searchPlaceholder?: string;
  searchFields?: (keyof T)[];
  filterTabs?: FilamentFilterTab[];
  activeFilterTab?: string;
  onFilterTabChange?: (tabId: string) => void;
  bulkActions?: {
    label: string;
    icon?: any;
    onClick: (selectedIds: (string | number)[]) => void;
  }[];
  emptyMessage?: string;
  defaultSortKey?: string;
  defaultSortOrder?: "asc" | "desc";
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | undefined>(defaultSortKey);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(defaultSortOrder);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Search filtering
  const filteredData = useMemo(() => {
    let res = data;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      res = res.filter((item) => {
        if (searchFields && searchFields.length > 0) {
          return searchFields.some((field) => {
            const val = item[field];
            return String(val ?? "").toLowerCase().includes(q);
          });
        }
        return Object.values(item).some((val) =>
          String(val ?? "").toLowerCase().includes(q)
        );
      });
    }
    return res;
  }, [data, searchQuery, searchFields]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a: any, b: any) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.size === paginatedData.length && paginatedData.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedData.map((row) => row.id)));
    }
  };

  const handleToggleRow = (id: string | number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const isAllSelected = paginatedData.length > 0 && paginatedData.every((r) => selectedIds.has(r.id));
  const isSomeSelected = selectedIds.size > 0;

  return (
    <div className="overflow-hidden rounded-xl border border-ocean-100 bg-white shadow-sm dark:border-ocean-800 dark:bg-ocean-950">
      {/* 1. Filament Filter Tabs (if provided) */}
      {filterTabs && filterTabs.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 border-b border-ocean-100 bg-ocean-50/50 p-2 dark:border-ocean-800 dark:bg-ocean-900/40">
          {filterTabs.map((tab) => {
            const isActive = activeFilterTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  if (onFilterTabChange) onFilterTabChange(tab.id);
                  setPage(1);
                }}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                  isActive
                    ? "bg-white text-ocean-950 shadow-xs dark:bg-ocean-800 dark:text-white"
                    : "text-ocean-600 hover:bg-ocean-100/60 dark:text-ocean-400 dark:hover:bg-ocean-800/60"
                )}
              >
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.2 text-[10px] font-bold",
                      isActive
                        ? "bg-ocean-100 text-ocean-800 dark:bg-ocean-700 dark:text-ocean-200"
                        : "bg-ocean-200/50 text-ocean-600 dark:bg-ocean-800 dark:text-ocean-400",
                      tab.badgeTone === "danger" && "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                    )}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* 2. Filament Table Header Toolbar (Search + Bulk Actions) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 border-b border-ocean-100 dark:border-ocean-800">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ocean-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full rounded-lg border border-ocean-200 bg-white pl-9 pr-8 py-1.5 text-xs text-ocean-950 placeholder:text-ocean-400 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ocean-400 hover:text-ocean-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Bulk Action Bar (when rows selected) */}
        {isSomeSelected && bulkActions && bulkActions.length > 0 ? (
          <div className="flex items-center gap-2 animate-in fade-in duration-100">
            <span className="text-xs font-semibold text-ocean-700 dark:text-ocean-300">
              {selectedIds.size} selected
            </span>
            {bulkActions.map((ba) => {
              const Icon = ba.icon;
              return (
                <button
                  key={ba.label}
                  type="button"
                  onClick={() => ba.onClick(Array.from(selectedIds))}
                  className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-100 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-300"
                >
                  {Icon && <Icon className="h-3.5 w-3.5" />}
                  <span>{ba.label}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-ocean-500 font-mono">
              {sortedData.length} records total
            </span>
          </div>
        )}
      </div>

      {/* 3. Filament Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-ocean-800 dark:text-ocean-200">
          <thead className="bg-ocean-50/80 uppercase tracking-wider text-[11px] font-semibold text-ocean-600 border-b border-ocean-100 dark:bg-ocean-900/60 dark:border-ocean-800 dark:text-ocean-400">
            <tr>
              <th className="w-10 px-4 py-3">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="flex items-center text-ocean-400 hover:text-ocean-700 dark:hover:text-ocean-200"
                >
                  {isAllSelected ? (
                    <CheckSquare className="h-4 w-4 text-amber-500" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                </button>
              </th>
              {columns.map((col) => {
                return (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={cn(
                      "px-4 py-3 font-semibold",
                      col.sortable && "cursor-pointer select-none hover:text-ocean-950 dark:hover:text-white",
                      col.className
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="text-ocean-400">
                          {sortKey === col.key ? (
                            sortOrder === "asc" ? (
                              <ChevronUp className="h-3 w-3 text-amber-500" />
                            ) : (
                              <ChevronDown className="h-3 w-3 text-amber-500" />
                            )
                          ) : (
                            <ChevronsUpDown className="h-3 w-3 opacity-50" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-ocean-100 dark:divide-ocean-800/60">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="py-12 text-center text-sm text-ocean-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => {
                const isSelected = selectedIds.has(row.id);
                return (
                  <tr
                    key={row.id}
                    className={cn(
                      "transition hover:bg-ocean-50/50 dark:hover:bg-ocean-900/40",
                      isSelected && "bg-amber-500/5 dark:bg-amber-500/10"
                    )}
                  >
                    <td className="w-10 px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleToggleRow(row.id)}
                        className="flex items-center text-ocean-400 hover:text-ocean-700 dark:hover:text-ocean-200"
                      >
                        {isSelected ? (
                          <CheckSquare className="h-4 w-4 text-amber-500" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                    {columns.map((col) => (
                      <td key={col.key} className={cn("px-4 py-3", col.className)}>
                        {col.render(row)}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 4. Filament Table Pagination Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-ocean-100 bg-ocean-50/40 px-4 py-3 text-xs text-ocean-600 dark:border-ocean-800 dark:bg-ocean-900/40 dark:text-ocean-400">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="font-semibold text-ocean-900 dark:text-white">{(page - 1) * pageSize + 1}</strong> to{" "}
            <strong className="font-semibold text-ocean-900 dark:text-white">
              {Math.min(page * pageSize, sortedData.length)}
            </strong>{" "}
            of <strong className="font-semibold text-ocean-900 dark:text-white">{sortedData.length}</strong> results
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px]">Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-md border border-ocean-200 bg-white px-2 py-0.5 text-xs text-ocean-900 dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded p-1 text-ocean-600 hover:bg-ocean-100 disabled:opacity-40 dark:text-ocean-400 dark:hover:bg-ocean-800"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 text-xs font-semibold">
              {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded p-1 text-ocean-600 hover:bg-ocean-100 disabled:opacity-40 dark:text-ocean-400 dark:hover:bg-ocean-800"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
