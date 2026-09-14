"use client";

import { useState } from "react";
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  Building,
  Phone,
  Mail,
  MapPin,
  Search,
  Filter,
  Download,
  AlertCircle,
} from "lucide-react";
import {
  getApplications,
  updateApplicationStatus,
  type ApplicantEntry,
  type ApplicationStatus,
  type ApplicationType,
} from "@/lib/admin-store";
import { FilamentBadge } from "../filament/filament-badge";
import { downloadCsv } from "@/lib/export-csv";
import { formatDate } from "@/lib/utils";

export function AdminApplicationsDesk({
  coordinatorName,
  onNotify,
}: {
  coordinatorName: string;
  onNotify: (msg: string) => void;
}) {
  const [applications, setApplications] = useState<ApplicantEntry[]>(() => getApplications());
  const [filterType, setFilterType] = useState<string>("ALL");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantEntry | null>(null);

  const handleStatusChange = (id: string, newStatus: ApplicationStatus) => {
    const updated = updateApplicationStatus(id, newStatus, coordinatorName);
    setApplications(updated);
    if (selectedApplicant && selectedApplicant.id === id) {
      setSelectedApplicant({
        ...selectedApplicant,
        status: newStatus,
        reviewedBy: coordinatorName,
        reviewedAt: new Date().toISOString(),
      });
    }
    onNotify(
      newStatus === "APPROVED"
        ? `Approved application for ${applications.find((a) => a.id === id)?.name}`
        : `Rejected application for ${applications.find((a) => a.id === id)?.name}`
    );
  };

  const handleExport = () => {
    const headers = ["ID", "Name", "Type", "Status", "Email", "Phone", "Community", "Skills/Focus", "Organisation", "Applied At"];
    const rows = applications.map((a) => [
      a.id,
      a.name,
      a.type,
      a.status,
      a.email,
      a.phone,
      a.community,
      a.skillsOrFocus,
      a.organisation || "N/A",
      formatDate(new Date(a.appliedAt)),
    ]);
    downloadCsv("south_tongu_applications_roster.csv", [headers, ...rows]);
    onNotify("Exported applications roster CSV");
  };

  const filtered = applications.filter((app) => {
    if (filterType !== "ALL" && app.type !== filterType) return false;
    if (filterStatus !== "ALL" && app.status !== filterStatus) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.name.toLowerCase().includes(q) ||
      app.email.toLowerCase().includes(q) ||
      app.community.toLowerCase().includes(q) ||
      app.skillsOrFocus.toLowerCase().includes(q) ||
      (app.organisation && app.organisation.toLowerCase().includes(q))
    );
  });

  const pendingCount = applications.filter((a) => a.status === "PENDING").length;

  return (
    <div className="space-y-6">
      {/* Desk Subheader */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg font-bold text-ocean-950 dark:text-white">
              Civic Applications Review Desk
            </h2>
            {pendingCount > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
                <Clock className="h-3 w-3" /> {pendingCount} Pending Triage
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-ocean-600 dark:text-ocean-400">
            Incoming volunteer registrations, ambassador pledges, and institutional partnership proposals.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 rounded-lg border border-ocean-200 bg-white px-3 py-1.5 text-xs font-semibold text-ocean-800 shadow-xs hover:bg-ocean-50 dark:border-ocean-700 dark:bg-ocean-900 dark:text-ocean-200 dark:hover:bg-ocean-800"
        >
          <Download className="h-3.5 w-3.5 text-ocean-500" /> Export CSV
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: "ALL", label: `All (${applications.length})` },
            { id: "PENDING", label: `Pending (${pendingCount})` },
            { id: "APPROVED", label: "Approved" },
            { id: "REJECTED", label: "Rejected" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                filterStatus === tab.id
                  ? "bg-amber-500 text-ocean-950 shadow-xs"
                  : "bg-white text-ocean-700 hover:bg-ocean-100 dark:bg-ocean-900 dark:text-ocean-300 dark:hover:bg-ocean-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Type dropdown filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-lg border border-ocean-200 bg-white px-2.5 py-1.5 text-xs font-medium text-ocean-800 dark:border-ocean-700 dark:bg-ocean-900 dark:text-ocean-200"
          >
            <option value="ALL">All Roles</option>
            <option value="VOLUNTEER">Volunteers</option>
            <option value="AMBASSADOR">Ambassadors</option>
            <option value="PARTNER">Institutional Partners</option>
          </select>

          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-ocean-400" />
            <input
              type="text"
              placeholder="Search applicants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 rounded-lg border border-ocean-200 bg-white py-1.5 pl-8 pr-3 text-xs text-ocean-900 placeholder:text-ocean-400 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="overflow-hidden rounded-xl border border-ocean-200/80 bg-white shadow-xs dark:border-ocean-800 dark:bg-[#0c1322]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-ocean-100 bg-ocean-50/70 font-semibold uppercase tracking-wider text-ocean-500 dark:border-ocean-800/80 dark:bg-ocean-900/50 dark:text-ocean-400">
              <tr>
                <th className="px-4 py-3">Applicant & Role</th>
                <th className="px-4 py-3">Community / Area</th>
                <th className="px-4 py-3">Skills / Focus</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Applied</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ocean-100 dark:divide-ocean-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-ocean-500">
                    No applications matching current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app.id} className="transition hover:bg-ocean-50/50 dark:hover:bg-ocean-900/30">
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-ocean-950 dark:text-white">{app.name}</div>
                      <div className="flex items-center gap-1.5 text-[11px] text-ocean-500">
                        <span>{app.email}</span>
                        {app.organisation && (
                          <>
                            <span>·</span>
                            <span className="font-semibold text-amber-600 dark:text-amber-400">
                              {app.organisation}
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-ocean-700 dark:text-ocean-300">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-ocean-400" />
                        <span>{app.community}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 max-w-xs truncate text-ocean-600 dark:text-ocean-300 font-medium">
                      {app.skillsOrFocus}
                    </td>
                    <td className="px-4 py-3.5">
                      <FilamentBadge
                        color={
                          app.status === "APPROVED"
                            ? "success"
                            : app.status === "REJECTED"
                            ? "danger"
                            : "warning"
                        }
                      >
                        {app.status}
                      </FilamentBadge>
                    </td>
                    <td className="px-4 py-3.5 text-[11px] text-ocean-500 whitespace-nowrap">
                      {formatDate(new Date(app.appliedAt))}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedApplicant(app)}
                          className="flex items-center gap-1 rounded-md border border-ocean-200 bg-white px-2 py-1 text-xs font-semibold text-ocean-700 hover:border-amber-500 hover:text-amber-600 dark:border-ocean-700 dark:bg-ocean-900 dark:text-ocean-300 dark:hover:text-amber-400"
                        >
                          <Eye className="h-3.5 w-3.5" /> Inspect
                        </button>

                        {app.status === "PENDING" && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(app.id, "APPROVED")}
                              title="Approve Application"
                              className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-1 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStatusChange(app.id, "REJECTED")}
                              title="Reject Application"
                              className="rounded-md border border-rose-500/30 bg-rose-500/10 p-1 text-rose-600 hover:bg-rose-500/20 dark:text-rose-400"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Applicant Inspection Drawer */}
      {selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedApplicant(null)}
            className="fixed inset-0 bg-ocean-950/60 backdrop-blur-xs transition-opacity"
          />

          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-ocean-100 bg-white p-6 shadow-2xl dark:border-ocean-800 dark:bg-ocean-950 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-ocean-100 pb-4 dark:border-ocean-800">
              <div>
                <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                  {selectedApplicant.type} APPLICATION
                </span>
                <h3 className="text-xl font-bold text-ocean-950 dark:text-white">
                  {selectedApplicant.name}
                </h3>
              </div>
              <FilamentBadge
                color={
                  selectedApplicant.status === "APPROVED"
                    ? "success"
                    : selectedApplicant.status === "REJECTED"
                    ? "danger"
                    : "warning"
                }
              >
                {selectedApplicant.status}
              </FilamentBadge>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 rounded-xl bg-ocean-50/60 p-3 dark:bg-ocean-900/40">
                <div>
                  <span className="block font-semibold text-ocean-500">Contact Email</span>
                  <span className="font-medium text-ocean-900 dark:text-white">{selectedApplicant.email}</span>
                </div>
                <div>
                  <span className="block font-semibold text-ocean-500">Phone Number</span>
                  <span className="font-medium text-ocean-900 dark:text-white">{selectedApplicant.phone}</span>
                </div>
                <div>
                  <span className="block font-semibold text-ocean-500">Community Base</span>
                  <span className="font-medium text-ocean-900 dark:text-white">{selectedApplicant.community}</span>
                </div>
                <div>
                  <span className="block font-semibold text-ocean-500">Organisation / Entity</span>
                  <span className="font-medium text-ocean-900 dark:text-white">
                    {selectedApplicant.organisation || "Individual Citizen"}
                  </span>
                </div>
              </div>

              <div>
                <span className="font-bold uppercase tracking-wider text-ocean-500">Skills / Focus Areas</span>
                <p className="mt-1 font-semibold text-ocean-900 dark:text-white">
                  {selectedApplicant.skillsOrFocus}
                </p>
              </div>

              <div>
                <span className="font-bold uppercase tracking-wider text-ocean-500">Statement of Purpose</span>
                <p className="mt-1 rounded-lg border border-ocean-100 bg-white p-3 leading-relaxed text-ocean-700 dark:border-ocean-800 dark:bg-ocean-900/60 dark:text-ocean-300">
                  &ldquo;{selectedApplicant.statement}&rdquo;
                </p>
              </div>

              {selectedApplicant.reviewedBy && (
                <div className="rounded-lg bg-emerald-500/10 p-2.5 text-emerald-800 dark:text-emerald-300">
                  Reviewed by <span className="font-bold">{selectedApplicant.reviewedBy}</span> on{" "}
                  {formatDate(new Date(selectedApplicant.reviewedAt || ""))}
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-ocean-100 pt-4 dark:border-ocean-800">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedApplicant.id, "APPROVED")}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                >
                  Approve Application
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedApplicant.id, "REJECTED")}
                  className="rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400"
                >
                  Reject
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedApplicant(null)}
                className="rounded-lg bg-ocean-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-ocean-800 dark:bg-white dark:text-ocean-950"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
