import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/contact/ContactForm";
import { PageHero } from "@/components/layout/PageHero";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Plus One Promo for a free quote on branded merchandise, business cards, mailers, postcards, EDDM, yard signs, and more.",
};

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
    label: "Service Area",
    value: "Serving businesses nationwide",
    href: undefined,
  },
  {
    icon: Clock,
    label: "Response Time",
    value: "Within 1 business day",
    href: undefined,
  },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's build something great for your brand"
        description={`Tell ${siteConfig.name} about your project — whether it's branded merchandise for your team, business cards for your staff, or a full direct mail campaign. We'll put together a custom quote with no obligation.`}
      />

      <section className="py-10 md:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
            <div className="lg:col-span-2">
              <div className="space-y-5">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-surface">
                      <item.icon size={18} className="text-taupe" strokeWidth={1.75} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-grey-olive">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="mt-0.5 text-sm font-medium text-taupe transition-colors hover:text-brand-accent-dark"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="mt-0.5 text-sm font-medium text-taupe">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
                <h3 className="text-base font-semibold text-taupe">
                  What to include in your message
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-grey-olive">
                  <li>Product or service type (merchandise, print, mail, etc.)</li>
                  <li>Estimated quantities and timeline</li>
                  <li>Your logo or brand guidelines (if available)</li>
                  <li>Budget range (optional)</li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-3">
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
