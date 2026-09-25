export type FeaturedProduct = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  priceFrom: number;
  image: string;
  alt: string;
};

/** Local image fallbacks when catalog products lack imageUrl */
export const featuredProducts: FeaturedProduct[] = [
  {
    id: "p1",
    slug: "heavy-cotton-tee",
    name: "Heavy Cotton T-Shirt",
    brand: "Gildan",
    category: "Apparel",
    priceFrom: 8.5,
    image: "/images/home/work-embroidered-polo.jpg",
    alt: "Heavy cotton t-shirt",
  },
  {
    id: "p2",
    slug: "fleece-hoodie",
    name: "Fleece Pullover Hoodie",
    brand: "Independent Trading",
    category: "Apparel",
    priceFrom: 28,
    image: "/images/home/work-embroidered-hoodie.jpg",
    alt: "Fleece pullover hoodie",
  },
  {
    id: "p3",
    slug: "structured-cap",
    name: "Structured Cap",
    brand: "Richardson",
    category: "Headwear",
    priceFrom: 12,
    image: "/images/home/work-embroidered-caps.jpg",
    alt: "Structured baseball cap",
  },
  {
    id: "p4",
    slug: "insulated-bottle",
    name: "Insulated Bottle",
    brand: "Promo Essentials",
    category: "Drinkware",
    priceFrom: 14,
    image: "/images/home/merchandise-drinkware-set.jpg",
    alt: "Insulated water bottle",
  },
  {
    id: "p5",
    slug: "canvas-tote",
    name: "Canvas Tote",
    brand: "Promo Essentials",
    category: "Bags",
    priceFrom: 9,
    image: "/images/home/merchandise-totes.jpg",
    alt: "Canvas tote bag",
  },
  {
    id: "p6",
    slug: "welcome-kit",
    name: "Welcome Gift Kit",
    brand: "Plus One",
    category: "Gifting",
    priceFrom: 45,
    image: "/images/home/work-welcome-kit.jpg",
    alt: "Custom welcome gift kit",
  },
  {
    id: "p7",
    slug: "business-cards",
    name: "Premium Business Cards",
    brand: "Plus One Print",
    category: "Print",
    priceFrom: 0.35,
    image: "/images/home/print-mailers.jpg",
    alt: "Premium business cards",
  },
  {
    id: "p8",
    slug: "team-polo",
    name: "Performance Polo",
    brand: "Port Authority",
    category: "Embroidery",
    priceFrom: 22,
    image: "/images/home/work-embroidered-polo.jpg",
    alt: "Embroidered performance polo",
  },
];
