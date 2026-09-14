"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Heart,
  Bookmark,
  AlertCircle,
  ArrowRight,
  MapPin,
  PlusCircle,
  Receipt,
  Printer,
  X,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import type { LocalSession } from "@/lib/local-session";
import { getInitiativeBySlug } from "@/lib/mock-data";
import { getLocalReports } from "@/lib/local-reports";
import { Card, Badge, Button, ProgressBar } from "@/components/ui";
import { formatGHS, formatDate, percent } from "@/lib/utils";
import { FilamentStatsOverview, type FilamentStat } from "./filament/filament-stats";
import { FilamentBadge } from "./filament/filament-badge";

export type DonationRecord = {
  id: string;
  initiativeSlug?: string;
  amount: number;
  date: string | Date;
  method?: string;
  recurring?: boolean;
  ref?: string;
  donorName?: string;
  donorEmail?: string;
};

const SEED_DONATIONS: DonationRecord[] = [
  {
    id: "sample-1",
    initiativeSlug: "global-citizenship-civic-education-programme",
    amount: 400,
    date: "2026-08-01",
    method: "Paystack (MTN MoMo)",
    ref: "pstk_live_883192014",
    donorName: "Kofi Mensah",
  },
  {
    id: "sample-2",
    initiativeSlug: "clean-communities-initiative",
    amount: 50,
    date: "2026-07-01",
    method: "Paystack (Telecel MoMo)",
    recurring: true,
    ref: "pstk_live_772910384",
    donorName: "Kofi Mensah",
  },
];

