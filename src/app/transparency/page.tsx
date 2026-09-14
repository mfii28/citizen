import type { Metadata } from "next";
import { donations, expenditures, initiatives } from "@/lib/mock-data";
import { SectionHeading, Card } from "@/components/ui";
import { FundAllocationChart } from "@/components/charts/fund-allocation-chart";
import { DonationsTrendChart } from "@/components/charts/donations-trend-chart";
import { formatGHS } from "@/lib/utils";
import { format } from "date-fns";

export const metadata: Metadata = { title: "Transparency Dashboard" };

export default function TransparencyPage() {
  const successfulDonations = donations.filter((d) => d.status === "SUCCESS");
  const activeCount = initiatives.filter((i) => i.status === "ACTIVE").length;

  const totalRaised = successfulDonations.reduce((sum, d) => sum + d.amount, 0);
  const totalSpent = expenditures.reduce((sum, e) => sum + e.amount, 0);

  const allocationMap = new Map<string, number>();
  for (const e of expenditures) allocationMap.set(e.category, (allocationMap.get(e.category) ?? 0) + e.amount);
  const allocation = Array.from(allocationMap, ([name, value]) => ({ name: name.charAt(0) + name.slice(1).toLowerCase(), value }));

  const monthMap = new Map<string, { raised: number; spent: number }>();
  const bump = (date: Date, key: "raised" | "spent", amount: number) => {
    const label = format(date, "MMM yyyy");
    const entry = monthMap.get(label) ?? { raised: 0, spent: 0 };
    entry[key] += amount;
    monthMap.set(label, entry);
  };
  successfulDonations.forEach((d) => bump(d.createdAt, "raised", d.amount));
  expenditures.forEach((e) => bump(e.date, "spent", e.amount));
  const trend = Array.from(monthMap, ([month, v]) => ({ month, ...v }));

  const recentDonors = [...successfulDonations].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 6);

  const kpis = [
    { label: "Total donations received", value: formatGHS(totalRaised) },
    { label: "Amount spent", value: formatGHS(totalSpent) },
    { label: "Balance remaining", value: formatGHS(totalRaised - totalSpent) },
    { label: "Active campaigns", value: String(activeCount) },
  ];

  return (
    <section className="section-y">
      <div className="container-page">
        <SectionHeading
          eyebrow="Full visibility"
          title="Transparency Dashboard"
          description="Illustrative figures for this demo site, shown in the same format the live dashboard would use."
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((k) => (
            <Card key={k.label} className="p-5">
              <p className="font-mono text-2xl font-semibold text-ocean-950 dark:text-white">{k.value}</p>
              <p className="mt-1 text-sm text-ocean-600 dark:text-ocean-400">{k.label}</p>
            </Card>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h2 className="font-display font-semibold text-ocean-950 dark:text-white">Fund allocation</h2>
            <div className="mt-4"><FundAllocationChart data={allocation} /></div>
          </Card>
          <Card className="p-6">
            <h2 className="font-display font-semibold text-ocean-950 dark:text-white">Donations vs. expenditure</h2>
            <div className="mt-4"><DonationsTrendChart data={trend} /></div>
          </Card>
        </div>

        <div className="mt-10">
          <h2 className="font-display font-semibold text-ocean-950 dark:text-white">Recent donors</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentDonors.map((d) => (
              <Card key={d.id} className="flex items-center justify-between p-4 text-sm">
                <span className="text-ocean-800 dark:text-ocean-200">{d.anonymous ? "Anonymous supporter" : d.donorName || "Supporter"}</span>
                <span className="font-mono text-ocean-600 dark:text-ocean-400">{formatGHS(d.amount)}</span>
              </Card>
            ))}
          </div>
        </div>

        <p className="mt-10 text-xs text-ocean-600 dark:text-ocean-400">
          This dashboard runs entirely on static demo data — there is no live database behind it.
        </p>
      </div>
    </section>
  );
}
