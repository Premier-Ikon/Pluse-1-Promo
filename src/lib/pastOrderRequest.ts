import {
  createCartItemId,
  type OrderRequestCartItem,
} from "@/lib/orderRequestCart";

export type PastOrderRequestItem = {
  productId?: string;
  productName?: string;
  productSlug?: string;
  brand?: string;
  imageUrl?: string;
  basePrice?: number;
  currency?: string;
  quantity?: number;
  variants?: Array<{
    color?: { name?: string; hex?: string };
    colorName?: string;
    hex?: string;
    imageUrl?: string;
    sizes?: Array<{ size?: string; qty?: number }>;
  }>;
  decoration?: {
    method?: string;
    locations?: string[];
    colors?: number;
  };
  design?: {
    hasArtwork?: boolean;
    notes?: string;
    artworkUrl?: string;
  };
};

export type PastOrderRequest = {
  id: string;
  createdAt?: string;
  status?: string;
  estimatedTotal?: number;
  productId?: string;
  productName?: string;
  productSlug?: string;
  imageUrl?: string;
  contact?: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
  };
  color?: { name?: string; hex?: string };
  decoration?: {
    method?: string;
    locations?: string[];
    colors?: number;
  };
  design?: {
    hasArtwork?: boolean;
    notes?: string;
    artworkUrl?: string;
  };
  sizes?: Array<{ size?: string; qty?: number }>;
  items?: PastOrderRequestItem[];
  delivery?: {
    speed?: string;
    needByDate?: string;
    notes?: string;
  };
  shipping?: {
    id?: string;
    label?: string;
    line1?: string;
    line2?: string | null;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    formatted?: string | null;
  } | null;
  specialInstructions?: string;
};

export function itemPieceCount(
  item: PastOrderRequestItem | NonNullable<PastOrderRequest["items"]>[number],
) {
  if (typeof item.quantity === "number") return item.quantity;
  return (item.variants || []).reduce(
    (sum, variant) =>
      sum +
      (variant.sizes || []).reduce((s, row) => s + (Number(row.qty) || 0), 0),
    0,
  );
}

export function orderPieceCount(order: PastOrderRequest) {
  if (order.items?.length) {
    return order.items.reduce((sum, item) => sum + itemPieceCount(item), 0);
  }
  return (order.sizes || []).reduce((sum, row) => sum + (Number(row.qty) || 0), 0);
}

export function statusLabel(status?: string) {
  const value = (status || "new").toLowerCase();
  if (value === "quoted") return "Quoted";
  if (value === "reviewing") return "Reviewing";
  if (value === "approved") return "Approved";
  if (value === "in_production" || value === "in_progress" || value === "in-progress") {
    return "In production";
  }
  if (value === "completed" || value === "fulfilled") return "Completed";
  if (value === "cancelled" || value === "canceled") return "Cancelled";
  return "Received";
}

export function formatOrderDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function normalizeVariants(
  item: PastOrderRequestItem,
): OrderRequestCartItem["variants"] {
  return (item.variants || [])
    .map((variant) => {
      const colorName =
        variant.color?.name || variant.colorName || "Unspecified";
      const sizes = (variant.sizes || [])
        .map((row) => ({
          size: String(row.size || "").trim(),
          qty: Number(row.qty) || 0,
        }))
        .filter((row) => row.size && row.qty > 0);
      return {
        colorName,
        hex: variant.color?.hex || variant.hex,
        imageUrl: variant.imageUrl,
        sizes,
      };
    })
    .filter((variant) => variant.sizes.length > 0);
}

/** Flatten stored order (multi or legacy single) into cart-ready lines. */
export function pastOrderToCartItems(
  order: PastOrderRequest,
): Omit<OrderRequestCartItem, "id">[] {
  const sourceItems: PastOrderRequestItem[] =
    order.items?.length
      ? order.items
      : order.productId
        ? [
            {
              productId: order.productId,
              productName: order.productName,
              productSlug: order.productSlug,
              imageUrl: order.imageUrl,
              variants: [
                {
                  color: order.color || { name: "Unspecified" },
                  sizes: order.sizes || [],
                },
              ],
              decoration: order.decoration,
              design: order.design,
            },
          ]
        : [];

  const cartItems: Omit<OrderRequestCartItem, "id">[] = [];

  for (const item of sourceItems) {
    const productId = String(item.productId || "").trim();
    if (!productId) continue;
    const variants = normalizeVariants(item);
    if (!variants.length) continue;
    cartItems.push({
      productId,
      productSlug: item.productSlug || productId,
      productName: item.productName || "Product",
      brand: item.brand,
      imageUrl: item.imageUrl,
      basePrice: item.basePrice,
      currency: item.currency,
      variants,
      decoration: {
        method: item.decoration?.method || "other",
        locations: item.decoration?.locations || [],
        colors: item.decoration?.colors ?? 0,
      },
      design: {
        hasArtwork: Boolean(
          item.design?.hasArtwork || item.design?.artworkUrl,
        ),
        notes: item.design?.notes,
        artworkUrl: item.design?.artworkUrl,
      },
    });
  }

  return cartItems;
}

export function pastOrderToCartWithIds(
  order: PastOrderRequest,
): OrderRequestCartItem[] {
  return pastOrderToCartItems(order).map((item) => ({
    ...item,
    id: createCartItemId(),
  }));
}

export function formatShippingSummary(
  shipping: PastOrderRequest["shipping"],
): string | null {
  if (!shipping) return null;
  if (shipping.formatted?.trim()) return shipping.formatted.trim();
  const line = [
    shipping.line1,
    shipping.line2,
    [shipping.city, shipping.state, shipping.postalCode]
      .filter(Boolean)
      .join(", "),
    shipping.country && shipping.country !== "US" ? shipping.country : null,
  ]
    .filter(Boolean)
    .join(", ");
  return line || null;
}
