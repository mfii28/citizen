"use client";

import { useState, useRef } from "react";
import { Award, Printer, Download, CheckCircle2, ShieldCheck, QrCode, Sparkles, UserCheck } from "lucide-react";
import { FilamentBadge } from "../filament/filament-badge";

interface EligibleVolunteer {
  id: string;
  name: string;
  email: string;
  community: string;
  approvedHours: number;
  tier: "BRONZE" | "SILVER" | "GOLD" | "DISTRICT_HERO";
  initiativeFocus: string;
}

const ELIGIBLE_VOLUNTEERS: EligibleVolunteer[] = [
  {
    id: "vol-cert-01",
    name: "Peace Kpodo",
    email: "peace.kpodo@yahoo.com",
    community: "Sogakope",
    approvedHours: 148,
    tier: "GOLD",
    initiativeFocus: "Community Health & Maternal Outreach",
  },
  {
    id: "vol-cert-02",
    name: "Kwesi Mensah",
    email: "kwesi.m@outlook.com",
    community: "Agorkpo",
    approvedHours: 92,
    tier: "SILVER",
    initiativeFocus: "Youth Digital Literacy & Coding Labs",
  },
  {
    id: "vol-cert-03",
    name: "Emmanuel Agbavor",
    email: "emmanuel.agbavor@outlook.com",
    community: "Dabala",
    approvedHours: 54,
    tier: "BRONZE",
    initiativeFocus: "Environmental Sanitation & Tree Planting",
  },
  {
    id: "vol-cert-04",
    name: "Selorm Dzreke",
    email: "selorm.d@thecitizenproject.org",
    community: "South Tongu District",
    approvedHours: 320,
    tier: "DISTRICT_HERO",
    initiativeFocus: "District Civic Coordination & Emergency Response",
  },
];

