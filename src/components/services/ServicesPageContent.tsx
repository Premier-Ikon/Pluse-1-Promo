"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  processSteps,
  services,
  whyPlusOne,
} from "@/data/site";
import { homeVisuals } from "@/data/visuals";
import { ServicesHero } from "@/components/services/ServicesHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CTA } from "@/components/home/CTA";
import { AppIcon } from "@/lib/icons";

export function ServicesPageContent() {
  return (
    <>
      <ServicesHero />

      <section className="py-16 md:py-24">
        <Container>
          <div className="mb-10 max-w-xl md:mb-12">
            <p className="text-eyebrow text-brand-accent-dark">Overview</p>
            <h2 className="mt-3 text-section-title text-taupe">
              Six ways we support your organization
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-grey-olive md:text-base">
              Jump into a service to see what&apos;s included, sample work, and
              how to request a quote.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
              >
                <Link
                  href={service.href}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-white p-5 transition-colors hover:border-brand-accent/40 hover:bg-brand-accent-light/30 md:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-xs font-semibold tabular-nums tracking-wide text-brand-accent-dark">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <AppIcon
                      name={service.icon}
                      size={18}
                      className="text-taupe/50 transition-colors group-hover:text-brand-accent-dark"
                    />
                  </div>
                  <h3 className="mt-5 text-base font-semibold tracking-tight text-taupe md:text-lg">
                    {service.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-grey-olive">
                    {service.description}
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

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={homeVisuals.atmosphere.src}
            alt={homeVisuals.atmosphere.alt}
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-taupe/75" />
        </div>
        <Container className="relative py-16 md:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-eyebrow text-brand-accent">From idea to finished</p>
            <h2 className="mt-3 text-section-title text-white">
              Real production. Clear quotes. One team.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-silver md:text-base">
              Whether you need embroidery, print, or a full merch program, we
              stay with you from the first request through delivery.
            </p>
          </div>
        </Container>
      </section>

      <section className="border-t border-border bg-surface py-16 md:py-24">
        <Container>
          <div className="mb-10 max-w-xl md:mb-14">
            <p className="text-eyebrow text-brand-accent-dark">In detail</p>
            <h2 className="mt-3 text-section-title text-taupe">
              Dig into each service
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-grey-olive md:text-base">
              Browse what&apos;s included and see sample work on each dedicated
              page.
            </p>
          </div>

          <div className="space-y-14 md:space-y-20">
            {services.map((service, index) => {
              const imageLeft = index % 2 === 0;
              return (
                <motion.article
                  key={service.id}
                  id={service.id}
                  initial={false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4 }}
                  className="scroll-mt-24 grid items-center gap-8 lg:grid-cols-12 lg:gap-12"
                >
                  <div
                    className={
                      imageLeft
                        ? "lg:col-span-5"
                        : "lg:col-span-5 lg:order-2"
                    }
                  >
                    <div
                      className={
                        imageLeft
                          ? "relative h-52 w-full max-w-md overflow-hidden rounded-2xl sm:h-56 md:h-64 lg:max-w-lg"
                          : "relative ml-auto h-52 w-full max-w-md overflow-hidden rounded-2xl sm:h-56 md:h-64 lg:max-w-lg"
                      }
                    >                      <Image
                        src={service.heroImage.src}
                        alt={service.heroImage.alt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 28rem"
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div
                    className={
                      imageLeft
                        ? "lg:col-span-7"
                        : "lg:col-span-7 lg:order-1"
                    }
                  >
                    <span className="text-xs font-semibold tabular-nums tracking-wide text-brand-accent-dark">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 text-xl font-bold tracking-tight text-taupe md:text-2xl">
                      {service.title}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-grey-olive md:text-base">
                      {service.longDescription}
                    </p>
                    <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                      {service.features.slice(0, 4).map((feature) => (
                        <li
                          key={feature}
                          className="border-l-2 border-brand-accent pl-3 text-sm leading-relaxed text-taupe"
                        >
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={service.href}
                      className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-taupe transition-colors hover:text-brand-accent-dark"
                    >
                      Explore {service.title.toLowerCase()}
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-t border-border py-16 md:py-24">
        <Container>
          <div className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="text-eyebrow text-brand-accent-dark">Our process</p>
              <h2 className="mt-3 text-section-title text-taupe">
                How an order request works
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-grey-olive md:text-base">
                Simple steps, clear quotes, and confirmation before anything
                goes into production.
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
          <div className="mb-10 max-w-xl md:mb-12">
            <p className="text-eyebrow text-brand-accent-dark">
              Why Plus One Promo
            </p>
            <h2 className="mt-3 text-section-title text-taupe">
              One partner for your organization
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-grey-olive md:text-base">
              Merchandise, print, and fulfillment under one roof — so you are
              not juggling vendors for every order.
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

      <CTA />
    </>
  );
}
