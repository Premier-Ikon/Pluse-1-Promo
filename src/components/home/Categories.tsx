"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { productGroups } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { IconBox } from "@/lib/icons";

export function Categories() {
  const previewCategories = [
    ...productGroups[0].items.slice(0, 3),
    ...productGroups[1].items.slice(0, 3),
  ];

  return (
    <section className="border-y border-border bg-surface py-20 md:py-28">
      <Container>
        <div className="mb-12 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Products"
            title="Branded goods & print materials"
            description="From custom apparel and drinkware to business cards, postcards, mailers, EDDM, and yard signs."
            className="mb-0 max-w-2xl"
          />
          <Button href="/products" variant="outline" size="md" className="w-full shrink-0 self-start sm:w-auto md:self-auto">
            View All Products
            <ArrowRight size={16} />
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {previewCategories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="group flex items-start gap-4 rounded-2xl border border-border bg-white p-5 transition-all hover:shadow-md md:p-6"
            >
              <IconBox name={category.icon} size="md" variant="default" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-semibold text-taupe">
                    {category.name}
                  </h3>
                  <span className="shrink-0 text-xs font-medium text-brand-accent-dark">
                    {category.count}
                  </span>
                </div>
                <p className="mt-1.5 text-sm leading-relaxed text-grey-olive">
                  {category.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
