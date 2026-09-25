"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

/** Client-provided photos for the about marquee. */
const aboutMarqueePhotos = [
  {
    src: "/images/home/about-marquee-embroidery.jpg",
    alt: "Multi-head embroidery production",
    className: "h-52 w-72 md:h-64 md:w-96",
  },
  {
    src: "/images/home/about-marquee-truck-crew.jpg",
    alt: "Branded service vehicle and team member",
    className: "h-64 w-44 md:h-80 md:w-56",
  },
  {
    src: "/images/home/about-marquee-screenprint.jpg",
    alt: "Screen printing presses on the production floor",
    className: "h-44 w-64 md:h-56 md:w-80",
  },
  {
    src: "/images/home/about-marquee-shopfloor.jpg",
    alt: "Custom apparel decoration shop",
    className: "h-56 w-72 md:h-72 md:w-96",
  },
  {
    src: "/images/home/about-marquee-rooftop.jpg",
    alt: "Team wearing branded workwear in the field",
    className: "h-60 w-48 md:h-72 md:w-56",
  },
  {
    src: "/images/home/about-marquee-warehouse.jpg",
    alt: "Organized inventory and fulfillment",
    className: "h-48 w-64 md:h-60 md:w-80",
  },
  {
    src: "/images/home/about-marquee-dtf.jpg",
    alt: "DTF printing and finishing equipment",
    className: "h-52 w-52 md:h-64 md:w-64",
  },
  {
    src: "/images/home/about-marquee-truck-barn.jpg",
    alt: "Branded vehicle ready for the day",
    className: "h-40 w-60 md:h-52 md:w-80",
  },
] as const;

const marqueePhotos = [...aboutMarqueePhotos, ...aboutMarqueePhotos];

export function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-surface">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="bg-hero-glow pointer-events-none absolute inset-0 opacity-70" />

      <Container className="relative pt-20 pb-14 md:pt-28 md:pb-20">
        <div className="mx-auto max-w-2xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-eyebrow text-brand-accent-dark"
          >
            About us
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-3 text-section-title text-balance text-taupe"
          >
            Made by real people, for every business.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 text-sm leading-relaxed text-grey-olive md:text-base"
          >
            {siteConfig.name} is a women-owned promotional partner with 15+ years
            of experience — built to help every business and person get
            high-quality custom goods at an affordable price.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Button href="/contact" variant="primary" size="lg">
              Request a quote
              <ArrowRight size={16} />
            </Button>
            <Button href="/services" variant="outline" size="lg">
              Explore services
            </Button>
          </motion.div>
        </div>
      </Container>

      <div
        className="group relative w-full pb-16 pt-7 md:pb-20 md:pt-10"
        aria-label="Photos from our shop and team"
      >
        <div className="overflow-hidden">
          <div className="animate-marquee-photos flex w-max items-end gap-3 px-2 motion-reduce:animate-none md:gap-4">
            {marqueePhotos.map((photo, i) => (
              <div
                key={`${photo.src}-${i}`}
                className={cn(
                  "relative shrink-0 overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm",
                  photo.className,
                )}
                aria-hidden={i >= aboutMarqueePhotos.length}
              >
                <Image
                  src={photo.src}
                  alt={i >= aboutMarqueePhotos.length ? "" : photo.alt}
                  fill
                  quality={90}
                  sizes="(max-width: 768px) 360px, 480px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
