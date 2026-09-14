"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Award, Clock, CalendarDays, PlusCircle, CheckCircle2, Trophy, X, ArrowRight, Shield } from "lucide-react";
import type { LocalSession } from "@/lib/local-session";
import { Card, Badge, Button, ProgressBar } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import { initiatives, events } from "@/lib/mock-data";

export type VolunteerHourEntry = {
  id: string;
  description: string;
  initiativeTitle: string;
  date: string;
  hours: number;
  approved: boolean;
};

const INITIAL_HOURS: VolunteerHourEntry[] = [
  { id: "vh-1", description: "Civic Education facilitation at Sogakope Basic School", initiativeTitle: "Global Citizenship Programme", date: "2026-08-12", hours: 6, approved: true },
  { id: "vh-2", description: "Estuary bank cleanup team coordination", initiativeTitle: "Clean Communities Initiative", date: "2026-07-20", hours: 4, approved: true },
  { id: "vh-3", description: "Voter dialogue workshop ushering & attendee check-in", initiativeTitle: "Know Yourself, Know Your Path", date: "2026-08-28", hours: 4, approved: true },
  { id: "vh-4", description: "Community survey data verification in Dabala", initiativeTitle: "Inside Community Survey", date: "2026-09-08", hours: 4, approved: false },
];

const STORAGE_KEY = "tcp:volunteer-hours";

