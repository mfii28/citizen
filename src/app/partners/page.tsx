import type { Metadata } from "next";
import { partners } from "@/lib/mock-data";
import { SectionHeading, Card, Badge } from "@/components/ui";
import { PartnerForm } from "@/components/forms/partner-form";
import { labelize } from "@/types";

export const metadata: Metadata = { title: "Partners" };

export default function PartnersPage() {
  const approved = [...partners]
    .filter((p) => p.status === "APPROVED")
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <section className="section-y">
      <div className="container-page">
        <SectionHeading
          eyebrow="Join the coalition"
          title="Partners"
          description="Individuals, schools, institutions, and businesses working alongside The Citizen Project."
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {approved.map((p) => (
            <Card key={p.id} className="p-5">
              <Badge>{labelize(p.category)}</Badge>
              <h3 className="mt-2 font-display font-semibold text-ocean-950 dark:text-white">{p.organisation ?? p.name}</h3>
              <p className="mt-1 text-sm text-ocean-600 dark:text-ocean-300">{p.purpose}</p>
            </Card>
          ))}
          {approved.length === 0 && <p className="text-ocean-500">Be our first listed partner.</p>}
        </div>

        <div className="mt-14 max-w-2xl">
          <h2 className="font-display text-xl font-semibold text-ocean-950 dark:text-white">Apply to partner with us</h2>
          <p className="mt-2 text-sm text-ocean-600 dark:text-ocean-300">
            This is a demo site — applications submitted here aren&apos;t reviewed or stored anywhere.
          </p>
          <Card className="mt-6 p-6 sm:p-8">
            <PartnerForm />
          </Card>
        </div>
      </div>
    </section>
  );
}
