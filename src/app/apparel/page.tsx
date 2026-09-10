import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CTA } from "@/components/home/CTA";
import { ProductCard } from "@/components/shop/ProductCard";
import { fetchCatalogProducts } from "@/lib/catalog";

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
      <PageHero
        eyebrow="Apparel"
        title={
          brandFilter
            ? `${brandFilter} apparel`
            : "Custom apparel for every team."
        }
        description={
          brandFilter
            ? `Styles from ${brandFilter} in our catalog. Configure colors, sizes, and decoration, then send an order request.`
            : "Browse tees, hoodies, hats, and more. Pick your colors and sizes, then request a quote — no online payment."
        }
      />

      <section className="py-16 md:py-20">
        <Container>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent-dark">
                Catalog
              </p>
              <h2 className="mt-1 text-section-title text-taupe">
                {brandFilter ? brandFilter : "All apparel"}
              </h2>
              {brandFilter && (
                <Link
                  href="/apparel"
                  className="mt-2 inline-block text-sm font-medium text-brand-accent-dark hover:underline"
                >
                  Clear brand filter
                </Link>
              )}
            </div>
            <p className="max-w-sm text-sm text-grey-olive">
              Prices shown are estimates for planning. Your request is reviewed
              before production.
            </p>
          </div>

          {!brandFilter && brands.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-2">
              {brands.map((b) => (
                <Link
                  key={b}
                  href={`/apparel?brand=${encodeURIComponent(b)}`}
                  className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-medium text-grey-olive transition hover:border-brand-accent/40 hover:text-taupe"
                >
                  {b}
                </Link>
              ))}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {products.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border px-4 py-12 text-center text-sm text-grey-olive">
              {brandFilter
                ? `No published products for ${brandFilter} yet. Try another brand or browse all apparel.`
                : "No products published yet. Check back soon."}
            </p>
          )}

          <div className="mt-12 rounded-2xl border border-border bg-surface p-6 text-center md:p-8">
            <h3 className="text-lg font-semibold text-taupe">
              Looking for something else?
            </h3>
            <p className="mx-auto mt-2 max-w-lg text-sm text-grey-olive">
              We source thousands of styles beyond this catalog. Tell us what you
              need and we&apos;ll build a custom quote.
            </p>
            <Button href="/contact" variant="primary" size="md" className="mt-5">
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
