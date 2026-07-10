import Link from "next/link";
import { siteConfig, navLinks } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <Container className="py-12 md:py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div className="lg:col-span-2">
            <Logo variant="footer" />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-grey-olive">
              {siteConfig.description}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-taupe">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block py-2 text-sm text-grey-olive transition-colors hover:text-taupe"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-taupe">
              Contact
            </h3>
            <ul className="space-y-2.5 text-sm text-grey-olive">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="block break-all py-2 transition-colors hover:text-taupe"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
                  className="block py-2 transition-colors hover:text-taupe"
                >
                  {siteConfig.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className="text-center text-xs text-grey-olive md:text-left">
            &copy; {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-grey-olive">
            <Link href="/privacy" className="transition-colors hover:text-taupe">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-taupe">
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
