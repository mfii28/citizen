import { prisma } from "@/lib/prisma";
import { Card, Badge } from "@/components/ui";
import { SurveyStatusSelect } from "@/components/admin/survey-status-select";
import { labelize } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminSurveysPage() {
  const reports = await prisma.surveyReport.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ocean-950 dark:text-white">Survey reports</h1>
      <div className="mt-6 space-y-3">
        {reports.map((r) => (
          <Card key={r.id} className="p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <Badge tone={r.urgency === "CRITICAL" || r.urgency === "HIGH" ? "gold" : "ocean"}>{labelize(r.category)}</Badge>
                <p className="mt-1 font-medium text-ocean-900 dark:text-white">{r.title}</p>
                <p className="text-xs text-ocean-500">{r.community}, {r.town} · {r.anonymous ? "Anonymous" : r.reporterName || "—"}</p>
                <p className="mt-2 text-sm text-ocean-600 dark:text-ocean-300">{r.description}</p>
              </div>
              <SurveyStatusSelect id={r.id} status={r.status} />
            </div>
          </Card>
        ))}
        {reports.length === 0 && <p className="text-sm text-ocean-500">No reports yet.</p>}
      </div>
    </div>
  );
}
