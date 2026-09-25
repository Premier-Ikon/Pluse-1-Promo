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
import { cn } from "@/lib/utils";

type ServiceDetailContentProps = {
  service: Service;
};

export function ServiceDetailContent({ service }: ServiceDetailContentProps) {
  const related = getRelatedServices(service.id);

  return (
    <>
      <section className="relative overflow-hidden bg-surface">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="bg-hero-glow pointer-events-none absolute inset-0 opacity-80" />
        <Container className="relative py-16 md:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6 xl:col-span-5">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-wrap items-center gap-x-3 gap-y-1"
              >
                <Link
                  href="/services"
                  className="text-eyebrow text-brand-accent-dark transition-colors hover:text-taupe"
                >
                  Services
                </Link>
                <span className="text-xs text-grey-olive/50" aria-hidden>
                  /
                </span>
                <span className="text-eyebrow text-grey-olive">
                  {service.title}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="text-section-title mt-3 text-taupe md:text-[clamp(2rem,4vw,3.25rem)]"
              >
                {service.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-4 max-w-lg text-sm leading-relaxed text-grey-olive md:text-base"
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
                  href="/services"
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  <ArrowLeft size={16} />
                  All services
                </Button>
                <Button
                  href="/contact"
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Request a quote
                  <ArrowRight size={16} />
                </Button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="lg:col-span-6 xl:col-span-7"
            >
              <div
                className={cn(
                  "relative ml-auto w-full overflow-hidden rounded-2xl bg-white",
                  service.id === "embroidery"
                    ? "aspect-[3/4] max-w-xs sm:max-w-sm"
                    : service.id === "stores"
                      ? "aspect-[16/11] max-w-md lg:max-w-lg"
                      : "aspect-[16/11] max-w-md sm:max-w-lg",
                )}
              >
                <Image
                  src={service.heroImage.src}
                  alt={service.heroImage.alt}
                  fill
                  priority
                  quality={100}
                  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 560px, 512px"
                  className={
                    service.id === "embroidery"
                      ? "object-cover object-[center_70%]"
                      : service.id === "stores"
                        ? "object-cover object-top"
                        : "object-cover object-center"
                  }
                />
              </div>
            </motion.div>
          </div>
        </Container>
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
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 280px"
                    quality={100}
                    className={
                      sample.imageClassName
                        ? `${sample.imageClassName} transition-transform duration-500 group-hover:scale-[1.02]`
                        : "object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    }
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
            src="/images/home/about-marquee-screenprint.jpg"
            alt="Production in progress"
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
