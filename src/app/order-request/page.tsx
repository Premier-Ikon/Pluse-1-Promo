"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Trash2 } from "lucide-react";
import { useOrderRequestCart } from "@/components/order/OrderRequestCartProvider";
import { ShippingAddressSelect } from "@/components/order/ShippingAddressSelect";
import { cartItemQty } from "@/lib/orderRequestCart";
import {
  clearOrderRequestDraft,
  minNeedByDate,
  readOrderRequestDraft,
  timelineFromNeedBy,
  writeOrderRequestDraft,
} from "@/lib/orderRequestDraft";
import {
  submitOrderRequest,
  type OrderRequestPayload,
} from "@/lib/catalog";
import {
  formatCustomerAddress,
  getDefaultShippingAddress,
  getShippingAddressOptions,
  useCustomerAuth,
} from "@/lib/customerAuth";
import { Button, ButtonNative } from "@/components/ui/Button";
import { ArtworkAttachmentCard } from "@/components/ui/ArtworkAttachmentCard";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

const TIMELINE_OPTIONS = [
  {
    id: "rush" as const,
    label: "Rush",
    optionLabel: "Rush (5–7 days)",
    hint: "About 5–7 days — faster when the calendar allows",
  },
  {
    id: "standard" as const,
    label: "Standard",
    optionLabel: "Standard (10–14 days)",
    hint: "About 10–14 days — typical production window",
  },
  {
    id: "flexible" as const,
    label: "Flexible",
    optionLabel: "Flexible",
    hint: "More than two weeks — room to plan production",
  },
];

