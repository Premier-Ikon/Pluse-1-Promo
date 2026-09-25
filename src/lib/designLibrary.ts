export type DesignLibrarySource = {
  id: string;
  createdAt?: string;
  items?: Array<{
    productName?: string;
    design?: {
      notes?: string;
      artworkUrl?: string;
    };
  }>;
  design?: {
    notes?: string;
    artworkUrl?: string;
  };
};

export type DesignLibraryItem = {
  id: string;
  url: string;
  notes?: string;
  productName?: string;
  requestId: string;
  createdAt?: string;
};

export function collectDesigns(
  orders: DesignLibrarySource[],
): DesignLibraryItem[] {
  const seen = new Set<string>();
  const designs: DesignLibraryItem[] = [];

  for (const order of orders) {
    const itemDesigns =
      order.items?.map((item, index) => ({
        url: item.design?.artworkUrl?.trim() || "",
        notes: item.design?.notes?.trim() || "",
        productName: item.productName,
        index,
      })) || [];

    if (!itemDesigns.length && order.design?.artworkUrl) {
      itemDesigns.push({
        url: order.design.artworkUrl.trim(),
        notes: order.design.notes?.trim() || "",
        productName: undefined,
        index: 0,
      });
    }

    for (const entry of itemDesigns) {
      if (!entry.url || seen.has(entry.url)) continue;
      seen.add(entry.url);
      designs.push({
        id: `${order.id}-${entry.index}-${entry.url}`,
        url: entry.url,
        notes: entry.notes || undefined,
        productName: entry.productName,
        requestId: order.id,
        createdAt: order.createdAt,
      });
    }
  }

  return designs;
}

export function isPreviewableImage(url: string) {
  const clean = url.split("?")[0].toLowerCase();
  return /\.(png|jpe?g|webp|gif|svg)$/.test(clean);
}

export function designFileLabel(url: string) {
  try {
    const name = decodeURIComponent(url.split("/").pop() || "");
    return name || "Artwork file";
  } catch {
    return "Artwork file";
  }
}