export function VolunteerDashboard({ session }: { session: LocalSession }) {
  const [entries, setEntries] = useState<VolunteerHourEntry[]>([]);
  const [showLogModal, setShowLogModal] = useState(false);

  // Form state
  const [description, setDescription] = useState("");
  const [initiativeTitle, setInitiativeTitle] = useState(initiatives[0]?.title ?? "General Volunteering");
  const [hours, setHours] = useState("3");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setEntries(JSON.parse(raw));
      } else {
        setEntries(INITIAL_HOURS);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_HOURS));
      }
    } catch {
      setEntries(INITIAL_HOURS);
    }
  }, []);

  const saveEntries = (updated: VolunteerHourEntry[]) => {
    setEntries(updated);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("tcp:volunteer-hours-changed", { detail: updated }));
    } catch {
      // no-op
    }
  };

  const handleLogHours = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: VolunteerHourEntry = {
      id: `vh-${Date.now()}`,
      description,
      initiativeTitle,
      date,
      hours: Number(hours) || 1,
      approved: false, // pending admin review
    };
    const next = [newEntry, ...entries];
    saveEntries(next);
    setShowLogModal(false);
    setDescription("");
  };

  const approvedHours = entries.filter((e) => e.approved).reduce((sum, e) => sum + e.hours, 0);
  const pendingHours = entries.filter((e) => !e.approved).reduce((sum, e) => sum + e.hours, 0);

  // Tier progression: Bronze 10h, Silver 30h, Gold 60h
  let currentTier = "Volunteer";
  let currentTone: "ocean" | "leaf" | "gold" = "ocean";
  let nextTier = "Bronze Ambassador (10h)";
  let targetHours = 10;
  let progressPercent = Math.min(100, Math.round((approvedHours / 10) * 100));

  if (approvedHours >= 60) {
    currentTier = "Gold Ambassador";
    currentTone = "gold";
    nextTier = "Distinguished Leader (100h)";
    targetHours = 100;
    progressPercent = Math.min(100, Math.round((approvedHours / 100) * 100));
  } else if (approvedHours >= 30) {
    currentTier = "Silver Ambassador";
    currentTone = "leaf";
    nextTier = "Gold Ambassador (60h)";
    targetHours = 60;
    progressPercent = Math.min(100, Math.round((approvedHours / 60) * 100));
  } else if (approvedHours >= 10) {
    currentTier = "Bronze Ambassador";
    currentTone = "ocean";
    nextTier = "Silver Ambassador (30h)";
    targetHours = 30;
    progressPercent = Math.min(100, Math.round((approvedHours / 30) * 100));
  }

  const upcomingEvents = events.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Ambassador Tier Banner */}
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-300/30 text-gold-600 dark:text-gold-400">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-semibold text-ocean-950 dark:text-white">
                  {currentTier} Status
                </h2>
                <Badge tone={currentTone}>{currentTier}</Badge>
              </div>
              <p className="mt-0.5 text-xs text-ocean-600 dark:text-ocean-400">
                Logged <strong className="font-mono text-ocean-900 dark:text-white">{approvedHours}h</strong> approved community service across South Tongu.
              </p>
            </div>
          </div>

          <Button onClick={() => setShowLogModal(true)} size="md">
            <PlusCircle className="h-4 w-4" /> Log Service Hours
          </Button>
        </div>

        {/* Tier progress bar */}
        <div className="mt-6 border-t border-ocean-100 pt-5 dark:border-ocean-800">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-ocean-700 dark:text-ocean-300">
              Next Tier: <span className="font-semibold text-ocean-950 dark:text-white">{nextTier}</span>
            </span>
            <span className="font-mono text-ocean-600 dark:text-ocean-400">
              {approvedHours} / {targetHours} hours ({progressPercent}%)
            </span>
          </div>
          <div className="mt-2">
            <ProgressBar value={progressPercent} />
          </div>
        </div>
      </Card>

      {/* KPI Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="p-5">
          <Clock className="h-5 w-5 text-ocean-600 dark:text-ocean-300" />
          <p className="mt-2 font-mono text-2xl font-semibold text-ocean-950 dark:text-white">
            {approvedHours}h
          </p>
          <p className="text-xs text-ocean-600 dark:text-ocean-400">Approved Service Hours</p>
        </Card>

        <Card className="p-5">
          <Clock className="h-5 w-5 text-gold-500" />
          <p className="mt-2 font-mono text-2xl font-semibold text-ocean-950 dark:text-white">
            {pendingHours}h
          </p>
          <p className="text-xs text-ocean-600 dark:text-ocean-400">Pending Verification</p>
        </Card>

        <Card className="p-5">
          <Award className="h-5 w-5 text-leaf-500" />
          <p className="mt-2 font-mono text-2xl font-semibold text-ocean-950 dark:text-white">
            Rank #4
          </p>
          <p className="text-xs text-ocean-600 dark:text-ocean-400">District Leaderboard</p>
        </Card>

        <Card className="p-5">
          <CalendarDays className="h-5 w-5 text-ocean-500" />
          <p className="mt-2 font-mono text-2xl font-semibold text-ocean-950 dark:text-white">
            3
          </p>
          <p className="text-xs text-ocean-600 dark:text-ocean-400">Upcoming Assignments</p>
        </Card>
      </div>

      {/* Service Hours History & Upcoming Tasks */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ocean-950 dark:text-white">
              Service Log &amp; Verification
            </h2>
            <button
              onClick={() => setShowLogModal(true)}
              className="flex items-center gap-1 text-xs font-semibold text-ocean-700 hover:text-ocean-950 dark:text-ocean-300"
            >
              <PlusCircle className="h-3.5 w-3.5" /> Log new hours
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {entries.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-ocean-950 dark:text-white">{item.description}</p>
                    <p className="mt-0.5 text-xs text-ocean-600 dark:text-ocean-400">
                      {item.initiativeTitle} · {formatDate(item.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold text-ocean-900 dark:text-white">
                      {item.hours}h
                    </span>
                    <Badge tone={item.approved ? "leaf" : "gold"}>
                      {item.approved ? "Approved" : "Pending Review"}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Upcoming Volunteer Engagements */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ocean-950 dark:text-white">
              Community Calendar
            </h2>
            <Link href="/events" className="text-xs font-semibold text-ocean-700 hover:text-ocean-950 dark:text-ocean-300">
              All events
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {upcomingEvents.map((evt) => (
              <Card key={evt.id} className="p-4">
                <Badge tone="ocean">Upcoming Task</Badge>
                <h3 className="mt-2 font-display text-sm font-semibold text-ocean-950 dark:text-white">
                  {evt.title}
                </h3>
                <p className="mt-1 text-xs text-ocean-600 dark:text-ocean-400">{evt.summary}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-ocean-600 dark:text-ocean-400">
                  <span>{formatDate(evt.startDate)}</span>
                  <span className="font-semibold text-ocean-800 dark:text-ocean-200">{evt.location ?? "Sogakope"}</span>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-ocean-100 bg-ocean-50/50 p-4 dark:border-ocean-800 dark:bg-ocean-900/40">
            <h4 className="font-display text-xs font-semibold text-ocean-950 dark:text-white">
              District Leaderboard
            </h4>
            <p className="mt-1 text-xs text-ocean-600 dark:text-ocean-400">
              Check volunteer standings and certificate criteria.
            </p>
            <Link
              href="/ambassadors"
              className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-ocean-800 underline dark:text-ocean-200"
            >
              View Ambassador Leaderboard <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Log Hours Modal */}
      {showLogModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ocean-950/50 p-4 backdrop-blur-sm"
          onClick={() => setShowLogModal(false)}
        >
          <Card
            className="w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-ocean-950 dark:text-white">
                Log Volunteer Service Hours
              </h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="rounded-full p-1 text-ocean-500 hover:bg-ocean-100 dark:hover:bg-ocean-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleLogHours} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-ocean-800 dark:text-ocean-200">
                  Activity Description
                </label>
                <input
                  required
                  placeholder="e.g. Conducted basic civic rights session with JHS learners"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-lg border border-ocean-200 px-3 py-2 text-sm focus:border-ocean-500 dark:border-ocean-700 dark:bg-ocean-900"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-ocean-800 dark:text-ocean-200">
                  Associated Initiative
                </label>
                <select
                  value={initiativeTitle}
                  onChange={(e) => setInitiativeTitle(e.target.value)}
                  className="w-full rounded-lg border border-ocean-200 px-3 py-2 text-sm focus:border-ocean-500 dark:border-ocean-700 dark:bg-ocean-900"
                >
                  {initiatives.map((i) => (
                    <option key={i.id} value={i.title}>
                      {i.title}
                    </option>
                  ))}
                  <option value="General Community Service">General Community Service</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-ocean-800 dark:text-ocean-200">
                    Hours Served
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    required
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="w-full rounded-lg border border-ocean-200 px-3 py-2 text-sm focus:border-ocean-500 dark:border-ocean-700 dark:bg-ocean-900"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-ocean-800 dark:text-ocean-200">
                    Date Completed
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-lg border border-ocean-200 px-3 py-2 text-sm focus:border-ocean-500 dark:border-ocean-700 dark:bg-ocean-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowLogModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Submit for Approval
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
