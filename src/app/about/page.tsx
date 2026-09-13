import type { Metadata } from "next";
import { SectionHeading, Card, Reveal } from "@/components/ui";
import { ShieldCheck, Users, Scale, Sprout } from "lucide-react";

export const metadata: Metadata = { title: "About Us" };

const values = [
  { icon: ShieldCheck, title: "Integrity", body: "Every cedi and every hour is accounted for — transparency isn't a slogan here, it's a page on this site." },
  { icon: Users, title: "Participation", body: "We build with communities, not for them. Every initiative starts with listening." },
  { icon: Scale, title: "Fairness", body: "Programmes are designed to reach girls and boys, every community in South Tongu, equally." },
  { icon: Sprout, title: "Sustainability", body: "We favour solutions communities can carry forward themselves, long after a project ends." },
];

export default function AboutPage() {
  return (
    <div>
      <section className="border-b border-ocean-100 bg-ocean-50 py-16 dark:border-ocean-900 dark:bg-ocean-900/30 sm:py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Our story"
            title="Why The Citizen Project exists"
            description="South Tongu District has no shortage of civic spirit — what it has lacked is a structured, youth-first way to channel it into visible community change."
          />
        </div>
      </section>

      <section className="section-y">
        <div className="container-page grid gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="space-y-4 text-ocean-700 dark:text-ocean-300">
              <h2 className="font-display text-2xl font-semibold text-ocean-950 dark:text-white">History</h2>
              <p>
                The Citizen Project began as a civic education programme for basic school learners, built to
                complement the National Commission for Civic Education's mandate under UN SDG 4. What started as a
                five-event learning calendar has grown into a broader constituency-wide movement — one that now
                spans environmental stewardship, youth livelihoods, and community-led reporting alongside our
                original education work.
              </p>
              <h2 className="pt-2 font-display text-2xl font-semibold text-ocean-950 dark:text-white">Governance</h2>
              <p>
                We operate with a lean, accountable structure: a coordinating team, community-level volunteer
                leads, and an advisory relationship with our institutional partners — Ghana Health Service, Ghana
                Education Service, local assemblies, and the NCCE.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="space-y-4 text-ocean-700 dark:text-ocean-300">
              <h2 className="font-display text-2xl font-semibold text-ocean-950 dark:text-white">Leadership &amp; Team</h2>
              <p>
                The Citizen Project is led by a small coordinating team supported by community volunteers and
                subject-matter partners across health, education, and civic administration. Full leadership
                profiles are being finalised and will appear here.
              </p>
              <h2 className="pt-2 font-display text-2xl font-semibold text-ocean-950 dark:text-white">Why we exist</h2>
              <p>
                Civic knowledge means little without the chance to practise it. We exist to close the gap between
                what young people are taught about citizenship and what they get to actually do about it —
                turning classroom civics into clean riverbanks, safer conversations about adolescence, and
                communities that report problems instead of enduring them.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-y bg-ocean-50 dark:bg-ocean-900/30">
        <div className="container-page">
          <SectionHeading eyebrow="What we stand for" title="Our values" align="center" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, idx) => (
              <Reveal key={v.title} delay={idx * 0.05}>
                <Card className="h-full p-6 text-center">
                  <v.icon className="mx-auto h-8 w-8 text-ocean-600 dark:text-ocean-300" />
                  <h3 className="mt-3 font-display font-semibold text-ocean-950 dark:text-white">{v.title}</h3>
                  <p className="mt-2 text-sm text-ocean-600 dark:text-ocean-300">{v.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
