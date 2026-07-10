import type { Metadata } from "next";
import { siteConfig, values, whyPlusOne } from "@/data/site";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CTA } from "@/components/home/CTA";
import { IconBox } from "@/lib/icons";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Plus One Promo — our mission to give every business access to premium branded goods, print materials, and promotional products.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="Quality branded goods for every business"
        description={siteConfig.mission}
      />

      <section className="py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              eyebrow="Who We Are"
              title="Your full-service promotional partner"
              description={`${siteConfig.name} helps businesses source, design, and deliver the branded products and print materials that keep their name in front of the people who matter most — employees, customers, and communities.`}
              align="center"
            />
            <p className="mt-8 text-center text-base leading-relaxed text-grey-olive">
              We work with companies of every size, from local businesses
              ordering yard signs and business cards to national brands
              launching full employee gifting and merchandise programs. No
              matter the scale, our standard stays the same: premium quality,
              professional design, and a partner who genuinely cares about your
              results.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-surface py-16 md:py-24">
        <Container>
          <SectionHeading
            eyebrow="Our Values"
            title="What drives everything we do"
            description="Plus One Promo was built on the belief that great branded products shouldn't be reserved for the biggest budgets."
            align="center"
            className="mb-12 md:mb-14"
          />

          <div className="grid gap-4 md:grid-cols-2">
            {values.map((value) => (
              <div
                key={value.title}
                className="flex items-start gap-4 rounded-2xl border border-border bg-white p-6 md:p-7"
              >
                <IconBox name={value.icon} size="md" variant="accent" />
                <div>
                  <h3 className="text-base font-semibold text-taupe">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-grey-olive">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <SectionHeading
            eyebrow="Why Choose Us"
            title="The Plus One Promo advantage"
            align="center"
            className="mb-12 md:mb-14"
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {whyPlusOne.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-white p-6 text-center"
              >
                <IconBox
                  name={item.icon}
                  size="md"
                  variant="accent"
                  className="mx-auto"
                />
                <h3 className="mt-4 text-sm font-semibold text-taupe">
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

      <section className="border-t border-border bg-taupe py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-eyebrow text-brand-accent-dark">Our Mission</p>
            <blockquote className="text-section-title mt-4 text-white">
              &ldquo;{siteConfig.mission}&rdquo;
            </blockquote>
          </div>
        </Container>
      </section>

      <CTA />
    </>
  );
}
