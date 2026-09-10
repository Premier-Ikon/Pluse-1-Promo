"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative min-h-[68vh] w-full sm:min-h-[62vh] lg:min-h-[560px] xl:min-h-[600px]">
        <Image
          src="/images/home/hero-team.jpg?v=5"
          alt="The Plus One Promo team reviewing custom apparel and gifts together"
          fill
          priority
          unoptimized
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
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-eyebrow text-brand-gold"
            >
              About us
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="text-section-title mt-3 text-white drop-shadow-sm md:text-[clamp(2rem,4vw,3.25rem)]"
            >
              Quality goods. Fair access. Made to last.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 max-w-lg text-sm leading-relaxed text-white/85 md:text-base"
            >
              {siteConfig.name} is a women-owned promotional partner with 15+
              years of experience — built to help every business and person get
              high-quality custom goods at an affordable price.
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
                Explore services
              </Button>
            </motion.div>
          </div>
        </Container>
      </div>
    </section>
  );
}
