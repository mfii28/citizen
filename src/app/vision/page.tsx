import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui";

export const metadata: Metadata = { title: "Our Vision" };

export default function VisionPage() {
  return (
    <section className="section-y">
      <div className="container-page max-w-3xl">
        <SectionHeading eyebrow="Looking ahead" title="Our Vision" />
        <p className="mt-6 text-lg text-ocean-700 dark:text-ocean-300">
          A South Tongu where every young person understands their power as a citizen — where civic
          responsibility, environmental care, and community solidarity are simply how people live, not
          a programme they once attended.
        </p>
        <p className="mt-4 text-ocean-600 dark:text-ocean-400">
          We envision a constituency where issues are reported and resolved instead of quietly endured, where
          volunteering is a normal part of growing up, and where the gains of one generation's civic education
          are visible in the next generation's communities.
        </p>
      </div>
    </section>
  );
}
