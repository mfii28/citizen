import { prisma } from "@/lib/prisma";
import { Card, Badge } from "@/components/ui";
import { PartnerActions } from "@/components/admin/partner-actions";
import { labelize } from "@/types";

export const dynamic = "force-dynamic";

export default async function AdminPartnersPage() {
  const partners = await prisma.partner.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ocean-950 dark:text-white">Partners</h1>
      <div className="mt-6 space-y-3">
        {partners.map((p) => (
          <Card key={p.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <Badge tone={p.status === "APPROVED" ? "leaf" : p.status === "PENDING" ? "gold" : "ocean"}>{p.status}</Badge>
              <p className="mt-1 font-medium text-ocean-900 dark:text-white">{p.organisation ?? p.name}</p>
              <p className="text-xs text-ocean-500">{labelize(p.category)} · {p.email}</p>
            </div>
            <PartnerActions id={p.id} status={p.status} />
          </Card>
        ))}
        {partners.length === 0 && <p className="text-sm text-ocean-500">No applications yet.</p>}
      </div>
    </div>
  );
}
