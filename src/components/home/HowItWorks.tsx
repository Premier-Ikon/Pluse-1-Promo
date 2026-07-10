"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { processSteps } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { IconBox } from "@/lib/icons";

export function HowItWorks() {
  return (
    <section className="border-t border-border py-20 md:py-28">
      <Container>
        <div className="mb-12 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Our Process"
            title="From idea to delivery — we handle it all"
            description="Simple, transparent, and built around your business — no matter your company size."
            align="left"
            className="mb-0 max-w-2xl"
          />
          <Button href="/process" variant="outline" size="md" className="w-full shrink-0 self-start sm:w-auto md:self-auto">
            Learn About Our Process
            <ArrowRight size={16} />
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="relative rounded-2xl border border-border bg-white p-6"
            >
              <span className="text-xs font-semibold tabular-nums text-silver">
                {step.step}
              </span>
              <IconBox
                name={step.icon}
                size="md"
                variant="accent"
                className="mt-4"
              />
              <h3 className="mt-4 text-base font-semibold text-taupe">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-grey-olive">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