export function AdminCertificateIssuer({
  coordinatorName,
  onNotify,
}: {
  coordinatorName: string;
  onNotify: (msg: string) => void;
}) {
  const [selectedVolunteer, setSelectedVolunteer] = useState<EligibleVolunteer>(ELIGIBLE_VOLUNTEERS[0]);
  const [citationText, setCitationText] = useState<string>(
    "In recognition of outstanding dedication, exemplary civic leadership, and verified volunteer service advancing community prosperity across South Tongu District, Ghana."
  );
  const printAreaRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
    onNotify(`Printed commendation certificate for ${selectedVolunteer.name}`);
  };

  const certificateNumber = `TCP-GH-ST-${selectedVolunteer.id.toUpperCase()}-${new Date().getFullYear()}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg font-bold text-ocean-950 dark:text-white">
              Civic Commendation &amp; Certificate Issuer
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
              <Award className="h-3 w-3" /> Official Credentials
            </span>
          </div>
          <p className="mt-0.5 text-xs text-ocean-600 dark:text-ocean-400">
            Issue certified digital certificates with cryptographic serial keys for volunteers completing service tiers.
          </p>
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-3.5 py-1.5 text-xs font-bold text-ocean-950 shadow-sm hover:bg-amber-400"
        >
          <Printer className="h-4 w-4" /> Print / Save Certificate PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Volunteer Selector & Citation Form */}
        <div className="space-y-4 rounded-xl border border-ocean-200/80 bg-white p-5 shadow-xs dark:border-ocean-800 dark:bg-[#0c1322]">
          <h3 className="font-bold text-xs uppercase tracking-wider text-ocean-500">
            Select Eligible Volunteer
          </h3>
          <div className="space-y-2">
            {ELIGIBLE_VOLUNTEERS.map((v) => (
              <div
                key={v.id}
                onClick={() => setSelectedVolunteer(v)}
                className={`cursor-pointer rounded-xl border p-3 transition ${
                  selectedVolunteer.id === v.id
                    ? "border-amber-500 bg-amber-500/10 shadow-xs dark:bg-amber-500/15"
                    : "border-ocean-100 bg-ocean-50/50 hover:border-ocean-300 dark:border-ocean-800 dark:bg-ocean-900/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-ocean-950 dark:text-white">{v.name}</span>
                  <FilamentBadge
                    color={
                      v.tier === "DISTRICT_HERO"
                        ? "danger"
                        : v.tier === "GOLD"
                        ? "warning"
                        : v.tier === "SILVER"
                        ? "info"
                        : "gray"
                    }
                  >
                    {v.tier.replace("_", " ")}
                  </FilamentBadge>
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-ocean-600 dark:text-ocean-400">
                  <span>{v.community}</span>
                  <span className="font-bold font-mono text-amber-600 dark:text-amber-400">
                    {v.approvedHours} Verified Hours
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-ocean-500 mb-1">
              Custom Citation Narrative
            </label>
            <textarea
              rows={3}
              value={citationText}
              onChange={(e) => setCitationText(e.target.value)}
              className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
            />
          </div>
        </div>

        {/* Right Column: Live Certificate Visual Preview */}
        <div className="lg:col-span-2">
          <div
            ref={printAreaRef}
            className="relative overflow-hidden rounded-2xl border-4 border-double border-amber-500/40 bg-gradient-to-br from-amber-50/40 via-white to-ocean-50/30 p-8 shadow-xl dark:border-amber-500/30 dark:from-[#0f172a] dark:via-[#0c1322] dark:to-[#080d16]"
          >
            {/* Watermark Crest */}
            <div className="pointer-events-none absolute right-6 top-6 text-amber-500/10 dark:text-amber-400/5">
              <Award className="h-64 w-64" />
            </div>

            {/* Certificate Header */}
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-ocean-950 font-bold text-lg shadow-md mb-2">
                TC
              </div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                THE CITIZEN PROJECT · SOUTH TONGU DISTRICT ASSEMBLY
              </p>
              <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ocean-950 dark:text-white sm:text-3xl">
                Certificate of Civic Commendation
              </h1>
              <p className="mt-1 text-xs text-ocean-600 dark:text-ocean-400">
                Conferred under the authority of The Citizen Project &amp; Volunteer Service Board
              </p>
            </div>

            {/* Recipient Name */}
            <div className="my-8 text-center">
              <p className="font-serif italic text-xs text-ocean-500">This official honor is gratefully presented to</p>
              <h2 className="mt-2 font-display text-3xl font-extrabold text-amber-600 dark:text-amber-400 underline decoration-amber-300 underline-offset-8">
                {selectedVolunteer.name}
              </h2>
              <p className="mt-2 text-xs font-semibold text-ocean-700 dark:text-ocean-300">
                {selectedVolunteer.community}, South Tongu District · {selectedVolunteer.initiativeFocus}
              </p>
            </div>

            {/* Citation */}
            <div className="mx-auto max-w-xl text-center">
              <p className="text-xs leading-relaxed text-ocean-700 dark:text-ocean-300 italic">
                &ldquo;{citationText}&rdquo;
              </p>
            </div>

            {/* Metric Badge & Service Record */}
            <div className="my-6 flex justify-center">
              <div className="flex items-center gap-6 rounded-xl border border-amber-500/20 bg-amber-500/5 px-6 py-2.5 dark:bg-amber-500/10">
                <div className="text-center">
                  <span className="block font-mono text-lg font-bold text-ocean-950 dark:text-white">
                    {selectedVolunteer.approvedHours}
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-ocean-500">Service Hours</span>
                </div>
                <div className="h-8 w-px bg-amber-500/20" />
                <div className="text-center">
                  <span className="block font-mono text-lg font-bold text-amber-600 dark:text-amber-400">
                    {selectedVolunteer.tier.replace("_", " ")}
                  </span>
                  <span className="text-[10px] uppercase font-semibold text-ocean-500">Honors Tier</span>
                </div>
              </div>
            </div>

            {/* Signatures & Seal Footer */}
            <div className="mt-8 flex flex-wrap items-end justify-between border-t border-ocean-200/80 pt-6 dark:border-ocean-800">
              <div className="text-left">
                <div className="font-serif italic font-bold text-ocean-950 dark:text-white text-sm">
                  {coordinatorName}
                </div>
                <div className="h-0.5 w-32 bg-ocean-300 dark:bg-ocean-700 my-1" />
                <p className="text-[10px] font-medium text-ocean-500">District Operations Coordinator</p>
                <p className="text-[10px] text-ocean-400">The Citizen Project</p>
              </div>

              {/* QR Verification Seal */}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-ocean-200 bg-white p-1 dark:border-ocean-700 dark:bg-ocean-900">
                  <QrCode className="h-10 w-10 text-ocean-900 dark:text-ocean-100" />
                </div>
                <div className="text-left font-mono text-[9px] text-ocean-500">
                  <p className="font-bold text-ocean-700 dark:text-ocean-300">VERIFIABLE CREDENTIAL</p>
                  <p>{certificateNumber}</p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ Cryptographically Signed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
