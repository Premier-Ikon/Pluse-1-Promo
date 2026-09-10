import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CTA } from "@/components/home/CTA";
import { ProductCard } from "@/components/shop/ProductCard";
import { fetchCollectionBySlug } from "@/lib/catalog";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchCollectionBySlug(slug);
  if (!data) return { title: "Collection" };
  return {
    title: data.collection.name,
    description:
      data.collection.pageDescription ||
      data.collection.description ||
      `Browse ${data.collection.name} from Plus One Promo.`,
  };
}

export default async function CollectionPage({ params }: Props) {
  const { slug } = await params;
  const data = await fetchCollectionBySlug(slug);
  if (!data) notFound();

  const { collection, products } = data;
  const description =
    collection.pageDescription ||
    collection.description ||
    `Browse ${collection.name} and request an order. Showcase pricing only — we confirm before production.`;

  return (
    <>
      <PageHero
        eyebrow="Apparel"
        title={collection.name}
        description={description}
      />

      <section className="py-16 md:py-20">
        <Container>
          <Link
            href="/apparel"
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-grey-olive hover:text-taupe"
          >
            <ArrowLeft size={16} />
            All apparel
          </Link>

          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent-dark">
                Collection
              </p>
              <h2 className="mt-1 text-section-title text-taupe">
                {collection.name}
              </h2>
            </div>
            <p className="max-w-sm text-sm text-grey-olive">
              {products.length} style{products.length === 1 ? "" : "s"} — configure
              colors, sizes, and decoration on each product.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {products.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border px-4 py-12 text-center">
              <p className="text-sm text-grey-olive">
                Products for this collection are coming soon.
              </p>
              <Button href="/apparel" variant="secondary" className="mt-5">
                Browse all apparel
              </Button>
            </div>
          )}

          <div className="mt-12 rounded-2xl border border-border bg-surface p-6 text-center md:p-8">
            <h3 className="text-lg font-semibold text-taupe">
              Need a different style?
            </h3>
            <p className="mx-auto mt-2 max-w-lg text-sm text-grey-olive">
              We can source beyond this list. Share what you need and we&apos;ll
              put a quote together.
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
