import type { Metadata } from "next";
import { SectionHeading, Card } from "@/components/ui";
import { GraduationCap, HeartHandshake, Recycle } from "lucide-react";

export const metadata: Metadata = { title: "Our Mission" };

const pillars = [
  { icon: GraduationCap, title: "Educate", body: "Deliver civic and life-skills education aligned with UN SDG 4, in step with the NCCE's mandate." },
  { icon: HeartHandshake, title: "Empower", body: "Give young people and volunteers real responsibility — real projects, real budgets, real outcomes." },
  { icon: Recycle, title: "Sustain", body: "Design every initiative so a community can keep running it after our direct involvement ends." },
];

export default function MissionPage() {
  return (
    <section className="section-y">
      <div className="container-page max-w-3xl">
        <SectionHeading eyebrow="What we do, every day" title="Our Mission" />
        <p className="mt-6 text-lg text-ocean-700 dark:text-ocean-300">
          To equip the young people of South Tongu District with the knowledge, character, and platform to
          take responsibility for their communities — and to give every resident a direct, transparent channel
          to raise what matters to them.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {pillars.map((p) => (
            <Card key={p.title} className="p-6">
              <p.icon className="h-7 w-7 text-ocean-600 dark:text-ocean-300" />
              <h3 className="mt-3 font-display font-semibold text-ocean-950 dark:text-white">{p.title}</h3>
              <p className="mt-2 text-sm text-ocean-600 dark:text-ocean-300">{p.body}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
