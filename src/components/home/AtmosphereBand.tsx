"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { homeVisuals } from "@/data/visuals";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function AtmosphereBand() {
  return (
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
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-eyebrow text-brand-accent">Ready when you are</p>
          <h2 className="mt-3 text-section-title text-white">
            Tell us what you need. We&apos;ll take it from there.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-silver md:text-base">
            Share your timeline, quantity, and artwork — or just an idea. We
            come back with options and a clear quote before production starts.
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
        </motion.div>
      </Container>
    </section>
  );
}
