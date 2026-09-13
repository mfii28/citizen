import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SectionHeading, Card } from "@/components/ui";

export const metadata: Metadata = { title: "Impact Dashboard" };
export const dynamic = "force-dynamic";

export default async function ImpactPage() {
  const [completed, active, upcoming, initiatives, surveyCommunities, volunteerAgg] = await Promise.all([
    prisma.initiative.count({ where: { status: "COMPLETED" } }),
    prisma.initiative.count({ where: { status: "ACTIVE" } }),
    prisma.initiative.count({ where: { status: "UPCOMING" } }),
    prisma.initiative.findMany({ select: { sdgTags: true, beneficiaries: true, volunteersInvolved: true, location: true } }),
    prisma.surveyReport.findMany({ select: { community: true }, distinct: ["community"] }),
    prisma.volunteerHour.aggregate({ _sum: { hours: true } }),
  ]);

  const sdgSet = new Set(initiatives.flatMap((i) => i.sdgTags));
  const volunteersInvolved = initiatives.reduce((sum, i) => sum + i.volunteersInvolved, 0);
  const trackedHours = volunteerAgg._sum.hours ?? 0;
  const communityLocations = new Set([
    ...surveyCommunities.map((s) => s.community.toLowerCase()),
    ...initiatives.map((i) => i.location).filter(Boolean).map((l) => (l as string).toLowerCase()),
  ]);
  const beneficiaryNotes = initiatives.map((i) => i.beneficiaries).filter(Boolean) as string[];

  const kpis = [
    { label: "Projects completed", value: completed },
    { label: "Active projects", value: active },
    { label: "Upcoming projects", value: upcoming },
    { label: "Communities reached", value: communityLocations.size },
    { label: "SDGs supported", value: sdgSet.size },
    { label: "Volunteers involved", value: volunteersInvolved },
  ];

  return (
    <section className="section-y">
      <div className="container-page">
        <SectionHeading
          eyebrow="The bigger picture"
          title="Impact Dashboard"
          description="A snapshot of reach and outcomes across every initiative — separate from the financial detail on the Transparency page."
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {kpis.map((k) => (
            <Card key={k.label} className="p-5">
              <p className="font-mono text-3xl font-semibold text-ocean-950 dark:text-white">{k.value}</p>
              <p className="mt-1 text-sm text-ocean-500 dark:text-ocean-400">{k.label}</p>
            </Card>
          ))}
        </div>

        {trackedHours > 0 && (
          <p className="mt-6 text-sm text-ocean-600 dark:text-ocean-300">
            <strong className="text-ocean-900 dark:text-white">{trackedHours}</strong> volunteer hours formally logged and approved.
          </p>
        )}

        {sdgSet.size > 0 && (
          <div className="mt-10">
            <h2 className="font-display text-lg font-semibold text-ocean-950 dark:text-white">SDGs supported</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {Array.from(sdgSet).map((s) => (
                <span key={s} className="rounded-full bg-gold-300/30 px-3 py-1 text-xs font-medium text-gold-600">{s}</span>
              ))}
            </div>
          </div>
        )}

        {beneficiaryNotes.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display text-lg font-semibold text-ocean-950 dark:text-white">Who this reaches</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-ocean-600 dark:text-ocean-300">
              {beneficiaryNotes.map((b) => <li key={b}>{b}</li>)}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
