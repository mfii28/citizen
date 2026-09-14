"use client";

import Link from "next/link";
import { Heart, Bookmark, AlertCircle, ArrowRight, MapPin, PlusCircle, ExternalLink } from "lucide-react";
import type { LocalSession } from "@/lib/local-session";
import { getInitiativeBySlug } from "@/lib/mock-data";
import { getLocalReports } from "@/lib/local-reports";
import { Card, Badge, Button, ProgressBar } from "@/components/ui";
import { formatGHS, formatDate, percent } from "@/lib/utils";

const SAMPLE_DONATIONS = [
  { id: "sample-1", initiativeSlug: "global-citizenship-civic-education-programme", amount: 400, date: new Date("2026-08-01"), method: "Mobile Money", ref: "TCP-883192" },
  { id: "sample-2", initiativeSlug: "clean-communities-initiative", amount: 50, date: new Date("2026-07-01"), method: "Mobile Money", recurring: true, ref: "TCP-772910" },
];

export function UserDashboard({
  session,
  favoriteSlugs,
}: {
  session: LocalSession;
  favoriteSlugs: string[];
}) {
  const reports = getLocalReports();
  const totalDonated = SAMPLE_DONATIONS.reduce((sum, d) => sum + d.amount, 0);
  const favorites = favoriteSlugs.map((s) => getInitiativeBySlug(s)).filter(Boolean);

  return (
    <div className="space-y-8">
      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-300/30 text-gold-600 dark:text-gold-400">
            <Heart className="h-5 w-5" />
          </div>
          <p className="mt-3 font-mono text-2xl font-semibold text-ocean-950 dark:text-white">
            {formatGHS(totalDonated)}
          </p>
          <p className="text-xs text-ocean-600 dark:text-ocean-400">Total contributed to South Tongu</p>
        </Card>

        <Card className="p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ocean-100 text-ocean-700 dark:bg-ocean-800 dark:text-ocean-300">
            <Bookmark className="h-5 w-5" />
          </div>
          <p className="mt-3 font-mono text-2xl font-semibold text-ocean-950 dark:text-white">
            {favorites.length}
          </p>
          <p className="text-xs text-ocean-600 dark:text-ocean-400">Saved community initiatives</p>
        </Card>

        <Card className="p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-leaf-400/15 text-leaf-600 dark:text-leaf-400">
            <AlertCircle className="h-5 w-5" />
          </div>
          <p className="mt-3 font-mono text-2xl font-semibold text-ocean-950 dark:text-white">
            {reports.length}
          </p>
          <p className="text-xs text-ocean-600 dark:text-ocean-400">Issues reported from this device</p>
        </Card>
      </div>

      {/* Main Sections: Favorites & History */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Favorited Initiatives */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ocean-950 dark:text-white">
              Favorited Initiatives
            </h2>
            <Link href="/initiatives" className="flex items-center gap-1 text-xs font-semibold text-ocean-700 hover:text-ocean-950 dark:text-ocean-300">
              Browse all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {favorites.map((i) => (
              <Card key={i!.id} className="p-5 transition hover:shadow-[0_12px_24px_rgba(8,29,38,0.08)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Badge tone={i!.status === "ACTIVE" ? "leaf" : "ocean"}>{i!.category}</Badge>
                    <Link href={`/initiatives/${i!.slug}`} className="mt-2 block font-display text-base font-semibold text-ocean-950 hover:text-ocean-700 dark:text-white">
                      {i!.title}
                    </Link>
                    <p className="mt-1 line-clamp-2 text-xs text-ocean-600 dark:text-ocean-300">{i!.summary}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-xs font-mono text-ocean-600 dark:text-ocean-400">
                    <span>{formatGHS(i!.amountRaised)} raised</span>
                    <span>{percent(i!.amountRaised, i!.budget)}%</span>
                  </div>
                  <div className="mt-1.5">
                    <ProgressBar value={percent(i!.amountRaised, i!.budget)} />
                  </div>
                </div>
              </Card>
            ))}

            {favorites.length === 0 && (
              <Card className="p-8 text-center">
                <Bookmark className="mx-auto h-8 w-8 text-ocean-400" />
                <p className="mt-2 text-sm font-medium text-ocean-900 dark:text-white">No saved initiatives yet</p>
                <p className="mt-1 text-xs text-ocean-600 dark:text-ocean-400">
                  Click the heart icon on any initiative to pin it to your dashboard.
                </p>
                <Button href="/initiatives" size="sm" className="mt-4">
                  Explore Initiatives
                </Button>
              </Card>
            )}
          </div>
        </div>

        {/* Donation History */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ocean-950 dark:text-white">
              Donation History
            </h2>
            <Link href="/donate" className="flex items-center gap-1 text-xs font-semibold text-ocean-700 hover:text-ocean-950 dark:text-ocean-300">
              Make a gift <PlusCircle className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {SAMPLE_DONATIONS.map((d) => {
              const initiative = getInitiativeBySlug(d.initiativeSlug);
              return (
                <Card key={d.id} className="flex items-center justify-between p-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ocean-900 dark:text-white">
                      {initiative?.title ?? "General Civic Fund"}
                    </p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-ocean-600 dark:text-ocean-400">
                      <span>{formatDate(d.date)}</span>
                      <span>·</span>
                      <span className="font-mono">{d.ref}</span>
                      {d.recurring && <Badge tone="gold">Monthly</Badge>}
                    </p>
                  </div>
                  <span className="ml-3 shrink-0 font-mono text-sm font-semibold text-ocean-900 dark:text-white">
                    {formatGHS(d.amount)}
                  </span>
                </Card>
              );
            })}

            <div className="rounded-xl border border-ocean-100 bg-ocean-50/50 p-4 text-xs text-ocean-600 dark:border-ocean-800 dark:bg-ocean-900/40 dark:text-ocean-400">
              <p className="font-medium text-ocean-800 dark:text-ocean-200">Public Audit Assurance</p>
              <p className="mt-1">
                Every verified contribution is mapped into our{" "}
                <Link href="/transparency" className="font-semibold underline">
                  Transparency Ledger
                </Link>{" "}
                and tracked to specific community deliverables.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reported Issues Section */}
      {reports.length > 0 && (
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ocean-950 dark:text-white">
              Your Community Issue Submissions
            </h2>
            <Link href="/community-map" className="flex items-center gap-1 text-xs font-semibold text-ocean-700 hover:text-ocean-950 dark:text-ocean-300">
              View on Map <MapPin className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {reports.map((r) => (
              <Card key={r.id} className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <Badge tone={r.urgency === "CRITICAL" ? "gold" : "ocean"}>
                    {r.urgency} URGENCY
                  </Badge>
                  <span className="font-mono text-[11px] text-ocean-500">{formatDate(r.createdAt)}</span>
                </div>
                <h3 className="mt-2 font-display text-sm font-semibold text-ocean-950 dark:text-white">
                  {r.title}
                </h3>
                <p className="mt-1 text-xs text-ocean-600 dark:text-ocean-400">
                  {r.community}, {r.town} · Status: <span className="font-medium text-ocean-800 dark:text-ocean-200">{r.status}</span>
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Civic Action Shortcuts */}
      <div className="rounded-2xl border border-ocean-100 bg-white p-6 dark:border-ocean-800 dark:bg-ocean-900">
        <h2 className="font-display text-base font-semibold text-ocean-950 dark:text-white">
          Active Civic Opportunities
        </h2>
        <p className="mt-1 text-xs text-ocean-600 dark:text-ocean-400">
          Concrete ways to support South Tongu District today.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Link
            href="/donate"
            className="flex items-center justify-between rounded-xl border border-ocean-200 p-4 transition hover:border-gold-500 hover:bg-gold-300/5 dark:border-ocean-700"
          >
            <div>
              <p className="text-sm font-semibold text-ocean-950 dark:text-white">Donate to a Project</p>
              <p className="text-xs text-ocean-600 dark:text-ocean-400">Fund civic literacy &amp; livelihoods</p>
            </div>
            <ArrowRight className="h-4 w-4 text-ocean-400" />
          </Link>

          <Link
            href="/survey"
            className="flex items-center justify-between rounded-xl border border-ocean-200 p-4 transition hover:border-ocean-500 hover:bg-ocean-50/50 dark:border-ocean-700"
          >
            <div>
              <p className="text-sm font-semibold text-ocean-950 dark:text-white">Report a Social Issue</p>
              <p className="text-xs text-ocean-600 dark:text-ocean-400">Geotag water, road, or civic problems</p>
            </div>
            <ArrowRight className="h-4 w-4 text-ocean-400" />
          </Link>

          <Link
            href="/community-map"
            className="flex items-center justify-between rounded-xl border border-ocean-200 p-4 transition hover:border-ocean-500 hover:bg-ocean-50/50 dark:border-ocean-700"
          >
            <div>
              <p className="text-sm font-semibold text-ocean-950 dark:text-white">Community Map</p>
              <p className="text-xs text-ocean-600 dark:text-ocean-400">Explore issues across Sogakope &amp; Dabala</p>
            </div>
            <ArrowRight className="h-4 w-4 text-ocean-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}
