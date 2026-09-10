import type { Metadata } from "next";
import { QuoteWizard } from "@/components/quote/QuoteWizard";
import {
  fetchCatalogProducts,
  fetchDecorationMethods,
} from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Build a Quote",
  description:
    "Build a custom apparel quote with Plus One Promo — pick products, share your design and timeline, and request pricing.",
};

export default async function QuotePage() {
  const [products, methods] = await Promise.all([
    fetchCatalogProducts(),
    fetchDecorationMethods(),
  ]);

  return <QuoteWizard products={products} methods={methods} />;
}
