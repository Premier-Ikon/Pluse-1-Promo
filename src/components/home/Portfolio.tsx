"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { homeVisuals } from "@/data/visuals";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Portfolio() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="Programs"
          title="How businesses work with us"
          description="Welcome kits, event gear, mail campaigns, and apparel programs — a few examples of what we put together."
          className="mb-12 md:mb-14"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {homeVisuals.portfolio.map((item, index) => (
            <motion.article
              key={item.title}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group overflow-hidden rounded-2xl border border-border bg-white"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-surface">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <div className="p-5 md:p-6">
                <p className="text-eyebrow text-grey-olive">{item.client}</p>
                <h3 className="mt-1.5 text-lg font-semibold text-taupe">
                  {item.title}
                </h3>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
