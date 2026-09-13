import type { Metadata } from "next";
export const metadata: Metadata = { title: "Cookie Policy" };
export default function CookiesPage() {
  return (
    <section className="section-y">
      <div className="container-page max-w-2xl">
        <h1 className="font-display text-3xl font-semibold text-ocean-950 dark:text-white">Cookie Policy</h1>
        <p className="mt-4 text-sm text-gold-600">Draft template — have this reviewed by a lawyer before publishing.</p>
        <p className="mt-6 text-ocean-700 dark:text-ocean-300">
          This site currently uses only a local preference cookie for dark/light mode. As analytics or payment
          cookies are added in later phases, this page will be updated to list them and provide consent controls.
        </p>
      </div>
    </section>
  );
}
