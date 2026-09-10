import { ArrowRight } from "lucide-react";
import type { CatalogProduct } from "@/lib/catalog";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/shop/ProductCard";

const COL_CLASS: Record<number, string> = {
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
};

export function ProductGlimpse({
  products,
  productsPerRow = 4,
  rows = 2,
}: {
  products: CatalogProduct[];
  productsPerRow?: number;
  rows?: number;
}) {
  const cols = Math.min(4, Math.max(2, productsPerRow));
  const rowCount = Math.min(4, Math.max(1, rows));
  const list = products.slice(0, cols * rowCount);

  return (
    <section className="border-t border-border bg-surface py-16 md:py-24">
      <Container>
        <div className="mb-10 max-w-xl md:mb-12">
          <p className="text-eyebrow text-brand-accent-dark">Products</p>
          <h2 className="mt-3 text-section-title text-taupe">
            A look at what we offer
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-grey-olive md:text-base">
            Showcase pricing only — request an order and we&apos;ll confirm the
            details before production.
          </p>
        </div>

        <div
          className={`grid grid-cols-2 gap-3 sm:gap-4 ${COL_CLASS[cols] || "lg:grid-cols-4"}`}
        >
          {list.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 flex justify-center md:mt-12">
          <Button href="/apparel" variant="primary" size="lg">
            View all products we offer
            <ArrowRight size={16} />
          </Button>
        </div>
      </Container>
    </section>
  );
}
