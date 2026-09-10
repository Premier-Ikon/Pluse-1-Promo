import { Hero } from "@/components/home/Hero";
import { TrustedBy } from "@/components/home/TrustedBy";
import { ProductBento } from "@/components/home/ProductBento";
import { Services } from "@/components/home/Services";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ProductGlimpse } from "@/components/home/ProductGlimpse";
import { AtmosphereBand } from "@/components/home/AtmosphereBand";
import { Testimonials } from "@/components/home/Testimonials";
import { Stats } from "@/components/home/Stats";
import { CTA } from "@/components/home/CTA";
import { fetchHomepageProducts } from "@/lib/catalog";

export default async function HomePage() {
  const { products, productsPerRow, rows } = await fetchHomepageProducts();

  return (
    <>
      <Hero />
      <TrustedBy />
      <ProductBento />
      <Services />
      <Stats />
      <HowItWorks />
      <ProductGlimpse
        products={products}
        productsPerRow={productsPerRow}
        rows={rows}
      />
      <AtmosphereBand />
      <Testimonials />
      <CTA />
    </>
  );
}
