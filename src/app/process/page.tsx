import type { Metadata } from "next";
import { processDetails, processSteps, siteConfig } from "@/data/site";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { CTA } from "@/components/home/CTA";
import { IconBox } from "@/lib/icons";

export const metadata: Metadata = {
  title: "Process",
  description:
    "Learn how Plus One Promo works — from initial consultation to design, production, and delivery of your branded goods and print materials.",
};

export default function ProcessPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Process"
        title="Simple, transparent, and built around your business"
        description={`Working with ${siteConfig.name} is straightforward. Whether you need branded merchandise for your team, business cards for your sales staff, or an EDDM campaign for your local market — we guide you through every step.`}
      />

      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step) => (
              <div
                key={step.step}
                className="rounded-2xl border border-border bg-white p-6"
              >
                <span className="text-xs font-semibold tabular-nums text-silver">
                  {step.step}
                </span>
                <IconBox
                  name={step.icon}
                  size="md"
                  variant="accent"
                  className="mt-4"
                />
                <h2 className="mt-4 text-base font-semibold text-taupe">
                  {step.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-grey-olive">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-surface py-16 md:py-24">
        <Container>
          <SectionHeading
            eyebrow="Why It Works"
            title="The Plus One Promo difference"
            description="We built our process to give every business — big or small — the same access to premium branded goods and professional support."
            align="center"
            className="mb-12 md:mb-14"
          />

          <div className="grid gap-4 md:grid-cols-3">
            {processDetails.map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-center rounded-2xl border border-border bg-white p-6 text-center md:p-8"
              >
                <IconBox name={item.icon} size="md" variant="accent" />
                <h3 className="mt-4 text-base font-semibold text-taupe">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-grey-olive">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-white p-8 text-center md:p-12">
            <h2 className="text-2xl font-bold tracking-tight text-taupe md:text-3xl">
              Ready to get started?
            </h2>
            <p className="mt-4 text-base leading-relaxed text-grey-olive">
              Reach out to {siteConfig.name} with your project details.
              We&apos;ll respond within one business day with recommendations
              and a custom quote — no obligation, no pressure.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/contact" variant="primary" size="lg">
                Start Your Project
              </Button>
              <Button href="/products" variant="outline" size="lg">
                Browse Products
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <CTA />
    </>
  );
}
