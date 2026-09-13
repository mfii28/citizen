import type { Metadata } from "next";
import { ambassadorLeaderboard } from "@/lib/mock-data";
import { SectionHeading, Card, Badge, Button } from "@/components/ui";
import { Award, Users, Trophy } from "lucide-react";

export const metadata: Metadata = { title: "Ambassadors & Leaderboard" };

function badgesFor(hours: number): string[] {
  const badges: string[] = [];
  if (hours >= 10) badges.push("Bronze — 10h+");
  if (hours >= 30) badges.push("Silver — 30h+");
  if (hours >= 60) badges.push("Gold — 60h+");
  return badges;
}

export default function AmbassadorsPage() {
  const leaderboard = [...ambassadorLeaderboard].sort((a, b) => b.hours - a.hours);

  return (
    <section className="section-y">
      <div className="container-page max-w-3xl">
        <SectionHeading eyebrow="Lead in your community" title="Ambassadors Programme" description="Our most active volunteers represent The Citizen Project locally — recruiting, organising, and reporting back." />

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Card className="p-5 text-center">
            <Award className="mx-auto h-7 w-7 text-ocean-600 dark:text-ocean-300" />
            <p className="mt-2 text-sm font-medium text-ocean-900 dark:text-white">Certificates &amp; badges</p>
          </Card>
          <Card className="p-5 text-center">
            <Users className="mx-auto h-7 w-7 text-ocean-600 dark:text-ocean-300" />
            <p className="mt-2 text-sm font-medium text-ocean-900 dark:text-white">Community leadership</p>
          </Card>
          <Card className="p-5 text-center">
            <Trophy className="mx-auto h-7 w-7 text-ocean-600 dark:text-ocean-300" />
            <p className="mt-2 text-sm font-medium text-ocean-900 dark:text-white">Leaderboard recognition</p>
          </Card>
        </div>

        <h2 className="mt-12 font-display text-lg font-semibold text-ocean-950 dark:text-white">Volunteer hours leaderboard</h2>
        <div className="mt-4 space-y-2">
          {leaderboard.map((row, idx) => (
            <Card key={row.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="w-6 font-mono text-sm text-ocean-400">#{idx + 1}</span>
                <span className="font-medium text-ocean-900 dark:text-white">{row.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {badgesFor(row.hours).map((b) => <Badge key={b} tone="gold">{b}</Badge>)}
                <span className="font-mono text-sm text-ocean-500">{row.hours}h</span>
              </div>
            </Card>
          ))}
          {leaderboard.length === 0 && <p className="text-sm text-ocean-500">No approved volunteer hours logged yet.</p>}
        </div>

        <Button href="/contact" size="lg" className="mt-6 w-full">Register your interest as an ambassador</Button>
      </div>
    </section>
  );
}
