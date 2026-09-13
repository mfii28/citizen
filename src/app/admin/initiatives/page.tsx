import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button, Card, Badge } from "@/components/ui";
import { formatGHS } from "@/lib/utils";
import { deleteInitiative } from "@/lib/admin-actions";
import { ConfirmSubmitButton } from "@/components/admin/delete-button";

export const dynamic = "force-dynamic";

export default async function AdminInitiativesPage() {
  const initiatives = await prisma.initiative.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-ocean-950 dark:text-white">Initiatives</h1>
        <Button href="/admin/initiatives/new">+ New initiative</Button>
      </div>
      <div className="mt-6 space-y-3">
        {initiatives.map((i) => (
          <Card key={i.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <Badge tone={i.status === "ACTIVE" ? "leaf" : "ocean"}>{i.status}</Badge>
              <p className="mt-1 font-medium text-ocean-900 dark:text-white">{i.title}</p>
              <p className="text-xs text-ocean-500">{formatGHS(Number(i.amountRaised))} / {formatGHS(Number(i.budget))}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Link href={`/admin/initiatives/${i.id}/edit`} className="rounded-full bg-ocean-50 px-3 py-1.5 text-xs font-semibold text-ocean-700 dark:bg-ocean-800 dark:text-ocean-200">
                Edit
              </Link>
              <form action={deleteInitiative.bind(null, i.id)}>
                <ConfirmSubmitButton />
              </form>
            </div>
          </Card>
        ))}
        {initiatives.length === 0 && <p className="text-sm text-ocean-500">No initiatives yet.</p>}
      </div>
    </div>
  );
}
