"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, Check, Trash2 } from "lucide-react";
import { useOrderRequestCart } from "@/components/order/OrderRequestCartProvider";
import { cartItemQty } from "@/lib/orderRequestCart";
import {
  submitOrderRequest,
  type OrderRequestPayload,
} from "@/lib/catalog";
import { Button, ButtonNative } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

const DELIVERY_OPTIONS = [
  "Standard (10–14 days)",
  "Rush (5–7 days)",
  "Urgent (3 days)",
  "Flexible",
];

export default function OrderRequestPage() {
  const { items, removeItem, clear, totalQty } = useOrderRequestCart();
  const [deliverySpeed, setDeliverySpeed] = useState("");
  const [needByDate, setNeedByDate] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [contact, setContact] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    if (!deliverySpeed) {
      setError("Choose a delivery timeline.");
      return;
    }
    if (!contact.name.trim() || !contact.email.trim()) {
      setError("Please add your name and email.");
      return;
    }

    setSubmitting(true);

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
      contact: {
        name: contact.name.trim(),
        email: contact.email.trim(),
        phone: contact.phone.trim() || undefined,
        company: contact.company.trim() || undefined,
      },
      estimatedTotal: estimate || undefined,
      specialInstructions: specialInstructions.trim() || undefined,
    };

    const result = await submitOrderRequest(payload);
    setSubmitting(false);
    if (!result.success) {
      setError(result.error || "Something went wrong.");
      return;
    }
    clear();
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
    <section className="bg-surface py-10 md:py-14">
      <Container>
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
            Review products, set your timeline, and send one quote request — no
            payment required.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-border bg-white px-6 py-14 text-center">
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
                          <div key={v.colorName} className="text-xs text-grey-olive">
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
                          ? "Artwork ready"
                          : "Needs design help"}
                        {" · "}
                        {cartItemQty(item)} pcs
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="h-fit rounded-2xl border border-border bg-white p-5 md:p-6">
              <p className="text-sm font-semibold text-taupe">
                Timeline & contact
              </p>
              <p className="mt-1 text-xs text-grey-olive">
                {items.length} product{items.length === 1 ? "" : "s"} ·{" "}
                {totalQty} pieces
              </p>

              <div className="mt-5">
                <p className="text-xs font-medium text-grey-olive">
                  How quickly do you need this?
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {DELIVERY_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setDeliverySpeed(opt)}
                      className={cn(
                        "rounded-lg border px-3 py-2 text-xs font-medium transition",
                        deliverySpeed === opt
                          ? "border-brand-accent bg-brand-accent-light/70 text-taupe"
                          : "border-border bg-surface text-grey-olive hover:border-brand-accent/40",
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <label className="mt-4 block text-xs text-grey-olive">
                  Need-by date (optional)
                  <input
                    type="date"
                    value={needByDate}
                    onChange={(e) => setNeedByDate(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm text-taupe outline-none focus:border-brand-accent"
                  />
                </label>
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
                      onChange={(e) =>
                        setContact((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                      className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm text-taupe outline-none focus:border-brand-accent"
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
                  className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm text-taupe outline-none focus:border-brand-accent"
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
    </section>
  );
}
