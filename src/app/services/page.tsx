import type { Metadata } from "next";
import { Check } from "lucide-react";
import { services, siteConfig, whyPlusOne } from "@/data/site";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { CTA } from "@/components/home/CTA";
import { IconBox } from "@/lib/icons";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Plus One Promo services — branded merchandise, print & direct mail, corporate gifting, events, and company store programs for businesses of all sizes.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Everything your brand needs to connect with your audience"
        description={`${siteConfig.name} is a full-service promotional partner. We help businesses of every size access premium branded goods, print materials, and marketing programs — managed from concept through delivery.`}
      />

      {services.map((service, index) => (
        <section
          key={service.id}
          id={service.id}
          className={index % 2 === 1 ? "bg-surface py-16 md:py-24" : "py-16 md:py-24"}
        >
          <Container>
            <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-14">
              <div className="lg:col-span-4">
                <IconBox name={service.icon} size="lg" variant="accent" />
                <h2 className="mt-6 text-2xl font-bold tracking-tight text-taupe md:text-3xl">
                  {service.title}
                </h2>
              </div>
              <div className="lg:col-span-8">
                <p className="text-base leading-relaxed text-grey-olive md:text-lg">
                  {service.longDescription}
                </p>
                <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2.5 text-sm text-taupe"
                    >
                      <Check
                        size={16}
                        className="mt-0.5 shrink-0 text-brand-accent"
                        strokeWidth={2.5}
                      />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  href="/contact"
                  variant="primary"
                  size="md"
                  className="mt-8"
                >
                  Get a Quote
                </Button>
              </div>
            </div>
          </Container>
        </section>
      ))}

      <section className="border-t border-border bg-surface py-16 md:py-24">
        <Container>
          <SectionHeading
            eyebrow="Why Plus One Promo"
            title="One partner for your entire brand program"
            description="Stop coordinating multiple vendors. Plus One Promo brings merchandise, print, direct mail, and fulfillment together."
            align="center"
            className="mb-12 md:mb-14"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            {whyPlusOne.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-2xl border border-border bg-white p-6 md:p-7"
              >
                <IconBox name={item.icon} size="md" variant="accent" />
                <div>
                  <h3 className="text-base font-semibold text-taupe">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-grey-olive">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTA />
    </>
  );
}
