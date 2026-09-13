import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { InitiativeForm } from "@/components/admin/initiative-form";

export const dynamic = "force-dynamic";

export default async function EditInitiativePage({ params }: { params: { id: string } }) {
  const initiative = await prisma.initiative.findUnique({ where: { id: params.id } });
  if (!initiative) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ocean-950 dark:text-white">Edit initiative</h1>
      <div className="mt-6 max-w-2xl">
        <InitiativeForm
          initiative={{
            ...initiative,
            budget: Number(initiative.budget),
            amountRaised: Number(initiative.amountRaised),
          }}
        />
      </div>
    </div>
  );
}
