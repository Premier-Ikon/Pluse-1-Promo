export type OrderRequestVariant = {
  colorName: string;
  hex?: string;
  imageUrl?: string;
  sizes: Array<{ size: string; qty: number }>;
};

export type OrderRequestCartItem = {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  brand?: string;
  imageUrl?: string;
  basePrice?: number;
  currency?: string;
  variants: OrderRequestVariant[];
  decoration: {
    method: string;
    locations: string[];
    colors: number;
  };
  design: {
    hasArtwork: boolean;
    notes?: string;
    artworkUrl?: string;
  };
};

const STORAGE_KEY = "p1p-order-request-cart";

function canUseStorage() {
  return typeof window !== "undefined";
}

export function readOrderRequestCart(): OrderRequestCartItem[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as OrderRequestCartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeOrderRequestCart(items: OrderRequestCartItem[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("p1p-order-cart-change"));
}

export function cartItemQty(item: OrderRequestCartItem): number {
  return item.variants.reduce(
    (sum, v) => sum + v.sizes.reduce((s, x) => s + x.qty, 0),
    0,
  );
}

export function cartTotalQty(items: OrderRequestCartItem[]): number {
  return items.reduce((sum, item) => sum + cartItemQty(item), 0);
}

export function createCartItemId() {
  return `line-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