export function UserDashboard({
  session,
  favoriteSlugs,
}: {
  session: LocalSession;
  favoriteSlugs: string[];
}) {
  const [donationsList, setDonationsList] = useState<DonationRecord[]>(SEED_DONATIONS);
  const [selectedReceipt, setSelectedReceipt] = useState<DonationRecord | null>(null);

  // Load local donations & sync
  useEffect(() => {
    const loadDonations = () => {
      try {
        const raw = window.localStorage.getItem("tcp:local-donations");
        if (raw) {
          const parsed = JSON.parse(raw);
          setDonationsList([...parsed, ...SEED_DONATIONS]);
        } else {
          setDonationsList(SEED_DONATIONS);
        }
      } catch {
        setDonationsList(SEED_DONATIONS);
      }
    };

    loadDonations();
    window.addEventListener("tcp:donations-changed", loadDonations);
    return () => window.removeEventListener("tcp:donations-changed", loadDonations);
  }, []);

  const reports = getLocalReports();
  const totalDonated = donationsList.reduce((sum, d) => sum + d.amount, 0);
  const favorites = favoriteSlugs.map((s) => getInitiativeBySlug(s)).filter(Boolean);

  const citizenStats: FilamentStat[] = [
    {
      id: "stat-donations",
      label: "Total Contributions",
      value: formatGHS(totalDonated),
      description: "Paystack verified",
      descriptionIcon: "up",
      chart: [50, 100, 150, 250, 450],
      chartTone: "amber",
    },
    {
      id: "stat-favorites",
      label: "Saved Initiatives",
      value: `${favorites.length} Projects`,
      description: "Active civic watch",
      descriptionIcon: "neutral",
      chart: [1, 2, 2, 3],
      chartTone: "sky",
    },
    {
      id: "stat-reports",
      label: "Community Reports",
      value: `${reports.length} Tracked`,
      description: "Submitted from device",
      descriptionIcon: "up",
      chart: [0, 1, 2, 3],
      chartTone: "emerald",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Filament Stats Overview Widgets */}
      <FilamentStatsOverview stats={citizenStats} className="sm:grid-cols-3 xl:grid-cols-3" />

      {/* Main Sections: Favorites & History */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Favorited Initiatives */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ocean-950 dark:text-white">
              Favorited Initiatives
            </h2>
            <Link
              href="/initiatives"
              className="flex items-center gap-1 text-xs font-semibold text-ocean-700 hover:text-ocean-950 dark:text-ocean-300"
            >
              Browse all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {favorites.map((i) => (
              <Card
                key={i!.id}
                className="p-5 transition hover:shadow-[0_12px_24px_rgba(8,29,38,0.08)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Badge tone={i!.status === "ACTIVE" ? "leaf" : "ocean"}>
                      {i!.category}
                    </Badge>
                    <Link
                      href={`/initiatives/${i!.slug}`}
                      className="mt-2 block font-display text-base font-semibold text-ocean-950 hover:text-ocean-700 dark:text-white"
                    >
                      {i!.title}
                    </Link>
                    <p className="mt-1 line-clamp-2 text-xs text-ocean-600 dark:text-ocean-300">
                      {i!.summary}
                    </p>
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
                <p className="mt-2 text-sm font-medium text-ocean-900 dark:text-white">
                  No saved initiatives yet
                </p>
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
            <Link
              href="/donate"
              className="flex items-center gap-1 text-xs font-semibold text-ocean-700 hover:text-ocean-950 dark:text-ocean-300"
            >
              Make a gift <PlusCircle className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {donationsList.map((d) => {
              const initiative = d.initiativeSlug
                ? getInitiativeBySlug(d.initiativeSlug)
                : null;
              return (
                <Card
                  key={d.id}
                  className="flex items-center justify-between p-4 transition hover:bg-ocean-50/50 dark:hover:bg-ocean-900/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ocean-900 dark:text-white">
                      {initiative?.title ?? "General Civic Fund"}
                    </p>
                    <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-ocean-600 dark:text-ocean-400">
                      <span>{formatDate(d.date)}</span>
                      <span>·</span>
                      <span className="font-mono text-[11px]">{d.ref || "Verified"}</span>
                      {d.recurring && <Badge tone="gold">Monthly</Badge>}
                    </p>
                  </div>
                  <div className="ml-3 flex shrink-0 items-center gap-2">
                    <span className="font-mono text-sm font-semibold text-ocean-900 dark:text-white">
                      {formatGHS(d.amount)}
                    </span>
                    <button
                      onClick={() => setSelectedReceipt(d)}
                      title="View Official Receipt"
                      className="rounded-lg p-1.5 text-ocean-500 hover:bg-ocean-100 hover:text-ocean-800 dark:hover:bg-ocean-800 dark:hover:text-ocean-200"
                    >
                      <Receipt className="h-4 w-4" />
                    </button>
                  </div>
                </Card>
              );
            })}

            <div className="rounded-xl border border-ocean-100 bg-ocean-50/50 p-4 text-xs text-ocean-600 dark:border-ocean-800 dark:bg-ocean-900/40 dark:text-ocean-400">
              <p className="font-medium text-ocean-800 dark:text-ocean-200">
                Public Audit Assurance
              </p>
              <p className="mt-1">
                Every verified Paystack contribution is mapped into our{" "}
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
            <Link
              href="/community-map"
              className="flex items-center gap-1 text-xs font-semibold text-ocean-700 hover:text-ocean-950 dark:text-ocean-300"
            >
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
                  <span className="font-mono text-[11px] text-ocean-500">
                    {formatDate(r.createdAt)}
                  </span>
                </div>
                <h3 className="mt-2 font-display text-sm font-semibold text-ocean-950 dark:text-white">
                  {r.title}
                </h3>
                <p className="mt-1 text-xs text-ocean-600 dark:text-ocean-400">
                  {r.community}, {r.town} · Status:{" "}
                  <span className="font-medium text-ocean-800 dark:text-ocean-200">
                    {r.status}
                  </span>
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
              <p className="text-sm font-semibold text-ocean-950 dark:text-white">
                Donate via Paystack
              </p>
              <p className="text-xs text-ocean-600 dark:text-ocean-400">
                Fund civic literacy &amp; livelihoods
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-ocean-400" />
          </Link>

          <Link
            href="/survey"
            className="flex items-center justify-between rounded-xl border border-ocean-200 p-4 transition hover:border-ocean-500 hover:bg-ocean-50/50 dark:border-ocean-700"
          >
            <div>
              <p className="text-sm font-semibold text-ocean-950 dark:text-white">
                Report a Social Issue
              </p>
              <p className="text-xs text-ocean-600 dark:text-ocean-400">
                Geotag water, road, or civic problems
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-ocean-400" />
          </Link>

          <Link
            href="/community-map"
            className="flex items-center justify-between rounded-xl border border-ocean-200 p-4 transition hover:border-ocean-500 hover:bg-ocean-50/50 dark:border-ocean-700"
          >
            <div>
              <p className="text-sm font-semibold text-ocean-950 dark:text-white">
                Community Map
              </p>
              <p className="text-xs text-ocean-600 dark:text-ocean-400">
                Explore issues across Sogakope &amp; Dabala
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-ocean-400" />
          </Link>
        </div>
      </div>

      {/* Official Paystack Receipt Modal */}
      {selectedReceipt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ocean-950/60 p-4 backdrop-blur-sm"
          onClick={() => setSelectedReceipt(null)}
        >
          <Card
            className="w-full max-w-md p-6 relative print:border-none print:shadow-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-ocean-100 pb-4 dark:border-ocean-800">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold-500 text-ocean-950 font-bold text-xs">
                  TCP
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold text-ocean-950 dark:text-white">
                    Official Donation Receipt
                  </h3>
                  <p className="text-[10px] font-mono text-ocean-600 dark:text-ocean-400">
                    Secured by Paystack · South Tongu
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="rounded-full p-1 text-ocean-500 hover:bg-ocean-100 dark:hover:bg-ocean-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="my-5 space-y-4">
              <div className="rounded-xl border border-leaf-500/20 bg-leaf-500/10 p-3.5 text-center">
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-leaf-700 dark:text-leaf-300">
                  <CheckCircle2 className="h-4 w-4" /> Payment Status: SUCCESS
                </div>
                <p className="mt-1 font-mono text-2xl font-bold text-ocean-950 dark:text-white">
                  {formatGHS(selectedReceipt.amount)}
                </p>
              </div>

              <div className="space-y-2 rounded-xl border border-ocean-100 bg-ocean-50/50 p-4 text-xs dark:border-ocean-800 dark:bg-ocean-900/50">
                <div className="flex justify-between py-1 border-b border-ocean-100 dark:border-ocean-800">
                  <span className="text-ocean-600 dark:text-ocean-400">Paystack Reference</span>
                  <span className="font-mono font-medium text-ocean-950 dark:text-white">
                    {selectedReceipt.ref || `pstk_live_${selectedReceipt.id}`}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-ocean-100 dark:border-ocean-800">
                  <span className="text-ocean-600 dark:text-ocean-400">Donor Name</span>
                  <span className="font-medium text-ocean-950 dark:text-white">
                    {selectedReceipt.donorName || session.name || "Supporter"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-ocean-100 dark:border-ocean-800">
                  <span className="text-ocean-600 dark:text-ocean-400">Channel / Gateway</span>
                  <span className="font-medium text-ocean-950 dark:text-white">
                    {selectedReceipt.method || "Paystack Checkout"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-ocean-100 dark:border-ocean-800">
                  <span className="text-ocean-600 dark:text-ocean-400">Date Issued</span>
                  <span className="font-mono text-ocean-950 dark:text-white">
                    {formatDate(selectedReceipt.date)}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-ocean-600 dark:text-ocean-400">Allocation</span>
                  <span className="font-medium text-ocean-950 dark:text-white">
                    {selectedReceipt.initiativeSlug
                      ? getInitiativeBySlug(selectedReceipt.initiativeSlug)?.title ?? "General Civic Fund"
                      : "General Civic Fund"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-ocean-100/50 p-3 text-[11px] text-ocean-700 dark:bg-ocean-800/40 dark:text-ocean-300">
                <ShieldCheck className="h-4 w-4 shrink-0 text-gold-500" />
                <span>
                  This receipt confirms an electronic transfer processed via Paystack Ghana for The Citizen Project.
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-ocean-100 pt-4 dark:border-ocean-800">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedReceipt(null)}
              >
                Close
              </Button>
              <Button
                size="sm"
                onClick={() => window.print()}
              >
                <Printer className="h-4 w-4" /> Print / Save PDF
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
