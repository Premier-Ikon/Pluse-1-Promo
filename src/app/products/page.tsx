import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { productGroups, siteConfig } from "@/data/site";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { CTA } from "@/components/home/CTA";
import { IconBox } from "@/lib/icons";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Explore Plus One Promo products — branded merchandise, business cards, postcards, mailers, EDDM, yard signs, and more.",
};

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Premium branded goods & print — all in one place"
        description={`${siteConfig.name} gives every business access to the best-quality promotional products and print materials — from custom apparel and corporate gifts to business cards, mailers, postcards, EDDM, and yard signs.`}
      />

      {productGroups.map((group, groupIndex) => (
        <section
          key={group.id}
          id={group.id}
          className={groupIndex % 2 === 1 ? "bg-surface py-16 md:py-24" : "py-16 md:py-24"}
        >
          <Container>
            <SectionHeading
              eyebrow={groupIndex === 0 ? "Branded Goods" : "Print & Mail"}
              title={group.title}
              description={group.description}
              className="mb-10 md:mb-12"
            />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((item) => (
                <article
                  key={item.name}
                  className="group flex flex-col rounded-2xl border border-border bg-white p-6 transition-all hover:shadow-md"
                >
                  <IconBox name={item.icon} size="md" variant="accent" />
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <h3 className="text-base font-semibold text-taupe">
                      {item.name}
                    </h3>
                    <span className="shrink-0 text-xs font-medium text-brand-accent-dark">
                      {item.count}
                    </span>
                  </div>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-grey-olive">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </Container>
        </section>
      ))}

      <section className="border-t border-border bg-taupe py-16 md:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-section-title text-white">
              Don&apos;t see what you need?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-silver md:text-base">
              Plus One Promo sources products and print materials across
              thousands of categories. Tell us what you&apos;re looking for and
              we&apos;ll find the right solution for your brand and budget.
            </p>
            <Button href="/contact" variant="secondary" size="lg" className="mt-8">
              Request a Custom Quote
              <ArrowUpRight size={16} />
            </Button>
          </div>
        </Container>
      </section>

      <CTA />
    </>
  );
}
