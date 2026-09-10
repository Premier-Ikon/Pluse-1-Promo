"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, ClipboardList, Menu, UserRound, X } from "lucide-react";
import { navLinks } from "@/data/site";
import { services } from "@/data/services";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import {
  ApparelDesktopNav,
  ApparelMobileNav,
  navDropdownFooterLinkClass,
  navDropdownHeaderClass,
  navDropdownItemClass,
  navDropdownPanelClass,
} from "@/components/layout/ApparelMegaMenu";
import { useOrderRequestCart } from "@/components/order/OrderRequestCartProvider";
import { AppIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

function linkIsActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function ServicesDesktopNav({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const active = linkIsActive("/services", pathname);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
    >
      <Link
        href="/services"
        aria-current={active ? "page" : undefined}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
          active || open
            ? "bg-surface text-taupe shadow-sm"
            : "text-grey-olive hover:bg-surface hover:text-taupe hover:shadow-sm",
        )}
      >
        Services
        <ChevronDown
          size={14}
          className={cn(
            "transition-transform duration-200",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </Link>

      <div
        className={cn(
          "absolute left-0 top-full z-50 pt-2 transition-all duration-200",
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0 pointer-events-none",
        )}
      >
        <div
          role="menu"
          aria-label="Services"
          className={cn(navDropdownPanelClass, "w-64")}
        >
          <div className={navDropdownHeaderClass}>
            <p className="text-eyebrow text-brand-accent-dark">Services</p>
            <p className="mt-1 text-xs leading-relaxed text-grey-olive">
              Explore what we can help you get done.
            </p>
          </div>

          <ul className="p-1.5">
            {services.map((service) => {
              const itemActive = pathname === service.href;
              return (
                <li key={service.id}>
                  <Link
                    href={service.href}
                    role="menuitem"
                    className={navDropdownItemClass(itemActive)}
                    onClick={() => setOpen(false)}
                  >
                    <AppIcon
                      name={service.icon}
                      size={16}
                      className="shrink-0 text-brand-accent-dark"
                    />
                    <span>{service.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-border p-2">
            <Link
              href="/services"
              role="menuitem"
              className={navDropdownFooterLinkClass}
              onClick={() => setOpen(false)}
            >
              View all services
              <span className="text-brand-accent-dark" aria-hidden>
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const { itemCount, totalQty } = useOrderRequestCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileApparelOpen, setMobileApparelOpen] = useState(false);
  const badge = itemCount > 0 ? itemCount : 0;

  useEffect(() => {
    if (!mobileOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setMobileServicesOpen(false);
    setMobileApparelOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/90 backdrop-blur-xl">
      <Container>
        <div className="flex h-16 items-center justify-between gap-3">
          <Logo variant="header" />

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              if (link.href === "/services") {
                return (
                  <ServicesDesktopNav key={link.href} pathname={pathname} />
                );
              }
              if (link.href === "/apparel") {
                return (
                  <ApparelDesktopNav key={link.href} pathname={pathname} />
                );
              }

              const active = linkIsActive(link.href, pathname);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-surface text-taupe shadow-sm"
                      : "text-grey-olive hover:bg-surface hover:text-taupe hover:shadow-sm",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/order-request"
              className={cn(
                "relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-taupe transition-colors hover:bg-surface",
                linkIsActive("/order-request", pathname) && "bg-surface",
              )}
              aria-label={
                badge
                  ? `Order request, ${badge} product${badge === 1 ? "" : "s"}, ${totalQty} pieces`
                  : "Order request"
              }
            >
              <ClipboardList size={20} strokeWidth={1.75} />
              {badge > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-accent px-1 text-[10px] font-semibold text-taupe">
                  {badge > 9 ? "9+" : badge}
                </span>
              )}
            </Link>
            <Link
              href="/account"
              className={cn(
                "inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-taupe transition-colors hover:bg-surface",
                linkIsActive("/account", pathname) && "bg-surface",
              )}
              aria-label="Account"
            >
              <UserRound size={20} strokeWidth={1.75} />
            </Link>
            <Button href="/quote" variant="primary" size="sm">
              Build a Quote
            </Button>
          </div>

          <div className="flex items-center gap-1 lg:hidden">
            <Link
              href="/order-request"
              className="relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-taupe hover:bg-surface"
              aria-label={
                badge
                  ? `Order request, ${badge} product${badge === 1 ? "" : "s"}`
                  : "Order request"
              }
            >
              <ClipboardList size={20} strokeWidth={1.75} />
              {badge > 0 && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-accent px-1 text-[10px] font-semibold text-taupe">
                  {badge > 9 ? "9+" : badge}
                </span>
              )}
            </Link>
            <Link
              href="/account"
              className={cn(
                "inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-taupe hover:bg-surface",
                linkIsActive("/account", pathname) && "bg-surface",
              )}
              aria-label="Account"
            >
              <UserRound size={20} strokeWidth={1.75} />
            </Link>
            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-taupe hover:bg-surface"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </Container>

      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 top-16 z-40 bg-black/20 lg:hidden"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed inset-x-0 top-16 z-50 border-b border-border bg-white shadow-lg transition-all duration-300 lg:hidden",
          mobileOpen
            ? "visible translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-y-2 opacity-0",
        )}
      >
        <Container className="flex max-h-[calc(100dvh-4rem)] flex-col gap-1 overflow-y-auto py-3">
          {navLinks.map((link) => {
            if (link.href === "/services") {
              const active = linkIsActive(link.href, pathname);
              return (
                <div key={link.href} className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <Link
                      href="/services"
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex-1 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200",
                        active
                          ? "bg-surface text-taupe shadow-sm"
                          : "text-grey-olive hover:bg-surface hover:text-taupe",
                      )}
                      onClick={() => setMobileOpen(false)}
                    >
                      Services
                    </Link>
                    <button
                      type="button"
                      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-taupe hover:bg-surface"
                      aria-label="Toggle services submenu"
                      aria-expanded={mobileServicesOpen}
                      onClick={() => setMobileServicesOpen((prev) => !prev)}
                    >
                      <ChevronDown
                        size={18}
                        className={cn(
                          "transition-transform duration-200",
                          mobileServicesOpen && "rotate-180",
                        )}
                      />
                    </button>
                  </div>

                  {mobileServicesOpen && (
                    <div className="mb-1 ml-2 space-y-0.5 border-l border-border pl-2">
                      {services.map((service) => (
                        <Link
                          key={service.id}
                          href={service.href}
                          className={cn(
                            "block rounded-lg px-3 py-2.5 text-sm transition-colors",
                            pathname === service.href
                              ? "bg-brand-accent-light/40 font-medium text-taupe"
                              : "text-grey-olive hover:bg-surface hover:text-taupe",
                          )}
                          onClick={() => setMobileOpen(false)}
                        >
                          {service.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            if (link.href === "/apparel") {
              return (
                <ApparelMobileNav
                  key={link.href}
                  pathname={pathname}
                  open={mobileApparelOpen}
                  onToggle={() => setMobileApparelOpen((prev) => !prev)}
                  onNavigate={() => setMobileOpen(false)}
                />
              );
            }

            const active = linkIsActive(link.href, pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-surface text-taupe shadow-sm"
                    : "text-grey-olive hover:bg-surface hover:text-taupe hover:shadow-sm",
                )}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
          <Button
            href="/quote"
            variant="primary"
            size="sm"
            className="mt-2 w-full"
            onClick={() => setMobileOpen(false)}
          >
            Build a Quote
          </Button>
        </Container>
      </div>
    </header>
  );
}
