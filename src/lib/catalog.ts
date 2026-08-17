export type ProductColor = {
  name: string;
  hex?: string;
  imageUrl?: string;
};

export type ProductPricing = {
  displayMode: "from" | "range" | "fixed" | "hidden";
  currency: string;
  basePrice?: number;
  priceNote?: string;
  decoration?: {
    screenprintFrom?: number;
    embroideryFrom?: number;
  };
};

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  brand?: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  gallery?: string[];
  colors: ProductColor[];
  sizes: string[];
  decorationOptions: Array<"screenprint" | "embroidery" | "dtf" | "other">;
  pricing: ProductPricing;
  source: "manual" | "ss";
  published?: boolean;
  featured?: boolean;
};

export type OrderRequestPayload = {
  productId: string;
  productName?: string;
  productSlug?: string;
  delivery: {
    speed: string;
    needByDate?: string;
    notes?: string;
  };
  color: {
    name: string;
    hex?: string;
  };
  decoration: {
    method: string;
    locations?: string[];
    colors?: number;
  };
  design: {
    hasArtwork: boolean;
    notes?: string;
    artworkUrl?: string;
  };
  sizes: Array<{ size: string; qty: number }>;
  contact: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
  };
  estimatedTotal?: number;
  specialInstructions?: string;
};

const FALLBACK_PRODUCTS: CatalogProduct[] = [
  {
    id: "seed-tee-001",
    slug: "heavy-cotton-tee",
    name: "Heavy Cotton T-Shirt",
    brand: "Gildan",
    description:
      "Classic heavyweight cotton tee — ideal for screen print or embroidery. Showcase pricing only; final quote after we review your request.",
    category: "Apparel",
    colors: [
      { name: "White", hex: "#ffffff" },
      { name: "Black", hex: "#111111" },
      { name: "Navy", hex: "#1e3a5f" },
      { name: "Carolina Blue", hex: "#7BAFD4" },
      { name: "Sport Grey", hex: "#9ca3af" },
    ],
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    decorationOptions: ["screenprint", "embroidery", "dtf"],
    pricing: {
      displayMode: "from",
      currency: "USD",
      basePrice: 8.5,
      priceNote: "Starting blank estimate — decoration quoted after review",
      decoration: { screenprintFrom: 4, embroideryFrom: 6 },
    },
    source: "manual",
    published: true,
    featured: true,
  },
  {
    id: "seed-hoodie-001",
    slug: "fleece-hoodie",
    name: "Fleece Pullover Hoodie",
    brand: "Independent Trading",
    description:
      "Soft midweight fleece hoodie for teams, events, and merch drops.",
    category: "Apparel",
    colors: [
      { name: "Black", hex: "#111111" },
      { name: "Heather Grey", hex: "#c4c4c4" },
      { name: "Forest", hex: "#2d4a3e" },
    ],
    sizes: ["S", "M", "L", "XL", "2XL"],
    decorationOptions: ["screenprint", "embroidery"],
    pricing: {
      displayMode: "from",
      currency: "USD",
      basePrice: 28,
      priceNote: "Starting blank estimate — decoration quoted after review",
      decoration: { screenprintFrom: 5, embroideryFrom: 8 },
    },
    source: "manual",
    published: true,
    featured: true,
  },
  {
    id: "seed-hat-001",
    slug: "structured-cap",
    name: "Structured Cap",
    brand: "Richardson",
    description: "Structured mid-profile cap — embroidery ready.",
    category: "Headwear",
    colors: [
      { name: "Black", hex: "#111111" },
      { name: "White", hex: "#ffffff" },
      { name: "Khaki", hex: "#c3b091" },
    ],
    sizes: ["OSFA"],
    decorationOptions: ["embroidery"],
    pricing: {
      displayMode: "from",
      currency: "USD",
      basePrice: 12,
      priceNote: "Starting blank estimate — embroidery quoted after review",
      decoration: { embroideryFrom: 7 },
    },
    source: "manual",
    published: true,
    featured: false,
  },
];

function catalogBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_CATALOG_API_URL || "http://localhost:4001"
  ).replace(/\/$/, "");
}

export function formatDisplayPrice(product: CatalogProduct): string {
  const { pricing } = product;
  if (!pricing || pricing.displayMode === "hidden" || pricing.basePrice == null) {
    return "Request quote";
  }
  const amount = pricing.basePrice.toLocaleString("en-US", {
    style: "currency",
    currency: pricing.currency || "USD",
  });
  if (pricing.displayMode === "fixed") return amount;
  return `From ${amount}`;
}

export async function fetchCatalogProducts(): Promise<CatalogProduct[]> {
  try {
    const res = await fetch(
      `${catalogBaseUrl()}/api/products?published=true`,
      { next: { revalidate: 30 } },
    );
    if (!res.ok) throw new Error(`Catalog API ${res.status}`);
    const data = (await res.json()) as { products: CatalogProduct[] };
    if (!data.products?.length) return FALLBACK_PRODUCTS;
    return data.products;
  } catch {
    return FALLBACK_PRODUCTS;
  }
}

export async function fetchCatalogProduct(
  slug: string,
): Promise<CatalogProduct | null> {
  try {
    const res = await fetch(
      `${catalogBaseUrl()}/api/products/${encodeURIComponent(slug)}?published=true`,
      { next: { revalidate: 30 } },
    );
    if (res.ok) {
      const data = (await res.json()) as { product: CatalogProduct };
      return data.product;
    }
  } catch {
    // fall through to local seed
  }
  return FALLBACK_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export async function submitOrderRequest(
  payload: OrderRequestPayload,
): Promise<{ success: boolean; message?: string; error?: string }> {
  const res = await fetch(`${catalogBaseUrl()}/api/order-requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      success: false,
      error:
        typeof data.error === "string"
          ? data.error
          : "Could not submit request. Please try again or contact us.",
    };
  }
  return {
    success: true,
    message: data.message,
  };
}
