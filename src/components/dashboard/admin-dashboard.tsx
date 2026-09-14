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
  Download,
  MapPin,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  TrendingUp,
  ShieldCheck,
  Building,
  Eye,
  Phone,
  Navigation,
  Bell,
  Sparkles,
  RefreshCw,
  Plus,
  SlidersHorizontal,
  ChevronDown,
  Building2,
  Check,
  CheckSquare,
  Square,
  Lock,
  Award,
  Calendar,
  BookOpen,
  Mail,
  UserCheck,
  DollarSign,
  FileText,
  PlusCircle,
  Paperclip,
} from "lucide-react";
import type { LocalSession } from "@/lib/local-session";
import {
  initiatives,
  donations,
  expenditures,
  surveyReports,
  type SurveyReport,
  type SurveyStatus,
  type Initiative,
} from "@/lib/mock-data";
import { getLocalReports, type LocalSurveyReport } from "@/lib/local-reports";
import { Card, Badge, Button, ProgressBar } from "@/components/ui";
import { formatGHS, formatDate, percent } from "@/lib/utils";
import { labelize } from "@/types";
import type { VolunteerHourEntry } from "./volunteer-dashboard";
import { FilamentStatsOverview, type FilamentStat } from "./filament/filament-stats";
import { FilamentBadge } from "./filament/filament-badge";
import { FilamentTable, type FilamentColumn, type FilamentFilterTab } from "./filament/filament-table";
import { FilamentCommandPalette } from "./filament/filament-command-palette";
import { FilamentNotifications } from "./filament/filament-notifications";
import { cn } from "@/lib/utils";

// New modular admin subcomponents
import { AdminApplicationsDesk } from "./admin/admin-applications-desk";
import { AdminCertificateIssuer } from "./admin/admin-certificate-issuer";
import { AdminEventsManager } from "./admin/admin-events-manager";
import { AdminBlogCms } from "./admin/admin-blog-cms";
import { AdminAuditLog } from "./admin/admin-audit-log";
import { AdminSubscribersHub } from "./admin/admin-subscribers-hub";
import { AdminSettings } from "./admin/admin-settings";
import { CommunityMapExplorer } from "@/components/community-map-explorer";
import {
  getManualDonations,
  saveManualDonation,
  getManualExpenditures,
  saveManualExpenditure,
  addAuditEntry,
  type ManualDonationEntry,
  type ManualExpenditureEntry,
} from "@/lib/admin-store";

export type AdminTab =
  | "overview"
  | "issues"
  | "map"
  | "volunteers"
  | "applications"
  | "certificates"
  | "initiatives"
  | "events"
  | "blog"
  | "finances"
  | "audit"
  | "subscribers"
  | "settings";

const VOLUNTEER_STORAGE_KEY = "tcp:volunteer-hours";
const ISSUES_STORAGE_KEY = "tcp:admin-issue-statuses";
const MILESTONES_STORAGE_KEY = "tcp:admin-initiative-milestones";

