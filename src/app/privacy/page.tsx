import type { Metadata } from "next";
export const metadata: Metadata = { title: "Privacy Policy" };
export default function PrivacyPage() {
  return (
    <section className="section-y">
      <div className="container-page max-w-2xl prose-ocean">
        <h1 className="font-display text-3xl font-semibold text-ocean-950 dark:text-white">Privacy Policy</h1>
        <p className="mt-4 text-sm text-gold-600">
          Draft template — have this reviewed by a lawyer against Ghana's Data Protection Act, 2012 (Act 843)
          before publishing.
        </p>
        <p className="mt-6 text-ocean-700 dark:text-ocean-300">
          The Citizen Project collects only the information needed to operate our programmes: contact details you
          provide through our forms, donation records, volunteer information, and community survey reports. We do
          not sell personal data. Anonymous submissions are stored without identifying information. Contact us at
          hello@thecitizenproject.org to request access to or deletion of your data.
        </p>
      </div>
    </section>
  );
}
