import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Shirt } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CTA } from "@/components/home/CTA";
import {
  fetchCatalogProducts,
  formatDisplayPrice,
} from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse Plus One Promo products and submit an order request. Showcase pricing only — we confirm before production.",
};

export default async function ShopPage() {
  const products = await fetchCatalogProducts();

  return (
    <>
      <PageHero
        eyebrow="Shop"
        title="Browse products. Request an order."
        description="Pick a product, walk through a short questionnaire, and send us an order request. No checkout — we confirm pricing with you before anything goes into production."
      />

      <section className="py-16 md:py-20">
        <Container>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent-dark">
                Catalog
              </p>
              <h2 className="mt-1 text-section-title text-taupe">
                Featured offerings
              </h2>
            </div>
            <p className="max-w-sm text-sm text-grey-olive">
              Prices shown are estimates for planning. Your request is reviewed by
              our team before production.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-all hover:shadow-md"
              >
                <div
                  className="flex h-44 items-center justify-center bg-surface"
                  style={
                    product.colors[0]?.hex
                      ? {
                          background: `linear-gradient(160deg, ${product.colors[0].hex}33, #faf9f7)`,
                        }
                      : undefined
                  }
                >
                  {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Shirt className="text-taupe/30" size={56} />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-medium text-grey-olive">
                    {product.brand || product.category}
                  </p>
                  <h3 className="mt-1 text-base font-semibold text-taupe group-hover:text-brand-accent-dark">
                    {product.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 flex-1 text-sm text-grey-olive">
                    {product.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-semibold text-taupe">
                      {formatDisplayPrice(product)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-accent-dark">
                      Request order
                      <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

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
