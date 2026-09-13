import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getInitiativeBySlug, getEventsForInitiative } from "@/lib/mock-data";
import { Badge, ProgressBar, Button, Card } from "@/components/ui";
import { ShareRow } from "@/components/share-row";
import { FavoriteButton } from "@/components/favorite-button";
import { formatGHS, formatDate, percent } from "@/lib/utils";
import { labelize } from "@/types";
import { MapPin, Users, Target, CalendarRange } from "lucide-react";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const initiative = getInitiativeBySlug(params.slug);
  if (!initiative) return {};
  return { title: initiative.title, description: initiative.summary };
}

export default function InitiativeDetailPage({ params }: { params: { slug: string } }) {
  const initiative = getInitiativeBySlug(params.slug);
  if (!initiative) notFound();

  const initiativeEvents = getEventsForInitiative(initiative.id);
  const raised = initiative.amountRaised;
  const budget = initiative.budget;

  return (
    <article>
      <section className="bg-gradient-to-br from-ocean-800 to-ocean-950 py-16 text-white">
        <div className="container-page">
          <div className="flex flex-wrap gap-1.5">
            <Badge tone={initiative.status === "ACTIVE" ? "leaf" : "ocean"}>{labelize(initiative.status)}</Badge>
            {initiative.sdgTags.map((s) => <Badge key={s} tone="gold">{s}</Badge>)}
          </div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h1 className="mt-4 max-w-2xl text-balance font-display text-3xl font-semibold sm:text-4xl">{initiative.title}</h1>
            <FavoriteButton initiativeId={initiative.id} initiallyFavorited={false} />
          </div>
          <p className="mt-3 max-w-2xl text-ocean-200">{initiative.summary}</p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page grid gap-10 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div>
              <h2 className="font-display text-xl font-semibold text-ocean-950 dark:text-white">About this initiative</h2>
              <p className="mt-3 whitespace-pre-line text-ocean-700 dark:text-ocean-300">{initiative.description}</p>
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold text-ocean-950 dark:text-white">Objectives</h2>
              <ul className="mt-3 space-y-2">
                {initiative.objectives.map((o) => (
                  <li key={o} className="flex gap-2 text-ocean-700 dark:text-ocean-300">
                    <Target className="mt-1 h-4 w-4 shrink-0 text-ocean-500" /> {o}
                  </li>
                ))}
              </ul>
            </div>

            {initiativeEvents.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-semibold text-ocean-950 dark:text-white">Timeline</h2>
                <div className="mt-3 space-y-3">
                  {initiativeEvents.map((e) => (
                    <Card key={e.id} className="flex items-center gap-4 p-4">
                      <CalendarRange className="h-5 w-5 shrink-0 text-ocean-500" />
                      <div>
                        <p className="font-medium text-ocean-950 dark:text-white">{e.title}</p>
                        <p className="text-sm text-ocean-500 dark:text-ocean-400">{formatDate(e.startDate)}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-5">
            <Card className="p-6">
              <div className="flex justify-between text-sm font-mono text-ocean-500 dark:text-ocean-400">
                <span>{formatGHS(raised)} raised</span>
                <span>{percent(raised, budget)}%</span>
              </div>
              <div className="mt-2"><ProgressBar value={percent(raised, budget)} /></div>
              <p className="mt-1 text-xs text-ocean-500 dark:text-ocean-400">Target: {formatGHS(budget)}</p>

              <div className="mt-5 flex flex-col gap-2">
                <Button href={`/donate?initiative=${initiative.id}`} className="w-full">Donate to this initiative</Button>
                <Button href="/volunteer" variant="secondary" className="w-full">Volunteer for this initiative</Button>
              </div>

              <div className="mt-5 border-t border-ocean-100 pt-4 dark:border-ocean-800">
                <ShareRow title={initiative.title} />
              </div>
            </Card>

            <Card className="space-y-3 p-6 text-sm">
              {initiative.location && (
                <div className="flex items-center gap-2 text-ocean-700 dark:text-ocean-300">
                  <MapPin className="h-4 w-4 text-ocean-500" /> {initiative.location}
                </div>
              )}
              <div className="flex items-center gap-2 text-ocean-700 dark:text-ocean-300">
                <Users className="h-4 w-4 text-ocean-500" /> {initiative.volunteersInvolved} volunteers involved
              </div>
              {initiative.beneficiaries && (
                <div className="flex items-center gap-2 text-ocean-700 dark:text-ocean-300">
                  <Target className="h-4 w-4 text-ocean-500" /> {initiative.beneficiaries}
                </div>
              )}
            </Card>
          </div>
        </div>
      </section>
    </article>
  );
}
