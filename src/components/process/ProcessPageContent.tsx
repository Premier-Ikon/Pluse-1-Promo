"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { processDetails, processSteps } from "@/data/site";
import { ProcessHero } from "@/components/process/ProcessHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PageEnter } from "@/components/ui/PageEnter";
import { CTA } from "@/components/home/CTA";
import { AppIcon } from "@/lib/icons";

export function ProcessPageContent() {
  return (
    <PageEnter>
      <ProcessHero />

      <section className="py-16 md:py-24">
        <Container>
          <div className="mb-10 max-w-xl md:mb-12">
            <p className="text-eyebrow text-brand-accent-dark">The steps</p>
            <h2 className="mt-3 text-section-title text-taupe">
              Four clear stages
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-grey-olive md:text-base">
              From the first request to delivery — options, a quote, and your
              approval before anything goes into production.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                className="flex h-full flex-col rounded-2xl border border-border bg-white p-5 md:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-semibold tabular-nums tracking-wide text-brand-accent-dark">
                    {step.step}
                  </span>
                  <AppIcon
                    name={step.icon}
                    size={18}
                    className="text-taupe/50"
                  />
                </div>
                <h3 className="mt-5 text-base font-semibold tracking-tight text-taupe md:text-lg">
                  {step.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-grey-olive">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-border bg-surface py-16 md:py-24">
        <Container>
          <div className="mb-4 max-w-xl md:mb-6">
            <p className="text-eyebrow text-brand-accent-dark">In detail</p>
            <h2 className="mt-3 text-section-title text-taupe">
              What happens at each stage
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-grey-olive md:text-base">
              No surprises — you always know where the order stands and what
              comes next.
            </p>
          </div>

          <div className="divide-y divide-border">
            {processSteps.map((step, index) => (
              <motion.article
                key={step.step}
                id={step.id}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4 }}
                className="grid scroll-mt-24 gap-6 py-10 first:pt-8 last:pb-0 md:py-12 lg:grid-cols-12 lg:gap-12"
              >
                <div className="lg:col-span-4">
                  <span className="text-xs font-semibold tabular-nums tracking-wide text-brand-accent-dark">
                    {step.step}
                  </span>
                  <div className="mt-3 flex items-center gap-3">
                    <AppIcon
                      name={step.icon}
                      size={22}
                      className="shrink-0 text-brand-accent-dark"
                    />
                    <h3 className="text-xl font-bold tracking-tight text-taupe md:text-2xl">
                      {step.title}
                    </h3>
                  </div>
                </div>
                <div className="lg:col-span-8">
                  <p className="text-sm leading-relaxed text-grey-olive md:text-base">
                    {step.description}
                  </p>
                  {index === 0 && (
                    <p className="mt-4 text-sm leading-relaxed text-grey-olive md:text-base">
                      Share quantity, timeline, decoration ideas, or just a
                      rough concept — we&apos;ll help shape it into a clear
                      request.
                    </p>
                  )}
                  {index === 1 && (
                    <p className="mt-4 text-sm leading-relaxed text-grey-olive md:text-base">
                      You review the options and quote first. Production only
                      starts after you say it looks right.
                    </p>
                  )}
                  {index === 2 && (
                    <p className="mt-4 text-sm leading-relaxed text-grey-olive md:text-base">
                      Sourcing, decoration, and quality checks happen with
                      updates along the way so you&apos;re never guessing.
                    </p>
                  )}
                  {index === 3 && (
                    <p className="mt-4 text-sm leading-relaxed text-grey-olive md:text-base">
                      We ship to one location or many — on the timeline we
                      confirmed together.
                    </p>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-border py-16 md:py-24">
        <Container>
          <div className="mb-10 max-w-xl md:mb-12">
            <p className="text-eyebrow text-brand-accent-dark">Why it works</p>
            <h2 className="mt-3 text-section-title text-taupe">
              Built for clarity at every size
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-grey-olive md:text-base">
              The same care for a small team run or a larger organization program —
              one partner, clear communication.
            </p>
          </div>

          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl bg-taupe px-6 py-10 sm:px-8 md:px-10 md:py-12"
          >
            <div className="grid gap-8 md:grid-cols-3 md:gap-10">
              {processDetails.map((item) => (
                <div key={item.title}>
                  <AppIcon
                    name={item.icon}
                    size={20}
                    className="text-brand-gold"
                  />
                  <h3 className="mt-4 text-base font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/home/work-team-apparel.jpg"
            alt="Reviewing custom product options"
            fill
            quality={90}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-taupe/75" />
        </div>
        <Container className="relative py-16 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-eyebrow text-brand-accent">Ready when you are</p>
            <h2 className="mt-3 text-section-title text-white">
              Tell us what you need. We&apos;ll take it from there.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-silver md:text-base">
              Share your timeline, quantity, and artwork — or just an idea. We
              come back with options and a clear quote before production starts.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/contact" variant="secondary" size="lg">
                Request a quote
                <ArrowRight size={16} />
              </Button>
              <Button
                href="/apparel"
                size="lg"
                className="border border-white/35 bg-white/15 text-white backdrop-blur-sm hover:border-white/50 hover:bg-white/25"
              >
                Browse products
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <CTA />
    </PageEnter>
  );
}
