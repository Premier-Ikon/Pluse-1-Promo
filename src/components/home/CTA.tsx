import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function CTA() {
  return (
    <section className="py-20 md:py-28">
      <Container>
        <div className="relative overflow-hidden rounded-2xl border border-border bg-taupe px-6 py-14 text-center md:px-16 md:py-16">
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.07]" />

          <div className="relative">
            <p className="text-eyebrow text-brand-gold">
              Work With {siteConfig.name}
            </p>
            <h2 className="text-section-title mx-auto mt-3 max-w-xl text-white">
              Ready to elevate your brand?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-silver md:text-base">
              Tell us about your project and we&apos;ll put together a custom
              quote. Branded merchandise, print, direct mail — whatever your
              business needs.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/contact" variant="secondary" size="lg">
                Get a Free Quote
                <ArrowRight size={16} />
              </Button>
              <Button
                href={`mailto:${siteConfig.email}`}
                variant="outline"
                size="lg"
                className="border-white/20 bg-transparent text-white hover:border-white/40 hover:bg-white/10"
              >
                {siteConfig.email}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
