"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  AlertTriangle,
  Users,
  FolderGit2,
  Receipt,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Download,
  MapPin,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
  TrendingUp,
  ShieldCheck,
  Building,
} from "lucide-react";
import type { LocalSession } from "@/lib/local-session";
import {
  initiatives,
  donations,
  expenditures,
  surveyReports,
  type SurveyReport,
  type SurveyStatus,
} from "@/lib/mock-data";
import { getLocalReports, type LocalSurveyReport } from "@/lib/local-reports";
import { Card, Badge, Button, ProgressBar } from "@/components/ui";
import { formatGHS, formatDate, percent } from "@/lib/utils";
import { labelize } from "@/types";
import type { VolunteerHourEntry } from "./volunteer-dashboard";

type AdminTab = "overview" | "issues" | "volunteers" | "initiatives" | "finances";

const VOLUNTEER_STORAGE_KEY = "tcp:volunteer-hours";
const ISSUES_STORAGE_KEY = "tcp:admin-issue-statuses";

export function AdminDashboard({ session }: { session: LocalSession }) {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Issues state with local status overrides
  const [statusOverrides, setStatusOverrides] = useState<Record<string, SurveyStatus>>({});
  const [issueFilter, setIssueFilter] = useState<string>("ALL");
  const [issueSearch, setIssueSearch] = useState<string>("");

  // Volunteer hours state
  const [volunteerEntries, setVolunteerEntries] = useState<VolunteerHourEntry[]>([]);

  // Load volunteer hours & status overrides from localStorage
  useEffect(() => {
    try {
      const rawHours = window.localStorage.getItem(VOLUNTEER_STORAGE_KEY);
      if (rawHours) setVolunteerEntries(JSON.parse(rawHours));

      const rawOverrides = window.localStorage.getItem(ISSUES_STORAGE_KEY);
      if (rawOverrides) setStatusOverrides(JSON.parse(rawOverrides));
    } catch {
      // no-op
    }

    const handleHoursSync = (e: any) => {
      if (e.detail) setVolunteerEntries(e.detail);
    };
    window.addEventListener("tcp:volunteer-hours-changed", handleHoursSync);
    return () => window.removeEventListener("tcp:volunteer-hours-changed", handleHoursSync);
  }, []);

  // Update issue status
  const handleUpdateIssueStatus = (id: string, newStatus: SurveyStatus) => {
    const updated = { ...statusOverrides, [id]: newStatus };
    setStatusOverrides(updated);
    try {
      window.localStorage.setItem(ISSUES_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // no-op
    }
  };

  // Approve / Reject volunteer hour
  const handleToggleVolunteerApproval = (id: string, approve: boolean) => {
    const updated = volunteerEntries.map((e) => (e.id === id ? { ...e, approved: approve } : e));
    setVolunteerEntries(updated);
    try {
      window.localStorage.setItem(VOLUNTEER_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("tcp:volunteer-hours-changed", { detail: updated }));
    } catch {
      // no-op
    }
  };

  // Aggregate all reports (seeded + device local)
  const allReports = useMemo(() => {
    const local = getLocalReports();
    const seeded = surveyReports;
    const combined = [...local, ...seeded];
    return combined.map((r) => ({
      ...r,
      status: statusOverrides[r.id] ?? r.status,
    }));
  }, [statusOverrides]);

  const filteredReports = useMemo(() => {
    return allReports.filter((r) => {
      const matchesFilter = issueFilter === "ALL" || r.status === issueFilter;
      const matchesSearch =
        !issueSearch ||
        r.title.toLowerCase().includes(issueSearch.toLowerCase()) ||
        r.community.toLowerCase().includes(issueSearch.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [allReports, issueFilter, issueSearch]);

  // Key metrics
  const totalRaised = donations.filter((d) => d.status === "SUCCESS").reduce((s, d) => s + d.amount, 0);
  const totalSpent = expenditures.reduce((s, e) => s + e.amount, 0);
  const resolvedIssues = allReports.filter((r) => r.status === "RESOLVED").length;
  const resolutionRate = allReports.length ? Math.round((resolvedIssues / allReports.length) * 100) : 0;
  const pendingHoursCount = volunteerEntries.filter((e) => !e.approved).length;
  const criticalIssuesCount = allReports.filter((r) => r.urgency === "CRITICAL" && r.status !== "RESOLVED").length;

  const navItems = [
    { id: "overview" as AdminTab, label: "Overview", icon: LayoutDashboard },
    {
      id: "issues" as AdminTab,
      label: "Community Issues",
      icon: AlertTriangle,
      badge: criticalIssuesCount > 0 ? `${criticalIssuesCount} Urgent` : undefined,
      badgeTone: "gold",
    },
    {
      id: "volunteers" as AdminTab,
      label: "Volunteer Hours",
      icon: Users,
      badge: pendingHoursCount > 0 ? `${pendingHoursCount} Pending` : undefined,
      badgeTone: "leaf",
    },
    { id: "initiatives" as AdminTab, label: "Initiatives", icon: FolderGit2 },
    { id: "finances" as AdminTab, label: "Financial Ledger", icon: Receipt },
  ];

  return (
    <div className="flex min-h-[750px] flex-col rounded-2xl border border-ocean-100 bg-white shadow-sm dark:border-ocean-800 dark:bg-ocean-950 lg:flex-row">
      {/* Mobile Sidebar Toggle Header */}
      <div className="flex items-center justify-between border-b border-ocean-100 p-4 dark:border-ocean-800 lg:hidden">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-gold-500" />
          <span className="font-display font-semibold text-ocean-950 dark:text-white">Admin Operations</span>
        </div>
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="rounded-lg p-2 text-ocean-700 hover:bg-ocean-50 dark:text-ocean-200 dark:hover:bg-ocean-900"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          sidebarOpen ? "block" : "hidden"
        } w-full shrink-0 border-b border-ocean-100 bg-ocean-50/40 p-5 dark:border-ocean-800 dark:bg-ocean-900/40 lg:block lg:w-64 lg:border-b-0 lg:border-r`}
      >
        <div className="hidden items-center gap-2 pb-6 lg:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-500 text-ocean-950 font-bold text-xs">
            TCP
          </div>
          <div>
            <p className="font-display text-sm font-semibold text-ocean-950 dark:text-white leading-tight">
              South Tongu
            </p>
            <p className="text-[11px] font-mono text-ocean-600 dark:text-ocean-400">Operations Console</p>
          </div>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition ${
                  active
                    ? "bg-ocean-700 text-white shadow-sm"
                    : "text-ocean-700 hover:bg-ocean-100 dark:text-ocean-300 dark:hover:bg-ocean-800/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-medium ${
                      active ? "bg-white/20 text-white" : "bg-gold-300/30 text-gold-700 dark:text-gold-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-8 rounded-xl border border-ocean-200/60 bg-white p-3.5 text-xs dark:border-ocean-700/60 dark:bg-ocean-900">
          <p className="font-semibold text-ocean-950 dark:text-white">Admin Privileges</p>
          <p className="mt-1 text-[11px] text-ocean-600 dark:text-ocean-400">
            Authenticated as <strong className="text-ocean-800 dark:text-ocean-200">{session.name}</strong>. Real-time updates persist in your local environment.
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden p-6 sm:p-8">
        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-2xl font-semibold text-ocean-950 dark:text-white">
                District Executive Summary
              </h2>
              <p className="mt-1 text-sm text-ocean-600 dark:text-ocean-400">
                Operational status across South Tongu District initiatives, volunteer hours, and community issues.
              </p>
            </div>

            {/* Quick KPI Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="p-5">
                <p className="text-xs text-ocean-600 dark:text-ocean-400">Total Funds Raised</p>
                <p className="mt-2 font-mono text-2xl font-semibold text-ocean-950 dark:text-white">
                  {formatGHS(totalRaised)}
                </p>
                <div className="mt-2 flex items-center gap-1 text-[11px] text-leaf-600 dark:text-leaf-400">
                  <TrendingUp className="h-3.5 w-3.5" /> 100% tracked in public ledger
                </div>
              </Card>

              <Card className="p-5">
                <p className="text-xs text-ocean-600 dark:text-ocean-400">Total Expenditures</p>
                <p className="mt-2 font-mono text-2xl font-semibold text-ocean-950 dark:text-white">
                  {formatGHS(totalSpent)}
                </p>
                <p className="mt-2 text-[11px] text-ocean-500">
                  Balance: <strong className="font-mono text-ocean-800 dark:text-ocean-200">{formatGHS(totalRaised - totalSpent)}</strong>
                </p>
              </Card>

              <Card className="p-5">
                <p className="text-xs text-ocean-600 dark:text-ocean-400">Issue Resolution Rate</p>
                <p className="mt-2 font-mono text-2xl font-semibold text-ocean-950 dark:text-white">
                  {resolutionRate}%
                </p>
                <div className="mt-2">
                  <ProgressBar value={resolutionRate} />
                </div>
              </Card>

              <Card className="p-5">
                <p className="text-xs text-ocean-600 dark:text-ocean-400">Critical Open Issues</p>
                <p className="mt-2 font-mono text-2xl font-semibold text-red-600 dark:text-red-400">
                  {criticalIssuesCount}
                </p>
                <p className="mt-2 text-[11px] text-ocean-500">Requires district assembly liaison</p>
              </Card>
            </div>

            {/* Urgent Action Feed & Quick Shortcuts */}
            <div className="grid gap-8 lg:grid-cols-2">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-semibold text-ocean-950 dark:text-white">
                    Action Items Required
                  </h3>
                  <Badge tone="gold">{pendingHoursCount + criticalIssuesCount} Pending</Badge>
                </div>

                <div className="mt-4 space-y-3">
                  {criticalIssuesCount > 0 && (
                    <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/50 p-3.5 dark:border-red-900/40 dark:bg-red-950/20">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-ocean-950 dark:text-white">
                          High-Urgency Community Reports Pending
                        </p>
                        <p className="mt-0.5 text-[11px] text-ocean-600 dark:text-ocean-400">
                          {criticalIssuesCount} resident report(s) flagged as Critical require review or dispatch.
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab("issues")}
                        className="shrink-0 text-xs font-semibold text-ocean-700 underline dark:text-ocean-300"
                      >
                        Review
                      </button>
                    </div>
                  )}

                  {pendingHoursCount > 0 && (
                    <div className="flex items-start gap-3 rounded-xl border border-leaf-200 bg-leaf-50/50 p-3.5 dark:border-leaf-900/40 dark:bg-leaf-950/20">
                      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600 dark:text-leaf-400" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-ocean-950 dark:text-white">
                          Volunteer Service Hours Awaiting Approval
                        </p>
                        <p className="mt-0.5 text-[11px] text-ocean-600 dark:text-ocean-400">
                          {pendingHoursCount} volunteer submission(s) ready for district verification.
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab("volunteers")}
                        className="shrink-0 text-xs font-semibold text-ocean-700 underline dark:text-ocean-300"
                      >
                        Approve
                      </button>
                    </div>
                  )}

                  <div className="flex items-start gap-3 rounded-xl border border-ocean-100 bg-ocean-50/50 p-3.5 dark:border-ocean-800 dark:bg-ocean-900/40">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ocean-600 dark:text-ocean-300" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-ocean-950 dark:text-white">
                        Civic Education Curriculum Phase 2
                      </p>
                      <p className="mt-0.5 text-[11px] text-ocean-600 dark:text-ocean-400">
                        Next milestone event scheduled in Dabala on September 28.
                      </p>
                    </div>
                    <Link
                      href="/events"
                      className="shrink-0 text-xs font-semibold text-ocean-700 underline dark:text-ocean-300"
                    >
                      Calendar
                    </Link>
                  </div>
                </div>
              </Card>

              {/* District Initiatives Health */}
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-base font-semibold text-ocean-950 dark:text-white">
                    Active District Initiatives
                  </h3>
                  <Link
                    href="/initiatives"
                    className="text-xs font-semibold text-ocean-700 hover:text-ocean-950 dark:text-ocean-300"
                  >
                    View public page
                  </Link>
                </div>

                <div className="mt-4 space-y-4">
                  {initiatives.map((i) => (
                    <div key={i.id} className="border-b border-ocean-100 pb-3 last:border-0 last:pb-0 dark:border-ocean-800">
                      <div className="flex items-center justify-between">
                        <span className="truncate text-xs font-semibold text-ocean-900 dark:text-white">
                          {i.title}
                        </span>
                        <Badge tone={i.status === "ACTIVE" ? "leaf" : "ocean"}>{i.status}</Badge>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-ocean-600 dark:text-ocean-400">
                        <span>{formatGHS(i.amountRaised)} / {formatGHS(i.budget)}</span>
                        <span>{percent(i.amountRaised, i.budget)}%</span>
                      </div>
                      <div className="mt-1">
                        <ProgressBar value={percent(i.amountRaised, i.budget)} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* TAB 2: COMMUNITY ISSUES */}
        {activeTab === "issues" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-semibold text-ocean-950 dark:text-white">
                  Community Issues Triage
                </h2>
                <p className="mt-1 text-sm text-ocean-600 dark:text-ocean-400">
                  Manage reports flagged by South Tongu residents. Update live statuses to sync with the Community Map.
                </p>
              </div>

              <Button href="/community-map" size="sm" variant="secondary">
                <MapPin className="h-4 w-4" /> Open Full Map
              </Button>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-ocean-400" />
                <input
                  type="text"
                  placeholder="Search by community or title..."
                  value={issueSearch}
                  onChange={(e) => setIssueSearch(e.target.value)}
                  className="w-full rounded-lg border border-ocean-200 pl-9 pr-3 py-2 text-xs focus:border-ocean-500 dark:border-ocean-700 dark:bg-ocean-900"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-ocean-600 dark:text-ocean-400">Status:</span>
                <select
                  value={issueFilter}
                  onChange={(e) => setIssueFilter(e.target.value)}
                  className="rounded-lg border border-ocean-200 px-3 py-2 text-xs dark:border-ocean-700 dark:bg-ocean-900"
                >
                  <option value="ALL">All Statuses ({allReports.length})</option>
                  <option value="SUBMITTED">Submitted</option>
                  <option value="IN_REVIEW">In Review</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="RESOLVED">Resolved</option>
                </select>
              </div>
            </div>

            {/* Reports Table */}
            <div className="overflow-x-auto rounded-xl border border-ocean-100 dark:border-ocean-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-ocean-50/70 font-mono uppercase text-ocean-600 dark:bg-ocean-900/60 dark:text-ocean-300">
                  <tr>
                    <th className="p-3.5">Community</th>
                    <th className="p-3.5">Issue Title</th>
                    <th className="p-3.5">Urgency</th>
                    <th className="p-3.5">Reported</th>
                    <th className="p-3.5">Live Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ocean-100 dark:divide-ocean-800">
                  {filteredReports.map((r) => (
                    <tr key={r.id} className="hover:bg-ocean-50/30 dark:hover:bg-ocean-900/30 transition">
                      <td className="p-3.5 font-medium text-ocean-950 dark:text-white">
                        {r.community}
                        <span className="block text-[11px] text-ocean-500">{r.town}</span>
                      </td>
                      <td className="p-3.5 max-w-xs">
                        <p className="font-semibold text-ocean-900 dark:text-white truncate">{r.title}</p>
                        <p className="mt-0.5 line-clamp-1 text-ocean-600 dark:text-ocean-400">{r.description}</p>
                      </td>
                      <td className="p-3.5">
                        <Badge tone={r.urgency === "CRITICAL" ? "gold" : "ocean"}>
                          {r.urgency}
                        </Badge>
                      </td>
                      <td className="p-3.5 font-mono text-[11px] text-ocean-600 dark:text-ocean-400">
                        {formatDate(r.createdAt)}
                      </td>
                      <td className="p-3.5">
                        <select
                          value={r.status}
                          onChange={(e) => handleUpdateIssueStatus(r.id, e.target.value as SurveyStatus)}
                          className="rounded-md border border-ocean-200 bg-white px-2.5 py-1 text-xs font-semibold text-ocean-800 shadow-sm transition hover:border-ocean-400 dark:border-ocean-700 dark:bg-ocean-900 dark:text-ocean-200"
                        >
                          <option value="SUBMITTED">Submitted</option>
                          <option value="IN_REVIEW">In Review</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="RESOLVED">Resolved</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {filteredReports.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-ocean-500">
                        No community issues match the selected criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: VOLUNTEER APPROVALS */}
        {activeTab === "volunteers" && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-semibold text-ocean-950 dark:text-white">
                Volunteer Service Verification
              </h2>
              <p className="mt-1 text-sm text-ocean-600 dark:text-ocean-400">
                Review and approve logged volunteer hours before they reflect on the public Ambassador Leaderboard.
              </p>
            </div>

            <div className="space-y-3">
              {volunteerEntries.map((entry) => (
                <Card key={entry.id} className="flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-ocean-950 dark:text-white">{entry.description}</p>
                      <Badge tone={entry.approved ? "leaf" : "gold"}>
                        {entry.approved ? "Approved" : "Needs Verification"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-ocean-600 dark:text-ocean-400">
                      Initiative: <strong className="text-ocean-800 dark:text-ocean-200">{entry.initiativeTitle}</strong> · Date: {formatDate(entry.date)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-base font-semibold text-ocean-900 dark:text-white">
                      {entry.hours}h
                    </span>
                    {entry.approved ? (
                      <button
                        type="button"
                        onClick={() => handleToggleVolunteerApproval(entry.id, false)}
                        className="flex items-center gap-1 rounded-full border border-ocean-200 px-3 py-1.5 text-xs text-ocean-600 hover:bg-ocean-50 dark:border-ocean-700 dark:text-ocean-400"
                      >
                        <XCircle className="h-3.5 w-3.5" /> Revert
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleVolunteerApproval(entry.id, true)}
                          className="flex items-center gap-1 rounded-full bg-leaf-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-leaf-600"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const filtered = volunteerEntries.filter((v) => v.id !== entry.id);
                            setVolunteerEntries(filtered);
                            window.localStorage.setItem(VOLUNTEER_STORAGE_KEY, JSON.stringify(filtered));
                          }}
                          className="flex items-center gap-1 rounded-full border border-ocean-200 px-3 py-1.5 text-xs text-ocean-600 hover:bg-red-50 hover:text-red-600 dark:border-ocean-700 dark:text-ocean-400"
                        >
                          Dismiss
                        </button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}

              {volunteerEntries.length === 0 && (
                <Card className="p-8 text-center text-ocean-500">
                  No volunteer submissions logged in the system.
                </Card>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: INITIATIVES */}
        {activeTab === "initiatives" && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl font-semibold text-ocean-950 dark:text-white">
                Initiative Portfolios &amp; Budgets
              </h2>
              <p className="mt-1 text-sm text-ocean-600 dark:text-ocean-400">
                Track project deliverables, SDG mappings, and funding progress across South Tongu.
              </p>
            </div>

            <div className="grid gap-6">
              {initiatives.map((init) => (
                <Card key={init.id} className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap gap-1.5">
                        <Badge tone={init.status === "ACTIVE" ? "leaf" : "ocean"}>{init.status}</Badge>
                        {init.sdgTags.map((s) => (
                          <Badge key={s} tone="gold">{s}</Badge>
                        ))}
                      </div>
                      <h3 className="mt-2 font-display text-lg font-semibold text-ocean-950 dark:text-white">
                        {init.title}
                      </h3>
                      <p className="mt-1 text-xs text-ocean-600 dark:text-ocean-400 max-w-2xl">
                        {init.summary}
                      </p>
                    </div>

                    <Button href={`/initiatives/${init.slug}`} size="sm" variant="ghost">
                      View details <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Milestones list */}
                  {init.milestones.length > 0 && (
                    <div className="mt-4 border-t border-ocean-100 pt-4 dark:border-ocean-800">
                      <p className="font-mono text-xs uppercase tracking-wider text-ocean-500">Milestone Timeline</p>
                      <div className="mt-2 grid gap-2 sm:grid-cols-3">
                        {init.milestones.map((m) => (
                          <div
                            key={m.label}
                            className="rounded-lg border border-ocean-100 bg-ocean-50/40 p-2.5 text-xs dark:border-ocean-800 dark:bg-ocean-900/40"
                          >
                            <span className="font-semibold text-ocean-900 dark:text-white">{m.label}</span>
                            <span className="block text-[11px] text-ocean-600 dark:text-ocean-400 mt-0.5">{m.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 border-t border-ocean-100 pt-4 dark:border-ocean-800">
                    <div className="flex justify-between text-xs font-mono text-ocean-600 dark:text-ocean-400">
                      <span>Raised: {formatGHS(init.amountRaised)}</span>
                      <span>Target Budget: {formatGHS(init.budget)} ({percent(init.amountRaised, init.budget)}%)</span>
                    </div>
                    <div className="mt-1.5">
                      <ProgressBar value={percent(init.amountRaised, init.budget)} />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: FINANCIAL LEDGER */}
        {activeTab === "finances" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-semibold text-ocean-950 dark:text-white">
                  Audited Financial Ledger
                </h2>
                <p className="mt-1 text-sm text-ocean-600 dark:text-ocean-400">
                  Itemized record of receipts and community allocations for public transparency.
                </p>
              </div>

              <Button href="/transparency" size="sm" variant="secondary">
                Public Dashboard <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recent Donations Ledger */}
              <div>
                <h3 className="font-display text-base font-semibold text-ocean-950 dark:text-white mb-3">
                  Verified Donations
                </h3>
                <div className="overflow-x-auto rounded-xl border border-ocean-100 dark:border-ocean-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-ocean-50/70 font-mono text-ocean-600 dark:bg-ocean-900/60 dark:text-ocean-300">
                      <tr>
                        <th className="p-3">Ref</th>
                        <th className="p-3">Donor</th>
                        <th className="p-3">Method</th>
                        <th className="p-3">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ocean-100 dark:divide-ocean-800">
                      {donations.filter((d) => d.status === "SUCCESS").slice(0, 6).map((d) => (
                        <tr key={d.id}>
                          <td className="p-3 font-mono text-[11px] text-ocean-500">{d.reference}</td>
                          <td className="p-3 font-medium text-ocean-900 dark:text-white">
                            {d.anonymous ? "Anonymous" : d.donorName || "Supporter"}
                          </td>
                          <td className="p-3 text-ocean-600 dark:text-ocean-400">{d.method}</td>
                          <td className="p-3 font-mono font-semibold text-ocean-900 dark:text-white">
                            {formatGHS(d.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Expenditures Ledger */}
              <div>
                <h3 className="font-display text-base font-semibold text-ocean-950 dark:text-white mb-3">
                  Allocated Expenditures
                </h3>
                <div className="overflow-x-auto rounded-xl border border-ocean-100 dark:border-ocean-800">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-ocean-50/70 font-mono text-ocean-600 dark:bg-ocean-900/60 dark:text-ocean-300">
                      <tr>
                        <th className="p-3">Category</th>
                        <th className="p-3">Description</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Spent</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ocean-100 dark:divide-ocean-800">
                      {expenditures.slice(0, 6).map((e) => (
                        <tr key={e.id}>
                          <td className="p-3 font-medium text-ocean-900 dark:text-white">
                            <Badge tone="ocean">{labelize(e.category)}</Badge>
                          </td>
                          <td className="p-3 text-ocean-600 dark:text-ocean-400">{e.description}</td>
                          <td className="p-3 font-mono text-[11px] text-ocean-500">{formatDate(e.date)}</td>
                          <td className="p-3 font-mono font-semibold text-ocean-900 dark:text-white">
                            {formatGHS(e.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
