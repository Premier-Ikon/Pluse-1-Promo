"use client";

import { motion } from "framer-motion";
import { testimonials } from "@/data/site";
import { Container } from "@/components/ui/Container";

export function Testimonials() {
  const [featured, ...rest] = testimonials;

  return (
    <section className="border-t border-border bg-surface py-16 md:py-24">
      <Container>
        <div className="mb-10 max-w-xl md:mb-12">
          <p className="text-eyebrow text-brand-accent-dark">Client stories</p>
          <h2 className="mt-3 text-section-title text-taupe">
            What partners say after the order lands
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-grey-olive md:text-base">
            Clear quotes, quality decoration, and one team that stays with you
            from request to delivery.
          </p>
        </div>

        <motion.figure
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45 }}
          className="rounded-3xl bg-taupe px-6 py-10 sm:px-10 sm:py-12 md:px-14 md:py-14"
        >
          <span
            className="block text-5xl font-bold leading-none text-brand-gold"
            aria-hidden
          >
            &ldquo;
          </span>
          <blockquote className="mt-4 max-w-3xl text-xl font-semibold leading-snug tracking-tight text-white sm:text-2xl md:text-[1.75rem] md:leading-snug">
            {featured.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-8 flex flex-col gap-1 border-t border-white/10 pt-6 sm:flex-row sm:items-baseline sm:gap-3">
            <cite className="not-italic text-sm font-semibold text-white">
              {featured.author}
            </cite>
            <span className="hidden text-brand-gold sm:inline" aria-hidden>
              ·
            </span>
            <span className="text-sm text-white/60">{featured.role}</span>
          </figcaption>
        </motion.figure>

        <div className="mt-10 grid gap-8 md:mt-12 md:grid-cols-2 md:gap-12">
          {rest.map((testimonial, index) => (
            <motion.figure
              key={testimonial.author}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: 0.06 + index * 0.06 }}
              className="border-l-2 border-brand-accent pl-5 md:pl-6"
            >
              <blockquote className="text-base leading-relaxed text-taupe md:text-[1.05rem]">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5">
                <cite className="not-italic text-sm font-semibold text-taupe">
                  {testimonial.author}
                </cite>
                <p className="mt-0.5 text-xs text-grey-olive">
                  {testimonial.role}
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
