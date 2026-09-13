import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, Badge, SectionHeading } from "@/components/ui";
import { formatGHS, formatDate } from "@/lib/utils";
import { CancelRecurringButton } from "@/components/cancel-recurring-button";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const [donations, favorites, recurring, volunteerAgg] = await Promise.all([
    prisma.donation.findMany({ where: { userId: session.user.id }, orderBy: { createdAt: "desc" }, include: { initiative: true } }),
    prisma.favorite.findMany({ where: { userId: session.user.id }, include: { initiative: true } }),
    prisma.recurringDonation.findMany({ where: { userId: session.user.id }, include: { initiative: true }, orderBy: { createdAt: "desc" } }),
    prisma.volunteerHour.aggregate({ where: { userId: session.user.id, approved: true }, _sum: { hours: true } }),
  ]);

  const totalHours = volunteerAgg._sum.hours ?? 0;

  return (
    <section className="section-y">
      <div className="container-page">
        <SectionHeading eyebrow="Your space" title={`Welcome, ${session.user.name?.split(" ")[0] ?? "friend"}`} />

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div>
              <h2 className="font-display text-lg font-semibold text-ocean-950 dark:text-white">Donation history</h2>
              <div className="mt-3 space-y-2">
                {donations.map((d) => (
                  <Card key={d.id} className="flex flex-wrap items-center justify-between gap-2 p-4 text-sm">
                    <div>
                      <p className="font-medium text-ocean-900 dark:text-white">{formatGHS(Number(d.amount))} · {d.initiative?.title ?? "General fund"}</p>
                      <p className="text-xs text-ocean-500">{formatDate(d.createdAt)} · {d.status}</p>
                    </div>
                    {d.status === "SUCCESS" && (
                      <a href={`/api/account/receipt/${d.id}`} className="rounded-full bg-ocean-50 px-3 py-1.5 text-xs font-semibold text-ocean-700 dark:bg-ocean-800 dark:text-ocean-200">
                        Download receipt
                      </a>
                    )}
                  </Card>
                ))}
                {donations.length === 0 && <p className="text-sm text-ocean-500">No donations recorded on this account yet.</p>}
              </div>
            </div>

            <div>
              <h2 className="font-display text-lg font-semibold text-ocean-950 dark:text-white">Recurring gifts</h2>
              <div className="mt-3 space-y-2">
                {recurring.map((r) => (
                  <Card key={r.id} className="flex flex-wrap items-center justify-between gap-2 p-4 text-sm">
                    <div>
                      <p className="font-medium text-ocean-900 dark:text-white">{formatGHS(Number(r.amount))}/month · {r.initiative?.title ?? "General fund"}</p>
                      <p className="text-xs text-ocean-500">Started {formatDate(r.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone={r.status === "ACTIVE" ? "leaf" : "ocean"}>{r.status}</Badge>
                      {r.status === "ACTIVE" && <CancelRecurringButton id={r.id} />}
                    </div>
                  </Card>
                ))}
                {recurring.length === 0 && <p className="text-sm text-ocean-500">No recurring gifts set up yet — start one from the Donate page.</p>}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="p-5">
              <p className="text-sm text-ocean-500">Signed in as</p>
              <p className="font-medium text-ocean-900 dark:text-white">{session.user.name}</p>
              <p className="text-sm text-ocean-500">{session.user.email}</p>
              {totalHours > 0 && (
                <>
                  <p className="mt-4 font-mono text-2xl font-semibold text-ocean-950 dark:text-white">{totalHours}</p>
                  <p className="text-xs text-ocean-500">Approved volunteer hours</p>
                  <a href="/api/account/certificate" className="mt-3 inline-block rounded-full bg-gold-500 px-4 py-2 text-xs font-semibold text-ocean-950 hover:bg-gold-400">
                    Download certificate
                  </a>
                </>
              )}
            </Card>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-ocean-500">Favorite initiatives</h2>
              <div className="mt-3 space-y-2">
                {favorites.map((f) => (
                  <Link key={f.id} href={`/initiatives/${f.initiative.slug}`}>
                    <Card className="p-3 text-sm hover:shadow-md">{f.initiative.title}</Card>
                  </Link>
                ))}
                {favorites.length === 0 && <p className="text-sm text-ocean-500">Nothing saved yet — heart an initiative to follow it here.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
