import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ProductConfigurator } from "@/components/shop/ProductConfigurator";
import {
  fetchCatalogProduct,
  fetchCatalogProducts,
  fetchDecorationMethods,
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
  const plain =
    product.description?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() ||
    product.name;
  return {
    title: product.name,
    description: plain.slice(0, 160),
  };
}

export default async function ShopProductPage({ params }: Props) {
  const { slug } = await params;
  const [product, decorationCatalog] = await Promise.all([
    fetchCatalogProduct(slug),
    fetchDecorationMethods(),
  ]);
  if (!product) notFound();

  return (
    <section className="bg-surface py-10 md:py-14">
      <Container>
        <Link
          href="/apparel"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-grey-olive hover:text-taupe"
        >
          <ArrowLeft size={16} />
          Back to apparel
        </Link>

        <div className="mt-8">
          <ProductConfigurator
            product={product}
            decorationCatalog={decorationCatalog}
          />
        </div>
      </Container>
    </section>
  );
}
