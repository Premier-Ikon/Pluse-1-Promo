"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { testimonials } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Testimonials() {
  return (
    <section className="border-t border-border bg-surface py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="Client Stories"
          title="Trusted by businesses big and small"
          description="From local shops to growing national brands, Plus One Promo helps businesses access the premium branded goods and print materials they need."
          align="center"
          className="mb-12 md:mb-14"
        />

        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.blockquote
              key={testimonial.author}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="flex flex-col rounded-2xl border border-border bg-white p-6 md:p-7"
            >
              <Quote
                size={20}
                className="text-brand-accent"
                fill="currentColor"
              />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-grey-olive">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <footer className="mt-6 border-t border-border pt-5">
                <cite className="not-italic">
                  <p className="text-sm font-semibold text-taupe">
                    {testimonial.author}
                  </p>
                  <p className="mt-0.5 text-xs text-grey-olive">
                    {testimonial.role}
                  </p>
                </cite>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </Container>
    </section>
  );
}
