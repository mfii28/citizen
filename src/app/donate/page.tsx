import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { DonationForm } from "@/components/forms/donation-form";
import { Card, SectionHeading } from "@/components/ui";
import { formatGHS } from "@/lib/utils";

export const metadata: Metadata = { title: "Donate" };
export const dynamic = "force-dynamic";

export default async function DonatePage({ searchParams }: { searchParams: { initiative?: string } }) {
  const recentDonors = await prisma.donation.findMany({
    where: { status: "SUCCESS" },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return (
    <section className="section-y">
      <div className="container-page grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionHeading
            eyebrow="Fuel the work"
            title="Make a donation"
            description="One-time or monthly. Every donation — anonymous or not — shows up in our public transparency dashboard."
          />
          <Card className="mt-8 p-6 sm:p-8">
            <DonationForm initiativeId={searchParams.initiative} />
          </Card>

          <div className="mt-8 grid gap-4 text-sm text-ocean-600 dark:text-ocean-300 sm:grid-cols-2">
            <p>💛 <strong className="text-ocean-900 dark:text-white">Sponsor an initiative</strong> — link your gift to a specific project from the Initiatives page.</p>
            <p>🏢 <strong className="text-ocean-900 dark:text-white">Corporate giving</strong> — tick "corporate donation" above, or contact us for a partnership plan.</p>
            <p>🧾 <strong className="text-ocean-900 dark:text-white">Receipts &amp; certificates</strong> — emailed automatically once email delivery is connected (Phase 2).</p>
            <p>🔁 <strong className="text-ocean-900 dark:text-white">Monthly giving</strong> — cancel anytime; we'll add self-service management in Phase 2.</p>
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
                <span className="font-mono text-sm text-ocean-500 dark:text-ocean-400">{formatGHS(Number(d.amount))}</span>
              </Card>
            ))}
            {recentDonors.length === 0 && <p className="text-sm text-ocean-500">Be the first to donate.</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
