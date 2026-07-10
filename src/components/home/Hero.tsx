"use client";

import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { siteConfig, heroFeatures, stats } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { IconBox } from "@/lib/icons";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-30" />
      <div className="bg-hero-glow pointer-events-none absolute inset-0" />

      <Container className="relative py-12 md:py-20 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="min-w-0">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-eyebrow text-grey-olive"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand-accent" />
              {siteConfig.name}
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-display mt-5 text-taupe md:mt-6"
            >
              Premium branded goods for every business.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 max-w-lg text-base leading-relaxed text-grey-olive md:mt-5 md:text-lg"
            >
              {siteConfig.mission} One partner for merchandise, print, direct
              mail, and signage.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="mt-6 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row"
            >
              <Button href="/contact" variant="primary" size="lg" className="w-full sm:w-auto">
                Get a Free Quote
                <ArrowRight size={16} />
              </Button>
              <Button href="/products" variant="outline" size="lg" className="w-full sm:w-auto">
                View Products
              </Button>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="mt-6 flex flex-col gap-2 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-2"
            >
              {["Free quotes", "Nationwide shipping", "Dedicated support"].map(
                (item) => (
                  <li
                    key={item}
                    className="flex items-center gap-1.5 text-sm text-grey-olive"
                  >
                    <CheckCircle2
                      size={15}
                      className="shrink-0 text-brand-accent"
                      strokeWidth={2}
                    />
                    {item}
                  </li>
                ),
              )}
            </motion.ul>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative min-w-0"
          >
            <div className="card-surface overflow-hidden p-4 sm:p-5 md:p-6">
              <div className="mb-4 flex items-center justify-between gap-2 border-b border-border pb-4">
                <p className="text-sm font-semibold text-taupe">
                  Product catalog
                </p>
                <span className="shrink-0 rounded-md bg-surface px-2 py-0.5 text-xs font-medium text-grey-olive">
                  50+ categories
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
                {heroFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.name}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, delay: 0.3 + index * 0.05 }}
                    className="flex min-w-0 items-start gap-3 rounded-xl border border-border bg-surface/60 p-3 sm:p-3.5"
                  >
                    <IconBox name={feature.icon} size="sm" variant="accent" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-taupe">
                        {feature.name}
                      </p>
                      <p className="text-xs text-grey-olive">
                        {feature.category}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
              {stats.slice(0, 3).map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-border bg-white px-3 py-2.5 text-center sm:py-3"
                >
                  <p className="text-base font-bold tabular-nums text-taupe sm:text-lg">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-xs leading-snug text-grey-olive">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
