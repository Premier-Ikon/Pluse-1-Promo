"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

const tabs = [
  {
    id: "need",
    number: "01",
    label: "What you need",
    title: "The right product for the job",
    body: "Apparel, drinkware, print, and gifts — we’ll help you pick what fits your team, event, or campaign.",
    points: ["Custom apparel & headwear", "Drinkware & everyday goods", "Print, mailers & signage"],
    image: "/images/home/what-you-need.jpg",
    imageAlt: "A professional team in coordinated branded apparel on a job site",
    cta: { href: "/shop", label: "Browse the shop" },
  },
  {
    id: "make",
    number: "02",
    label: "How you make it",
    title: "Decoration that fits your brand",
    body: "Screen print, embroidery, or DTF — and Design Studio support if you still need artwork.",
    points: ["Screen print & embroidery", "DTF and specialty options", "Artwork help when you need it"],
    image: "/images/home/hoodie.jpg",
    imageAlt: "Branded hoodie showing decoration quality",
    cta: { href: "/contact?intent=design", label: "Open Design Studio" },
  },
  {
    id: "when",
    number: "03",
    label: "When you need it",
    title: "A timeline that works",
    body: "Share your need-by date on the request. We’ll confirm what’s realistic before production starts.",
    points: ["Standard for planned runs", "Rush when dates are tight", "Clear timing before we start"],
    image: "/images/home/when-you-need.jpg",
    imageAlt: "Screen printing production floor with shirts on press and stacked finished apparel",
    cta: { href: "/shop", label: "Start an order request" },
  },
  {
    id: "gotyou",
    number: "04",
    label: "We've got you",
    title: "Request now. Confirm before production.",
    body: "No online checkout. You send a request, we review it, then you approve the quote when it looks right.",
    points: ["Submit an order request", "Get a clear quote back", "Approve before we produce"],
    image: "/images/home/hero-team.jpg",
    imageAlt: "Team reviewing branded products together",
    cta: { href: "/contact", label: "Talk with us" },
  },
] as const;

export function ProductBento() {
  const [activeId, setActiveId] = useState<(typeof tabs)[number]["id"]>("need");
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];

  return (
    <section className="border-y border-border bg-surface py-16 md:py-20 lg:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:max-w-xl lg:text-left">
          <p className="text-eyebrow text-brand-accent-dark">Get started</p>
          <h2 className="mt-3 text-section-title text-taupe">
            From idea to order request
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-grey-olive md:text-base">
            Tap a step to learn more — then continue when you&apos;re ready.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-10 flex gap-2 overflow-x-auto pb-1 md:mt-12 md:flex-wrap md:justify-center lg:justify-start">
          {tabs.map((tab) => {
            const selected = tab.id === activeId;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveId(tab.id)}
                className={cn(
                  "flex shrink-0 items-baseline gap-2 rounded-full px-4 py-2.5 text-left transition-colors",
                  selected
                    ? "bg-taupe text-white"
                    : "bg-white text-grey-olive ring-1 ring-border hover:text-taupe",
                )}
              >
                <span
                  className={cn(
                    "text-xs font-semibold tabular-nums",
                    selected ? "text-brand-gold" : "text-silver",
                  )}
                >
                  {tab.number}
                </span>
                <span className="text-sm font-semibold whitespace-nowrap">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Showcase */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22 }}
            className="mt-6 overflow-hidden rounded-3xl bg-taupe md:mt-8"
          >
            <div className="grid md:grid-cols-2">
              <div className="flex flex-col justify-center p-7 sm:p-8 md:p-10 lg:p-12">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-gold">
                  {active.number} · {active.label}
                </p>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-white md:text-[1.75rem]">
                  {active.title}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70 md:text-[0.95rem]">
                  {active.body}
                </p>

                <ul className="mt-6 space-y-2.5">
                  {active.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-center gap-2.5 text-sm text-white/85"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
                      {point}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <Button href={active.cta.href} variant="secondary" size="md">
                    {active.cta.label}
                    <ArrowRight size={16} />
                  </Button>
                  <Link
                    href="/contact"
                    className="text-sm font-medium text-white/70 transition hover:text-white"
                  >
                    Or talk with us
                  </Link>
                </div>
              </div>

              <div className="relative min-h-[240px] sm:min-h-[280px] md:min-h-[420px]">
                <Image
                  src={active.image}
                  alt={active.imageAlt}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </Container>
    </section>
  );
}
