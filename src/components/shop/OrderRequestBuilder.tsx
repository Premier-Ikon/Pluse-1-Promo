"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Shirt,
} from "lucide-react";
import type { CatalogProduct, OrderRequestPayload } from "@/lib/catalog";
import { formatDisplayPrice, submitOrderRequest } from "@/lib/catalog";
import { ButtonNative } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "delivery", label: "Delivery", hint: "Select your delivery option." },
  { id: "color", label: "Color", hint: "Pick a garment color." },
  { id: "decoration", label: "Decoration", hint: "How should we brand it?" },
  { id: "design", label: "Design", hint: "Tell us about your artwork." },
  { id: "sizes", label: "Sizes & Quantity", hint: "Select sizes and quantity." },
  { id: "contact", label: "Contact", hint: "Where should we send the quote?" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

const DELIVERY_OPTIONS = ["Standard (10–14 days)", "Rush (5–7 days)", "Urgent (3 days)", "Flexible"];

const LOCATION_OPTIONS = ["Front chest", "Full front", "Back", "Left sleeve", "Right sleeve", "Hat front"];

type Props = { product: CatalogProduct };

export function OrderRequestBuilder({ product }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ message: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [deliverySpeed, setDeliverySpeed] = useState("");
  const [needByDate, setNeedByDate] = useState("");
  const [colorName, setColorName] = useState(product.colors[0]?.name || "");
  const [decorationMethod, setDecorationMethod] = useState(
    product.decorationOptions[0] || "screenprint",
  );
  const [locations, setLocations] = useState<string[]>(["Front chest"]);
  const [inkColors, setInkColors] = useState(1);
  const [hasArtwork, setHasArtwork] = useState(true);
  const [designNotes, setDesignNotes] = useState("");
  const [sizeQty, setSizeQty] = useState<Record<string, number>>(() =>
    Object.fromEntries(product.sizes.map((s) => [s, 0])),
  );
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });

  const step = STEPS[stepIndex];
  const selectedColor = product.colors.find((c) => c.name === colorName);
  const totalQty = Object.values(sizeQty).reduce((a, b) => a + b, 0);

  const estimate = useMemo(() => {
    const base = product.pricing.basePrice ?? 0;
    const deco =
      decorationMethod === "embroidery"
        ? product.pricing.decoration?.embroideryFrom ?? 0
        : product.pricing.decoration?.screenprintFrom ?? 0;
    if (!totalQty) return 0;
    return (base + deco) * totalQty;
  }, [product, decorationMethod, totalQty]);

  function canAdvance(id: StepId): boolean {
    switch (id) {
      case "delivery":
        return Boolean(deliverySpeed);
      case "color":
        return Boolean(colorName);
      case "decoration":
        return Boolean(decorationMethod) && locations.length > 0;
      case "design":
        return true;
      case "sizes":
        return totalQty > 0;
      case "contact":
        return Boolean(contact.name.trim() && contact.email.trim());
      default:
        return false;
    }
  }

  async function handleSubmit() {
    setError(null);
    if (!canAdvance("contact")) {
      setError("Please add your name and email.");
      return;
    }
    setSubmitting(true);

    const payload: OrderRequestPayload = {
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      delivery: {
        speed: deliverySpeed,
        needByDate: needByDate || undefined,
      },
      color: {
        name: colorName,
        hex: selectedColor?.hex,
      },
      decoration: {
        method: decorationMethod,
        locations,
        colors: inkColors,
      },
      design: {
        hasArtwork,
        notes: designNotes || undefined,
      },
      sizes: Object.entries(sizeQty)
        .filter(([, qty]) => qty > 0)
        .map(([size, qty]) => ({ size, qty })),
      contact: {
        name: contact.name.trim(),
        email: contact.email.trim(),
        phone: contact.phone.trim() || undefined,
        company: contact.company.trim() || undefined,
      },
      estimatedTotal: estimate || undefined,
      specialInstructions: specialInstructions || undefined,
    };

    const result = await submitOrderRequest(payload);
    setSubmitting(false);
    if (!result.success) {
      setError(result.error || "Something went wrong.");
      return;
    }
    setDone({
      message:
        result.message ||
        "Request received. We'll confirm pricing before production.",
    });
  }

  function next() {
    if (!canAdvance(step.id)) return;
    if (stepIndex === STEPS.length - 1) {
      void handleSubmit();
      return;
    }
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function back() {
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function toggleLocation(loc: string) {
    setLocations((prev) =>
      prev.includes(loc) ? prev.filter((l) => l !== loc) : [...prev, loc],
    );
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-border bg-white p-8 text-center md:p-12">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-accent-light text-brand-accent-dark">
          <Check size={22} />
        </div>
        <h2 className="mt-4 text-xl font-semibold text-taupe">
          Order request submitted
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-grey-olive">
          {done.message} This is not a payment — we&apos;ll reply with a
          confirmed quote before anything goes into production.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex text-sm font-medium text-brand-accent-dark hover:underline"
        >
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-[#f7f4ef]">
      <div className="flex items-center justify-between border-b border-border bg-white px-4 py-3 md:px-6">
        <h2 className="text-base font-semibold text-taupe">Order Request Builder</h2>
        <p className="text-xs text-grey-olive">No payment — request only</p>
      </div>

      <div className="grid lg:grid-cols-[240px_minmax(0,1fr)_minmax(220px,280px)]">
        {/* Steps sidebar */}
        <aside className="border-b border-border bg-white p-4 lg:border-b-0 lg:border-r">
          <ol className="space-y-2">
            {STEPS.map((s, i) => {
              const active = i === stepIndex;
              const complete = i < stepIndex;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => {
                      if (i <= stepIndex) setStepIndex(i);
                    }}
                    className={cn(
                      "w-full rounded-xl border px-3 py-2.5 text-left transition-colors",
                      active
                        ? "border-brand-accent bg-brand-accent-light/60"
                        : "border-transparent hover:bg-surface",
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold",
                          complete || active
                            ? "bg-brand-accent text-taupe"
                            : "bg-surface text-grey-olive",
                        )}
                      >
                        {complete ? <Check size={12} /> : i + 1}
                      </span>
                      <span className="text-sm font-medium text-taupe">
                        {s.label}
                      </span>
                    </div>
                    <p className="mt-1 pl-7 text-[11px] leading-snug text-grey-olive">
                      {s.id === "color" && colorName
                        ? colorName
                        : s.hint}
                    </p>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="mt-6 border-t border-border pt-4">
            <p className="text-sm font-medium text-taupe">{product.name}</p>
            <p className="mt-1 text-xs text-grey-olive">
              Showcase: {formatDisplayPrice(product)}
            </p>
            <p className="mt-3 text-sm text-taupe">
              Est. subtotal{" "}
              <span className="font-semibold">
                {estimate
                  ? estimate.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })
                  : "$0.00"}
              </span>
            </p>
            <p className="mt-1 text-[11px] text-grey-olive">
              Estimate only — we confirm before production.
            </p>
            <textarea
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="Add special instructions…"
              rows={2}
              className="mt-3 w-full resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-brand-accent"
            />
            <div className="mt-3 flex gap-2">
              <ButtonNative
                type="button"
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={back}
                disabled={stepIndex === 0}
              >
                <ChevronLeft size={16} />
                Back
              </ButtonNative>
              <ButtonNative
                type="button"
                variant="secondary"
                size="sm"
                className="flex-1"
                onClick={next}
                disabled={!canAdvance(step.id) || submitting}
              >
                {stepIndex === STEPS.length - 1
                  ? submitting
                    ? "Sending…"
                    : "Submit"
                  : "Next"}
                {stepIndex < STEPS.length - 1 && <ChevronRight size={16} />}
              </ButtonNative>
            </div>
            {error && (
              <p className="mt-2 text-xs text-red-600" role="alert">
                {error}
              </p>
            )}
          </div>
        </aside>

        {/* Active step */}
        <div className="min-h-[360px] bg-white p-5 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-grey-olive">
            {step.label}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-taupe">
            {step.id === "delivery" && "How quickly do you need your order?"}
            {step.id === "color" && "Which color do you want?"}
            {step.id === "decoration" && "How should we decorate it?"}
            {step.id === "design" && "Do you already have artwork?"}
            {step.id === "sizes" && "Select sizes and quantity"}
            {step.id === "contact" && "Where should we send your quote?"}
          </h3>

          <div className="mt-6">
            {step.id === "delivery" && (
              <div className="flex flex-wrap gap-2">
                {DELIVERY_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setDeliverySpeed(opt)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                      deliverySpeed === opt
                        ? "border-brand-accent bg-brand-accent-light text-taupe"
                        : "border-border bg-surface text-grey-olive hover:border-brand-accent/50",
                    )}
                  >
                    {opt}
                  </button>
                ))}
                <label className="mt-4 block w-full text-sm text-grey-olive">
                  Need-by date (optional)
                  <input
                    type="date"
                    value={needByDate}
                    onChange={(e) => setNeedByDate(e.target.value)}
                    className="mt-1 w-full max-w-xs rounded-lg border border-border px-3 py-2 text-base text-taupe outline-none focus:border-brand-accent md:text-sm"
                  />
                </label>
              </div>
            )}

            {step.id === "color" && (
              <div className="flex flex-wrap gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setColorName(c.name)}
                    className={cn(
                      "flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition-colors",
                      colorName === c.name
                        ? "border-brand-accent bg-brand-accent-light"
                        : "border-border hover:border-brand-accent/40",
                    )}
                  >
                    <span
                      className="h-5 w-5 rounded-full border border-black/10"
                      style={{ backgroundColor: c.hex || "#ddd" }}
                    />
                    {c.name}
                  </button>
                ))}
              </div>
            )}

            {step.id === "decoration" && (
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {product.decorationOptions.map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setDecorationMethod(method)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm font-medium capitalize",
                        decorationMethod === method
                          ? "border-brand-accent bg-brand-accent-light"
                          : "border-border bg-surface",
                      )}
                    >
                      {method}
                    </button>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-medium text-taupe">Locations</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {LOCATION_OPTIONS.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => toggleLocation(loc)}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-xs font-medium",
                          locations.includes(loc)
                            ? "border-brand-accent bg-brand-accent-light"
                            : "border-border",
                        )}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
                {decorationMethod !== "embroidery" && (
                  <label className="block text-sm text-grey-olive">
                    Number of print colors
                    <input
                      type="number"
                      min={1}
                      max={8}
                      value={inkColors}
                      onChange={(e) => setInkColors(Number(e.target.value) || 1)}
                      className="mt-1 w-24 rounded-lg border border-border px-3 py-2 text-base text-taupe outline-none focus:border-brand-accent md:text-sm"
                    />
                  </label>
                )}
              </div>
            )}

            {step.id === "design" && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: "I have artwork ready", value: true },
                    { label: "I need design help", value: false },
                  ].map((opt) => (
                    <button
                      key={String(opt.value)}
                      type="button"
                      onClick={() => setHasArtwork(opt.value)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm font-medium",
                        hasArtwork === opt.value
                          ? "border-brand-accent bg-brand-accent-light"
                          : "border-border bg-surface",
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <label className="block text-sm text-grey-olive">
                  Design notes
                  <textarea
                    value={designNotes}
                    onChange={(e) => setDesignNotes(e.target.value)}
                    rows={4}
                    placeholder="Logo colors, placement ideas, file types you have…"
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-base text-taupe outline-none focus:border-brand-accent md:text-sm"
                  />
                </label>
              </div>
            )}

            {step.id === "sizes" && (
              <div className="max-w-md space-y-2">
                {product.sizes.map((size) => (
                  <div
                    key={size}
                    className="flex items-center justify-between gap-4 rounded-lg border border-border px-3 py-2"
                  >
                    <span className="text-sm font-medium text-taupe">{size}</span>
                    <input
                      type="number"
                      min={0}
                      value={sizeQty[size] ?? 0}
                      onChange={(e) =>
                        setSizeQty((prev) => ({
                          ...prev,
                          [size]: Math.max(0, Number(e.target.value) || 0),
                        }))
                      }
                      className="w-20 rounded-md border border-border px-2 py-1.5 text-center text-base outline-none focus:border-brand-accent md:text-sm"
                    />
                  </div>
                ))}
                <p className="pt-2 text-sm text-grey-olive">
                  Total pieces: <strong className="text-taupe">{totalQty}</strong>
                </p>
              </div>
            )}

            {step.id === "contact" && (
              <div className="grid max-w-lg gap-3 sm:grid-cols-2">
                {(
                  [
                    ["name", "Full name", "text"],
                    ["email", "Email", "email"],
                    ["phone", "Phone", "tel"],
                    ["company", "Company", "text"],
                  ] as const
                ).map(([key, label, type]) => (
                  <label key={key} className="block text-sm text-grey-olive sm:col-span-1">
                    {label}
                    {(key === "name" || key === "email") && " *"}
                    <input
                      type={type}
                      required={key === "name" || key === "email"}
                      value={contact[key]}
                      onChange={(e) =>
                        setContact((prev) => ({ ...prev, [key]: e.target.value }))
                      }
                      className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-base text-taupe outline-none focus:border-brand-accent md:text-sm"
                    />
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Preview */}
        <aside className="hidden border-l border-border bg-[#efeae2] p-6 lg:block">
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div
              className="flex h-40 w-40 items-center justify-center rounded-2xl border border-border bg-white shadow-sm"
              style={{
                background: selectedColor?.hex
                  ? `linear-gradient(145deg, ${selectedColor.hex}, color-mix(in srgb, ${selectedColor.hex} 70%, #000))`
                  : undefined,
              }}
            >
              <Shirt
                size={64}
                className={
                  selectedColor?.hex && selectedColor.hex.toLowerCase() !== "#ffffff"
                    ? "text-white/90"
                    : "text-taupe/40"
                }
              />
            </div>
            <p className="mt-4 text-sm font-semibold text-taupe">{product.name}</p>
            <p className="mt-1 text-xs text-grey-olive">
              {colorName || "Select a color"}
              {decorationMethod ? ` · ${decorationMethod}` : ""}
            </p>
            {totalQty > 0 && (
              <p className="mt-2 text-xs text-grey-olive">{totalQty} pcs</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
