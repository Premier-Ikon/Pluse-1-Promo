"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { services } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { IconBox } from "@/lib/icons";

export function Services() {
  return (
    <section className="py-20 md:py-28" id="services">
      <Container>
        <div className="mb-12 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Our Services"
            title="One partner for your entire brand program"
            description="Branded merchandise, print, direct mail, corporate gifting, events, and company store programs — managed under one roof."
            className="mb-0 max-w-2xl"
          />
          <Button href="/services" variant="outline" size="md" className="w-full shrink-0 self-start sm:w-auto md:self-auto">
            View All Services
            <ArrowRight size={16} />
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
            >
              <Link
                href={service.href}
                className="group flex h-full flex-col rounded-2xl border border-border bg-white p-6 transition-all hover:border-taupe/15 hover:shadow-md md:p-7"
              >
                <IconBox name={service.icon} size="lg" variant="accent" />
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-taupe">
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
