import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { OrderRequestBuilder } from "@/components/shop/OrderRequestBuilder";
import {
  fetchCatalogProduct,
  fetchCatalogProducts,
  formatDisplayPrice,
} from "@/lib/catalog";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const products = await fetchCatalogProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchCatalogProduct(slug);
  if (!product) return { title: "Product" };
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ShopProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await fetchCatalogProduct(slug);
  if (!product) notFound();

  return (
    <section className="bg-surface py-10 md:py-14">
      <Container>
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-grey-olive hover:text-taupe"
        >
          <ArrowLeft size={16} />
          Back to shop
        </Link>

        <div className="mt-6 mb-8 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent-dark">
            {product.brand || product.category}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-taupe md:text-3xl">
            {product.name}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-grey-olive md:text-base">
            {product.description}
          </p>
          <p className="mt-3 text-sm font-semibold text-taupe">
            {formatDisplayPrice(product)}
            {product.pricing.priceNote ? (
              <span className="ml-2 font-normal text-grey-olive">
                — {product.pricing.priceNote}
              </span>
            ) : null}
          </p>
        </div>

        <OrderRequestBuilder product={product} />
      </Container>
    </section>
  );
}
