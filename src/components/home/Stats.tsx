"use client";

import { motion } from "framer-motion";
import { stats } from "@/data/site";
import { Container } from "@/components/ui/Container";

export function Stats() {
  return (
    <section className="bg-surface py-12 md:py-16">
      <Container>
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl bg-taupe px-6 py-10 sm:px-8 md:px-10 md:py-12"
        >
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: 0.05 + index * 0.05 }}
                className="text-center md:border-l md:border-white/10 md:first:border-l-0"
              >
                <p className="text-stat text-brand-gold">{stat.value}</p>
                <p className="mt-2 text-sm text-white/65">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
