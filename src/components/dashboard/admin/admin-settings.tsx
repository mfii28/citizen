"use client";

import { useState } from "react";
import { SlidersHorizontal, Save, ShieldCheck, CreditCard, Building, Phone, AlertTriangle } from "lucide-react";
import {
  getDistrictSettings,
  saveDistrictSettings,
  type DistrictSettings,
} from "@/lib/admin-store";

export function AdminSettings({
  coordinatorName,
  onNotify,
}: {
  coordinatorName: string;
  onNotify: (msg: string) => void;
}) {
  const [settings, setSettings] = useState<DistrictSettings>(() => getDistrictSettings());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveDistrictSettings(settings, coordinatorName);
    onNotify("District settings & Paystack keys saved successfully");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg font-bold text-ocean-950 dark:text-white">
              District Assembly &amp; Gateway Configuration
            </h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
              <SlidersHorizontal className="h-3 w-3" /> System Parameters
            </span>
          </div>
          <p className="mt-0.5 text-xs text-ocean-600 dark:text-ocean-400">
            Configure district administrative liaisons, emergency hotlines, Paystack API credentials, and civic alert banners.
          </p>
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-ocean-950 shadow-sm hover:bg-amber-400"
        >
          <Save className="h-3.5 w-3.5" /> Save Configuration
        </button>
      </div>

      {/* 1. District Assembly & Liaison Parameters */}
      <div className="rounded-xl border border-ocean-200/80 bg-white p-5 shadow-xs dark:border-ocean-800 dark:bg-[#0c1322] space-y-4">
        <div className="flex items-center gap-2 border-b border-ocean-100 pb-3 dark:border-ocean-800">
          <Building className="h-4 w-4 text-amber-500" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-ocean-950 dark:text-white">
            District Assembly &amp; Operational Liaisons
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
              District Jurisdiction Name
            </label>
            <input
              type="text"
              value={settings.districtName}
              onChange={(e) => setSettings({ ...settings, districtName: e.target.value })}
              className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
              District Assembly Liaison Officer
            </label>
            <input
              type="text"
              value={settings.assemblyLiaisonName}
              onChange={(e) => setSettings({ ...settings, assemblyLiaisonName: e.target.value })}
              className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
              Assembly Contact Phone
            </label>
            <input
              type="text"
              value={settings.assemblyContactPhone}
              onChange={(e) => setSettings({ ...settings, assemblyContactPhone: e.target.value })}
              className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
              Rapid Response WhatsApp Hotline
            </label>
            <input
              type="text"
              value={settings.emergencyWhatsApp}
              onChange={(e) => setSettings({ ...settings, emergencyWhatsApp: e.target.value })}
              className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
              Central Field Office Address
            </label>
            <input
              type="text"
              value={settings.officeLocation}
              onChange={(e) => setSettings({ ...settings, officeLocation: e.target.value })}
              className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* 2. Paystack Gateway Integration */}
      <div className="rounded-xl border border-ocean-200/80 bg-white p-5 shadow-xs dark:border-ocean-800 dark:bg-[#0c1322] space-y-4">
        <div className="flex items-center gap-2 border-b border-ocean-100 pb-3 dark:border-ocean-800">
          <CreditCard className="h-4 w-4 text-emerald-500" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-ocean-950 dark:text-white">
            Paystack &amp; Mobile Money Gateway Parameters
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
              Paystack Public Key
            </label>
            <input
              type="text"
              value={settings.paystackPublicKey}
              onChange={(e) => setSettings({ ...settings, paystackPublicKey: e.target.value })}
              className="w-full font-mono rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
              Direct MoMo Fallback Merchant Line
            </label>
            <input
              type="text"
              value={settings.momoMerchantNumber}
              onChange={(e) => setSettings({ ...settings, momoMerchantNumber: e.target.value })}
              className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
            />
          </div>

          <div className="sm:col-span-2 flex items-center justify-between rounded-lg bg-ocean-50/60 p-3 dark:bg-ocean-900/40">
            <div>
              <span className="block font-bold text-ocean-950 dark:text-white">Paystack Production Live Mode</span>
              <span className="text-[11px] text-ocean-500">
                Switching to live will charge actual donor credit cards and Ghana MoMo wallets.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, paystackLiveMode: !settings.paystackLiveMode })}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.paystackLiveMode ? "bg-emerald-500" : "bg-ocean-300 dark:bg-ocean-700"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.paystackLiveMode ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Emergency Public Notice Banner */}
      <div className="rounded-xl border border-ocean-200/80 bg-white p-5 shadow-xs dark:border-ocean-800 dark:bg-[#0c1322] space-y-4">
        <div className="flex items-center gap-2 border-b border-ocean-100 pb-3 dark:border-ocean-800">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-ocean-950 dark:text-white">
            Public Emergency Alert Banner
          </h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="alert-active"
              checked={settings.alertBannerActive}
              onChange={(e) => setSettings({ ...settings, alertBannerActive: e.target.checked })}
              className="h-4 w-4 rounded text-amber-500"
            />
            <label htmlFor="alert-active" className="font-bold text-ocean-950 dark:text-white">
              Display emergency alert banner across public website header
            </label>
          </div>

          <div>
            <label className="block font-semibold text-ocean-700 dark:text-ocean-300 mb-1">
              Banner Advisory Text
            </label>
            <input
              type="text"
              value={settings.publicAlertBanner}
              onChange={(e) => setSettings({ ...settings, publicAlertBanner: e.target.value })}
              className="w-full rounded-lg border border-ocean-200 bg-white p-2 text-xs text-ocean-900 focus:border-amber-500 focus:outline-none dark:border-ocean-700 dark:bg-ocean-900 dark:text-white"
            />
          </div>
        </div>
      </div>
    </form>
  );
}
