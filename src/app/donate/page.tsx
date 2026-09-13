import type { Metadata } from "next";
import { donations } from "@/lib/mock-data";
import { DonationForm } from "@/components/forms/donation-form";
import { Card, SectionHeading } from "@/components/ui";
import { formatGHS } from "@/lib/utils";

export const metadata: Metadata = { title: "Donate" };

export default function DonatePage({ searchParams }: { searchParams: { initiative?: string } }) {
  const recentDonors = [...donations]
    .filter((d) => d.status === "SUCCESS")
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 8);

  return (
    <section className="section-y">
      <div className="container-page grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionHeading
            eyebrow="Fuel the work"
            title="Make a donation"
            description="This is a demo site — donations shown here are illustrative and no payment is actually processed."
          />
          <Card className="mt-8 p-6 sm:p-8">
            <DonationForm initiativeId={searchParams.initiative} />
          </Card>

          <div className="mt-8 grid gap-4 text-sm text-ocean-600 dark:text-ocean-300 sm:grid-cols-2">
            <p>💛 <strong className="text-ocean-900 dark:text-white">Sponsor an initiative</strong> — link your gift to a specific project from the Initiatives page.</p>
            <p>🏢 <strong className="text-ocean-900 dark:text-white">Corporate giving</strong> — tick &quot;corporate donation&quot; above, or contact us for a partnership plan.</p>
          </div>
        </div>

        <div>
          <h2 className="font-display text-lg font-semibold text-ocean-950 dark:text-white">Donor wall</h2>
          <div className="mt-4 space-y-3">
            {recentDonors.map((d) => (
              <Card key={d.id} className="flex items-center justify-between p-4">
                <span className="text-sm font-medium text-ocean-800 dark:text-ocean-200">
                  {d.anonymous ? "Anonymous supporter" : d.donorName || "A generous donor"}
                </span>
                <span className="font-mono text-sm text-ocean-500 dark:text-ocean-400">{formatGHS(d.amount)}</span>
              </Card>
            ))}
            {recentDonors.length === 0 && <p className="text-sm text-ocean-500">Be the first to donate.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
