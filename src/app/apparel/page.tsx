import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CTA } from "@/components/home/CTA";
import { ProductCard } from "@/components/shop/ProductCard";
import { fetchCatalogProducts } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Apparel",
  description:
    "Browse custom apparel from Plus One Promo — tees, hoodies, hats, and more. Request an order; we confirm pricing before production.",
};

type Props = {
  searchParams: Promise<{ brand?: string }>;
};

export default async function ApparelPage({ searchParams }: Props) {
  const { brand } = await searchParams;
  const all = await fetchCatalogProducts();
  const brandFilter = brand?.trim() || "";
  const products = brandFilter
    ? all.filter(
        (p) =>
          (p.brand || "").toLowerCase() === brandFilter.toLowerCase() ||
          (p.brand || "")
            .toLowerCase()
            .includes(brandFilter.toLowerCase()),
      )
    : all;

  const brands = Array.from(
    new Set(all.map((p) => p.brand).filter(Boolean) as string[]),
  ).sort((a, b) => a.localeCompare(b));

  return (
    <>
      <section className="relative overflow-hidden bg-surface">
        <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="bg-hero-glow pointer-events-none absolute inset-0 opacity-70" />

        <Container className="relative pt-10 pb-16 md:pt-14 md:pb-24">
          <div className="max-w-2xl">
            <p className="text-eyebrow text-brand-accent-dark">Apparel</p>
            <h1 className="mt-3 text-section-title text-taupe">
              {brandFilter
                ? `${brandFilter} apparel`
                : "Custom apparel for every team."}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-grey-olive md:text-base">
              {brandFilter
                ? `Styles from ${brandFilter} in our catalog. Configure colors, sizes, and decoration, then send an order request.`
                : "Browse tees, hoodies, hats, and more. Pick your colors and sizes, then request a quote — no online payment."}
            </p>
          </div>

          {brands.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <Link
                href="/apparel"
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-medium transition",
                  !brandFilter
                    ? "border-brand-accent bg-brand-accent-light/80 text-taupe"
                    : "border-border bg-white text-grey-olive hover:border-brand-accent/40 hover:text-taupe",
                )}
              >
                All
              </Link>
              {brands.map((b) => {
                const active = Boolean(
                  brandFilter &&
                    (brandFilter.toLowerCase() === b.toLowerCase() ||
                      b.toLowerCase().includes(brandFilter.toLowerCase())),
                );
                return (
                  <Link
                    key={b}
                    href={`/apparel?brand=${encodeURIComponent(b)}`}
                    className={cn(
                      "rounded-lg border px-3 py-1.5 text-xs font-medium transition",
                      active
                        ? "border-brand-accent bg-brand-accent-light/80 text-taupe"
                        : "border-border bg-white text-grey-olive hover:border-brand-accent/40 hover:text-taupe",
                    )}
                  >
                    {b}
                  </Link>
                );
              })}
            </div>
          )}

          <p className="mt-8 text-sm text-grey-olive">
            {products.length} style{products.length === 1 ? "" : "s"}
            {brandFilter ? ` · ${brandFilter}` : ""}
            <span className="mx-2 text-border">·</span>
            Estimates for planning — we confirm pricing before production.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {products.length === 0 && (
            <p className="mt-6 rounded-2xl border border-dashed border-border bg-white px-4 py-12 text-center text-sm text-grey-olive">
              {brandFilter
                ? `No published products for ${brandFilter} yet. Try another brand or browse all apparel.`
                : "No products published yet. Check back soon."}
            </p>
          )}

          <div className="mt-12 flex flex-col gap-4 rounded-2xl border border-brand-accent/30 bg-brand-accent-light/50 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 md:mt-14">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-taupe">
                Looking for something else?
              </p>
              <p className="mt-0.5 text-sm leading-relaxed text-grey-olive">
                We source thousands of styles beyond this catalog. Tell us what
                you need and we&apos;ll build a custom quote.
              </p>
            </div>
            <Button
              href="/contact"
              variant="primary"
              size="sm"
              className="w-full shrink-0 sm:w-auto"
            >
              Custom quote
              <ArrowUpRight size={16} />
            </Button>
          </div>
        </Container>
      </section>

      <CTA />
    </>
  );
}
