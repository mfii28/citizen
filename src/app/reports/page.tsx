import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SectionHeading, Card, Badge } from "@/components/ui";
import { FileText, Download } from "lucide-react";

export const metadata: Metadata = { title: "Reports" };
export const dynamic = "force-dynamic";

const TYPE_LABEL: Record<string, string> = {
  ANNUAL: "Annual Report",
  FINANCIAL: "Financial Statement",
  AUDIT: "Audit Report",
  IMPACT: "Impact Report",
};

export default async function ReportsPage() {
  const reports = await prisma.report.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <section className="section-y">
      <div className="container-page max-w-3xl">
        <SectionHeading
          eyebrow="Full disclosure"
          title="Annual Reports & Financial Statements"
          description="Published reports, audits, and impact summaries — the same transparency commitment as our live dashboard, in document form."
        />
        <div className="mt-8 space-y-3">
          {reports.map((r) => (
            <Card key={r.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-ocean-500" />
                <div>
                  <Badge>{TYPE_LABEL[r.type] ?? r.type}</Badge>
                  <p className="mt-1 font-medium text-ocean-900 dark:text-white">{r.title} ({r.year})</p>
                  {r.summary && <p className="text-sm text-ocean-600 dark:text-ocean-300">{r.summary}</p>}
                </div>
              </div>
              {r.fileUrl ? (
                <a href={r.fileUrl} className="flex items-center gap-1.5 rounded-full bg-ocean-50 px-3 py-1.5 text-xs font-semibold text-ocean-700 dark:bg-ocean-800 dark:text-ocean-200">
                  <Download className="h-3.5 w-3.5" /> Download
                </a>
              ) : (
                <span className="text-xs text-ocean-400">Upload pending</span>
              )}
            </Card>
          ))}
          {reports.length === 0 && <p className="text-ocean-500">No reports published yet.</p>}
        </div>
      </div>
    </section>
  );
}
