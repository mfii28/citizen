import nextDynamic from "next/dynamic";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { resolveCoordinates } from "@/lib/communities";
import { SectionHeading } from "@/components/ui";
import type { MapPin } from "@/components/community-map";

export const metadata: Metadata = { title: "Community Map" };
export const dynamic = "force-dynamic";

const CommunityMap = nextDynamic(
  () => import("@/components/community-map").then((m) => m.CommunityMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[520px] items-center justify-center rounded-2xl bg-ocean-50 text-sm text-ocean-500 dark:bg-ocean-900">
        Loading map…
      </div>
    ),
  }
);

function urgencyTone(urgency: string): MapPin["tone"] {
  if (urgency === "CRITICAL") return "critical";
  if (urgency === "HIGH") return "high";
  if (urgency === "LOW") return "low";
  return "medium";
}

export default async function CommunityMapPage() {
  const reports = await prisma.surveyReport.findMany({ orderBy: { createdAt: "desc" } });

  const pins: MapPin[] = [];
  const unplaced: typeof reports = [];

  for (const r of reports) {
    const coords = resolveCoordinates(r.community, r.latitude, r.longitude);
    if (!coords) {
      unplaced.push(r);
      continue;
    }
    pins.push({
      id: r.id,
      lat: coords[0],
      lng: coords[1],
      title: r.title,
      description: `${r.community}, ${r.town} — ${r.status.replace("_", " ")}`,
      tone: urgencyTone(r.urgency),
    });
  }

  return (
    <section className="section-y">
      <div className="container-page">
        <SectionHeading
          eyebrow="See where the need is"
          title="Community Map"
          description="Every reported issue from the Community Survey, plotted across South Tongu District — this is what makes a report visible, not just filed away."
        />

        <div className="mt-8 flex flex-wrap gap-4 text-xs text-ocean-600 dark:text-ocean-300">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: "#dc2626" }} /> Critical</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: "#E8A233" }} /> High</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: "#1E8AA8" }} /> Medium</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: "#3D9A6C" }} /> Low</span>
        </div>

        <div className="mt-4">
          <CommunityMap pins={pins} />
        </div>

        {unplaced.length > 0 && (
          <p className="mt-4 text-xs text-ocean-500 dark:text-ocean-400">
            {unplaced.length} report{unplaced.length > 1 ? "s" : ""} from a community we don't have coordinates for
            yet aren&apos;t shown — add the community to <code>src/lib/communities.ts</code>, or capture GPS
            directly on the survey form.
          </p>
        )}
      </div>
    </section>
  );
}
