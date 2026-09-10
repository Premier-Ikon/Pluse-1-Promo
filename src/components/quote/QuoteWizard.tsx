"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Search,
  Upload,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/shop/ProductCard";
import {
  submitOrderRequest,
  uploadArtworkFile,
  type CatalogProduct,
  type DecorationMethod,
} from "@/lib/catalog";
import { cn } from "@/lib/utils";

type Step = "products" | "configure" | "design" | "timeline" | "contact";

type ConfigState = {
  selectedColors: string[];
  previewColor: string;
  colorQuery: string;
  sizeQtyByColor: Record<string, Record<string, number>>;
  methodId: string;
  locations: string[];
  inkColors: number;
};

type DesignState = {
  hasArtwork: boolean;
  notes: string;
  artworkUrl: string;
  artworkFileName: string;
  uploading: boolean;
};

const STEPS: Array<{ id: Step; label: string }> = [
  { id: "products", label: "Products" },
  { id: "configure", label: "Details" },
  { id: "design", label: "Design" },
  { id: "timeline", label: "Timeline" },
  { id: "contact", label: "Submit" },
];

const DELIVERY = [
  { id: "standard", label: "Standard", hint: "Typical turnaround" },
  { id: "rush", label: "Rush", hint: "Faster when available" },
  { id: "flexible", label: "Flexible", hint: "No hard deadline" },
];

function emptyConfig(product: CatalogProduct, methods: DecorationMethod[]): ConfigState {
  const initial =
    product.showcaseColor || product.colors?.[0]?.name || "";
  const method =
    methods.find((m) => product.decorationOptions?.includes(m.id)) ||
    methods[0];
  const allowedLocs =
    (method && product.decorationLocations?.[method.id]) ||
    method?.locations ||
    [];
  return {
    selectedColors: initial ? [initial] : [],
    previewColor: initial,
    colorQuery: "",
    sizeQtyByColor: {},
    methodId: method?.id || "screenprint",
    locations: allowedLocs.slice(0, 1),
    inkColors: 1,
  };
}

function configQty(cfg: ConfigState) {
  return cfg.selectedColors.reduce((sum, colorName) => {
    const sizes = cfg.sizeQtyByColor[colorName] || {};
    return sum + Object.values(sizes).reduce((a, b) => a + b, 0);
  }, 0);
}

type Props = {
  products: CatalogProduct[];
  methods: DecorationMethod[];
};

