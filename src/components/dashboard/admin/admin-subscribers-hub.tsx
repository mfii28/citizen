"use client";

import { useState } from "react";
import { Mail, Send, Download, Users, CheckCircle2, ShieldCheck, Plus, X, Trash2, RefreshCw } from "lucide-react";
import {
  getSubscribers,
  addSubscriber,
  toggleSubscriberStatus,
  deleteSubscriber,
  addAuditEntry,
  type SubscriberEntry,
} from "@/lib/admin-store";
import { FilamentBadge } from "../filament/filament-badge";
import { downloadCsv } from "@/lib/export-csv";
import { formatDate } from "@/lib/utils";

export function AdminSubscribersHub({
  coordinatorName,
  onNotify,
}: {
  coordinatorName: string;
  onNotify: (msg: string) => void;
}) {
  const [subscribers, setSubscribers] = useState<SubscriberEntry[]>(() => getSubscribers());
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // New subscriber form state
  const [newEmail, setNewEmail] = useState("");
  const [newSource, setNewSource] = useState("Admin Registration");

  // Broadcast state
  const [broadcastSubject, setBroadcastSubject] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastTarget, setBroadcastTarget] = useState("ALL_ACTIVE");

  const handleExport = () => {
    const headers = ["ID", "Email", "Status", "Subscribed At", "Source"];
    const rows = subscribers.map((s) => [s.id, s.email, s.status, formatDate(new Date(s.subscribedAt)), s.source]);
    downloadCsv("south_tongu_newsletter_subscribers.csv", [headers, ...rows]);
    onNotify("Exported newsletter subscribers CSV");
  };

  const handleAddSubscriber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    const next = addSubscriber(newEmail.trim(), newSource);
    setSubscribers(next);
    setIsAddOpen(false);
    setNewEmail("");
    onNotify(`Added subscriber: ${newEmail.trim()}`);
  };

  const handleToggleStatus = (id: string) => {
    const next = toggleSubscriberStatus(id, coordinatorName);
    setSubscribers(next);
    const target = next.find((s) => s.id === id);
    onNotify(`Subscriber ${target?.email} status changed to ${target?.status}`);
  };

  const handleDelete = (id: string) => {
    const next = deleteSubscriber(id, coordinatorName);
    setSubscribers(next);
    setDeletingId(null);
    onNotify("Subscriber removed from registry");
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastSubject.trim() || !broadcastMessage.trim()) return;

    addAuditEntry({
      actor: coordinatorName,
      action: "BROADCAST_DISPATCHED",
      entityType: "SYSTEM",
      entityId: `broadcast-${Date.now()}`,
      details: `Dispatched community broadcast "${broadcastSubject}" to ${subscribers.length} subscribers.`,
    });

    setIsBroadcastOpen(false);
    setBroadcastSubject("");
    setBroadcastMessage("");
    onNotify(`Dispatched broadcast to ${subscribers.length} active subscribers`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg font-bold text-ocean-950 dark:text-white">
              Newsletter &amp; Citizen Subscribers Hub
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/15 px-2.5 py-0.5 text-xs font-semibold text-cyan-700 dark:text-cyan-400">
              <Users className="h-3 w-3" /> {subscribers.length} Subscribers
            </span>
          </div>
          <p className="mt-0.5 text-xs text-ocean-600 dark:text-ocean-400">
            Citizens and donors subscribed to public quarterly bulletins, emergency advisories, and milestone reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 rounded-lg border border-ocean-200 bg-white px-3 py-1.5 text-xs font-semibold text-ocean-800 shadow-xs hover:bg-ocean-50 dark:border-ocean-700 dark:bg-ocean-900 dark:text-ocean-200 dark:hover:bg-ocean-800"
          >
            <Download className="h-3.5 w-3.5 text-ocean-500" /> Export CSV
          </button>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-ocean-200 bg-white px-3 py-1.5 text-xs font-semibold text-ocean-800 shadow-xs hover:bg-ocean-50 dark:border-ocean-700 dark:bg-ocean-900 dark:text-ocean-200"
          >
            <Plus className="h-3.5 w-3.5 text-amber-500" /> Add Subscriber
          </button>
          <button
            type="button"
            onClick={() => setIsBroadcastOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-ocean-950 shadow-sm hover:bg-amber-400"
          >
            <Send className="h-3.5 w-3.5" /> Compose Broadcast
          </button>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="overflow-hidden rounded-xl border border-ocean-200/80 bg-white shadow-xs dark:border-ocean-800 dark:bg-[#0c1322]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-ocean-100 bg-ocean-50/70 font-semibold uppercase tracking-wider text-ocean-500 dark:border-ocean-800/80 dark:bg-ocean-900/50 dark:text-ocean-400">
              <tr>
                <th className="px-4 py-3">Subscriber Email</th>
                <th className="px-4 py-3">Acquisition Source</th>
                <th className="px-4 py-3">Date Subscribed</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ocean-100 dark:divide-ocean-800/60">
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-ocean-500">
                    No subscribers found.
                  </td>
                </tr>
              ) : (
                subscribers.map((sub) => (
                  <tr key={sub.id} className="transition hover:bg-ocean-50/50 dark:hover:bg-ocean-900/30">
                    <td className="px-4 py-3.5 font-bold text-ocean-950 dark:text-white">
                      {sub.email}
                    </td>
                    <td className="px-4 py-3.5 text-ocean-600 dark:text-ocean-400 font-medium">
                      {sub.source}
                    </td>
                    <td className="px-4 py-3.5 text-[11px] text-ocean-500 font-mono">
                      {formatDate(new Date(sub.subscribedAt))}
                    </td>
                    <td className="px-4 py-3.5">
                      <FilamentBadge color={sub.status === "ACTIVE" ? "success" : "gray"}>
                        {sub.status}
                      </FilamentBadge>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(sub.id)}
                          className="rounded-md border border-ocean-200 bg-white px-2 py-1 text-xs font-semibold text-ocean-700 hover:bg-ocean-100 dark:border-ocean-700 dark:bg-ocean-900 dark:text-ocean-300"
                        >
                          {sub.status === "ACTIVE" ? "Unsubscribe" : "Activate"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingId(sub.id)}
                          title="Delete Subscriber"
                          className="rounded-md border border-rose-500/20 bg-rose-500/10 p-1 text-rose-600 hover:bg-rose-500/20 dark:text-rose-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Subscriber Modal (CREATE) */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsAddOpen(false)}
            className="fixed inset-0 bg-ocean-950/60 backdrop-blur-xs transition-opacity"
          />

          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-ocean-100 bg-white p-6 shadow-2xl dark:border-ocean-800 dark:bg-ocean-950 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-ocean-100 pb-3 dark:border-ocean-800">
              <h3 className="text-base font-bold text-ocean-950 dark:text-white">
                Add New Newsletter Subscriber
              </h3>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="rounded p-1 text-ocean-400 hover:text-ocean-700 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubscriber} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
                  Subscriber Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
                  Acquisition Source
                </label>
                <select
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
                >
                  <option value="Admin Registration">Admin Registration</option>
                  <option value="District Assembly Outreach">District Assembly Outreach</option>
                  <option value="Community Town Hall RSVP">Community Town Hall RSVP</option>
                  <option value="Volunteer Portal">Volunteer Portal</option>
                  <option value="Website Footer">Website Footer</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-ocean-100 dark:border-ocean-800">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="rounded-lg border border-ocean-200 px-3.5 py-1.5 text-xs font-semibold text-ocean-700 hover:bg-ocean-50 dark:border-ocean-700 dark:text-ocean-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-bold text-ocean-950 hover:bg-amber-400"
                >
                  Enroll Subscriber
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Subscriber Confirmation Modal (DELETE) */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setDeletingId(null)}
            className="fixed inset-0 bg-ocean-950/60 backdrop-blur-xs transition-opacity"
          />

          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-rose-200 bg-white p-6 shadow-2xl dark:border-rose-900 dark:bg-ocean-950 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-ocean-950 dark:text-white">Remove Subscriber?</h3>
                <p className="text-xs text-ocean-600 dark:text-ocean-400">
                  Are you sure you want to permanently delete this subscriber from the mailing registry?
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="rounded-lg border border-ocean-200 px-3 py-1.5 text-xs font-semibold text-ocean-700 hover:bg-ocean-50 dark:border-ocean-700 dark:text-ocean-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deletingId)}
                className="rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-rose-500 shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Composer Modal */}
      {isBroadcastOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsBroadcastOpen(false)}
            className="fixed inset-0 bg-ocean-950/60 backdrop-blur-xs transition-opacity"
          />

          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-ocean-100 bg-white p-6 shadow-2xl dark:border-ocean-800 dark:bg-ocean-950 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-ocean-100 pb-3 dark:border-ocean-800">
              <h3 className="text-base font-bold text-ocean-950 dark:text-white">
                Dispatch Community Bulletin Broadcast
              </h3>
              <button
                type="button"
                onClick={() => setIsBroadcastOpen(false)}
                className="rounded p-1 text-ocean-400 hover:text-ocean-700 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
                  Target Recipient Pool
                </label>
                <select
                  value={broadcastTarget}
                  onChange={(e) => setBroadcastTarget(e.target.value)}
                  className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
                >
                  <option value="ALL_ACTIVE">All Verified Active Subscribers ({subscribers.filter(s => s.status === "ACTIVE").length})</option>
                  <option value="VOLUNTEERS_ONLY">South Tongu Volunteers &amp; Donors</option>
                  <option value="COMMUNITY_LEADERS">Assembly Members &amp; Area Liaisons</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
                  Email Subject Line *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. South Tongu Quarterly Progress: Sogakope Health Centre Delivery"
                  value={broadcastSubject}
                  onChange={(e) => setBroadcastSubject(e.target.value)}
                  className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
                  Newsletter / Bulletin Content *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Dear Citizen, here is the official update on district projects and verified community donations..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-ocean-100 dark:border-ocean-800">
                <button
                  type="button"
                  onClick={() => setIsBroadcastOpen(false)}
                  className="rounded-lg border border-ocean-200 px-3.5 py-1.5 text-xs font-semibold text-ocean-700 hover:bg-ocean-50 dark:border-ocean-700 dark:text-ocean-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-amber-500 px-4 py-1.5 text-xs font-bold text-ocean-950 hover:bg-amber-400"
                >
                  Dispatch Bulletin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
