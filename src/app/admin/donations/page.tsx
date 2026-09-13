import { prisma } from "@/lib/prisma";
import { Card, Badge } from "@/components/ui";
import { formatGHS, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDonationsPage() {
  const donations = await prisma.donation.findMany({ orderBy: { createdAt: "desc" }, take: 100, include: { initiative: true } });
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ocean-950 dark:text-white">Donations</h1>
      <div className="mt-6 space-y-2">
        {donations.map((d) => (
          <Card key={d.id} className="flex flex-wrap items-center justify-between gap-2 p-4 text-sm">
            <div>
              <p className="font-medium text-ocean-900 dark:text-white">{d.anonymous ? "Anonymous" : d.donorName || d.donorEmail}</p>
              <p className="text-xs text-ocean-500">{d.initiative?.title ?? "General fund"} · {formatDate(d.createdAt)}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono">{formatGHS(Number(d.amount))}</span>
              <Badge tone={d.status === "SUCCESS" ? "leaf" : d.status === "PENDING" ? "gold" : "ocean"}>{d.status}</Badge>
            </div>
          </Card>
        ))}
        {donations.length === 0 && <p className="text-sm text-ocean-500">No donations yet.</p>}
      </div>
    </div>
  );
}
