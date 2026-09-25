export type ProductColor = {
  name: string;
  hex?: string;
  imageUrl?: string;
  swatchUrl?: string;
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
  imageThumbUrl?: string;
  gallery?: string[];
  galleryThumbs?: string[];
  colors: ProductColor[];
  sizes: string[];
  showcaseColor?: string;
  decorationOptions: string[];
  /** methodId → allowed locations for this product */
  decorationLocations?: Record<string, string[]>;
  pricing: ProductPricing;
  source: "manual" | "ss";
  published?: boolean;
  featured?: boolean;
};

export type OrderRequestPayload = {
  /** Multi-product cart format (preferred). */
  items?: Array<{
    productId: string;
    productName?: string;
    productSlug?: string;
    imageUrl?: string;
    variants: Array<{
      color: { name: string; hex?: string };
      sizes: Array<{ size: string; qty: number }>;
    }>;
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
  }>;
  /** Legacy single-product fields (optional when `items` is set). */
  productId?: string;
  productName?: string;
  productSlug?: string;
  delivery: {
    speed: string;
    needByDate?: string;
    notes?: string;
  };
  shipping?: {
    id?: string;
    label?: string;
    line1: string;
    line2?: string | null;
    city: string;
    state: string;
    postalCode: string;
    country?: string;
    formatted?: string | null;
  } | null;
  color?: {
    name: string;
    hex?: string;
  };
  decoration?: {
    method: string;
    locations?: string[];
    colors?: number;
  };
  design?: {
    hasArtwork: boolean;
    notes?: string;
    artworkUrl?: string;
  };
  sizes?: Array<{ size: string; qty: number }>;
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

export type DecorationMethod = {
  id: string;
  label: string;
  askInkColors?: boolean;
  locations: string[];
};

const FALLBACK_DECORATION_METHODS: DecorationMethod[] = [
  {
    id: "screenprint",
    label: "Screen Print",
    askInkColors: true,
    locations: [
      "Front chest",
      "Full front",
      "Back",
      "Left sleeve",
      "Right sleeve",
    ],
  },
  {
    id: "embroidery",
    label: "Embroidery",
    askInkColors: false,
    locations: [
      "Front chest",
      "Left chest",
      "Full front",
      "Back",
      "Left sleeve",
      "Right sleeve",
      "Hat front",
    ],
  },
  {
    id: "dtf",
    label: "DTF",
    askInkColors: false,
    locations: ["Front chest", "Full front", "Back"],
  },
];

export async function fetchDecorationMethods(): Promise<DecorationMethod[]> {
  try {
    const res = await fetch(`${catalogBaseUrl()}/api/settings/decoration`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`Decoration API ${res.status}`);
    const data = (await res.json()) as { decorationMethods?: DecorationMethod[] };
    if (data.decorationMethods?.length) return data.decorationMethods;
  } catch {
    // fall through
  }
  return FALLBACK_DECORATION_METHODS;
}

export type MegaMenuItem = {
  id: string;
  label: string;
  collectionSlug?: string;
  brand?: string;
  href?: string;
};

export type MegaMenuColumn = {
  id: string;
  title: string;
  items: MegaMenuItem[];
  viewAllLabel?: string;
  viewAllHref?: string;
  helpText?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export type ApparelMegaMenu = {
  columns: MegaMenuColumn[];
};

export function megaMenuItemHref(item: MegaMenuItem): string {
  if (item.href) return item.href;
  if (item.collectionSlug) return `/collections/${item.collectionSlug}`;
  if (item.brand) {
    return `/apparel?brand=${encodeURIComponent(item.brand)}`;
  }
  return "/apparel";
}

const FALLBACK_APPAREL_MEGA_MENU: ApparelMegaMenu = {
  columns: [
    {
      id: "categories",
      title: "Categories",
      items: [
        { id: "custom-t-shirts", label: "Custom T-Shirts", collectionSlug: "custom-t-shirts" },
        { id: "custom-hats", label: "Custom Hats", collectionSlug: "custom-hats" },
        { id: "custom-hoodies", label: "Custom Hoodies", collectionSlug: "custom-hoodies" },
        { id: "custom-polos", label: "Custom Polos", collectionSlug: "custom-polos" },
        { id: "custom-sweats", label: "Custom Sweats", collectionSlug: "custom-sweats" },
      ],
      viewAllLabel: "View All",
      viewAllHref: "/apparel",
      helpText: "Need help finding the perfect product?",
      ctaLabel: "Talk to us",
      ctaHref: "/contact",
    },
    {
      id: "brands",
      title: "Brands",
      items: [
        { id: "comfort-colors", label: "Comfort Colors", brand: "Comfort Colors" },
        { id: "gildan", label: "Gildan", brand: "Gildan" },
        { id: "bella-canvas", label: "Bella+Canvas", brand: "Bella+Canvas" },
        { id: "next-level", label: "Next Level Apparel", brand: "Next Level" },
      ],
      viewAllLabel: "View All",
      viewAllHref: "/apparel",
    },
    {
      id: "discover",
      title: "Discover",
      items: [
        { id: "best-sellers", label: "Best Sellers", collectionSlug: "best-sellers" },
        { id: "trending", label: "Trending", collectionSlug: "trending" },
        { id: "business", label: "Business", collectionSlug: "business" },
      ],
      viewAllLabel: "View All",
      viewAllHref: "/apparel",
    },
  ],
};

export async function fetchApparelMegaMenu(): Promise<ApparelMegaMenu> {
  try {
    const res = await fetch(`${catalogBaseUrl()}/api/settings/navigation`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Navigation API ${res.status}`);
    const data = (await res.json()) as { apparelMegaMenu?: ApparelMegaMenu };
    if (data.apparelMegaMenu?.columns?.length) return data.apparelMegaMenu;
  } catch {
    // fall through
  }
  return FALLBACK_APPAREL_MEGA_MENU;
}

export type CatalogCollection = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  pageDescription?: string;
};

export async function fetchCollectionBySlug(
  slug: string,
): Promise<{ collection: CatalogCollection; products: CatalogProduct[] } | null> {
  try {
    const res = await fetch(
      `${catalogBaseUrl()}/api/collections/slug/${encodeURIComponent(slug)}`,
      { next: { revalidate: 30 } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      collection: CatalogCollection;
      products: CatalogProduct[];
    };
    return {
      collection: data.collection,
      products: data.products || [],
    };
  } catch {
    return null;
  }
}

export function formatDisplayPrice(product: CatalogProduct): string {
  const parts = formatPriceParts(product);
  if (parts.kind === "quote") return "Request quote";
  if (parts.kind === "fixed") return parts.amount;
  return `From ${parts.amount}`;
}

export function formatPriceParts(product: CatalogProduct): {
  kind: "quote" | "fixed" | "from";
  amount: string;
  label: string;
} {
  const { pricing } = product;
  if (!pricing || pricing.displayMode === "hidden" || pricing.basePrice == null) {
    return { kind: "quote", amount: "", label: "Request quote" };
  }
  const amount = pricing.basePrice.toLocaleString("en-US", {
    style: "currency",
    currency: pricing.currency || "USD",
    minimumFractionDigits: pricing.basePrice % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  if (pricing.displayMode === "fixed") {
    return { kind: "fixed", amount, label: amount };
  }
  return { kind: "from", amount, label: `From ${amount}` };
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

export type HomepageCollection = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  productsPerRow?: number;
  rows?: number;
} | null;

/** Products for the homepage featured row (admin-selected collection). */
export async function fetchHomepageProducts(): Promise<{
  collection: HomepageCollection;
  products: CatalogProduct[];
  productsPerRow: number;
  rows: number;
}> {
  try {
    const res = await fetch(`${catalogBaseUrl()}/api/collections/homepage`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error(`Homepage API ${res.status}`);
    const data = (await res.json()) as {
      collection: HomepageCollection;
      products: CatalogProduct[];
      productsPerRow?: number;
      rows?: number;
    };
    if (data.products?.length) {
      const productsPerRow =
        data.productsPerRow ||
        data.collection?.productsPerRow ||
        4;
      const rows = data.rows || data.collection?.rows || 2;
      return {
        collection: data.collection || null,
        products: data.products,
        productsPerRow,
        rows,
      };
    }
  } catch {
    // fall through
  }

  const featured = FALLBACK_PRODUCTS.filter((p) => p.featured);
  return {
    collection: null,
    products: featured.length ? featured : FALLBACK_PRODUCTS.slice(0, 8),
    productsPerRow: 4,
    rows: 2,
  };
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

export async function uploadArtworkFile(file: File): Promise<{
  ok: boolean;
  url?: string;
  thumbUrl?: string | null;
  fileName?: string;
  error?: string;
}> {
  try {
    const buffer = await file.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = "";
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    const fileBase64 = btoa(binary);

    const res = await fetch(`${catalogBaseUrl()}/api/uploads/artwork`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileBase64,
        contentType: file.type || "application/octet-stream",
        fileName: file.name,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        ok: false,
        error:
          typeof data.error === "string"
            ? data.error
            : "Could not upload artwork",
      };
    }
    return {
      ok: true,
      url: data.asset?.url,
      thumbUrl: data.asset?.thumbUrl,
      fileName: data.asset?.fileName || file.name,
    };
  } catch {
    return { ok: false, error: "Could not upload artwork" };
  }
}
