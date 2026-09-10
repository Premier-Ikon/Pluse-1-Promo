"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import {
  aboutHighlights,
  siteConfig,
  values,
  whyPlusOne,
} from "@/data/site";
import { AboutHero } from "@/components/about/AboutHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CTA } from "@/components/home/CTA";
import { AppIcon } from "@/lib/icons";

export function AboutPageContent() {
  return (
    <>
      <AboutHero />

      <section className="border-b border-border bg-surface py-12 md:py-16">
        <Container>
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl bg-taupe px-6 py-8 sm:px-8 md:px-10 md:py-10"
          >
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
              {aboutHighlights.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: 0.05 + index * 0.05 }}
                  className="flex flex-col justify-center border-white/10 sm:border-l-0 lg:border-l lg:px-6 lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0"
                >
                  <p className="text-eyebrow text-brand-gold">{item.value}</p>
                  <p className="mt-2 text-sm leading-snug text-white/70 md:text-[0.95rem]">
                    {item.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-6">
              <p className="text-eyebrow text-brand-accent-dark">Who we are</p>
              <h2 className="mt-3 text-section-title text-taupe">
                A partner built around access and quality
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-grey-olive md:text-base">
                {siteConfig.name} is a women-owned business with more than
                fifteen years helping teams, founders, and organizations get
                custom merchandise and print done right — without locking
                quality behind a premium-only price tag.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-grey-olive md:text-base">
                From a small local order to a larger program, our standard stays
                the same: goods made to last, clear quotes before production,
                and a real person to work with.
              </p>
              <Button
                href="/process"
                variant="outline"
                size="md"
                className="mt-8"
              >
                See how we work
                <ArrowRight size={16} />
              </Button>
            </div>

            <div className="lg:col-span-6">
              <div className="relative h-64 overflow-hidden rounded-2xl sm:h-80 md:h-[22rem]">
                <Image
                  src="/images/home/what-you-need.jpg"
                  alt="Reviewing product and decoration options together"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-border bg-surface py-16 md:py-24">
        <Container>
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
              {siteConfig.mission}&rdquo;
            </blockquote>
            <figcaption className="mt-8 border-t border-white/10 pt-6 text-sm text-white/60">
              Our mission at {siteConfig.name}
            </figcaption>
          </motion.figure>
        </Container>
      </section>

      <section className="border-t border-border py-16 md:py-24">
        <Container>
          <div className="mb-10 max-w-xl md:mb-12">
            <p className="text-eyebrow text-brand-accent-dark">Our values</p>
            <h2 className="mt-3 text-section-title text-taupe">
              What drives every order
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-grey-olive md:text-base">
              Great custom products shouldn&apos;t only be for the biggest
              budgets — lasting quality should be within reach.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className="rounded-2xl border border-border bg-white p-5 transition-colors hover:border-brand-accent/40 hover:bg-brand-accent-light/30 md:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-semibold tabular-nums tracking-wide text-brand-accent-dark">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <AppIcon
                    name={value.icon}
                    size={18}
                    className="text-taupe/50"
                  />
                </div>
                <h3 className="mt-5 text-base font-semibold tracking-tight text-taupe md:text-lg">
                  {value.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-grey-olive">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-border bg-surface py-16 md:py-24">
        <Container>
          <div className="mb-10 max-w-xl md:mb-12">
            <p className="text-eyebrow text-brand-accent-dark">Why choose us</p>
            <h2 className="mt-3 text-section-title text-taupe">
              The Plus One Promo difference
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-grey-olive md:text-base">
              One team for merchandise, embroidery, print, and programs — with
              the same care at every size.
            </p>
          </div>

          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl bg-taupe px-6 py-10 sm:px-8 md:px-10 md:py-12"
          >
            <div className="grid gap-8 sm:grid-cols-2 md:gap-10">
              {whyPlusOne.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <AppIcon
                    name={item.icon}
                    size={20}
                    className="mt-0.5 shrink-0 text-brand-gold"
                  />
                  <div>
                    <h3 className="text-base font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/home/when-you-need.jpg"
            alt="Production in progress"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-taupe/75" />
        </div>
        <Container className="relative py-16 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-eyebrow text-brand-accent">Ready when you are</p>
            <h2 className="mt-3 text-section-title text-white">
              Let&apos;s get quality goods in your hands.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-silver md:text-base">
              Tell us what you need — we&apos;ll come back with options and a
              clear quote before production starts.
            </p>
            <Button
              href="/contact"
              variant="secondary"
              size="lg"
              className="mt-8"
            >
              Request a quote
              <ArrowRight size={16} />
            </Button>
          </div>
        </Container>
      </section>

      <CTA />
    </>
  );
}
