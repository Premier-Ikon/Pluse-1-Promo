"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import {
  fetchApparelMegaMenu,
  megaMenuItemHref,
  type ApparelMegaMenu,
  type MegaMenuColumn,
} from "@/lib/catalog";
import { cn } from "@/lib/utils";

/** Shared panel chrome — keep Services + Apparel dropdowns looking like one system. */
export const navDropdownPanelClass =
  "overflow-hidden rounded-xl border border-border bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)]";

export const navDropdownHeaderClass =
  "border-b border-border bg-surface/70 px-4 py-3";

export const navDropdownItemClass = (active: boolean) =>
  cn(
    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
    active
      ? "bg-brand-accent-light/50 text-taupe"
      : "text-taupe hover:bg-surface",
  );

export const navDropdownFooterLinkClass =
  "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-taupe transition-colors hover:bg-surface";

function linkIsActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function ColumnBlock({
  column,
  pathname,
  onNavigate,
}: {
  column: MegaMenuColumn;
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="min-w-0">
      <p className="px-3 text-eyebrow text-brand-accent-dark">{column.title}</p>
      <ul className="mt-2 space-y-0.5">
        {column.items.map((item) => {
          const href = megaMenuItemHref(item);
          const active = linkIsActive(href, pathname);
          return (
            <li key={item.id}>
              <Link
                href={href}
                role="menuitem"
                className={navDropdownItemClass(active)}
                onClick={onNavigate}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {column.viewAllHref && (
        <Link
          href={column.viewAllHref}
          className="mt-1 flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold text-grey-olive transition-colors hover:bg-surface hover:text-taupe"
          onClick={onNavigate}
        >
          {column.viewAllLabel || "View all"}
          <span className="text-brand-accent-dark" aria-hidden>
            →
          </span>
        </Link>
      )}
    </div>
  );
}

export function ApparelDesktopNav({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<ApparelMegaMenu | null>(null);
  const active =
    linkIsActive("/apparel", pathname) ||
    linkIsActive("/collections", pathname) ||
    linkIsActive("/shop", pathname);

  useEffect(() => {
    let cancelled = false;
    void fetchApparelMegaMenu().then((data) => {
      if (!cancelled) setMenu(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const columns = menu?.columns || [];
  const footerColumn =
    columns.find((c) => c.helpText || (c.ctaLabel && c.ctaHref)) || columns[0];

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
        href="/apparel"
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
        Apparel
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
          "absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2 transition-all duration-200 xl:left-0 xl:translate-x-0",
          open
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-1 opacity-0 pointer-events-none",
        )}
      >
        <div
          role="menu"
          aria-label="Apparel"
          className={cn(
            navDropdownPanelClass,
            "w-[min(92vw,40rem)] lg:w-[min(92vw,44rem)]",
          )}
        >
          <div className={navDropdownHeaderClass}>
            <p className="text-eyebrow text-brand-accent-dark">Apparel</p>
            <p className="mt-1 text-xs leading-relaxed text-grey-olive">
              Browse categories, brands, and curated collections.
            </p>
          </div>

          <div
            className={cn(
              "grid gap-1 p-1.5 sm:gap-0",
              columns.length >= 3
                ? "sm:grid-cols-3"
                : columns.length === 2
                  ? "sm:grid-cols-2"
                  : "grid-cols-1",
            )}
          >
            {columns.map((column, index) => (
              <div
                key={column.id}
                className={cn(
                  "min-w-0 py-1.5 sm:px-1",
                  index > 0 && "sm:border-l sm:border-border",
                )}
              >
                <ColumnBlock
                  column={column}
                  pathname={pathname}
                  onNavigate={() => setOpen(false)}
                />
              </div>
            ))}
          </div>

          <div className="border-t border-border p-2">
            <Link
              href="/apparel"
              role="menuitem"
              className={navDropdownFooterLinkClass}
              onClick={() => setOpen(false)}
            >
              View all apparel
              <span className="text-brand-accent-dark" aria-hidden>
                →
              </span>
            </Link>

            {footerColumn?.helpText ||
            (footerColumn?.ctaLabel && footerColumn?.ctaHref) ? (
              <div className="mt-1 rounded-lg px-3 py-2">
                {footerColumn.helpText && (
                  <p className="text-xs leading-relaxed text-grey-olive">
                    {footerColumn.helpText}
                  </p>
                )}
                {footerColumn.ctaLabel && footerColumn.ctaHref && (
                  <Link
                    href={footerColumn.ctaHref}
                    className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-accent-dark hover:underline"
                    onClick={() => setOpen(false)}
                  >
                    <Search size={13} aria-hidden />
                    {footerColumn.ctaLabel}
                  </Link>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ApparelMobileNav({
  pathname,
  open,
  onToggle,
  onNavigate,
}: {
  pathname: string;
  open: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  const [menu, setMenu] = useState<ApparelMegaMenu | null>(null);
  const active =
    linkIsActive("/apparel", pathname) ||
    linkIsActive("/collections", pathname);

  useEffect(() => {
    let cancelled = false;
    void fetchApparelMegaMenu().then((data) => {
      if (!cancelled) setMenu(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <Link
          href="/apparel"
          aria-current={active ? "page" : undefined}
          className={cn(
            "flex-1 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200",
            active
              ? "bg-surface text-taupe shadow-sm"
              : "text-grey-olive hover:bg-surface hover:text-taupe",
          )}
          onClick={onNavigate}
        >
          Apparel
        </Link>
        <button
          type="button"
          className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-taupe hover:bg-surface"
          aria-label="Toggle apparel submenu"
          aria-expanded={open}
          onClick={onToggle}
        >
          <ChevronDown
            size={18}
            className={cn(
              "transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>
      </div>

      {open && (
        <div className="mb-1 ml-2 space-y-3 border-l border-border pl-2">
          {(menu?.columns || []).map((column) => (
            <div key={column.id}>
              <p className="px-3 text-eyebrow text-brand-accent-dark">
                {column.title}
              </p>
              <ul className="mt-1 space-y-0.5">
                {column.items.map((item) => {
                  const href = megaMenuItemHref(item);
                  const itemActive =
                    pathname === href || pathname.startsWith(`${href}/`);
                  return (
                    <li key={item.id}>
                      <Link
                        href={href}
                        className={navDropdownItemClass(itemActive)}
                        onClick={onNavigate}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <Link
            href="/apparel"
            className={navDropdownFooterLinkClass}
            onClick={onNavigate}
          >
            View all apparel
            <span className="text-brand-accent-dark" aria-hidden>
              →
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}
