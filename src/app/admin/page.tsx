import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui";
import { formatGHS } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [donationAgg, initiativesActive, pendingSurveys, pendingPartners, recentSurveys] = await Promise.all([
    prisma.donation.aggregate({ where: { status: "SUCCESS" }, _sum: { amount: true }, _count: true }),
    prisma.initiative.count({ where: { status: "ACTIVE" } }),
    prisma.surveyReport.count({ where: { status: "SUBMITTED" } }),
    prisma.partner.count({ where: { status: "PENDING" } }),
    prisma.surveyReport.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const kpis = [
    { label: "Total raised", value: formatGHS(Number(donationAgg._sum.amount ?? 0)) },
    { label: "Donations recorded", value: String(donationAgg._count) },
    { label: "Active initiatives", value: String(initiativesActive) },
    { label: "Pending survey reports", value: String(pendingSurveys) },
    { label: "Pending partner applications", value: String(pendingPartners) },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ocean-950 dark:text-white">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((k) => (
          <Card key={k.label} className="p-5">
            <p className="font-mono text-2xl font-semibold text-ocean-950 dark:text-white">{k.value}</p>
            <p className="mt-1 text-sm text-ocean-500 dark:text-ocean-400">{k.label}</p>
          </Card>
        ))}
      </div>

      <h2 className="mt-10 font-display text-lg font-semibold text-ocean-950 dark:text-white">Recent survey reports</h2>
      <div className="mt-4 space-y-2">
        {recentSurveys.map((s) => (
          <Card key={s.id} className="flex flex-wrap items-center justify-between gap-2 p-4 text-sm">
            <span>{s.title} — {s.community}</span>
            <span className="font-mono text-xs text-ocean-500">{s.status}</span>
          </Card>
        ))}
        {recentSurveys.length === 0 && <p className="text-sm text-ocean-500">No reports yet.</p>}
      </div>
    </div>
  );
}
