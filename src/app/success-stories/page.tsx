import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SectionHeading, Card, Badge } from "@/components/ui";

export const metadata: Metadata = { title: "Success Stories" };
export const dynamic = "force-dynamic";

export default async function SuccessStoriesPage() {
  const stories = await prisma.successStory.findMany({ orderBy: { createdAt: "desc" }, include: { initiative: true } });

  return (
    <section className="section-y">
      <div className="container-page">
        <SectionHeading
          eyebrow="Real people, real change"
          title="Success Stories"
          description="Beneficiaries and outcomes behind the numbers on our Transparency and Impact pages."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((s) => (
            <Card key={s.id} className="overflow-hidden">
              <div className="flex h-36 items-center justify-center bg-gradient-to-br from-leaf-500 to-ocean-900 font-mono text-xs text-white">
                {s.initiative?.category ?? "Success Story"}
              </div>
              <div className="p-5">
                {s.impactMetric && <Badge tone="leaf">{s.impactMetric}</Badge>}
                <h3 className="mt-2 font-display font-semibold text-ocean-950 dark:text-white">{s.title}</h3>
                {s.beneficiaryName && <p className="mt-1 text-xs text-ocean-500">{s.beneficiaryName}</p>}
                <p className="mt-2 text-sm text-ocean-600 dark:text-ocean-300">{s.story}</p>
              </div>
            </Card>
          ))}
          {stories.length === 0 && <p className="text-ocean-500">Stories are on the way — check back soon.</p>}
        </div>
      </div>
    </section>
  );
}
