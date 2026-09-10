"use client";

import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { siteConfig } from "@/data/site";
import { ContactForm } from "@/components/contact/ContactForm";
import { Container } from "@/components/ui/Container";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: siteConfig.email,
    href: `mailto:${siteConfig.email}`,
  },
  {
    icon: Phone,
    label: "Phone",
    value: siteConfig.phone,
    href: `tel:${siteConfig.phone.replace(/\D/g, "")}`,
  },
  {
    icon: MapPin,
    label: "Service area",
    value: "Organizations nationwide",
    href: undefined,
  },
  {
    icon: Clock,
    label: "Response time",
    value: "Within 1 business day",
    href: undefined,
  },
];

const tips = [
  "What you need (merchandise, print, gifts, etc.)",
  "Estimated quantity and timeline",
  "Logo or artwork if you have it",
  "Budget range — optional, but helpful",
];

export function ContactPageContent() {
  return (
    <section className="relative overflow-hidden bg-surface">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="bg-hero-glow pointer-events-none absolute inset-0 opacity-80" />
      <Container className="relative py-16 md:py-24">
        <div className="max-w-2xl">
          <p className="text-eyebrow text-brand-accent-dark">Contact</p>
          <h1 className="mt-3 text-section-title text-taupe">
            Tell us what you need
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-grey-olive md:text-base">
            Share a few details with {siteConfig.name} — merchandise, print,
            gifts, or an idea. We&apos;ll come back with options and a clear
            quote, usually within one business day.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:gap-14">
          <aside className="space-y-8 lg:col-span-4">
            <div className="space-y-5">
              {contactInfo.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-white">
                    <item.icon
                      size={18}
                      className="text-taupe"
                      strokeWidth={1.75}
                    />
                  </div>
                  <div>
                    <p className="text-eyebrow text-grey-olive">{item.label}</p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="mt-1 block text-sm font-medium text-taupe transition-colors hover:text-brand-accent-dark"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="mt-1 text-sm font-medium text-taupe">
                        {item.value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-3xl bg-taupe px-5 py-6 sm:px-6">
              <p className="text-eyebrow text-brand-gold">Helpful to include</p>
              <ul className="mt-4 space-y-3">
                {tips.map((tip) => (
                  <li
                    key={tip}
                    className="border-l-2 border-brand-gold pl-3 text-sm leading-relaxed text-white/70"
                  >
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="lg:col-span-8">
            <ContactForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
