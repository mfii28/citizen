"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Clock, Bookmark, LogOut } from "lucide-react";
import { getSession, clearSession, type LocalSession } from "@/lib/local-session";
import { getInitiativeBySlug } from "@/lib/mock-data";
import { getFavoriteSlugs, FAVORITES_CHANGED_EVENT } from "@/lib/local-favorites";
import { SectionHeading, Card, Badge, Button } from "@/components/ui";
import { formatGHS, formatDate } from "@/lib/utils";

const SAMPLE_DONATIONS = [
  { id: "sample-1", initiativeSlug: "global-citizenship-civic-education-programme", amount: 400, date: new Date("2026-08-01"), method: "Mobile Money" },
  { id: "sample-2", initiativeSlug: "clean-communities-initiative", amount: 50, date: new Date("2026-07-01"), method: "Mobile Money", recurring: true },
];

const SAMPLE_HOURS = [
  { id: "sample-1", description: "Newsletter design help", hours: 6, date: new Date("2026-07-01"), approved: true },
];

const SAMPLE_FAVORITE_SLUGS = ["youth-skills-livelihood-initiative"];

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSessionState] = useState<LocalSession | null | "checking">("checking");
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);

  useEffect(() => {
    const existing = getSession();
    if (!existing) {
      router.replace("/login");
      return;
    }
    setSessionState(existing);
    const saved = getFavoriteSlugs();
    setFavoriteSlugs(saved.length > 0 ? saved : SAMPLE_FAVORITE_SLUGS);

    const handleSync = () => {
      const updated = getFavoriteSlugs();
      setFavoriteSlugs(updated.length > 0 ? updated : SAMPLE_FAVORITE_SLUGS);
    };
    window.addEventListener(FAVORITES_CHANGED_EVENT, handleSync);
    return () => window.removeEventListener(FAVORITES_CHANGED_EVENT, handleSync);
  }, [router]);

  if (session === "checking" || session === null) {
    return (
      <section className="section-y">
        <div className="container-page">
          <p className="text-sm text-ocean-600 dark:text-ocean-400">Loading your dashboard…</p>
        </div>
      </section>
    );
  }

  const totalGiven = SAMPLE_DONATIONS.reduce((sum, d) => sum + d.amount, 0);
  const totalHours = SAMPLE_HOURS.reduce((sum, h) => sum + h.hours, 0);
  const favorites = favoriteSlugs.map((slug) => getInitiativeBySlug(slug)).filter(Boolean);

  return (
    <section className="section-y">
      <div className="container-page">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <SectionHeading eyebrow="Your account" title={`Welcome back, ${session.name || "there"}`} description={session.email} />
          <button
            onClick={() => {
              clearSession();
              router.push("/");
            }}
            className="flex items-center gap-1.5 rounded-full border border-ocean-200 px-4 py-2 text-sm font-semibold text-ocean-700 transition hover:border-ocean-400 dark:border-ocean-700 dark:text-ocean-200"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>

        <p className="mt-4 rounded-lg bg-gold-300/20 p-3 text-xs text-gold-600">
          This is a demo dashboard — the numbers below are sample data, not your real activity. Once our backend
          is connected, this page will show your actual donations, hours, and saved initiatives.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Card className="p-5">
            <Heart className="h-5 w-5 text-gold-500" />
            <p className="mt-2 font-mono text-2xl font-semibold text-ocean-950 dark:text-white">{formatGHS(totalGiven)}</p>
            <p className="mt-1 text-sm text-ocean-600 dark:text-ocean-400">Total given (sample)</p>
          </Card>
          <Card className="p-5">
            <Clock className="h-5 w-5 text-ocean-600 dark:text-ocean-300" />
            <p className="mt-2 font-mono text-2xl font-semibold text-ocean-950 dark:text-white">{totalHours}h</p>
            <p className="mt-1 text-sm text-ocean-600 dark:text-ocean-400">Volunteer hours (sample)</p>
          </Card>
          <Card className="p-5">
            <Bookmark className="h-5 w-5 text-leaf-500" />
            <p className="mt-2 font-mono text-2xl font-semibold text-ocean-950 dark:text-white">{favorites.length}</p>
            <p className="mt-1 text-sm text-ocean-600 dark:text-ocean-400">Favorited initiatives</p>
          </Card>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-lg font-semibold text-ocean-950 dark:text-white">Donation history</h2>
            <div className="mt-4 space-y-3">
              {SAMPLE_DONATIONS.map((d) => {
                const initiative = getInitiativeBySlug(d.initiativeSlug);
                return (
                  <Card key={d.id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-sm font-medium text-ocean-900 dark:text-white">{initiative?.title ?? "General fund"}</p>
                      <p className="mt-0.5 flex items-center gap-2 text-xs text-ocean-600 dark:text-ocean-400">
                        {formatDate(d.date)} · {d.method}
                        {d.recurring && <Badge tone="gold">Monthly</Badge>}
                      </p>
                    </div>
                    <span className="font-mono text-sm text-ocean-800 dark:text-ocean-200">{formatGHS(d.amount)}</span>
                  </Card>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-ocean-950 dark:text-white">Volunteer hours</h2>
            <div className="mt-4 space-y-3">
              {SAMPLE_HOURS.map((h) => (
                <Card key={h.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium text-ocean-900 dark:text-white">{h.description}</p>
                    <p className="mt-0.5 text-xs text-ocean-600 dark:text-ocean-400">{formatDate(h.date)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={h.approved ? "leaf" : "ocean"}>{h.approved ? "Approved" : "Pending"}</Badge>
                    <span className="font-mono text-sm text-ocean-800 dark:text-ocean-200">{h.hours}h</span>
                  </div>
                </Card>
              ))}
              <Button href="/ambassadors" variant="secondary" size="sm">See the leaderboard</Button>
            </div>
          </div>
        </div>

        {favorites.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display text-lg font-semibold text-ocean-950 dark:text-white">Favorited initiatives</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {favorites.map((i) => (
                <Link key={i!.id} href={`/initiatives/${i!.slug}`}>
                  <Card className="p-5 transition hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(8,29,38,0.10)]">
                    <Badge tone={i!.status === "ACTIVE" ? "leaf" : "ocean"}>{i!.category}</Badge>
                    <p className="mt-2 font-display font-semibold text-ocean-950 dark:text-white">{i!.title}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
