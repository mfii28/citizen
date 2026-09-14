import { Hero } from "@/components/home/hero";
import {
  StatsBand,
  FeaturedInitiatives,
  UpcomingEvents,
  TestimonialsSection,
  PartnersStrip,
  ClosingCta,
} from "@/components/home/sections";
import { initiatives, events, testimonials, partners, donations, getProgressLabel } from "@/lib/mock-data";

function getHomeData() {
  const featuredInitiatives = [...initiatives]
    .filter((i) => i.status === "ACTIVE" || i.status === "UPCOMING")
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 3);

  const now = new Date();
  const upcomingEvents = [...events]
    .filter((e) => e.startDate >= now)
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
    .slice(0, 4);

  const featuredTestimonials = testimonials.filter((t) => t.featured).slice(0, 3);
  const approvedPartners = partners.filter((p) => p.status === "APPROVED").slice(0, 8);

  const volunteers = initiatives.reduce((sum, i) => sum + i.volunteersInvolved, 0);
  const raised = donations.filter((d) => d.status === "SUCCESS").reduce((sum, d) => sum + d.amount, 0);
  const communities = new Set(initiatives.map((i) => i.location).filter(Boolean));

  return {
    initiatives: featuredInitiatives,
    events: upcomingEvents,
    testimonials: featuredTestimonials,
    partners: approvedPartners,
    initiativeCount: initiatives.length,
    volunteers,
    raised,
    communities: Math.max(communities.size, 1),
  };
}

export default function HomePage() {
  const { initiatives, events, testimonials, partners, initiativeCount, volunteers, raised, communities } = getHomeData();

  return (
    <>
      <Hero />
      <StatsBand
        initiatives={initiativeCount}
        volunteers={volunteers}
        communities={communities}
        raised={raised}
      />
      <FeaturedInitiatives
        initiatives={initiatives.map((i) => ({
          id: i.id,
          slug: i.slug,
          title: i.title,
          summary: i.summary,
          category: i.category,
          status: i.status,
          budget: i.budget,
          amountRaised: i.amountRaised,
          progressLabel: getProgressLabel(i),
        }))}
      />
      {events.length > 0 && <UpcomingEvents events={events} />}
      {testimonials.length > 0 && <TestimonialsSection testimonials={testimonials} />}
      <PartnersStrip partners={partners} />
      <ClosingCta />
    </>
  );
}
