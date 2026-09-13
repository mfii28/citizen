import type { Metadata } from "next";
export const metadata: Metadata = { title: "Terms of Use" };
export default function TermsPage() {
  return (
    <section className="section-y">
      <div className="container-page max-w-2xl">
        <h1 className="font-display text-3xl font-semibold text-ocean-950 dark:text-white">Terms of Use</h1>
        <p className="mt-4 text-sm text-gold-600">Draft template — have this reviewed by a lawyer before publishing.</p>
        <p className="mt-6 text-ocean-700 dark:text-ocean-300">
          By using this website you agree to provide accurate information, refrain from misusing our reporting or
          donation tools, and respect the communities and volunteers featured on this site. Content on this site
          may not be reproduced for commercial purposes without permission.
        </p>
      </div>
    </section>
  );
}
