import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig, navLinks } from "@/data/site";
import { services } from "@/data/services";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-taupe">
      <Container className="py-14 md:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <Logo variant="footer" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
              {siteConfig.tagline} Merchandise, embroidery, print, and gifts —
              with a clear quote before anything goes into production.
            </p>
            <Button
              href="/contact"
              variant="secondary"
              size="sm"
              className="mt-6"
            >
              Request a quote
              <ArrowRight size={14} />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-8 lg:gap-8">
            <div>
              <p className="text-eyebrow text-brand-gold">Explore</p>
              <ul className="mt-4 space-y-1">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block py-1.5 text-sm text-white/65 transition-colors hover:text-brand-gold"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-eyebrow text-brand-gold">Services</p>
              <ul className="mt-4 space-y-1">
                {services.map((service) => (
                  <li key={service.id}>
                    <Link
                      href={service.href}
                      className="block py-1.5 text-sm text-white/65 transition-colors hover:text-brand-gold"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <p className="text-eyebrow text-brand-gold">Contact</p>
              <ul className="mt-4 space-y-1 text-sm">
                <li>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="block break-all py-1.5 text-white/65 transition-colors hover:text-brand-gold"
                  >
                    {siteConfig.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
                    className="block py-1.5 text-white/65 transition-colors hover:text-brand-gold"
                  >
                    {siteConfig.phone}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-center text-xs text-white/40 md:text-left">
            &copy; {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-white/40">
            <Link
              href="/privacy"
              className="transition-colors hover:text-brand-gold"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-brand-gold"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
