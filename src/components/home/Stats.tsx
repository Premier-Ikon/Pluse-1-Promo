"use client";

import { motion } from "framer-motion";
import { stats } from "@/data/site";
import { Container } from "@/components/ui/Container";

export function Stats() {
  return (
    <section className="border-y border-border bg-white py-12 md:py-14">
      <Container>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.06 }}
              className="text-center"
            >
              <p className="text-stat text-taupe">{stat.value}</p>
              <p className="mt-1.5 text-sm text-grey-olive">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
