"use client";

import { motion } from "framer-motion";
import { portfolioItems } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconBox } from "@/lib/icons";

export function Portfolio() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="Case Studies"
          title="How businesses use Plus One Promo"
          description="From welcome kits to direct mail campaigns — see the programs we build for clients across industries."
          className="mb-12 md:mb-14"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {portfolioItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="flex items-start gap-5 rounded-2xl border border-border bg-white p-6 md:p-7"
            >
              <IconBox name={item.icon} size="lg" variant="accent" />
              <div>
                <p className="text-eyebrow text-grey-olive">{item.client}</p>
                <h3 className="mt-1.5 text-lg font-semibold text-taupe">
                  {item.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
