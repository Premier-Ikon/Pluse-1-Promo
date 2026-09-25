"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

const collage = [
  {
    src: "/images/home/about-marquee-screenprint.jpg",
    alt: "Screen printing presses on the production floor",
    className: "col-span-2 sm:col-span-7 sm:row-span-2",
    sizes: "(max-width: 640px) 100vw, 60vw",
  },
  {
    src: "/images/home/about-marquee-embroidery.jpg",
    alt: "Multi-head embroidery machines in production",
    className: "col-span-1 sm:col-span-5",
    sizes: "(max-width: 640px) 50vw, 40vw",
  },
  {
    src: "/images/home/about-marquee-warehouse.jpg",
    alt: "Warehouse inventory ready for fulfillment",
    className: "col-span-1 sm:col-span-5",
    sizes: "(max-width: 640px) 50vw, 40vw",
  },
] as const;

export function ServicesHero() {
  return (
    <section className="relative overflow-hidden bg-taupe">
      <div className="relative min-h-[68vh] w-full sm:min-h-[62vh] lg:min-h-[560px] xl:min-h-[600px]">
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-[1fr_7.5rem] gap-[3px] bg-taupe sm:grid-cols-12 sm:grid-rows-2">
          {collage.map((panel) => (
            <div
              key={panel.src}
              className={cn("relative min-h-0 overflow-hidden", panel.className)}
            >
              <Image
                src={panel.src}
                alt={panel.alt}
                fill
                priority
                quality={90}
                sizes={panel.sizes}
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/20 to-transparent"
          aria-hidden
        />

        <Container className="relative flex min-h-[68vh] flex-col justify-end pb-36 pt-28 sm:min-h-[62vh] sm:pb-14 lg:min-h-[560px] lg:pb-16 xl:min-h-[600px]">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-eyebrow text-brand-gold"
            >
              Services
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-section-title mt-3 text-white drop-shadow-sm md:text-[clamp(2rem,4vw,3.25rem)]"
            >
              What we help you get done
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 max-w-lg text-sm leading-relaxed text-white/85 md:text-base"
            >
              {siteConfig.name} handles merchandise, embroidery, print, gifts,
              events, and merch programs — one team, clear quotes before
              production.
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
                href="/apparel"
                size="lg"
                className="w-full border border-white/35 bg-white/15 text-white backdrop-blur-sm hover:border-white/50 hover:bg-white/25 sm:w-auto"
              >
                Browse products
              </Button>
            </motion.div>
          </div>
        </Container>
      </div>
    </section>
  );
}