export default function OrderRequestPage() {
  const { items, removeItem, clear, totalQty, ready: cartReady } =
    useOrderRequestCart();
  const { user, loading: authLoading } = useCustomerAuth();
  const [deliverySpeed, setDeliverySpeed] = useState("");
  const [needByDate, setNeedByDate] = useState("");
  const [shippingId, setShippingId] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [timelineSource, setTimelineSource] = useState<"quote" | "manual" | null>(
    null,
  );
  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [contactTouched, setContactTouched] = useState(false);
  const [dataReady, setDataReady] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [loaderExiting, setLoaderExiting] = useState(false);
  const [contentReady, setContentReady] = useState(false);

  const earliestNeedBy = useMemo(() => minNeedByDate(), []);
  const autoTimeline = useMemo(
    () => (needByDate ? timelineFromNeedBy(needByDate) : null),
    [needByDate],
  );

  useEffect(() => {
    function applyDraft() {
      const draft = readOrderRequestDraft();
      if (!draft) return;
      if (draft.needByDate) setNeedByDate(draft.needByDate);
      if (draft.specialInstructions) {
        setSpecialInstructions(draft.specialInstructions);
      }
      if (draft.source === "quote" || draft.needByDate) {
        setTimelineSource(draft.source === "quote" ? "quote" : "manual");
      }
    }

    applyDraft();
    window.addEventListener("p1p-order-draft-change", applyDraft);
    window.addEventListener("storage", applyDraft);
    return () => {
      window.removeEventListener("p1p-order-draft-change", applyDraft);
      window.removeEventListener("storage", applyDraft);
    };
  }, []);

  useEffect(() => {
    if (!autoTimeline) {
      setDeliverySpeed("");
      return;
    }
    const match = TIMELINE_OPTIONS.find((row) => row.id === autoTimeline.id);
    setDeliverySpeed(match?.optionLabel || autoTimeline.label);
  }, [autoTimeline]);

  useEffect(() => {
    if (!needByDate && !specialInstructions.trim()) return;
    writeOrderRequestDraft({
      needByDate: needByDate || undefined,
      deliverySpeed: autoTimeline?.label,
      specialInstructions: specialInstructions.trim() || undefined,
      source: timelineSource === "quote" ? "quote" : "manual",
    });
  }, [needByDate, specialInstructions, autoTimeline, timelineSource]);

  const shippingOptions = useMemo(
    () => getShippingAddressOptions(user),
    [user],
  );

  const selectedShipping = useMemo(
    () => shippingOptions.find((row) => row.id === shippingId) || null,
    [shippingOptions, shippingId],
  );

  useEffect(() => {
    if (cartReady && !authLoading) setDataReady(true);
  }, [cartReady, authLoading]);

  useEffect(() => {
    if (!dataReady || !showLoader) return;
    const minHold = window.setTimeout(() => {
      setLoaderExiting(true);
      setContentReady(true);
    }, 280);
    return () => window.clearTimeout(minHold);
  }, [dataReady, showLoader]);

  useEffect(() => {
    if (!loaderExiting) return;
    const doneTimer = window.setTimeout(() => setShowLoader(false), 360);
    return () => window.clearTimeout(doneTimer);
  }, [loaderExiting]);

  useEffect(() => {
    if (!user || contactTouched) return;
    setContact({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      company: user.company || "",
    });
  }, [user, contactTouched]);

  useEffect(() => {
    if (!shippingOptions.length) {
      setShippingId("");
      return;
    }
    setShippingId((prev) => {
      if (prev && shippingOptions.some((row) => row.id === prev)) return prev;
      return (
        getDefaultShippingAddress(user)?.id ||
        user?.defaultShippingAddressId ||
        shippingOptions[0].id
      );
    });
  }, [shippingOptions, user]);

  const estimate = useMemo(() => {
    return items.reduce((sum, item) => {
      const qty = cartItemQty(item);
      const base = item.basePrice ?? 0;
      return sum + base * qty;
    }, 0);
  }, [items]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!items.length) {
      setError("Add at least one product to your request.");
      return;
    }
    if (!needByDate || !autoTimeline || !deliverySpeed) {
      setError("Choose a need-by date so we can set the right timeline.");
      return;
    }
    if (shippingOptions.length && !selectedShipping) {
      setError("Choose a shipping destination.");
      return;
    }
    if (!contact.name.trim() || !contact.email.trim()) {
      setError("Please add your name and email.");
      return;
    }

    setSubmitting(true);

    const addressLine = formatCustomerAddress(selectedShipping);
    const notes = [
      specialInstructions.trim(),
      addressLine
        ? `Ship to (${selectedShipping?.label || "Destination"}): ${addressLine}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");

    const payload: OrderRequestPayload = {
      items: items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        productSlug: item.productSlug,
        imageUrl: item.imageUrl,
        variants: item.variants.map((v) => ({
          color: { name: v.colorName, hex: v.hex },
          sizes: v.sizes,
        })),
        decoration: item.decoration,
        design: item.design,
      })),
      delivery: {
        speed: deliverySpeed,
        needByDate: needByDate || undefined,
      },
      shipping: selectedShipping
        ? {
            id: selectedShipping.id,
            label: selectedShipping.label,
            line1: selectedShipping.line1,
            line2: selectedShipping.line2 || null,
            city: selectedShipping.city,
            state: selectedShipping.state,
            postalCode: selectedShipping.postalCode,
            country: selectedShipping.country || "US",
            formatted:
              selectedShipping.formatted ||
              formatCustomerAddress(selectedShipping),
          }
        : null,
      contact: {
        name: contact.name.trim(),
        email: contact.email.trim(),
        phone: contact.phone.trim() || undefined,
        company: contact.company.trim() || undefined,
      },
      estimatedTotal: estimate || undefined,
      specialInstructions: notes || undefined,
    };

    const result = await submitOrderRequest(payload);
    setSubmitting(false);
    if (!result.success) {
      setError(result.error || "Something went wrong.");
      return;
    }
    clear();
    clearOrderRequestDraft();
    setNeedByDate("");
    setDeliverySpeed("");
    setSpecialInstructions("");
    setTimelineSource(null);
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
            Order request submitted
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-grey-olive">
            {done} This is not a payment — we&apos;ll reply with a confirmed
            quote before anything goes into production.
          </p>
          <Button href="/apparel" variant="primary" className="mt-8">
            Back to apparel
          </Button>
        </Container>
      </section>
    );
  }

  return (
    <section className="relative min-h-[calc(100dvh-4.5rem)] bg-surface py-10 md:py-14">
      {showLoader ? (
        <div
          className={cn(
            "absolute inset-0 z-20 flex flex-col items-center justify-center bg-surface",
            loaderExiting && "page-loader-exit",
          )}
          aria-busy="true"
          aria-live="polite"
        >
          <div className="page-loader-ring" />
          <p className="mt-4 text-sm text-grey-olive">Loading your request…</p>
        </div>
      ) : null}

      {contentReady ? (
        <Container className="page-content-enter">
          <Link
            href="/apparel"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-grey-olive hover:text-taupe"
          >
            <ArrowLeft size={16} />
            Continue shopping
          </Link>

          <div className="mt-6 mb-8 max-w-2xl">
            <p className="text-eyebrow text-brand-accent-dark">Order request</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-taupe md:text-3xl">
              Your request
            </h1>
            <p className="mt-2 text-sm text-grey-olive md:text-base">
              Review products, set your timeline and destination, then send one
              quote request — no payment required.
            </p>
          </div>

          {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-14 text-center">
              <p className="text-sm text-grey-olive">
                Your order request is empty.
              </p>
              <Button href="/apparel" variant="secondary" className="mt-5">
                Browse apparel
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]"
            >
              <div className="space-y-4">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-2xl border border-border bg-white"
                  >
                    <div className="flex gap-4 p-4 sm:p-5">
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-[#efeae2]">
                        {item.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.imageUrl}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            {item.brand && (
                              <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-accent-dark">
                                {item.brand}
                              </p>
                            )}
                            <Link
                              href={`/shop/${item.productSlug}`}
                              className="text-sm font-semibold text-taupe hover:underline"
                            >
                              {item.productName}
                            </Link>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="rounded-lg p-2 text-grey-olive hover:bg-surface hover:text-taupe"
                            aria-label="Remove from request"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="mt-3 space-y-2">
                          {item.variants.map((v) => (
                            <div
                              key={v.colorName}
                              className="text-xs text-grey-olive"
                            >
                              <span className="inline-flex items-center gap-1.5 font-medium text-taupe">
                                <span
                                  className="h-2.5 w-2.5 rounded-full border border-black/10"
                                  style={{ backgroundColor: v.hex || "#ddd" }}
                                />
                                {v.colorName}
                              </span>
                              <span className="ml-2">
                                {v.sizes
                                  .map((s) => `${s.size} × ${s.qty}`)
                                  .join(" · ")}
                              </span>
                            </div>
                          ))}
                        </div>
                        <p className="mt-3 text-xs text-grey-olive">
                          {item.decoration.method}
                          {item.decoration.locations.length
                            ? ` · ${item.decoration.locations.join(", ")}`
                            : ""}
                          {" · "}
                          {item.design.hasArtwork
                            ? item.design.artworkUrl
                              ? "Artwork attached"
                              : "Artwork ready"
                            : "Needs design help"}
                          {" · "}
                          {cartItemQty(item)} pcs
                        </p>
                        {item.design.artworkUrl ? (
                          <ArtworkAttachmentCard
                            url={item.design.artworkUrl}
                            fileName="Artwork"
                            className="mt-3"
                          />
                        ) : null}
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <aside className="h-fit rounded-2xl border border-border bg-white p-5 md:p-6">
                <p className="text-sm font-semibold text-taupe">
                  Timeline & destination
                </p>
                <p className="mt-1 text-xs text-grey-olive">
                  {items.length} product{items.length === 1 ? "" : "s"} ·{" "}
                  {totalQty} pieces
                </p>

                <div className="mt-5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium text-grey-olive">
                      Need-by date *
                    </p>
                    {timelineSource === "quote" && needByDate ? (
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-brand-accent-dark">
                        From your quote
                      </span>
                    ) : null}
                  </div>
                  <input
                    type="date"
                    required
                    min={earliestNeedBy}
                    value={needByDate}
                    onChange={(e) => {
                      setNeedByDate(e.target.value);
                      setTimelineSource("manual");
                      setError(null);
                    }}
                    className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-taupe outline-none transition focus:border-brand-accent focus:bg-white"
                  />
                  {timelineSource === "quote" && needByDate ? (
                    <p className="mt-1.5 text-[11px] text-grey-olive">
                      Carried over from Build a quote — change it anytime if
                      needed.
                    </p>
                  ) : null}
                  <p className="mt-3 text-xs font-medium text-grey-olive">
                    Timeline (set from your date)
                  </p>
                  <div className="mt-2 grid gap-2">
                    {TIMELINE_OPTIONS.map((option) => {
                      const on = autoTimeline?.id === option.id;
                      return (
                        <div
                          key={option.id}
                          className={cn(
                            "rounded-xl border px-3 py-2.5 transition",
                            on
                              ? "border-brand-accent bg-brand-accent-light/60"
                              : "border-border bg-surface opacity-50",
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-semibold text-taupe">
                              {option.label}
                            </p>
                            {on ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-brand-accent-dark">
                                <Check size={10} strokeWidth={3} />
                                Selected
                              </span>
                            ) : null}
                          </div>
                          <p className="mt-0.5 text-[11px] leading-relaxed text-grey-olive">
                            {option.hint}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium text-grey-olive">
                      Shipping destination
                    </p>
                    {user ? (
                      <Link
                        href="/account?tab=settings"
                        className="text-[11px] font-medium text-brand-accent-dark underline underline-offset-2"
                      >
                        Manage addresses
                      </Link>
                    ) : null}
                  </div>

                  {shippingOptions.length ? (
                    <ShippingAddressSelect
                      options={shippingOptions}
                      value={shippingId}
                      onChange={setShippingId}
                      defaultId={user?.defaultShippingAddressId}
                    />
                  ) : (
                    <div className="mt-2 rounded-xl border border-dashed border-border bg-surface px-3.5 py-3">
                      <p className="text-xs leading-relaxed text-grey-olive">
                        {user
                          ? "No saved destinations yet. Add one in account settings to select it here."
                          : "Sign in to choose a saved shipping destination from your account."}
                      </p>
                      <Link
                        href={
                          user ? "/account?tab=settings" : "/account"
                        }
                        className="mt-2 inline-flex text-xs font-medium text-brand-accent-dark underline underline-offset-2"
                      >
                        {user ? "Add shipping address" : "Sign in"}
                      </Link>
                    </div>
                  )}
                </div>

                <div className="mt-5 grid gap-3">
                  {(
                    [
                      ["name", "Full name", "text"],
                      ["email", "Email", "email"],
                      ["phone", "Phone", "tel"],
                      ["company", "Company", "text"],
                    ] as const
                  ).map(([key, label, type]) => (
                    <label key={key} className="block text-xs text-grey-olive">
                      {label}
                      {(key === "name" || key === "email") && " *"}
                      <input
                        type={type}
                        required={key === "name" || key === "email"}
                        value={contact[key]}
                        onChange={(e) => {
                          setContactTouched(true);
                          setContact((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }));
                        }}
                        className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-taupe outline-none transition focus:border-brand-accent focus:bg-white"
                      />
                    </label>
                  ))}
                </div>

                <label className="mt-4 block text-xs text-grey-olive">
                  Special instructions
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    rows={3}
                    placeholder="Anything else we should know…"
                    className="mt-1 w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-taupe outline-none transition focus:border-brand-accent focus:bg-white"
                  />
                </label>

                {estimate > 0 && (
                  <p className="mt-5 text-sm text-taupe">
                    Est. garment subtotal{" "}
                    <span className="font-semibold">
                      {estimate.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </span>
                  </p>
                )}
                <p className="mt-1 text-[11px] text-grey-olive">
                  Estimate only — decoration & final quote after review.
                </p>

                {error && (
                  <p className="mt-3 text-sm text-red-600" role="alert">
                    {error}
                  </p>
                )}

                <ButtonNative
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="mt-5 w-full"
                  disabled={submitting}
                >
                  {submitting ? "Sending…" : "Submit order request"}
                </ButtonNative>
              </aside>
            </form>
          )}
        </Container>
      ) : null}
    </section>
  );
}
