import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/home/hero";
import {
  StatsBand,
  FeaturedInitiatives,
  UpcomingEvents,
  TestimonialsSection,
  PartnersStrip,
} from "@/components/home/sections";

export const dynamic = "force-dynamic";

async function getHomeData() {
  const [initiatives, events, testimonials, partners, initiativeAgg, donationAgg] = await Promise.all([
    prisma.initiative.findMany({ where: { status: { in: ["ACTIVE", "UPCOMING"] } }, orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.event.findMany({ where: { startDate: { gte: new Date() } }, orderBy: { startDate: "asc" }, take: 4 }),
    prisma.testimonial.findMany({ where: { featured: true }, take: 3 }),
    prisma.partner.findMany({ where: { status: "APPROVED" }, take: 8 }),
    prisma.initiative.aggregate({ _count: true, _sum: { volunteersInvolved: true } }),
    prisma.donation.aggregate({ where: { status: "SUCCESS" }, _sum: { amount: true } }),
  ]);

  const communities = await prisma.initiative.findMany({
    where: { location: { not: null } },
    select: { location: true },
    distinct: ["location"],
  });

  return { initiatives, events, testimonials, partners, initiativeAgg, donationAgg, communities };
}

export default async function HomePage() {
  const { initiatives, events, testimonials, partners, initiativeAgg, donationAgg, communities } = await getHomeData();

  return (
    <>
      <Hero />
      <StatsBand
        initiatives={initiativeAgg._count}
        volunteers={initiativeAgg._sum.volunteersInvolved ?? 0}
        communities={Math.max(communities.length, 1)}
        raised={Number(donationAgg._sum.amount ?? 0)}
      />
      <FeaturedInitiatives
        initiatives={initiatives.map((i) => ({
          id: i.id,
          slug: i.slug,
          title: i.title,
          summary: i.summary,
          category: i.category,
          status: i.status,
          budget: Number(i.budget),
          amountRaised: Number(i.amountRaised),
        }))}
      />
      {events.length > 0 && <UpcomingEvents events={events} />}
      {testimonials.length > 0 && <TestimonialsSection testimonials={testimonials} />}
      <PartnersStrip partners={partners} />
    </>
  );
}
