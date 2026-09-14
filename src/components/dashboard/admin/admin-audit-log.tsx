"use client";

import { useState } from "react";
import { ShieldCheck, Clock, Search, Filter, History, User, CheckCircle2 } from "lucide-react";
import { getAuditLog, type AuditLogEntry } from "@/lib/admin-store";
import { FilamentBadge } from "../filament/filament-badge";
import { formatDate } from "@/lib/utils";

export function AdminAuditLog({ onNotify }: { onNotify: (msg: string) => void }) {
  const [logs] = useState<AuditLogEntry[]>(() => getAuditLog());
  const [filterType, setFilterType] = useState<string>("ALL");
  const [search, setSearch] = useState<string>("");

  const filtered = logs.filter((entry) => {
    if (filterType !== "ALL" && entry.entityType !== filterType) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      entry.actor.toLowerCase().includes(q) ||
      entry.action.toLowerCase().includes(q) ||
      entry.details.toLowerCase().includes(q) ||
      entry.entityId.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg font-bold text-ocean-950 dark:text-white">
              System Audit Trail &amp; Operational Log
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="h-3 w-3" /> Immutable Ledger
            </span>
          </div>
          <p className="mt-0.5 text-xs text-ocean-600 dark:text-ocean-400">
            Cryptographically timestamped record of all district coordinator actions, status updates, approvals, and financial ledger exports.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: "ALL", label: "All Events" },
            { id: "ISSUE", label: "Issues" },
            { id: "VOLUNTEER", label: "Volunteer Hours" },
            { id: "APPLICATION", label: "Applications" },
            { id: "FINANCE", label: "Finances" },
            { id: "SETTINGS", label: "Settings" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filterType === tab.id
                  ? "bg-amber-500 text-ocean-950 shadow-xs"
                  : "bg-white text-ocean-700 hover:bg-ocean-100 dark:bg-ocean-900 dark:text-ocean-300 dark:hover:bg-ocean-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-ocean-400" />
          <input
            type="text"
            placeholder="Search audit trail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-56 rounded-lg border border-ocean-200 bg-white py-1.5 pl-8 pr-3 text-xs text-ocean-900 placeholder:text-ocean-400 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
          />
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="rounded-xl border border-ocean-200/80 bg-white p-5 shadow-xs dark:border-ocean-800 dark:bg-[#0c1322]">
        <div className="relative border-l-2 border-ocean-200 pl-6 space-y-6 dark:border-ocean-800">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-xs text-ocean-500">No events found matching current query.</p>
          ) : (
            filtered.map((entry) => (
              <div key={entry.id} className="relative group">
                {/* Dot */}
                <div className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-amber-500 shadow-xs dark:border-ocean-950" />

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-ocean-950 dark:text-white">
                      {entry.action.replace(/_/g, " ")}
                    </span>
                    <FilamentBadge
                      color={
                        entry.entityType === "FINANCE"
                          ? "success"
                          : entry.entityType === "ISSUE"
                          ? "warning"
                          : entry.entityType === "VOLUNTEER"
                          ? "info"
                          : "gray"
                      }
                    >
                      {entry.entityType}
                    </FilamentBadge>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-ocean-500 font-mono">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(new Date(entry.timestamp))}</span>
                  </div>
                </div>

                <p className="mt-1 text-xs text-ocean-700 dark:text-ocean-300">
                  {entry.details}
                </p>

                <div className="mt-2 flex items-center gap-3 text-[10px] text-ocean-500">
                  <span className="flex items-center gap-1">
                    <User className="h-3 w-3 text-amber-500" />
                    <span className="font-semibold text-ocean-700 dark:text-ocean-300">{entry.actor}</span>
                  </span>
                  <span>·</span>
                  <span className="font-mono">Ref: #{entry.entityId}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
