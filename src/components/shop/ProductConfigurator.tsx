"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Shirt, X } from "lucide-react";
import type { CatalogProduct, DecorationMethod } from "@/lib/catalog";
import { formatDisplayPrice, uploadArtworkFile } from "@/lib/catalog";
import { useOrderRequestCart } from "@/components/order/OrderRequestCartProvider";
import { PastDesignPicker } from "@/components/quote/PastDesignPicker";
import { AddedToOrderModal } from "@/components/shop/AddedToOrderModal";
import { ProductDescription } from "@/components/shop/ProductDescription";
import { ArtworkAttachmentCard } from "@/components/ui/ArtworkAttachmentCard";
import { ButtonNative } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Props = {
  product: CatalogProduct;
  decorationCatalog?: DecorationMethod[];
};

export function ProductConfigurator({
  product,
  decorationCatalog = [],
}: Props) {
  const { addItem } = useOrderRequestCart();

  const availableMethods = useMemo(() => {
    const allowed = product.decorationOptions?.length
      ? product.decorationOptions
      : decorationCatalog.map((m) => m.id);

    function resolveLocations(method: DecorationMethod) {
      const productLocs = product.decorationLocations?.[method.id];
      if (productLocs) {
        const catalogSet = new Set(method.locations);
        const ordered = method.locations.filter((l) =>
          productLocs.includes(l),
        );
        const extras = productLocs.filter((l) => !catalogSet.has(l));
        return [...ordered, ...extras];
      }
      return method.locations?.length
        ? method.locations
        : [
            "Front chest",
            "Full front",
            "Back",
            "Left sleeve",
            "Right sleeve",
            "Hat front",
          ];
    }

    const fromCatalog = decorationCatalog
      .filter((m) => allowed.includes(m.id))
      .map((m) => ({
        ...m,
        locations: resolveLocations(m),
      }));
    if (fromCatalog.length) return fromCatalog;

    return allowed.map((id) => ({
      id,
      label: id.replace(/-/g, " "),
      askInkColors: id !== "embroidery",
      locations: resolveLocations({
        id,
        label: id,
        locations: product.decorationLocations?.[id] || [],
      }),
    }));
  }, [product, decorationCatalog]);

  const [selectedColors, setSelectedColors] = useState<string[]>(() => {
    const initial =
      product.showcaseColor || product.colors[0]?.name || "";
    return initial ? [initial] : [];
  });
  const [previewColor, setPreviewColor] = useState(
    product.showcaseColor || product.colors[0]?.name || "",
  );
  const [colorQuery, setColorQuery] = useState("");
  const [sizeQtyByColor, setSizeQtyByColor] = useState<
    Record<string, Record<string, number>>
  >({});
  const [decorationMethod, setDecorationMethod] = useState(
    () => availableMethods[0]?.id || "",
  );
  const [locations, setLocations] = useState<string[]>([]);
  const [hasArtwork, setHasArtwork] = useState(true);
  const [designNotes, setDesignNotes] = useState("");
  const [artworkUrl, setArtworkUrl] = useState("");
  const [artworkFileName, setArtworkFileName] = useState("");
  const [uploadingArtwork, setUploadingArtwork] = useState(false);
  const [showAddedModal, setShowAddedModal] = useState(false);
  const [addedSnapshot, setAddedSnapshot] = useState<{
    name: string;
    image?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeMethod =
    availableMethods.find((m) => m.id === decorationMethod) ||
    availableMethods[0];
  const locationOptions = activeMethod?.locations || [];

  useEffect(() => {
    if (!availableMethods.length) return;
    if (!availableMethods.some((m) => m.id === decorationMethod)) {
      setDecorationMethod(availableMethods[0].id);
    }
  }, [availableMethods, decorationMethod]);

  useEffect(() => {
    const opts = activeMethod?.locations || [];
    setLocations((prev) => {
      const kept = prev.filter((l) => opts.includes(l));
      if (kept.length) return kept;
      return opts[0] ? [opts[0]] : [];
    });
  }, [activeMethod?.id]); // eslint-disable-line react-hooks/exhaustive-deps -- reset when method changes

  const activePreview =
    product.colors.find((c) => c.name === previewColor) ||
    product.colors.find((c) => selectedColors.includes(c.name)) ||
    product.colors[0];
  const previewImage =
    activePreview?.imageUrl || product.imageUrl || product.imageThumbUrl || "";

  const filteredColors = useMemo(() => {
    const q = colorQuery.trim().toLowerCase();
    if (!q) return product.colors;
    return product.colors.filter((c) => c.name.toLowerCase().includes(q));
  }, [product.colors, colorQuery]);

  const totalQty = useMemo(() => {
    return selectedColors.reduce((sum, colorName) => {
      const sizes = sizeQtyByColor[colorName] || {};
      return sum + Object.values(sizes).reduce((a, b) => a + b, 0);
    }, 0);
  }, [selectedColors, sizeQtyByColor]);

  function resetConfigurator() {
    const initialColor =
      product.showcaseColor || product.colors[0]?.name || "";
    setSelectedColors(initialColor ? [initialColor] : []);
    setPreviewColor(initialColor);
    setColorQuery("");
    setSizeQtyByColor({});
    setDecorationMethod(availableMethods[0]?.id || "");
    setLocations(
      availableMethods[0]?.locations?.[0]
        ? [availableMethods[0].locations[0]]
        : [],
    );
    setHasArtwork(true);
    setDesignNotes("");
    setArtworkUrl("");
    setArtworkFileName("");
    setUploadingArtwork(false);
    setError(null);
  }

  function closeAddedModal() {
    setShowAddedModal(false);
    setAddedSnapshot(null);
    resetConfigurator();
  }

  function toggleColor(name: string) {
    setPreviewColor(name);
    setSelectedColors((prev) => {
      if (prev.includes(name)) {
        setSizeQtyByColor((qty) => {
          const next = { ...qty };
          delete next[name];
          return next;
        });
        return prev.filter((c) => c !== name);
      }
      return [...prev, name];
    });
  }

  function clearSelectedColors() {
    setSelectedColors([]);
    setSizeQtyByColor({});
    setPreviewColor(product.showcaseColor || product.colors[0]?.name || "");
  }

  function setQty(colorName: string, size: string, qty: number) {
    setSizeQtyByColor((prev) => ({
      ...prev,
      [colorName]: {
        ...(prev[colorName] || {}),
        [size]: Math.max(0, qty),
      },
    }));
  }

  function toggleLocation(loc: string) {
    setLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc],
    );
  }

  function handleAdd() {
    setError(null);
    if (selectedColors.length === 0) {
      setError("Select at least one color.");
      return;
    }
    if (totalQty < 1) {
      setError("Add sizes and quantities for your selected colors.");
      return;
    }
    if (!decorationMethod || locations.length === 0) {
      setError("Choose a decoration method and at least one location.");
      return;
    }

    const variants = selectedColors
      .map((colorName) => {
        const color = product.colors.find((c) => c.name === colorName);
        const sizes = Object.entries(sizeQtyByColor[colorName] || {})
          .filter(([, qty]) => qty > 0)
          .map(([size, qty]) => ({ size, qty }));
        if (!sizes.length) return null;
        return {
          colorName,
          hex: color?.hex,
          imageUrl: color?.imageUrl || product.imageThumbUrl || product.imageUrl,
          sizes,
        };
      })
      .filter(Boolean) as Array<{
      colorName: string;
      hex?: string;
      imageUrl?: string;
      sizes: Array<{ size: string; qty: number }>;
    }>;

    if (!variants.length) {
      setError("Add sizes and quantities for your selected colors.");
      return;
    }

    addItem({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      brand: product.brand,
      imageUrl:
        variants[0]?.imageUrl ||
        product.imageThumbUrl ||
        product.imageUrl,
      basePrice: product.pricing.basePrice,
      currency: product.pricing.currency || "USD",
      variants,
      decoration: {
        method: activeMethod?.label || decorationMethod,
        locations,
        colors: 0,
      },
      design: {
        hasArtwork,
        notes: designNotes.trim() || undefined,
        artworkUrl: artworkUrl.trim() || undefined,
      },
    });

    setAddedSnapshot({
      name: product.name,
      image:
        variants[0]?.imageUrl ||
        previewImage ||
        product.imageThumbUrl ||
        product.imageUrl,
    });
    setShowAddedModal(true);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
      {/* Preview */}
      <div>
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-[#efeae2]">
          {previewImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewImage}
              alt={`${product.name}${activePreview ? ` — ${activePreview.name}` : ""}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{
                background: activePreview?.hex
                  ? `linear-gradient(145deg, ${activePreview.hex}, color-mix(in srgb, ${activePreview.hex} 70%, #000))`
                  : undefined,
              }}
            >
              <Shirt
                size={72}
                className={
                  activePreview?.hex &&
                  activePreview.hex.toLowerCase() !== "#ffffff"
                    ? "text-white/90"
                    : "text-taupe/35"
                }
              />
            </div>
          )}
        </div>
        {activePreview && (
          <p className="mt-3 text-sm text-grey-olive">
            Preview:{" "}
            <span className="font-medium text-taupe">{activePreview.name}</span>
          </p>
        )}
      </div>

      {/* Configure */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent-dark">
          {product.brand || product.category}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-taupe md:text-3xl">
          {product.name}
        </h1>
        <p className="mt-3 text-sm font-semibold text-taupe">
          {formatDisplayPrice(product)}
          {product.pricing.priceNote ? (
            <span className="ml-2 font-normal text-grey-olive">
              — {product.pricing.priceNote}
            </span>
          ) : null}
        </p>

        {/* Colors */}
        <div className="mt-8">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sm font-semibold text-taupe">Colors</p>
            <div className="flex items-center gap-3">
              <p className="text-xs text-grey-olive">
                {selectedColors.length} selected
                {product.colors.length > 0
                  ? ` of ${product.colors.length}`
                  : ""}
              </p>
              {selectedColors.length > 0 && (
                <button
                  type="button"
                  onClick={clearSelectedColors}
                  className="text-xs font-medium text-brand-accent-dark hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          <label className="relative mt-3 block">
            <span className="sr-only">Search colors</span>
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-grey-olive/70"
              aria-hidden
            />
            <input
              type="search"
              value={colorQuery}
              onChange={(e) => setColorQuery(e.target.value)}
              placeholder="Search colors…"
              className="w-full rounded-xl border border-border bg-[#f7f4ef] py-2.5 pl-9 pr-9 text-sm text-taupe placeholder:text-grey-olive/60 outline-none transition focus:border-brand-accent focus:bg-white focus:ring-1 focus:ring-brand-accent/30"
            />
            {colorQuery && (
              <button
                type="button"
                onClick={() => setColorQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-grey-olive hover:bg-white hover:text-taupe"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </label>

          <div className="mt-3 py-1">
            <div className="flex flex-wrap gap-2">
              {filteredColors.map((c) => {
                const selected = selectedColors.includes(c.name);
                return (
                  <button
                    key={c.name}
                    type="button"
                    title={c.name}
                    onClick={() => toggleColor(c.name)}
                    className={cn(
                      "relative h-6 w-6 rounded-full border transition sm:h-7 sm:w-7",
                      selected
                        ? "border-brand-accent outline outline-1 outline-offset-1 outline-brand-accent"
                        : "border-black/15 hover:border-taupe/40",
                    )}
                    style={{
                      backgroundColor: c.hex || "#e8e4de",
                      backgroundImage: c.swatchUrl
                        ? `url(${c.swatchUrl})`
                        : undefined,
                      backgroundSize: "cover",
                    }}
                  >
                    <span className="sr-only">{c.name}</span>
                  </button>
                );
              })}
            </div>
            {filteredColors.length === 0 && (
              <p className="py-2 text-sm text-grey-olive">
                No colors match “{colorQuery.trim()}”.
              </p>
            )}
          </div>

          {selectedColors.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {selectedColors.map((name) => {
                const color = product.colors.find((c) => c.name === name);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggleColor(name)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-2 py-1 text-xs text-taupe transition hover:border-brand-accent/40"
                    title={`Remove ${name}`}
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full border border-black/10"
                      style={{ backgroundColor: color?.hex || "#ddd" }}
                    />
                    {name}
                    <X size={12} className="text-grey-olive" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Sizes per color */}
        <div className="mt-8">
          <p className="text-sm font-semibold text-taupe">Sizes & quantity</p>
          <p className="mt-1 text-xs text-grey-olive">
            Set quantities for each selected color.
          </p>
          <div className="mt-4 space-y-5">
            {selectedColors.map((colorName) => {
              const color = product.colors.find((c) => c.name === colorName);
              return (
                <div key={colorName}>
                  <div className="mb-2 flex items-center gap-2">
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-black/10"
                      style={{ backgroundColor: color?.hex || "#ddd" }}
                    />
                    <p className="text-sm font-medium text-taupe">{colorName}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {product.sizes.map((size) => (
                      <label
                        key={`${colorName}-${size}`}
                        className="flex flex-col gap-1 rounded-lg border border-border bg-white px-2.5 py-2"
                      >
                        <span className="text-[11px] font-medium text-grey-olive">
                          {size}
                        </span>
                        <input
                          type="number"
                          min={0}
                          value={sizeQtyByColor[colorName]?.[size] ?? 0}
                          onFocus={(e) => e.currentTarget.select()}
                          onChange={(e) =>
                            setQty(
                              colorName,
                              size,
                              Math.max(0, Number(e.target.value) || 0),
                            )
                          }
                          className="w-full border-0 bg-transparent p-0 text-sm font-semibold text-taupe outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
            {selectedColors.length === 0 && (
              <p className="text-sm text-grey-olive">
                Select colors above to choose sizes.
              </p>
            )}
          </div>
          {totalQty > 0 && (
            <p className="mt-3 text-sm text-grey-olive">
              Total pieces:{" "}
              <strong className="text-taupe">{totalQty}</strong>
            </p>
          )}
        </div>

        {/* Decoration */}
        <div className="mt-8">
          <p className="text-sm font-semibold text-taupe">Decoration</p>
          {availableMethods.length === 0 ? (
            <p className="mt-2 text-sm text-grey-olive">
              Decoration options are not set for this product yet.
            </p>
          ) : (
            <>
              <div className="mt-3 flex flex-wrap gap-2">
                {availableMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setDecorationMethod(method.id)}
                    className={cn(
                      "rounded-lg border px-3.5 py-2 text-sm font-medium transition",
                      decorationMethod === method.id
                        ? "border-brand-accent bg-brand-accent-light/70 text-taupe"
                        : "border-border bg-white text-grey-olive hover:border-brand-accent/40",
                    )}
                  >
                    {method.label}
                  </button>
                ))}
              </div>
              {locationOptions.length > 0 && (
                <>
                  <p className="mt-4 text-xs font-medium text-grey-olive">
                    Locations
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {locationOptions.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => toggleLocation(loc)}
                        className={cn(
                          "rounded-lg border px-3 py-1.5 text-xs font-medium transition",
                          locations.includes(loc)
                            ? "border-brand-accent bg-brand-accent-light/70 text-taupe"
                            : "border-border bg-white text-grey-olive hover:border-brand-accent/40",
                        )}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Design */}
        <div className="mt-8">
          <p className="text-sm font-semibold text-taupe">Design</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { label: "I have artwork ready", value: true },
              { label: "I need design help", value: false },
            ].map((opt) => (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => setHasArtwork(opt.value)}
                className={cn(
                  "rounded-lg border px-3.5 py-2 text-sm font-medium transition",
                  hasArtwork === opt.value
                    ? "border-brand-accent bg-brand-accent-light/70 text-taupe"
                    : "border-border bg-white text-grey-olive hover:border-brand-accent/40",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {hasArtwork && (
            <div className="mt-4 space-y-4">
              <PastDesignPicker
                selectedUrl={artworkUrl}
                onSelect={(past) => {
                  setArtworkUrl(past.url);
                  setArtworkFileName(
                    past.productName ||
                      past.url.split("/").pop() ||
                      "Past design",
                  );
                  if (!designNotes.trim() && past.notes) {
                    setDesignNotes(past.notes);
                  }
                }}
              />

              <div>
                <p className="text-xs font-medium text-taupe">
                  Or upload new artwork
                </p>
                <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-[#f7f4ef] px-3 py-6 text-center transition hover:border-brand-accent/50">
                  <span className="text-sm font-medium text-taupe">
                    {uploadingArtwork
                      ? "Uploading…"
                      : artworkFileName
                        ? "Replace file"
                        : "Choose a file"}
                  </span>
                  <span className="mt-1 text-[11px] text-grey-olive">
                    PNG, JPG, PDF, AI, EPS — up to 10MB
                  </span>
                  <input
                    type="file"
                    accept="image/*,.pdf,.ai,.eps,application/pdf"
                    className="sr-only"
                    disabled={uploadingArtwork}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      e.target.value = "";
                      if (!file) return;
                      setError(null);
                      setUploadingArtwork(true);
                      const result = await uploadArtworkFile(file);
                      setUploadingArtwork(false);
                      if (!result.ok || !result.url) {
                        setError(result.error || "Upload failed.");
                        return;
                      }
                      setArtworkUrl(result.url);
                      setArtworkFileName(result.fileName || file.name);
                    }}
                  />
                </label>

                {artworkUrl && (
                  <ArtworkAttachmentCard
                    url={artworkUrl}
                    fileName={artworkFileName}
                    onRemove={() => {
                      setArtworkUrl("");
                      setArtworkFileName("");
                    }}
                    className="mt-2"
                  />
                )}
              </div>
            </div>
          )}

          <label className="mt-4 block text-xs text-grey-olive">
            Design notes (optional)
            <textarea
              value={designNotes}
              onChange={(e) => setDesignNotes(e.target.value)}
              rows={3}
              placeholder="Logo colors, placement ideas, file types…"
              className="mt-1 w-full rounded-lg border border-border bg-white px-3 py-2 text-sm text-taupe outline-none focus:border-brand-accent"
            />
          </label>
        </div>

        <div className="mt-8 space-y-3">
          <ButtonNative
            type="button"
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
            onClick={handleAdd}
          >
            Add to order request
          </ButtonNative>
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}
          <p className="text-xs text-grey-olive">
            No payment here — add products, then submit one request for a quote.
          </p>
        </div>

        <div className="mt-10">
          <ProductDescription description={product.description} />
        </div>
      </div>

      <AddedToOrderModal
        open={showAddedModal}
        productName={addedSnapshot?.name || product.name}
        productImage={addedSnapshot?.image}
        onClose={closeAddedModal}
      />
    </div>
  );
}
