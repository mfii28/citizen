import type { Metadata } from "next";
import { surveyReports } from "@/lib/mock-data";
import { SectionHeading } from "@/components/ui";
import { CommunityMapExplorer } from "@/components/community-map-explorer";

export const metadata: Metadata = { title: "Community Map" };

export default function CommunityMapPage() {
  return (
    <section className="section-y">
      <div className="container-page">
        <SectionHeading
          eyebrow="See where the need is"
          title="Community Map"
          description="Every reported issue from the Community Survey, plotted across South Tongu District — this is what makes a report visible, not just filed away. Reports submitted from this device appear here instantly; open a pin to read the full report or download it as a PDF."
        />

        <div className="mt-8 flex flex-wrap gap-4 text-xs text-ocean-600 dark:text-ocean-300">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: "#dc2626" }} /> Critical</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: "#E8A233" }} /> High</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: "#1E8AA8" }} /> Medium</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: "#3D9A6C" }} /> Low</span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full border-2 border-dashed border-ocean-400" /> From this device
          </span>
        </div>

        <CommunityMapExplorer seededReports={surveyReports} />
      </div>
    </section>
  );
}
