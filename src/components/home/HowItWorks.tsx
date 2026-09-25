"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { processSteps } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AppIcon } from "@/lib/icons";

export function HowItWorks() {
  return (
    <section className="border-t border-border py-16 md:py-24">
      <Container>
        <div className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-eyebrow text-brand-accent-dark">Our process</p>
            <h2 className="mt-3 text-section-title text-taupe">
              How an order request works
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-grey-olive md:text-base">
              Simple steps, clear quotes, and confirmation before anything goes
              into production.
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
            >
              <Link
                href="/process"
                className="group flex h-full flex-col rounded-2xl border border-border bg-white p-5 transition-colors hover:border-brand-accent/40 hover:bg-brand-accent-light/30 md:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-semibold tabular-nums tracking-wide text-brand-accent-dark">
                    {step.step}
                  </span>
                  <AppIcon
                    name={step.icon}
                    size={18}
                    className="text-taupe/50 transition-colors group-hover:text-brand-accent-dark"
                  />
                </div>
                <h3 className="mt-5 text-base font-semibold tracking-tight text-taupe md:text-lg">
                  {step.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-grey-olive">
                  {step.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-taupe">
                  See the process
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