export function QuoteWizard({ products, methods }: Props) {
  const [step, setStep] = useState<Step>("products");
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [configs, setConfigs] = useState<Record<string, ConfigState>>({});
  const [design, setDesign] = useState<DesignState>({
    hasArtwork: true,
    notes: "",
    artworkUrl: "",
    artworkFileName: "",
    uploading: false,
  });
  const [deliverySpeed, setDeliverySpeed] = useState("standard");
  const [needByDate, setNeedByDate] = useState("");
  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const brands = useMemo(
    () =>
      Array.from(
        new Set(products.map((p) => p.brand).filter(Boolean) as string[]),
      ).sort((a, b) => a.localeCompare(b)),
    [products],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (brand && (p.brand || "").toLowerCase() !== brand.toLowerCase()) {
        return false;
      }
      if (!q) return true;
      return [p.name, p.brand, p.category, p.slug]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [products, query, brand]);

  const selectedProducts = useMemo(
    () =>
      selectedIds
        .map((id) => products.find((p) => p.id === id))
        .filter(Boolean) as CatalogProduct[],
    [selectedIds, products],
  );

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  function toggleProduct(product: CatalogProduct) {
    setSelectedIds((prev) => {
      if (prev.includes(product.id)) {
        return prev.filter((id) => id !== product.id);
      }
      setConfigs((c) => ({
        ...c,
        [product.id]: c[product.id] || emptyConfig(product, methods),
      }));
      return [...prev, product.id];
    });
  }

  function updateConfig(productId: string, patch: Partial<ConfigState>) {
    setConfigs((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], ...patch },
    }));
  }

  function toggleColor(product: CatalogProduct, colorName: string) {
    const cfg = configs[product.id] || emptyConfig(product, methods);
    const selected = cfg.selectedColors.includes(colorName);
    const selectedColors = selected
      ? cfg.selectedColors.filter((c) => c !== colorName)
      : [...cfg.selectedColors, colorName];
    const sizeQtyByColor = { ...cfg.sizeQtyByColor };
    if (selected) delete sizeQtyByColor[colorName];
    updateConfig(product.id, {
      selectedColors,
      previewColor: colorName,
      sizeQtyByColor,
    });
  }

  function setQty(
    productId: string,
    colorName: string,
    size: string,
    qty: number,
  ) {
    const cfg = configs[productId];
    if (!cfg) return;
    updateConfig(productId, {
      sizeQtyByColor: {
        ...cfg.sizeQtyByColor,
        [colorName]: {
          ...(cfg.sizeQtyByColor[colorName] || {}),
          [size]: Math.max(0, qty),
        },
      },
    });
  }

  function validateConfigure() {
    for (const product of selectedProducts) {
      const cfg = configs[product.id];
      if (!cfg) return "Configure each selected product.";
      if (!cfg.selectedColors.length) {
        return `Select at least one color for ${product.name}.`;
      }
      if (configQty(cfg) < 1) {
        return `Add sizes and quantities for ${product.name}.`;
      }
      if (!cfg.methodId || !cfg.locations.length) {
        return `Choose decoration and a location for ${product.name}.`;
      }
    }
    return null;
  }

  function goNext() {
    setError(null);
    if (step === "products") {
      if (!selectedIds.length) {
        setError("Select at least one product to continue.");
        return;
      }
      setStep("configure");
      return;
    }
    if (step === "configure") {
      const msg = validateConfigure();
      if (msg) {
        setError(msg);
        return;
      }
      setStep("design");
      return;
    }
    if (step === "design") setStep("timeline");
    if (step === "timeline") {
      if (!deliverySpeed) {
        setError("Choose a timeline.");
        return;
      }
      setStep("contact");
    }
  }

  function goBack() {
    setError(null);
    const order: Step[] = [
      "products",
      "configure",
      "design",
      "timeline",
      "contact",
    ];
    const idx = order.indexOf(step);
    if (idx > 0) setStep(order[idx - 1]);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!contact.name.trim() || !contact.email.trim()) {
      setError("Add your name and email so we can send the quote.");
      return;
    }
    const cfgError = validateConfigure();
    if (cfgError) {
      setError(cfgError);
      setStep("configure");
      return;
    }

    setSubmitting(true);
    const estimate = selectedProducts.reduce((sum, product) => {
      const cfg = configs[product.id];
      return sum + (product.pricing?.basePrice || 0) * configQty(cfg);
    }, 0);

    const result = await submitOrderRequest({
      items: selectedProducts.map((product) => {
        const cfg = configs[product.id];
        const method = methods.find((m) => m.id === cfg.methodId);
        const variants = cfg.selectedColors
          .map((colorName) => {
            const color = product.colors?.find((c) => c.name === colorName);
            const sizes = Object.entries(cfg.sizeQtyByColor[colorName] || {})
              .filter(([, qty]) => qty > 0)
              .map(([size, qty]) => ({ size, qty }));
            if (!sizes.length) return null;
            return {
              color: { name: colorName, hex: color?.hex },
              sizes,
            };
          })
          .filter(Boolean) as Array<{
          color: { name: string; hex?: string };
          sizes: Array<{ size: string; qty: number }>;
        }>;

        const preview =
          product.colors?.find((c) => c.name === cfg.previewColor) ||
          product.colors?.find((c) => cfg.selectedColors.includes(c.name)) ||
          product.colors?.[0];

        return {
          productId: product.id,
          productName: product.name,
          productSlug: product.slug,
          imageUrl:
            preview?.imageUrl || product.imageThumbUrl || product.imageUrl,
          variants,
          decoration: {
            method: method?.label || cfg.methodId,
            locations: cfg.locations,
            colors: method?.askInkColors ? cfg.inkColors : undefined,
          },
          design: {
            hasArtwork: design.hasArtwork,
            notes: design.notes.trim() || undefined,
            artworkUrl: design.artworkUrl.trim() || undefined,
          },
        };
      }),
      delivery: {
        speed: deliverySpeed,
        needByDate: needByDate || undefined,
      },
      contact: {
        name: contact.name.trim(),
        email: contact.email.trim(),
        phone: contact.phone.trim() || undefined,
        company: contact.company.trim() || undefined,
      },
      estimatedTotal: estimate || undefined,
      specialInstructions: specialInstructions.trim() || undefined,
    });

    setSubmitting(false);
    if (!result.success) {
      setError(result.error || "Could not submit your quote request.");
      return;
    }
    setDone(
      result.message ||
        "Request received. We'll confirm pricing before production.",
    );
  }

  if (done) {
    return (
      <section className="bg-surface py-16 md:py-24">
        <Container className="max-w-xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-accent-light text-brand-accent-dark">
            <Check size={22} />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-taupe">
            Quote request submitted
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-grey-olive">
            {done} Create an account anytime to track requests from your
            dashboard.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/account" variant="primary">
              Go to account
            </Button>
            <Button href="/apparel" variant="secondary">
              Keep browsing
            </Button>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-surface py-10 md:py-14">
      <Container>
        <div className="mb-8 max-w-2xl">
          <p className="text-eyebrow text-brand-accent-dark">Build a quote</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-taupe md:text-3xl">
            Tell us what you need — we&apos;ll confirm pricing.
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-grey-olive">
            Pick products, share your design and timeline, then send a request.
            No payment online.
          </p>
        </div>

        <ol className="mb-8 flex flex-wrap gap-2">
          {STEPS.map((item, index) => {
            const active = item.id === step;
            const complete = index < stepIndex;
            return (
              <li
                key={item.id}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold",
                  active
                    ? "bg-taupe text-white"
                    : complete
                      ? "bg-brand-accent-light text-brand-accent-dark"
                      : "bg-white text-grey-olive ring-1 ring-border",
                )}
              >
                {index + 1}. {item.label}
              </li>
            );
          })}
        </ol>

        {error && (
          <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        {step === "products" && (
          <div>
            <div className="mb-5 flex flex-wrap gap-3">
              <label className="relative min-w-[14rem] flex-1">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-grey-olive"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products"
                  className="w-full rounded-xl border border-border bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-accent"
                />
              </label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="rounded-xl border border-border bg-white py-2.5 pl-3 pr-10 text-sm outline-none focus:border-brand-accent"
              >
                <option value="">All brands</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <p className="mb-4 text-sm text-grey-olive">
              {selectedIds.length} selected · {filtered.length} shown
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  selected={selectedIds.includes(product.id)}
                  onSelect={() => toggleProduct(product)}
                />
              ))}
            </div>
            {!filtered.length && (
              <p className="rounded-2xl border border-dashed border-border bg-white px-4 py-12 text-center text-sm text-grey-olive">
                No products match that filter.
              </p>
            )}
          </div>
        )}

        {step === "configure" && (
          <div className="space-y-5">
            {selectedProducts.map((product) => {
              const cfg = configs[product.id] || emptyConfig(product, methods);
              const productMethods = methods.filter(
                (m) =>
                  !product.decorationOptions?.length ||
                  product.decorationOptions.includes(m.id),
              );
              const activeMethod =
                productMethods.find((m) => m.id === cfg.methodId) ||
                productMethods[0];
              const locs =
                product.decorationLocations?.[activeMethod?.id || ""] ||
                activeMethod?.locations ||
                [];
              const preview =
                product.colors?.find((c) => c.name === cfg.previewColor) ||
                product.colors?.find((c) =>
                  cfg.selectedColors.includes(c.name),
                ) ||
                product.colors?.[0];
              const previewImage =
                preview?.imageUrl ||
                product.imageThumbUrl ||
                product.imageUrl ||
                "";
              const colorQuery = cfg.colorQuery.trim().toLowerCase();
              const filteredColors = (product.colors || []).filter((c) =>
                colorQuery ? c.name.toLowerCase().includes(colorQuery) : true,
              );

              return (
                <div
                  key={product.id}
                  className="rounded-2xl border border-border bg-white p-5 md:p-6"
                >
                  <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                    <div>
                      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-[#efeae2]">
                        {previewImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={previewImage}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                      {preview && (
                        <p className="mt-2 text-sm text-grey-olive">
                          Preview:{" "}
                          <span className="font-medium text-taupe">
                            {preview.name}
                          </span>
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-brand-accent-dark">
                        {product.brand || product.category}
                      </p>
                      <h2 className="mt-1 text-lg font-bold text-taupe md:text-xl">
                        {product.name}
                      </h2>

                      <div className="mt-6">
                        <div className="flex items-baseline justify-between gap-3">
                          <p className="text-sm font-semibold text-taupe">
                            Colors
                          </p>
                          <p className="text-xs text-grey-olive">
                            {cfg.selectedColors.length} selected
                            {(product.colors?.length || 0) > 0
                              ? ` of ${product.colors.length}`
                              : ""}
                          </p>
                        </div>

                        <label className="relative mt-3 block">
                          <span className="sr-only">Search colors</span>
                          <Search
                            size={15}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-grey-olive/70"
                          />
                          <input
                            type="search"
                            value={cfg.colorQuery}
                            onChange={(e) =>
                              updateConfig(product.id, {
                                colorQuery: e.target.value,
                              })
                            }
                            placeholder="Search colors…"
                            className="w-full rounded-xl border border-border bg-[#f7f4ef] py-2.5 pl-9 pr-9 text-sm text-taupe placeholder:text-grey-olive/60 outline-none transition focus:border-brand-accent focus:bg-white"
                          />
                          {cfg.colorQuery && (
                            <button
                              type="button"
                              onClick={() =>
                                updateConfig(product.id, { colorQuery: "" })
                              }
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-grey-olive hover:text-taupe"
                              aria-label="Clear search"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </label>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {filteredColors.map((c) => {
                            const selected = cfg.selectedColors.includes(c.name);
                            return (
                              <button
                                key={c.name}
                                type="button"
                                title={c.name}
                                onClick={() => toggleColor(product, c.name)}
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

                        {cfg.selectedColors.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {cfg.selectedColors.map((name) => {
                              const color = product.colors?.find(
                                (c) => c.name === name,
                              );
                              return (
                                <button
                                  key={name}
                                  type="button"
                                  onClick={() => toggleColor(product, name)}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-2 py-1 text-xs text-taupe transition hover:border-brand-accent/40"
                                >
                                  <span
                                    className="h-2.5 w-2.5 rounded-full border border-black/10"
                                    style={{
                                      backgroundColor: color?.hex || "#ddd",
                                    }}
                                  />
                                  {name}
                                  <X size={12} className="text-grey-olive" />
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      <div className="mt-6">
                        <p className="text-sm font-semibold text-taupe">
                          Sizes & quantity
                        </p>
                        <p className="mt-1 text-xs text-grey-olive">
                          Set quantities for each selected color.
                        </p>
                        <div className="mt-4 space-y-5">
                          {cfg.selectedColors.map((colorName) => {
                            const color = product.colors?.find(
                              (c) => c.name === colorName,
                            );
                            return (
                              <div key={colorName}>
                                <div className="mb-2 flex items-center gap-2">
                                  <span
                                    className="h-3.5 w-3.5 rounded-full border border-black/10"
                                    style={{
                                      backgroundColor: color?.hex || "#ddd",
                                    }}
                                  />
                                  <p className="text-sm font-medium text-taupe">
                                    {colorName}
                                  </p>
                                </div>
                                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                                  {(product.sizes || []).map((size) => (
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
                                        value={
                                          cfg.sizeQtyByColor[colorName]?.[
                                            size
                                          ] ?? 0
                                        }
                                        onFocus={(e) =>
                                          e.currentTarget.select()
                                        }
                                        onChange={(e) =>
                                          setQty(
                                            product.id,
                                            colorName,
                                            size,
                                            Math.max(
                                              0,
                                              Number(e.target.value) || 0,
                                            ),
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
                          {!cfg.selectedColors.length && (
                            <p className="text-sm text-grey-olive">
                              Select a color to add sizes.
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-6">
                        <p className="text-sm font-semibold text-taupe">
                          Decoration
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {productMethods.map((method) => {
                            const on = cfg.methodId === method.id;
                            return (
                              <button
                                key={method.id}
                                type="button"
                                onClick={() =>
                                  updateConfig(product.id, {
                                    methodId: method.id,
                                    locations: (
                                      product.decorationLocations?.[
                                        method.id
                                      ] ||
                                      method.locations ||
                                      []
                                    ).slice(0, 1),
                                  })
                                }
                                className={cn(
                                  "rounded-full border px-3 py-1.5 text-xs font-semibold",
                                  on
                                    ? "border-taupe bg-taupe text-white"
                                    : "border-border bg-surface text-taupe",
                                )}
                              >
                                {method.label}
                              </button>
                            );
                          })}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {locs.map((loc) => {
                            const on = cfg.locations.includes(loc);
                            return (
                              <button
                                key={loc}
                                type="button"
                                onClick={() => {
                                  const next = on
                                    ? cfg.locations.filter((l) => l !== loc)
                                    : [...cfg.locations, loc];
                                  updateConfig(product.id, {
                                    locations: next.length ? next : [loc],
                                  });
                                }}
                                className={cn(
                                  "rounded-lg border px-2.5 py-1 text-xs",
                                  on
                                    ? "border-brand-accent bg-brand-accent-light text-taupe"
                                    : "border-border text-grey-olive",
                                )}
                              >
                                {loc}
                              </button>
                            );
                          })}
                        </div>
                        {activeMethod?.askInkColors && (
                          <label className="mt-3 block max-w-[10rem] text-xs">
                            <span className="font-medium text-taupe">
                              Ink / thread colors
                            </span>
                            <input
                              type="number"
                              min={1}
                              max={12}
                              value={cfg.inkColors}
                              onChange={(e) =>
                                updateConfig(product.id, {
                                  inkColors: Math.max(
                                    1,
                                    Number(e.target.value) || 1,
                                  ),
                                })
                              }
                              className="mt-1 w-full rounded-lg border border-border bg-surface px-2 py-1.5 text-sm outline-none focus:border-brand-accent"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {step === "design" && (
          <div className="max-w-2xl rounded-2xl border border-border bg-white p-6">
            <p className="text-sm font-semibold text-taupe">
              Do you have artwork ready?
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                { value: true, label: "Yes, I have a design" },
                { value: false, label: "Not yet — help me" },
              ].map((option) => (
                <button
                  key={String(option.value)}
                  type="button"
                  onClick={() =>
                    setDesign((prev) => ({
                      ...prev,
                      hasArtwork: option.value,
                    }))
                  }
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium",
                    design.hasArtwork === option.value
                      ? "border-taupe bg-taupe text-white"
                      : "border-border bg-surface text-taupe",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {design.hasArtwork && (
              <div className="mt-5">
                <p className="text-sm font-medium text-taupe">Upload artwork</p>
                <p className="mt-1 text-xs text-grey-olive">
                  PNG, JPG, WebP, SVG, PDF, AI, or EPS — up to 10MB.
                </p>
                <label className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-[#f7f4ef] px-4 py-8 text-center transition hover:border-brand-accent/50">
                  <Upload size={20} className="text-brand-accent-dark" />
                  <span className="mt-2 text-sm font-medium text-taupe">
                    {design.uploading
                      ? "Uploading…"
                      : design.artworkFileName
                        ? "Replace file"
                        : "Choose a file"}
                  </span>
                  <input
                    type="file"
                    accept="image/*,.pdf,.ai,.eps,application/pdf"
                    className="sr-only"
                    disabled={design.uploading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      e.target.value = "";
                      if (!file) return;
                      setError(null);
                      setDesign((prev) => ({ ...prev, uploading: true }));
                      const result = await uploadArtworkFile(file);
                      if (!result.ok || !result.url) {
                        setDesign((prev) => ({ ...prev, uploading: false }));
                        setError(result.error || "Upload failed.");
                        return;
                      }
                      setDesign((prev) => ({
                        ...prev,
                        uploading: false,
                        artworkUrl: result.url || "",
                        artworkFileName: result.fileName || file.name,
                      }));
                    }}
                  />
                </label>

                {design.artworkUrl && (
                  <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-border bg-white px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-taupe">
                        {design.artworkFileName || "Artwork uploaded"}
                      </p>
                      <a
                        href={design.artworkUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-brand-accent-dark underline"
                      >
                        View file
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setDesign((prev) => ({
                          ...prev,
                          artworkUrl: "",
                          artworkFileName: "",
                        }))
                      }
                      className="shrink-0 rounded-md p-1.5 text-grey-olive hover:bg-surface hover:text-taupe"
                      aria-label="Remove artwork"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                <label className="mt-4 block text-sm">
                  <span className="font-medium text-taupe">
                    Or paste a link (optional)
                  </span>
                  <input
                    value={
                      design.artworkFileName ? "" : design.artworkUrl
                    }
                    onChange={(e) =>
                      setDesign((prev) => ({
                        ...prev,
                        artworkUrl: e.target.value,
                        artworkFileName: "",
                      }))
                    }
                    placeholder="Google Drive, Dropbox, or image URL"
                    className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3 py-2.5 outline-none focus:border-brand-accent"
                  />
                </label>
              </div>
            )}

            <label className="mt-5 block text-sm">
              <span className="font-medium text-taupe">Design notes</span>
              <textarea
                value={design.notes}
                onChange={(e) =>
                  setDesign((prev) => ({ ...prev, notes: e.target.value }))
                }
                rows={4}
                placeholder="Logo placement, colors, file type, inspiration…"
                className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3 py-2 outline-none focus:border-brand-accent"
              />
            </label>
          </div>
        )}

        {step === "timeline" && (
          <div className="max-w-2xl space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {DELIVERY.map((option) => {
                const on = deliverySpeed === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setDeliverySpeed(option.id)}
                    className={cn(
                      "rounded-2xl border p-4 text-left transition",
                      on
                        ? "border-brand-accent bg-white ring-2 ring-brand-accent/25"
                        : "border-border bg-white hover:border-brand-accent/40",
                    )}
                  >
                    <p className="font-semibold text-taupe">{option.label}</p>
                    <p className="mt-1 text-xs text-grey-olive">{option.hint}</p>
                  </button>
                );
              })}
            </div>
            <label className="block max-w-sm text-sm">
              <span className="font-medium text-taupe">
                Need-by date (optional)
              </span>
              <input
                type="date"
                value={needByDate}
                onChange={(e) => setNeedByDate(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2.5 outline-none focus:border-brand-accent"
              />
            </label>
          </div>
        )}

        {step === "contact" && (
          <form
            id="quote-submit"
            onSubmit={onSubmit}
            className="max-w-2xl space-y-4 rounded-2xl border border-border bg-white p-6"
          >
            <p className="text-sm text-grey-olive">
              Almost done — where should we send your quote?
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm sm:col-span-2">
                <span className="font-medium text-taupe">Name</span>
                <input
                  required
                  value={contact.name}
                  onChange={(e) =>
                    setContact((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3 py-2.5 outline-none focus:border-brand-accent"
                />
              </label>
              <label className="text-sm sm:col-span-2">
                <span className="font-medium text-taupe">Email</span>
                <input
                  type="email"
                  required
                  value={contact.email}
                  onChange={(e) =>
                    setContact((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3 py-2.5 outline-none focus:border-brand-accent"
                />
              </label>
              <label className="text-sm">
                <span className="font-medium text-taupe">Company</span>
                <input
                  value={contact.company}
                  onChange={(e) =>
                    setContact((prev) => ({
                      ...prev,
                      company: e.target.value,
                    }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3 py-2.5 outline-none focus:border-brand-accent"
                />
              </label>
              <label className="text-sm">
                <span className="font-medium text-taupe">Phone</span>
                <input
                  value={contact.phone}
                  onChange={(e) =>
                    setContact((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3 py-2.5 outline-none focus:border-brand-accent"
                />
              </label>
              <label className="text-sm sm:col-span-2">
                <span className="font-medium text-taupe">
                  Anything else we should know?
                </span>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  rows={3}
                  className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3 py-2.5 outline-none focus:border-brand-accent"
                />
              </label>
            </div>
            <p className="text-xs text-grey-olive">
              After you submit, you can{" "}
              <Link href="/account" className="font-medium text-brand-accent-dark underline">
                create an account
              </Link>{" "}
              with this email to track the request.
            </p>
          </form>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
          {step === "products" ? (
            <Link
              href="/apparel"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-grey-olive hover:text-taupe"
            >
              <ArrowLeft size={16} />
              Back to apparel
            </Link>
          ) : (
            <button
              type="button"
              onClick={goBack}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-grey-olive hover:text-taupe"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          )}

          {step === "contact" ? (
            <button
              type="submit"
              form="quote-submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-taupe px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Submit quote request"}
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              disabled={design.uploading}
              className="inline-flex items-center gap-2 rounded-xl bg-taupe px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
            >
              Continue
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </Container>
    </section>
  );
}