function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csvContent = rows
    .map((e) =>
      e
        .map((val) => {
          const str = String(val ?? "").replace(/"/g, '""');
          return `"${str}"`;
        })
        .join(",")
    )
    .join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function AdminDashboard({ session }: { session: LocalSession }) {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Command palette & notifications
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Issues state with local status overrides
  const [statusOverrides, setStatusOverrides] = useState<Record<string, SurveyStatus>>({});
  const [issueFilterTab, setIssueFilterTab] = useState<string>("ALL");
  const [selectedIssue, setSelectedIssue] = useState<
    ((SurveyReport | LocalSurveyReport) & { status: SurveyStatus }) | null
  >(null);

  // Volunteer hours state
  const [volunteerEntries, setVolunteerEntries] = useState<VolunteerHourEntry[]>([]);
  const [volunteerFilterTab, setVolunteerFilterTab] = useState<string>("ALL");

  // Milestones state
  const [milestonesState, setMilestonesState] = useState<Record<string, boolean>>({});

  // Resolution notes & assigned officers
  const [resolutionNotes, setResolutionNotes] = useState<Record<string, string>>({
    "survey-s1": "Referred to South Tongu District Works Dept on 12 Sept for structural inspection.",
  });
  const [assignedOfficers, setAssignedOfficers] = useState<Record<string, string>>({
    "survey-s1": "Selorm Dzreke (District Coordinator)",
    "survey-s2": "Hon. Seth Agbenu (Assembly Liaison)",
  });

  // Initiatives state
  const [initiativesList, setInitiativesList] = useState<Initiative[]>(initiatives);
  const [newInitiativeModalOpen, setNewInitiativeModalOpen] = useState(false);

  // Manual finances state
  const [manualDonations, setManualDonations] = useState<ManualDonationEntry[]>(() => getManualDonations());
  const [manualExpenditures, setManualExpenditures] = useState<ManualExpenditureEntry[]>(() => getManualExpenditures());
  const [newDonationModalOpen, setNewDonationModalOpen] = useState(false);
  const [newExpenditureModalOpen, setNewExpenditureModalOpen] = useState(false);

  // Form states for New Initiative
  const [initTitle, setInitTitle] = useState("");
  const [initCategory, setInitCategory] = useState("Community Infrastructure");
  const [initBudget, setInitBudget] = useState(25000);
  const [initLocation, setInitLocation] = useState("Sogakope Central");
  const [initSummary, setInitSummary] = useState("");

  // Form states for Offline Donation
  const [donDonor, setDonDonor] = useState("");
  const [donAmount, setDonAmount] = useState(500);
  const [donMethod, setDonMethod] = useState<"CASH" | "DIRECT_MOMO" | "BANK_WIRE" | "ASSEMBLY_GRANT">("DIRECT_MOMO");
  const [donRef, setDonRef] = useState("");
  const [donNotes, setDonNotes] = useState("");

  // Form states for Logged Expenditure
  const [expDesc, setExpDesc] = useState("");
  const [expAmount, setExpAmount] = useState(350);
  const [expCat, setExpCat] = useState<"PROGRAMS" | "ADMINISTRATION" | "FUNDRAISING" | "COMMUNITY_WORKS">("COMMUNITY_WORKS");
  const [expInitTitle, setExpInitTitle] = useState("Youth Skills & Livelihood");
  const [expReceipt, setExpReceipt] = useState("receipt_invoice_ST_09.pdf");

  // Finances filter tab
  const [financesFilterTab, setFinancesFilterTab] = useState<string>("ALL");

  // Toast notice
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load from localStorage
  useEffect(() => {
    try {
      const rawHours = window.localStorage.getItem(VOLUNTEER_STORAGE_KEY);
      if (rawHours) setVolunteerEntries(JSON.parse(rawHours));

      const rawOverrides = window.localStorage.getItem(ISSUES_STORAGE_KEY);
      if (rawOverrides) setStatusOverrides(JSON.parse(rawOverrides));

      const rawMilestones = window.localStorage.getItem(MILESTONES_STORAGE_KEY);
      if (rawMilestones) setMilestonesState(JSON.parse(rawMilestones));
    } catch {
      // LocalStorage fallback
    }
  }, []);

  const handleUpdateStatus = (issueId: string, newStatus: SurveyStatus) => {
    const next = { ...statusOverrides, [issueId]: newStatus };
    setStatusOverrides(next);
    try {
      window.localStorage.setItem(ISSUES_STORAGE_KEY, JSON.stringify(next));
    } catch {}
    if (selectedIssue && selectedIssue.id === issueId) {
      setSelectedIssue({ ...selectedIssue, status: newStatus });
    }
    showToast(`Issue ${issueId} updated to ${newStatus}`);
  };

  const handleToggleVolunteerApproval = (entry: VolunteerHourEntry) => {
    const updated = volunteerEntries.map((e) =>
      e.id === entry.id
        ? {
            ...e,
            approved: !e.approved,
            approvedBy: !e.approved ? session.name : undefined,
            approvedAt: !e.approved ? new Date().toISOString() : undefined,
          }
        : e
    );
    setVolunteerEntries(updated);
    try {
      window.localStorage.setItem(VOLUNTEER_STORAGE_KEY, JSON.stringify(updated));
    } catch {}
    const volName = entry.volunteerName || "Akua Agbavitor";
    showToast(!entry.approved ? `Approved ${entry.hours}h for ${volName}` : `Reverted approval for ${volName}`);
  };

  const handleToggleMilestone = (key: string, current: boolean) => {
    const next = { ...milestonesState, [key]: !current };
    setMilestonesState(next);
    try {
      window.localStorage.setItem(MILESTONES_STORAGE_KEY, JSON.stringify(next));
    } catch {}
    showToast(`Milestone marked as ${!current ? "Delivered" : "In Progress"}`);
  };

  // Combined reports
  const allReports = useMemo(() => {
    const local = getLocalReports();
    const seeded = surveyReports;
    const combined = [...local, ...seeded];
    return combined.map((r) => ({
      ...r,
      status: statusOverrides[r.id] ?? r.status,
    }));
  }, [statusOverrides]);

  // Key metrics
  const totalRaised = donations.filter((d) => d.status === "SUCCESS").reduce((s, d) => s + d.amount, 0);
  const totalSpent = expenditures.reduce((s, e) => s + e.amount, 0);
  const resolvedIssues = allReports.filter((r) => r.status === "RESOLVED").length;
  const resolutionRate = allReports.length ? Math.round((resolvedIssues / allReports.length) * 100) : 0;
  const pendingHoursCount = volunteerEntries.filter((e) => !e.approved).length;
  const totalVolunteerHours = volunteerEntries.reduce((s, e) => s + e.hours, 1420);
  const criticalIssuesCount = allReports.filter((r) => r.urgency === "CRITICAL" && r.status !== "RESOLVED").length;

  // Filament Stats Overview Data
  const filamentStats: FilamentStat[] = [
    {
      id: "stat-funds",
      label: "Total Civic Funds",
      value: formatGHS(totalRaised),
      description: "+18.4% vs last quarter",
      descriptionIcon: "up",
      chart: [120, 140, 135, 180, 210, 230, 248],
      chartTone: "emerald",
    },
    {
      id: "stat-resolution",
      label: "Issue Resolution Rate",
      value: `${resolutionRate}%`,
      description: `${resolvedIssues} of ${allReports.length} resolved`,
      descriptionIcon: "up",
      chart: [65, 70, 72, 78, 82, 85, 89],
      chartTone: "sky",
    },
    {
      id: "stat-volunteers",
      label: "Verified Service Hours",
      value: `${totalVolunteerHours.toLocaleString()} hrs`,
      description: "+120 hrs logged this month",
      descriptionIcon: "up",
      chart: [850, 920, 1050, 1180, 1300, 1420],
      chartTone: "emerald",
    },
    {
      id: "stat-sla",
      label: "Critical Unassigned Triage",
      value: `${criticalIssuesCount} Urgent`,
      description: "Under 24hr SLA deadline",
      descriptionIcon: "down",
      chart: [5, 8, 6, 4, 7, 5, 3],
      chartTone: "amber",
    },
  ];

  interface FilamentNavItem {
    id: AdminTab;
    label: string;
    icon: any;
    badge?: string;
    badgeTone?: "danger" | "warning";
  }

  // Filament Navigation Groups
  const navigationGroups: { label: string; items: FilamentNavItem[] }[] = [
    {
      label: "OPERATIONS",
      items: [
        { id: "overview" as AdminTab, label: "Overview", icon: LayoutDashboard },
        {
          id: "issues" as AdminTab,
          label: "Community Issues",
          icon: AlertTriangle,
          badge: criticalIssuesCount > 0 ? `${criticalIssuesCount} Urgent` : undefined,
          badgeTone: "danger" as const,
        },
        { id: "map" as AdminTab, label: "Geospatial Map", icon: MapPin },
      ],
    },
    {
      label: "COMMUNITY & FIELD",
      items: [
        {
          id: "volunteers" as AdminTab,
          label: "Volunteer Hours",
          icon: Users,
          badge: pendingHoursCount > 0 ? `${pendingHoursCount} Pending` : undefined,
          badgeTone: "warning" as const,
        },
        {
          id: "applications" as AdminTab,
          label: "Applications Desk",
          icon: UserCheck,
          badge: "4 Active",
          badgeTone: "warning" as const,
        },
        { id: "certificates" as AdminTab, label: "Certificate Issuer", icon: Award },
      ],
    },
    {
      label: "PROGRAMS & CMS",
      items: [
        { id: "initiatives" as AdminTab, label: "Initiatives & Capital", icon: FolderGit2 },
        { id: "events" as AdminTab, label: "Community Events", icon: Calendar },
        { id: "blog" as AdminTab, label: "News & Editorial", icon: BookOpen },
      ],
    },
    {
      label: "FINANCE & AUDIT",
      items: [
        { id: "finances" as AdminTab, label: "Financial Ledger", icon: Receipt },
        { id: "audit" as AdminTab, label: "Audit Trail", icon: ShieldCheck },
      ],
    },
    {
      label: "SYSTEM",
      items: [
        { id: "subscribers" as AdminTab, label: "Newsletter Hub", icon: Mail },
        { id: "settings" as AdminTab, label: "District Settings", icon: SlidersHorizontal },
      ],
    },
  ];

  // CSV Exporters
  const handleExportIssues = () => {
    const headers = ["ID", "Title", "Community", "Town", "Urgency", "Status", "Date Reported", "Description"];
    const rows = allReports.map((r) => [r.id, r.title, r.community, r.town, r.urgency, r.status, formatDate(r.createdAt), r.description]);
    downloadCsv("south_tongu_community_issues.csv", [headers, ...rows]);
    showToast("Exported community issues CSV");
  };

  const handleExportFinances = () => {
    const headers = ["Type", "Reference", "Entity/Donor", "Category/Method", "Date", "Amount (GHS)"];
    const donationRows = donations.filter((d) => d.status === "SUCCESS").map((d) => ["DONATION", d.reference, d.anonymous ? "Anonymous" : d.donorName || "Supporter", d.method, formatDate(d.createdAt), d.amount]);
    const expenditureRows = expenditures.map((e) => ["EXPENDITURE", e.id, e.description, e.category, formatDate(e.date), `-${e.amount}`]);
    downloadCsv("south_tongu_financial_ledger.csv", [headers, ...donationRows, ...expenditureRows]);
    showToast("Exported financial ledger CSV");
  };

  // Filtered issues for FilamentTable
  const issuesTableData = useMemo(() => {
    if (issueFilterTab === "ALL") return allReports;
    return allReports.filter((r) => r.status === issueFilterTab || (issueFilterTab === "CRITICAL" && r.urgency === "CRITICAL"));
  }, [allReports, issueFilterTab]);

  const issueFilterTabs: FilamentFilterTab[] = [
    { id: "ALL", label: "All Records", badge: allReports.length },
    { id: "CRITICAL", label: "Critical Priority", badge: criticalIssuesCount, badgeTone: "danger" },
    { id: "SUBMITTED", label: "Submitted", badge: allReports.filter((r) => r.status === "SUBMITTED").length },
    { id: "IN_REVIEW", label: "In Review", badge: allReports.filter((r) => r.status === "IN_REVIEW").length },
    { id: "IN_PROGRESS", label: "In Progress", badge: allReports.filter((r) => r.status === "IN_PROGRESS").length },
    { id: "RESOLVED", label: "Resolved", badge: resolvedIssues, badgeTone: "success" },
  ];

  const issueColumns: FilamentColumn<any>[] = [
    {
      key: "id",
      header: "Code",
      sortable: true,
      className: "w-28 font-mono text-[11px] text-ocean-600 dark:text-ocean-400",
      render: (row) => `#${row.id.replace("survey-", "ISS-").slice(0, 9)}`,
    },
    {
      key: "title",
      header: "Issue Title & Location",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-ocean-950 dark:text-white line-clamp-1">{row.title}</p>
          <div className="flex items-center gap-1.5 text-[11px] text-ocean-500">
            <MapPin className="h-3 w-3 text-ocean-400" />
            <span>{row.community}</span>
            <span>·</span>
            <span>{row.town}</span>
          </div>
        </div>
      ),
    },
    {
      key: "urgency",
      header: "Urgency",
      sortable: true,
      render: (row) => {
        const color = row.urgency === "CRITICAL" ? "danger" : row.urgency === "HIGH" ? "warning" : row.urgency === "MEDIUM" ? "info" : "gray";
        return <FilamentBadge color={color}>{row.urgency}</FilamentBadge>;
      },
    },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (row) => {
        const color = row.status === "RESOLVED" ? "success" : row.status === "IN_PROGRESS" ? "info" : row.status === "IN_REVIEW" ? "warning" : "gray";
        return <FilamentBadge color={color}>{row.status.replace("_", " ")}</FilamentBadge>;
      },
    },
    {
      key: "createdAt",
      header: "Reported",
      sortable: true,
      className: "text-[11px] text-ocean-500 whitespace-nowrap",
      render: (row) => formatDate(row.createdAt),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right",
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedIssue(row)}
            title="Inspect & Triage Issue"
            className="flex items-center gap-1 rounded-md border border-ocean-200 bg-white px-2.5 py-1 text-xs font-semibold text-ocean-800 hover:border-amber-500 hover:text-amber-600 dark:border-ocean-700 dark:bg-ocean-900 dark:text-ocean-200 dark:hover:text-amber-400"
          >
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Inspect</span>
          </button>
        </div>
      ),
    },
  ];

  // Filtered finances for FilamentTable
  const combinedFinances = useMemo(() => {
    const list: any[] = [];
    donations
      .filter((d) => d.status === "SUCCESS")
      .forEach((d) => {
        list.push({
          id: d.id,
          type: "DONATION",
          reference: d.reference,
          entity: d.anonymous ? "Anonymous Supporter" : d.donorName || "Community Supporter",
          category: d.method.toUpperCase(),
          date: d.createdAt,
          amount: d.amount,
          tone: "success",
        });
      });
    manualDonations.forEach((d) => {
      list.push({
        id: d.id,
        type: "DONATION",
        reference: d.reference,
        entity: d.donorName,
        category: d.method.replace("_", " "),
        date: new Date(d.createdAt),
        amount: d.amount,
        tone: "success",
      });
    });
    expenditures.forEach((e) => {
      list.push({
        id: e.id,
        type: "EXPENDITURE",
        reference: e.id,
        entity: e.description,
        category: labelize(e.category),
        date: e.date,
        amount: -e.amount,
        tone: "expense",
      });
    });
    manualExpenditures.forEach((e) => {
      list.push({
        id: e.id,
        type: "EXPENDITURE",
        reference: e.id,
        entity: e.description,
        category: labelize(e.category),
        date: new Date(e.date),
        amount: -e.amount,
        tone: "expense",
      });
    });
    if (financesFilterTab === "DONATIONS") return list.filter((f) => f.type === "DONATION");
    if (financesFilterTab === "EXPENDITURES") return list.filter((f) => f.type === "EXPENDITURE");
    return list;
  }, [financesFilterTab, manualDonations, manualExpenditures]);

  const financeFilterTabs: FilamentFilterTab[] = [
    { id: "ALL", label: "All Ledger Rows", badge: combinedFinances.length },
    { id: "DONATIONS", label: "Civic Donations", badgeTone: "success" },
    { id: "EXPENDITURES", label: "Disbursements & Contractors" },
  ];

  const financeColumns: FilamentColumn<any>[] = [
    {
      key: "type",
      header: "Type",
      sortable: true,
      render: (row) => (
        <FilamentBadge color={row.type === "DONATION" ? "success" : "info"}>
          {row.type}
        </FilamentBadge>
      ),
    },
    {
      key: "reference",
      header: "Reference",
      className: "font-mono text-[11px] text-ocean-600 dark:text-ocean-400",
      render: (row) => row.reference,
    },
    {
      key: "entity",
      header: "Entity / Description",
      sortable: true,
      render: (row) => (
        <div>
          <p className="font-semibold text-ocean-950 dark:text-white line-clamp-1">{row.entity}</p>
          <p className="text-[11px] text-ocean-500">{row.category}</p>
        </div>
      ),
    },
    {
      key: "date",
      header: "Date",
      sortable: true,
      className: "text-[11px] text-ocean-500 whitespace-nowrap",
      render: (row) => formatDate(row.date),
    },
    {
      key: "amount",
      header: "Amount (GH₵)",
      sortable: true,
      className: "text-right font-mono font-bold",
      render: (row) => (
        <span className={row.amount > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}>
          {row.amount > 0 ? `+${formatGHS(row.amount)}` : `-${formatGHS(Math.abs(row.amount))}`}
        </span>
      ),
    },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-ocean-50/30 dark:bg-[#080d16] lg:flex-row">
      {/* ------------------------------------------------------------- */}
      {/* 1. FILAMENT APP SIDEBAR (Desktop & Mobile Drawer) */}
      {/* ------------------------------------------------------------- */}
      <aside
        className={cn(
          "flex h-full flex-col border-r border-ocean-200/70 bg-white transition-all duration-200 dark:border-ocean-800/80 dark:bg-[#0c1322]",
          isSidebarCollapsed ? "lg:w-20" : "lg:w-64",
          "max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:z-50 max-lg:w-72",
          mobileSidebarOpen ? "max-lg:translate-x-0" : "max-lg:-translate-x-full"
        )}
      >
        {/* Filament Brand Header */}
        <div className="flex h-16 items-center justify-between border-b border-ocean-100 px-4 dark:border-ocean-800/70">
          <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-sm font-bold text-ocean-950 shadow-xs">
              TC
            </div>
            {!isSidebarCollapsed && (
              <div className="overflow-hidden">
                <p className="truncate font-display text-sm font-bold text-ocean-950 dark:text-white leading-tight">
                  The Citizen Project
                </p>
                <div className="flex items-center gap-1">
                  <span className="truncate text-[10px] font-medium text-amber-600 dark:text-amber-400">
                    South Tongu Assembly
                  </span>
                  <ChevronDown className="h-3 w-3 text-ocean-400" />
                </div>
              </div>
            )}
          </Link>

          {/* Close for mobile */}
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="rounded p-1 text-ocean-400 hover:text-ocean-700 lg:hidden dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filament Navigation Groups */}
        <div className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
          {navigationGroups.map((group) => (
            <div key={group.label} className="space-y-1">
              {!isSidebarCollapsed && (
                <p className="px-2.5 pb-1 font-mono text-[10px] font-bold uppercase tracking-wider text-ocean-400 dark:text-ocean-500">
                  {group.label}
                </p>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    title={isSidebarCollapsed ? item.label : undefined}
                    className={cn(
                      "group relative flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-xs font-semibold transition",
                      isActive
                        ? "bg-amber-500/10 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200"
                        : "text-ocean-700 hover:bg-ocean-100/60 dark:text-ocean-300 dark:hover:bg-ocean-900/60",
                      isSidebarCollapsed && "justify-center px-0"
                    )}
                  >
                    {/* Active left pill indicator */}
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-amber-500" />
                    )}

                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition",
                        isActive
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-ocean-400 group-hover:text-ocean-700 dark:text-ocean-500 dark:group-hover:text-ocean-200"
                      )}
                    />

                    {!isSidebarCollapsed && (
                      <>
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span
                            className={cn(
                              "ml-auto rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                              item.badgeTone === "danger"
                                ? "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                                : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Collapse Toggle (Desktop) */}
        <div className="hidden border-t border-ocean-100 p-2 lg:block dark:border-ocean-800/70">
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="flex w-full items-center justify-center gap-2 rounded-lg p-2 text-xs font-semibold text-ocean-500 hover:bg-ocean-100 hover:text-ocean-900 dark:hover:bg-ocean-900 dark:hover:text-white"
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4" />
                <span>Collapse sidebar</span>
              </>
            )}
          </button>
        </div>

        {/* Filament User Profile Card */}
        <div className="border-t border-ocean-100 p-3 dark:border-ocean-800/70">
          <div
            className={cn(
              "flex items-center gap-2.5 rounded-xl bg-ocean-50/70 p-2 dark:bg-ocean-900/50",
              isSidebarCollapsed && "justify-center p-1"
            )}
          >
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-500 font-bold text-xs text-ocean-950">
              SD
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-ocean-900" />
            </div>
            {!isSidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-ocean-950 dark:text-white">
                  {session.name}
                </p>
                <p className="truncate text-[10px] text-ocean-500">
                  District Coordinator
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-ocean-950/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. FILAMENT MAIN CONTENT AREA */}
      {/* ------------------------------------------------------------- */}
      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-ocean-200/70 bg-white/95 px-4 backdrop-blur-sm sm:px-6 dark:border-ocean-800/80 dark:bg-ocean-950/95">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen(true)}
              className="rounded-lg p-1.5 text-ocean-600 hover:bg-ocean-100 lg:hidden dark:text-ocean-300 dark:hover:bg-ocean-900"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1.5 text-xs text-ocean-500 font-medium">
              <span className="font-semibold text-ocean-800 dark:text-ocean-300">Admin</span>
              <span>/</span>
              <span>Operations</span>
              <span>/</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400 capitalize">
                {activeTab}
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {/* Command Palette Trigger (Ctrl+K) */}
            <button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-ocean-200 bg-ocean-50/60 px-3 py-1.5 text-xs text-ocean-600 transition hover:border-amber-500 hover:bg-white dark:border-ocean-800 dark:bg-ocean-900/60 dark:text-ocean-300 dark:hover:bg-ocean-900"
            >
              <Search className="h-3.5 w-3.5 text-ocean-400" />
              <span className="hidden sm:inline">Search or jump to...</span>
              <kbd className="rounded bg-white px-1.5 py-0.2 font-mono text-[10px] font-semibold text-ocean-500 shadow-xs dark:bg-ocean-800">
                ⌘K
              </kbd>
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative flex h-9 w-9 items-center justify-center rounded-lg text-ocean-600 hover:bg-ocean-100 dark:text-ocean-300 dark:hover:bg-ocean-900"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-ocean-950" />
              </button>
              <FilamentNotifications
                isOpen={notificationsOpen}
                onClose={() => setNotificationsOpen(false)}
              />
            </div>

            {/* Public Portal Link */}
            <Link
              href="/"
              className="hidden sm:flex items-center gap-1.5 rounded-lg border border-ocean-200 px-3 py-1.5 text-xs font-semibold text-ocean-700 hover:bg-ocean-50 dark:border-ocean-800 dark:text-ocean-300 dark:hover:bg-ocean-900"
            >
              <ExternalLink className="h-3.5 w-3.5 text-ocean-400" />
              <span>Public Portal</span>
            </Link>
          </div>
        </header>

        {/* Filament Page Content Container */}
        <main className="flex-1 overflow-y-auto space-y-6 p-4 sm:p-6 lg:p-8">
          {/* Toast Notification Banner */}
          {toastMessage && (
            <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs font-semibold text-amber-900 dark:text-amber-300 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-amber-500" />
                <span>{toastMessage}</span>
              </div>
              <button onClick={() => setToastMessage(null)} className="text-amber-700 hover:text-amber-950">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Filament Page Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ocean-200/60 pb-5 dark:border-ocean-800/60">
            <div>
              <h1 className="font-display text-2xl font-bold text-ocean-950 dark:text-white sm:text-3xl">
                {activeTab === "overview" && "Operations Overview"}
                {activeTab === "issues" && "Community Issues Desk"}
                {activeTab === "map" && "South Tongu Geospatial Hotspots"}
                {activeTab === "volunteers" && "Volunteer Service Ledger"}
                {activeTab === "applications" && "Civic Applications Review Desk"}
                {activeTab === "certificates" && "Commendation & Certificate Issuer"}
                {activeTab === "initiatives" && "Civic Initiatives & Milestones"}
                {activeTab === "events" && "Community Outreach Events & RSVPs"}
                {activeTab === "blog" && "Civic News & Editorial CMS"}
                {activeTab === "finances" && "Financial Ledger & Paystack Audit"}
                {activeTab === "audit" && "System Audit Trail & Operations Log"}
                {activeTab === "subscribers" && "Newsletter & Broadcast Hub"}
                {activeTab === "settings" && "District Assembly & Platform Settings"}
              </h1>
              <p className="mt-1 text-xs text-ocean-600 dark:text-ocean-400">
                South Tongu District Assembly · Live verified operations database
              </p>
            </div>

            {/* Filament Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {activeTab === "issues" && (
                <>
                  <button
                    type="button"
                    onClick={handleExportIssues}
                    className="flex items-center gap-1.5 rounded-lg border border-ocean-200 bg-white px-3 py-2 text-xs font-semibold text-ocean-800 hover:bg-ocean-50 dark:border-ocean-700 dark:bg-ocean-900 dark:text-ocean-200"
                  >
                    <Download className="h-3.5 w-3.5" /> Export CSV
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (allReports[0]) setSelectedIssue(allReports[0]);
                    }}
                    className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-2 text-xs font-semibold text-ocean-950 hover:bg-amber-400 shadow-xs"
                  >
                    <Plus className="h-4 w-4" /> Triage First Issue
                  </button>
                </>
              )}

              {activeTab === "initiatives" && (
                <button
                  type="button"
                  onClick={() => setNewInitiativeModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-2 text-xs font-semibold text-ocean-950 hover:bg-amber-400 shadow-xs"
                >
                  <Plus className="h-4 w-4" /> Create New Initiative
                </button>
              )}

              {activeTab === "finances" && (
                <>
                  <button
                    type="button"
                    onClick={() => setNewDonationModalOpen(true)}
                    className="flex items-center gap-1.5 rounded-lg border border-ocean-200 bg-white px-3 py-2 text-xs font-semibold text-ocean-800 hover:bg-ocean-50 dark:border-ocean-700 dark:bg-ocean-900 dark:text-ocean-200"
                  >
                    <Plus className="h-3.5 w-3.5 text-emerald-500" /> Record Offline Donation
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewExpenditureModalOpen(true)}
                    className="flex items-center gap-1.5 rounded-lg border border-ocean-200 bg-white px-3 py-2 text-xs font-semibold text-ocean-800 hover:bg-ocean-50 dark:border-ocean-700 dark:bg-ocean-900 dark:text-ocean-200"
                  >
                    <Plus className="h-3.5 w-3.5 text-rose-500" /> Log Expenditure
                  </button>
                  <button
                    type="button"
                    onClick={handleExportFinances}
                    className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-2 text-xs font-semibold text-ocean-950 hover:bg-amber-400 shadow-xs"
                  >
                    <Download className="h-4 w-4" /> Export CSV
                  </button>
                </>
              )}

              {activeTab === "overview" && (
                <button
                  type="button"
                  onClick={() => showToast("Operational metrics refreshed with district servers")}
                  className="flex items-center gap-1.5 rounded-lg border border-ocean-200 bg-white px-3 py-2 text-xs font-semibold text-ocean-700 hover:bg-ocean-50 dark:border-ocean-700 dark:bg-ocean-900 dark:text-ocean-300"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Refresh Metrics
                </button>
              )}
            </div>
          </div>

          {/* ----------------------------------------------------------- */}
          {/* TAB 1: OVERVIEW (Filament Stats Widgets + Quick Dispatch) */}
          {/* ----------------------------------------------------------- */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Signature Filament Stats Overview */}
              <FilamentStatsOverview stats={filamentStats} />

              {/* Priority Action Items & Quick Triage Table */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-ocean-900 dark:text-white">
                      Priority Issues Requiring Dispatch
                    </h2>
                    <button
                      onClick={() => setActiveTab("issues")}
                      className="text-xs font-semibold text-amber-600 hover:underline dark:text-amber-400"
                    >
                      View all {allReports.length} issues &rarr;
                    </button>
                  </div>

                  <FilamentTable
                    columns={issueColumns}
                    data={allReports.slice(0, 5)}
                    searchPlaceholder="Filter emergency reports..."
                  />
                </div>

                {/* Right Rail: Volunteer Pipeline & Quick Summary */}
                <div className="space-y-4">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-ocean-900 dark:text-white">
                    Volunteer Audit Queue
                  </h2>
                  <div className="rounded-xl border border-ocean-100 bg-white p-4 dark:border-ocean-800 dark:bg-ocean-950">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-ocean-600 dark:text-ocean-400">
                        Unverified Submissions
                      </span>
                      <FilamentBadge color={pendingHoursCount > 0 ? "warning" : "success"}>
                        {pendingHoursCount} Pending
                      </FilamentBadge>
                    </div>

                    <div className="mt-4 space-y-3">
                      {volunteerEntries.slice(0, 3).map((v) => (
                        <div key={v.id} className="flex items-center justify-between border-t border-ocean-100 pt-3 dark:border-ocean-800">
                          <div>
                            <p className="text-xs font-semibold text-ocean-950 dark:text-white">{v.volunteerName || "Akua Agbavitor"}</p>
                            <p className="text-[11px] text-ocean-500">{v.hours} hrs · {v.description}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleVolunteerApproval(v)}
                            className={cn(
                              "rounded px-2 py-1 text-[11px] font-semibold transition",
                              v.approved
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                : "bg-amber-500 text-ocean-950 hover:bg-amber-400"
                            )}
                          >
                            {v.approved ? "Approved" : "Approve"}
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab("volunteers")}
                      className="mt-4 w-full rounded-lg border border-ocean-200 py-2 text-center text-xs font-semibold text-ocean-700 hover:bg-ocean-50 dark:border-ocean-700 dark:text-ocean-300 dark:hover:bg-ocean-900"
                    >
                      Open Full Volunteer Ledger &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* TAB 2: COMMUNITY ISSUES DESK (Filament Table Builder) */}
          {/* ----------------------------------------------------------- */}
          {activeTab === "issues" && (
            <div className="space-y-4">
              <FilamentTable
                columns={issueColumns}
                data={issuesTableData}
                filterTabs={issueFilterTabs}
                activeFilterTab={issueFilterTab}
                onFilterTabChange={setIssueFilterTab}
                searchPlaceholder="Search community reports by title, town, or location..."
                searchFields={["title", "community", "town", "description"]}
                bulkActions={[
                  {
                    label: "Mark In Progress",
                    icon: Clock,
                    onClick: (ids) => {
                      ids.forEach((id) => handleUpdateStatus(String(id), "IN_PROGRESS"));
                      showToast(`Updated ${ids.length} issues to In Progress`);
                    },
                  },
                  {
                    label: "Export Selected CSV",
                    icon: Download,
                    onClick: (ids) => {
                      const sel = allReports.filter((r) => ids.includes(r.id));
                      const headers = ["ID", "Title", "Community", "Town", "Urgency", "Status"];
                      const rows = sel.map((r) => [r.id, r.title, r.community, r.town, r.urgency, r.status]);
                      downloadCsv("selected_issues.csv", [headers, ...rows]);
                      showToast(`Exported ${ids.length} selected issues`);
                    },
                  },
                ]}
              />
            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* TAB 3: VOLUNTEER SERVICE LEDGER */}
          {/* ----------------------------------------------------------- */}
          {activeTab === "volunteers" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-ocean-100 bg-white p-4 dark:border-ocean-800 dark:bg-ocean-950">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-wider text-ocean-900 dark:text-white">
                      Field Service Hours Audit
                    </h2>
                    <p className="text-xs text-ocean-500">
                      Verify civic ambassador hours logged across South Tongu programs
                    </p>
                  </div>
                  <FilamentBadge color={pendingHoursCount > 0 ? "warning" : "success"}>
                    {pendingHoursCount} Hours Logs Pending Review
                  </FilamentBadge>
                </div>

                <div className="divide-y divide-ocean-100 dark:divide-ocean-800">
                  {volunteerEntries.map((v) => (
                    <div key={v.id} className="flex flex-wrap items-center justify-between gap-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xs">
                          {(v.volunteerName || "Akua Agbavitor").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-ocean-900 dark:text-white">
                            {v.volunteerName || "Akua Agbavitor"}
                          </p>
                          <p className="text-[11px] text-ocean-500">
                            {v.description} · {v.hours} hrs on {v.date}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <FilamentBadge color={v.approved ? "success" : "warning"}>
                          {v.approved ? "Verified & Certified" : "Pending Verification"}
                        </FilamentBadge>

                        <button
                          type="button"
                          onClick={() => handleToggleVolunteerApproval(v)}
                          className={cn(
                            "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                            v.approved
                              ? "border border-ocean-200 text-ocean-600 hover:bg-ocean-50 dark:border-ocean-700 dark:text-ocean-300"
                              : "bg-amber-500 text-ocean-950 hover:bg-amber-400"
                          )}
                        >
                          {v.approved ? "Revert Approval" : "Verify Hours"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* TAB 4: INITIATIVES & MILESTONE DELIVERY */}
          {/* ----------------------------------------------------------- */}
          {activeTab === "initiatives" && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {initiativesList.map((init) => {
                const isMilestoneDelivered = milestonesState[`milestone-${init.id}`] ?? false;
                return (
                  <div
                    key={init.id}
                    className="rounded-xl border border-ocean-100 bg-white p-5 shadow-sm dark:border-ocean-800 dark:bg-ocean-950"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ocean-400">
                        {init.category}
                      </span>
                      <FilamentBadge color={isMilestoneDelivered ? "success" : "info"}>
                        {isMilestoneDelivered ? "Phase Delivered" : "In Progress"}
                      </FilamentBadge>
                    </div>

                    <h3 className="mt-2 text-base font-bold text-ocean-950 dark:text-white">
                      {init.title}
                    </h3>
                    <p className="mt-1 text-xs text-ocean-600 dark:text-ocean-400 line-clamp-2">
                      {init.description}
                    </p>

                    <div className="mt-4 border-t border-ocean-100 pt-3 dark:border-ocean-800">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-ocean-500">Milestone Delivery Status:</span>
                        <button
                          type="button"
                          onClick={() => handleToggleMilestone(`milestone-${init.id}`, isMilestoneDelivered)}
                          className={cn(
                            "flex items-center gap-1.5 rounded-md px-2.5 py-1 font-semibold transition text-xs",
                            isMilestoneDelivered
                              ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                              : "bg-amber-500/15 text-amber-700 dark:text-amber-300 hover:bg-amber-500/25"
                          )}
                        >
                          <Check className="h-3.5 w-3.5" />
                          <span>{isMilestoneDelivered ? "Marked Delivered" : "Mark as Delivered"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* TAB 5: FINANCIAL LEDGER & AUDIT */}
          {/* ----------------------------------------------------------- */}
          {activeTab === "finances" && (
            <div className="space-y-4">
              <FilamentTable
                columns={financeColumns}
                data={combinedFinances}
                filterTabs={financeFilterTabs}
                activeFilterTab={financesFilterTab}
                onFilterTabChange={setFinancesFilterTab}
                searchPlaceholder="Search ledger by reference, donor, or vendor..."
                searchFields={["reference", "entity", "category"]}
                bulkActions={[
                  {
                    label: "Export Selected Rows",
                    icon: Download,
                    onClick: (ids) => {
                      const sel = combinedFinances.filter((r) => ids.includes(r.id));
                      const headers = ["Type", "Reference", "Entity", "Category", "Date", "Amount"];
                      const rows = sel.map((r) => [r.type, r.reference, r.entity, r.category, formatDate(r.date), r.amount]);
                      downloadCsv("selected_finances.csv", [headers, ...rows]);
                      showToast(`Exported ${ids.length} selected financial records`);
                    },
                  },
                ]}
              />
            </div>
          )}

          {/* TAB 6: GEOSPATIAL MAP VIEW */}
          {activeTab === "map" && (
            <div className="space-y-4">
              <div className="overflow-hidden rounded-xl border border-ocean-200/80 bg-white p-4 shadow-xs dark:border-ocean-800 dark:bg-[#0c1322]">
                <CommunityMapExplorer seededReports={surveyReports} />
              </div>
            </div>
          )}

          {/* TAB 7: APPLICATIONS DESK */}
          {activeTab === "applications" && (
            <AdminApplicationsDesk coordinatorName={session.name} onNotify={showToast} />
          )}

          {/* TAB 8: CERTIFICATE ISSUER */}
          {activeTab === "certificates" && (
            <AdminCertificateIssuer coordinatorName={session.name} onNotify={showToast} />
          )}

          {/* TAB 9: COMMUNITY EVENTS */}
          {activeTab === "events" && (
            <AdminEventsManager coordinatorName={session.name} onNotify={showToast} />
          )}

          {/* TAB 10: EDITORIAL BLOG CMS */}
          {activeTab === "blog" && (
            <AdminBlogCms coordinatorName={session.name} onNotify={showToast} />
          )}

          {/* TAB 11: AUDIT TRAIL */}
          {activeTab === "audit" && (
            <AdminAuditLog onNotify={showToast} />
          )}

          {/* TAB 12: SUBSCRIBERS HUB */}
          {activeTab === "subscribers" && (
            <AdminSubscribersHub coordinatorName={session.name} onNotify={showToast} />
          )}

          {/* TAB 13: SETTINGS */}
          {activeTab === "settings" && (
            <AdminSettings coordinatorName={session.name} onNotify={showToast} />
          )}
        </main>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. FILAMENT SLIDE-OVER / MODAL TRIAGE DRAWER */}
      {/* ------------------------------------------------------------- */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedIssue(null)}
            className="fixed inset-0 bg-ocean-950/60 backdrop-blur-xs transition-opacity"
          />

          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-ocean-100 bg-white p-6 shadow-2xl dark:border-ocean-800 dark:bg-ocean-950 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-ocean-100 pb-4 dark:border-ocean-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                    #{selectedIssue.id.replace("survey-", "ISS-").slice(0, 10)}
                  </span>
                  <FilamentBadge color={selectedIssue.urgency === "CRITICAL" ? "danger" : "warning"}>
                    {selectedIssue.urgency}
                  </FilamentBadge>
                </div>
                <h3 className="mt-1 text-lg font-bold text-ocean-950 dark:text-white">
                  {selectedIssue.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedIssue(null)}
                className="rounded-lg p-1 text-ocean-400 hover:text-ocean-700 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              <div className="rounded-lg bg-ocean-50/70 p-3 text-xs text-ocean-700 dark:bg-ocean-900/40 dark:text-ocean-300">
                <span className="font-semibold text-ocean-900 dark:text-white">Field Narrative:</span>
                <p className="mt-1 leading-relaxed">{selectedIssue.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-lg border border-ocean-100 p-3 dark:border-ocean-800">
                  <span className="text-[10px] font-bold uppercase text-ocean-400">Location</span>
                  <p className="mt-1 font-semibold text-ocean-900 dark:text-white">
                    {selectedIssue.community}, {selectedIssue.town}
                  </p>
                </div>
                <div className="rounded-lg border border-ocean-100 p-3 dark:border-ocean-800">
                  <span className="text-[10px] font-bold uppercase text-ocean-400">Date Filed</span>
                  <p className="mt-1 font-semibold text-ocean-900 dark:text-white">
                    {formatDate(selectedIssue.createdAt)}
                  </p>
                </div>
              </div>

              {/* Status Dispatch Buttons */}
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-ocean-500">
                  Dispatch Operational Status
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(["SUBMITTED", "IN_REVIEW", "IN_PROGRESS", "RESOLVED"] as SurveyStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleUpdateStatus(selectedIssue.id, st)}
                      className={cn(
                        "rounded-lg border py-2 text-xs font-semibold transition",
                        selectedIssue.status === st
                          ? "border-amber-500 bg-amber-500 text-ocean-950 shadow-xs"
                          : "border-ocean-200 hover:border-ocean-300 dark:border-ocean-700 text-ocean-700 dark:text-ocean-300"
                      )}
                    >
                      {st.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Officer Assignment */}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-ocean-500">
                  Assigned Field Officer / Liaison
                </label>
                <select
                  value={assignedOfficers[selectedIssue.id] || "Selorm Dzreke (District Coordinator)"}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAssignedOfficers({ ...assignedOfficers, [selectedIssue.id]: val });
                    showToast(`Assigned issue to ${val}`);
                  }}
                  className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
                >
                  <option value="Selorm Dzreke (District Coordinator)">Selorm Dzreke (District Coordinator)</option>
                  <option value="Hon. Seth Agbenu (Assembly Liaison)">Hon. Seth Agbenu (Assembly Liaison)</option>
                  <option value="Kwesi Mensah (Field Operations Lead)">Kwesi Mensah (Field Operations Lead)</option>
                  <option value="Peace Kpodo (Community Health Lead)">Peace Kpodo (Community Health Lead)</option>
                  <option value="South Tongu District Works Dept">South Tongu District Works Dept</option>
                </select>
              </div>

              {/* Resolution & Works Notes */}
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-ocean-500">
                  Official Resolution &amp; Works Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Log contractor dispatch records, assembly referrals, or resolution notes..."
                  value={resolutionNotes[selectedIssue.id] || ""}
                  onChange={(e) => {
                    setResolutionNotes({ ...resolutionNotes, [selectedIssue.id]: e.target.value });
                  }}
                  className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
                />
                <p className="mt-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                  ✓ Automatic citizen SMS notification queued for {selectedIssue.phone || "+233 24 551 0921"}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 flex items-center justify-between border-t border-ocean-100 pt-4 dark:border-ocean-800">
              <span className="text-xs text-ocean-500 font-mono">
                Coordinator: {session.name}
              </span>
              <button
                type="button"
                onClick={() => setSelectedIssue(null)}
                className="rounded-lg bg-ocean-900 px-4 py-2 text-xs font-semibold text-white hover:bg-ocean-800 dark:bg-white dark:text-ocean-950"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. NEW INITIATIVE MODAL */}
      {newInitiativeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setNewInitiativeModalOpen(false)}
            className="fixed inset-0 bg-ocean-950/60 backdrop-blur-xs transition-opacity"
          />

          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-ocean-100 bg-white p-6 shadow-2xl dark:border-ocean-800 dark:bg-ocean-950 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-ocean-100 pb-3 dark:border-ocean-800">
              <h3 className="text-base font-bold text-ocean-950 dark:text-white">Create New Civic Initiative</h3>
              <button onClick={() => setNewInitiativeModalOpen(false)} className="rounded p-1 text-ocean-400 hover:text-ocean-700">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!initTitle.trim()) return;
                const newInit: Initiative = {
                  id: `init-${Date.now()}`,
                  slug: initTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                  title: initTitle,
                  summary: initSummary || "Community-driven civic initiative funded through district transparency partnerships.",
                  description: initSummary || "Community-driven civic initiative funded through district transparency partnerships.",
                  coverImage: null,
                  category: initCategory,
                  objectives: ["Civic mobilization", "Infrastructure restoration", "Community oversight"],
                  sdgTags: ["SDG 6: Clean Water", "SDG 11: Sustainable Communities"],
                  status: "ACTIVE",
                  budget: Number(initBudget),
                  amountRaised: 0,
                  location: initLocation,
                  beneficiaries: "3,500 residents",
                  volunteersInvolved: 15,
                  startDate: new Date(),
                  endDate: null,
                  createdAt: new Date(),
                  milestones: [
                    {
                      label: "Phase 1: Stakeholder Mobilization",
                      description: "Assembly approval and site scoping.",
                      date: new Date(),
                      status: "current",
                    },
                  ],
                };
                setInitiativesList([newInit, ...initiativesList]);
                setNewInitiativeModalOpen(false);
                setInitTitle("");
                setInitSummary("");
                addAuditEntry({
                  actor: session.name,
                  action: "INITIATIVE_CREATED",
                  entityType: "INITIATIVE",
                  entityId: newInit.id,
                  details: `Created new initiative: "${newInit.title}" (Budget: GHS ${newInit.budget.toLocaleString()})`,
                });
                showToast(`Created initiative "${newInit.title}"`);
              }}
              className="mt-4 space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
                  Initiative Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sogakope Youth Digital & Livelihoods Hub"
                  value={initTitle}
                  onChange={(e) => setInitTitle(e.target.value)}
                  className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
                    Category
                  </label>
                  <select
                    value={initCategory}
                    onChange={(e) => setInitCategory(e.target.value)}
                    className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
                  >
                    <option value="Community Infrastructure">Infrastructure</option>
                    <option value="Youth Empowerment">Youth Empowerment</option>
                    <option value="Civic Education">Civic Education</option>
                    <option value="Environmental Sanitation">Sanitation &amp; Ecology</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
                    Target Budget (GHS) *
                  </label>
                  <input
                    type="number"
                    required
                    value={initBudget}
                    onChange={(e) => setInitBudget(Number(e.target.value))}
                    className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
                  Location / Community Area
                </label>
                <input
                  type="text"
                  value={initLocation}
                  onChange={(e) => setInitLocation(e.target.value)}
                  className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
                  Summary &amp; Community Impact
                </label>
                <textarea
                  rows={3}
                  placeholder="Outline key community outcomes, beneficiaries, and milestones..."
                  value={initSummary}
                  onChange={(e) => setInitSummary(e.target.value)}
                  className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 border-t border-ocean-100 pt-3 dark:border-ocean-800">
                <button
                  type="button"
                  onClick={() => setNewInitiativeModalOpen(false)}
                  className="rounded-lg border border-ocean-200 px-3 py-1.5 font-semibold text-ocean-700 hover:bg-ocean-50 dark:border-ocean-700 dark:text-ocean-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-amber-500 px-4 py-1.5 font-bold text-ocean-950 hover:bg-amber-400"
                >
                  Save Initiative
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MANUAL OFFLINE DONATION MODAL */}
      {newDonationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setNewDonationModalOpen(false)}
            className="fixed inset-0 bg-ocean-950/60 backdrop-blur-xs transition-opacity"
          />

          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-ocean-100 bg-white p-6 shadow-2xl dark:border-ocean-800 dark:bg-ocean-950 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-ocean-100 pb-3 dark:border-ocean-800">
              <h3 className="text-base font-bold text-ocean-950 dark:text-white">Record Offline / Direct Donation</h3>
              <button onClick={() => setNewDonationModalOpen(false)} className="rounded p-1 text-ocean-400 hover:text-ocean-700">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!donDonor.trim()) return;
                const ref = donRef.trim() || `OFFLINE-${Date.now().toString().slice(-6)}`;
                const next = saveManualDonation(
                  {
                    donorName: donDonor,
                    donorEmail: "manual.donor@offline.org",
                    amount: Number(donAmount),
                    method: donMethod,
                    reference: ref,
                    notes: donNotes,
                    recordedBy: session.name,
                  },
                  session.name
                );
                setManualDonations(next);
                setNewDonationModalOpen(false);
                setDonDonor("");
                setDonRef("");
                setDonNotes("");
                showToast(`Recorded offline donation of GHS ${donAmount.toLocaleString()} from ${donDonor}`);
              }}
              className="mt-4 space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
                  Donor / Entity Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. South Tongu Traders Association"
                  value={donDonor}
                  onChange={(e) => setDonDonor(e.target.value)}
                  className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
                    Amount (GHS) *
                  </label>
                  <input
                    type="number"
                    required
                    value={donAmount}
                    onChange={(e) => setDonAmount(Number(e.target.value))}
                    className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={donMethod}
                    onChange={(e) => setDonMethod(e.target.value as any)}
                    className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
                  >
                    <option value="DIRECT_MOMO">Direct MoMo Transfer</option>
                    <option value="CASH">Cash Donation</option>
                    <option value="BANK_WIRE">Bank Wire Transfer</option>
                    <option value="ASSEMBLY_GRANT">Assembly Matching Grant</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
                  Transaction / Receipt Reference
                </label>
                <input
                  type="text"
                  placeholder="e.g. MTN-MOMO-882319 or CHQ-0041"
                  value={donRef}
                  onChange={(e) => setDonRef(e.target.value)}
                  className="w-full font-mono rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
                  Auditor Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Optional context on fund designation or donor requests..."
                  value={donNotes}
                  onChange={(e) => setDonNotes(e.target.value)}
                  className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 border-t border-ocean-100 pt-3 dark:border-ocean-800">
                <button
                  type="button"
                  onClick={() => setNewDonationModalOpen(false)}
                  className="rounded-lg border border-ocean-200 px-3 py-1.5 font-semibold text-ocean-700 hover:bg-ocean-50 dark:border-ocean-700 dark:text-ocean-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-amber-500 px-4 py-1.5 font-bold text-ocean-950 hover:bg-amber-400"
                >
                  Save to Audited Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. LOG EXPENDITURE MODAL */}
      {newExpenditureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setNewExpenditureModalOpen(false)}
            className="fixed inset-0 bg-ocean-950/60 backdrop-blur-xs transition-opacity"
          />

          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-ocean-100 bg-white p-6 shadow-2xl dark:border-ocean-800 dark:bg-ocean-950 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-ocean-100 pb-3 dark:border-ocean-800">
              <h3 className="text-base font-bold text-ocean-950 dark:text-white">Log Project Expenditure</h3>
              <button onClick={() => setNewExpenditureModalOpen(false)} className="rounded p-1 text-ocean-400 hover:text-ocean-700">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!expDesc.trim()) return;
                const next = saveManualExpenditure(
                  {
                    category: expCat,
                    description: expDesc,
                    amount: Number(expAmount),
                    date: new Date().toISOString(),
                    initiativeTitle: expInitTitle,
                    receiptFileName: expReceipt,
                    recordedBy: session.name,
                  },
                  session.name
                );
                setManualExpenditures(next);
                setNewExpenditureModalOpen(false);
                setExpDesc("");
                showToast(`Logged expenditure of GHS ${expAmount.toLocaleString()} for ${expDesc}`);
              }}
              className="mt-4 space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
                  Item Description &amp; Vendor *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 50 Bags of Cement from Sogakope Hardware Ltd"
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
                    Amount (GHS) *
                  </label>
                  <input
                    type="number"
                    required
                    value={expAmount}
                    onChange={(e) => setExpAmount(Number(e.target.value))}
                    className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
                    Expense Category
                  </label>
                  <select
                    value={expCat}
                    onChange={(e) => setExpCat(e.target.value as any)}
                    className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
                  >
                    <option value="COMMUNITY_WORKS">Community Works</option>
                    <option value="PROGRAMS">Program Delivery</option>
                    <option value="ADMINISTRATION">Administration &amp; Logistics</option>
                    <option value="FUNDRAISING">Civic Mobilization</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
                  Receipt / Invoice Filename Attachment
                </label>
                <div className="flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-ocean-400" />
                  <input
                    type="text"
                    value={expReceipt}
                    onChange={(e) => setExpReceipt(e.target.value)}
                    className="w-full font-mono rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 border-t border-ocean-100 pt-3 dark:border-ocean-800">
                <button
                  type="button"
                  onClick={() => setNewExpenditureModalOpen(false)}
                  className="rounded-lg border border-ocean-200 px-3 py-1.5 font-semibold text-ocean-700 hover:bg-ocean-50 dark:border-ocean-700 dark:text-ocean-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-rose-600 px-4 py-1.5 font-bold text-white hover:bg-rose-500"
                >
                  Save Expenditure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. FILAMENT COMMAND PALETTE MODAL (⌘K) */}
      <FilamentCommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigateTab={(t) => setActiveTab(t)}
        onSelectIssue={(id) => {
          const found = allReports.find((r) => r.id === id);
          if (found) setSelectedIssue(found);
        }}
      />
    </div>
  );
}
