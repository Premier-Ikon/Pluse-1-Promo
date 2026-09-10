"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { services } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AppIcon } from "@/lib/icons";

export function Services() {
  return (
    <section className="py-16 md:py-24" id="services">
      <Container>
        <div className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-eyebrow text-brand-accent-dark">Services</p>
            <h2 className="mt-3 text-section-title text-taupe">
              What we help you get done
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-grey-olive md:text-base">
              Merchandise, embroidery, print, gifts, events, and ongoing merch
              programs — one team to work with.
            </p>
          </div>
          <Button
            href="/services"
            variant="outline"
            size="md"
            className="w-full shrink-0 self-start sm:w-auto"
          >
            View all services
            <ArrowRight size={16} />
          </Button>
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
  );
}
