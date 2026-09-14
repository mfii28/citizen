import type { SurveyReport } from "@/lib/mock-data";

// Reports submitted through the Survey form on this device. There is no
// backend yet (see PRODUCT.md), so a submitted report is saved to this
// browser's localStorage only — visible on this device's Community Map,
// not shared with other visitors, until a real backend is connected.

const STORAGE_KEY = "tcp:local-reports";

export type LocalSurveyReport = SurveyReport & { source: "local" };

export function getLocalReports(): LocalSurveyReport[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as (SurveyReport & { source: "local" })[];
    return parsed.map((r) => ({ ...r, createdAt: new Date(r.createdAt) }));
  } catch {
    return [];
  }
}

export function addLocalReport(report: Omit<LocalSurveyReport, "source">): LocalSurveyReport {
  const full: LocalSurveyReport = { ...report, source: "local" };
  if (typeof window !== "undefined") {
    try {
      const existing = getLocalReports();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([full, ...existing]));
    } catch {
      // localStorage unavailable (private browsing, quota, etc.) — the form
      // still shows a success message, it just won't appear on the map.
    }
  }
  return full;
}

export function generateLocalReportId(): string {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
