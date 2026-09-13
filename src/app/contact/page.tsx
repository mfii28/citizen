import type { Metadata } from "next";
import { SectionHeading, Card } from "@/components/ui";
import { ContactForm } from "@/components/forms/contact-form";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";

export const metadata: Metadata = { title: "Contact" };

const faqs = [
  { q: "How do I volunteer?", a: "Visit the Volunteer page and register your interest — we'll follow up with current opportunities." },
  { q: "Is my donation tax-deductible?", a: "This depends on our registration status; we'll confirm details as our NGO registration is finalised." },
  { q: "How do I report an issue anonymously?", a: "Use the Report a Social Issue form and tick 'submit anonymously' — no name or contact details required." },
];

export default function ContactPage() {
  return (
    <section className="section-y">
      <div className="container-page grid gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="We'd love to hear from you" title="Contact us" />
          <div className="mt-6 space-y-3 text-sm text-ocean-700 dark:text-ocean-300">
            <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-ocean-500" /> +233 00 000 0000</p>
            <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-ocean-500" /> hello@thecitizenproject.org</p>
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-ocean-500" /> South Tongu District, Volta Region, Ghana</p>
            <p className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-ocean-500" /> WhatsApp: +233 00 000 0000</p>
            <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-ocean-500" /> Mon–Fri, 9am–5pm GMT</p>
          </div>

          <h2 className="mt-10 font-display text-lg font-semibold text-ocean-950 dark:text-white">FAQ</h2>
          <div className="mt-4 space-y-3">
            {faqs.map((f) => (
              <Card key={f.q} className="p-4">
                <p className="font-medium text-ocean-900 dark:text-white">{f.q}</p>
                <p className="mt-1 text-sm text-ocean-600 dark:text-ocean-300">{f.a}</p>
              </Card>
            ))}
          </div>
        </div>

        <Card className="h-fit p-6 sm:p-8">
          <ContactForm />
        </Card>
      </div>
    </section>
  );
}
