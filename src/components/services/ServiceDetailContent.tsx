"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Service } from "@/data/services";
import { getRelatedServices } from "@/data/services";
import { processSteps } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CTA } from "@/components/home/CTA";
import { AppIcon } from "@/lib/icons";

type ServiceDetailContentProps = {
  service: Service;
};

export function ServiceDetailContent({ service }: ServiceDetailContentProps) {
  const related = getRelatedServices(service.id);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="relative min-h-[68vh] w-full sm:min-h-[62vh] lg:min-h-[560px] xl:min-h-[600px]">
          <Image
            src={service.heroImage.src}
            alt={service.heroImage.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />

          <div
            className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-black/15"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/15 to-transparent"
            aria-hidden
          />

          <Container className="relative flex min-h-[68vh] flex-col justify-end pb-12 pt-28 sm:min-h-[62vh] sm:pb-14 lg:min-h-[560px] lg:pb-16 xl:min-h-[600px]">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-wrap items-center gap-x-3 gap-y-1"
              >
                <Link
                  href="/services"
                  className="text-eyebrow text-brand-gold transition-colors hover:text-brand-gold/80"
                >
                  Services
                </Link>
                <span className="text-xs text-white/40" aria-hidden>
                  /
                </span>
                <span className="text-eyebrow text-white/70">{service.title}</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="text-section-title mt-3 text-white drop-shadow-sm md:text-[clamp(2rem,4vw,3.25rem)]"
              >
                {service.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-4 max-w-lg text-sm leading-relaxed text-white/85 md:text-base"
              >
                {service.pageIntro}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
              >
                <Button
                  href="/contact"
                  variant="secondary"
                  size="lg"
                  className="w-full shadow-md sm:w-auto"
                >
                  Request a quote
                  <ArrowRight size={16} />
                </Button>
                <Button
                  href="/services"
                  size="lg"
                  className="w-full border border-white/35 bg-white/15 text-white backdrop-blur-sm hover:border-white/50 hover:bg-white/25 sm:w-auto"
                >
                  <ArrowLeft size={16} />
                  All services
                </Button>
              </motion.div>
            </div>
          </Container>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <p className="text-eyebrow text-brand-accent-dark">Overview</p>
              <h2 className="mt-3 text-section-title text-taupe">
                What this service covers
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-grey-olive md:text-base">
                {service.longDescription}
              </p>
            </div>

            <div className="lg:col-span-7">
              <p className="text-eyebrow text-brand-accent-dark">Included</p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {service.features.map((feature) => (
                  <li
                    key={feature}
                    className="border-l-2 border-brand-accent pl-4 text-sm leading-relaxed text-taupe"
                  >
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-10 border-t border-border pt-10">
                <p className="text-eyebrow text-brand-accent-dark">Ideal for</p>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {service.idealFor.map((item) => (
                    <li
                      key={item}
                      className="border-l-2 border-border pl-4 text-sm leading-relaxed text-grey-olive"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-border bg-surface py-16 md:py-24">
        <Container>
          <div className="mb-10 max-w-xl md:mb-12">
            <p className="text-eyebrow text-brand-accent-dark">Our work</p>
            <h2 className="mt-3 text-section-title text-taupe">
              A look at {service.title.toLowerCase()}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-grey-olive md:text-base">
              Sample styles and finishes — your quote will reflect the exact
              products, decoration, and quantities you need.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {service.work.map((sample, index) => (
              <motion.figure
                key={`${sample.src}-${sample.caption}`}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className="group"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white">
                  <Image
                    src={sample.src}
                    alt={sample.alt}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="mt-3.5">
                  <span className="text-[11px] font-semibold tabular-nums tracking-wide text-brand-accent-dark">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-1 text-sm font-medium leading-snug text-taupe">
                    {sample.caption}
                  </p>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-border py-16 md:py-24">
        <Container>
          <div className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="text-eyebrow text-brand-accent-dark">How it works</p>
              <h2 className="mt-3 text-section-title text-taupe">
                From request to delivery
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-grey-olive md:text-base">
                Same clear process for every service — options and a quote
                before production.
              </p>
            </div>
            <Button
              href="/process"
              variant="outline"
              size="md"
              className="w-full shrink-0 self-start sm:w-auto"
            >
              See the full process
              <ArrowRight size={16} />
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step) => (
              <div
                key={step.step}
                className="flex h-full flex-col rounded-2xl border border-border bg-white p-5 md:p-6"
              >
                <span className="text-xs font-semibold tabular-nums tracking-wide text-brand-accent-dark">
                  {step.step}
                </span>
                <h3 className="mt-4 text-base font-semibold tracking-tight text-taupe">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-grey-olive">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
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
              Tell us what you need for {service.title.toLowerCase()}.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-silver md:text-base">
              Share timeline, quantity, and artwork — or just an idea. We come
              back with options and a clear quote.
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

      <section className="border-t border-border bg-surface py-16 md:py-24">
        <Container>
          <div className="mb-10 max-w-xl md:mb-12">
            <p className="text-eyebrow text-brand-accent-dark">More services</p>
            <h2 className="mt-3 text-section-title text-taupe">
              Explore related work
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {related.map((item, index) => (
              <motion.div
                key={item.id}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
              >
                <Link
                  href={item.href}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-white p-5 transition-colors hover:border-brand-accent/40 hover:bg-brand-accent-light/30 md:p-6"
                >
                  <AppIcon
                    name={item.icon}
                    size={18}
                    className="text-taupe/50 transition-colors group-hover:text-brand-accent-dark"
                  />
                  <h3 className="mt-5 text-base font-semibold tracking-tight text-taupe">
                    {item.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-grey-olive">
                    {item.description}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-taupe">
                    Learn more
                    <ArrowUpRight
                      size={15}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <CTA />
    </>
  );
}
