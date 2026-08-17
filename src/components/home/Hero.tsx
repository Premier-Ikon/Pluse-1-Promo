"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Package,
  MessageCircle,
  Truck,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const trustItems = [
  { icon: BadgeCheck, label: "Clear quotes first" },
  { icon: MessageCircle, label: "Real people, real help" },
  { icon: Truck, label: "Ships nationwide" },
  { icon: Package, label: "Apparel, print & gifts" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Full-bleed photo — tall frame so more of the shot shows */}
      <div className="relative min-h-[88vh] w-full sm:min-h-[86vh] lg:min-h-[820px] xl:min-h-[880px]">
        <Image
          src="/images/home/hero-team.jpg?v=5"
          alt="A team reviewing branded apparel, drinkware, and gifts together in a bright studio"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Soft shadow for type — keep the photo natural */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/10"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent"
          aria-hidden
        />

        <Container className="relative flex min-h-[88vh] flex-col justify-end pb-12 pt-32 sm:min-h-[86vh] sm:pb-14 lg:min-h-[820px] lg:pb-16 xl:min-h-[880px]">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-sm font-semibold tracking-wide text-brand-gold"
            >
              Plus One Promo
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-display mt-3 text-white drop-shadow-sm"
            >
              Custom apparel &amp; goods done right.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 max-w-lg text-base leading-relaxed text-white/85 md:text-lg"
            >
              Team shirts, client gifts, drinkware, and print — we confirm
              pricing with you before anything goes into production.
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
                href="/shop"
                size="lg"
                className="w-full border border-white/35 bg-white/15 text-white backdrop-blur-sm hover:border-white/50 hover:bg-white/25 sm:w-auto"
              >
                View products
              </Button>
            </motion.div>
          </div>
        </Container>
      </div>

      {/* Trust strip — brand bar under the photo */}
      <div className="bg-taupe">
        <Container>
          <ul className="grid grid-cols-2 sm:grid-cols-4">
            {trustItems.map((item, index) => (
              <motion.li
                key={item.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.2 + index * 0.05 }}
                className="flex items-center gap-2.5 px-3 py-3.5 sm:justify-center sm:px-4 sm:py-4"
              >
                <item.icon
                  size={18}
                  className="shrink-0 text-brand-gold"
                  strokeWidth={1.75}
                />
                <span className="text-xs font-medium text-white sm:text-sm">
                  {item.label}
                </span>
              </motion.li>
            ))}
          </ul>
        </Container>
      </div>
    </section>
  );
}
