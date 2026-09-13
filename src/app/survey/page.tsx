import type { Metadata } from "next";
import { SectionHeading, Card } from "@/components/ui";
import { SurveyForm } from "@/components/forms/survey-form";

export const metadata: Metadata = { title: "Report a Social Issue" };

export default function SurveyPage() {
  return (
    <section className="section-y">
      <div className="container-page max-w-2xl">
        <SectionHeading
          eyebrow="Community intelligence"
          title="Report a social issue"
          description="See a problem in your community — education, health, roads, water, security, or anything else? Tell us. Every report is reviewed and tracked through to resolution."
        />
        <Card className="mt-8 p-6 sm:p-8">
          <SurveyForm />
        </Card>
      </div>
    </section>
  );
}
