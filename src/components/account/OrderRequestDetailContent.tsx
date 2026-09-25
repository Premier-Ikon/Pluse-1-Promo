"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Button, ButtonNative } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageEnter } from "@/components/ui/PageEnter";
import { ArtworkAttachmentCard } from "@/components/ui/ArtworkAttachmentCard";
import { useOrderRequestCart } from "@/components/order/OrderRequestCartProvider";
import { useCustomerAuth } from "@/lib/customerAuth";
import {
  clearOrderRequestDraft,
  writeOrderRequestDraft,
} from "@/lib/orderRequestDraft";
import {
  formatOrderDate,
  formatShippingSummary,
  itemPieceCount,
  orderPieceCount,
  pastOrderToCartItems,
  statusLabel,
  type PastOrderRequest,
} from "@/lib/pastOrderRequest";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Package,
  RotateCcw,
} from "lucide-react";

function DetailLoaderFallback() {
  return (
    <div className="relative flex min-h-[calc(100dvh-4.5rem)] flex-1 flex-col">
      <div
        className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-surface"
        aria-busy="true"
        aria-live="polite"
      >
        <div className="page-loader-ring" />
        <p className="mt-4 text-sm text-grey-olive">Loading request…</p>
      </div>
    </div>
  );
}

function OrderRequestDetailInner() {
  const params = useParams();
  const router = useRouter();
  const orderId = String(params?.id || "");
  const { user, loading: authLoading, fetchMyOrders } = useCustomerAuth();
  const { replaceAll, ready: cartReady } = useOrderRequestCart();

  const [order, setOrder] = useState<PastOrderRequest | null>(null);
  const [loadState, setLoadState] = useState<"loading" | "ready" | "missing">(
    "loading",
  );
  const [reordering, setReordering] = useState(false);
  const [reorderError, setReorderError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/account");
      return;
    }
    if (!orderId) {
      setLoadState("missing");
      return;
    }

    let cancelled = false;
    (async () => {
      setLoadState("loading");
      const rows = (await fetchMyOrders()) as PastOrderRequest[];
      if (cancelled) return;
      const match = rows.find((row) => row.id === orderId) || null;
      setOrder(match);
      setLoadState(match ? "ready" : "missing");
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user, orderId, fetchMyOrders, router]);

  const pageReady =
    !authLoading && Boolean(user) && loadState !== "loading" && cartReady;

  const pieceCount = useMemo(
    () => (order ? orderPieceCount(order) : 0),
    [order],
  );

  const shippingLine = useMemo(
    () => formatShippingSummary(order?.shipping),
    [order],
  );

  const canReorder = useMemo(
    () => (order ? pastOrderToCartItems(order).length > 0 : false),
    [order],
  );

  function handleReorder() {
    if (!order) return;
    const items = pastOrderToCartItems(order);
    if (!items.length) {
      setReorderError(
        "This request doesn’t have enough product details to reorder automatically.",
      );
      return;
    }
    setReordering(true);
    setReorderError("");
    replaceAll(items);
    clearOrderRequestDraft();
    const notes = order.specialInstructions?.trim();
    if (notes) {
      writeOrderRequestDraft({
        specialInstructions: notes,
        source: "manual",
      });
    }
    router.push("/order-request");
  }

  if (loadState === "missing" && pageReady) {
    return (
      <PageEnter ready label="Loading request…">
        <section className="bg-surface py-16 md:py-24">
          <Container className="max-w-lg text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-accent-light text-brand-accent-dark">
              <Package size={22} />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-taupe">
              Request not found
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-grey-olive">
              That order request isn’t in your account, or the link may be out
              of date.
            </p>
            <Button href="/account" variant="primary" className="mt-8">
              Back to account
            </Button>
          </Container>
        </section>
      </PageEnter>
    );
  }

  const items = order?.items?.length
    ? order.items
    : order
      ? [
          {
            productId: order.productId,
            productName: order.productName,
            productSlug: order.productSlug,
            imageUrl: order.imageUrl,
            variants: [
              {
                color: order.color,
                sizes: order.sizes,
              },
            ],
            decoration: order.decoration,
            design: order.design,
          },
        ]
      : [];

  return (
    <PageEnter ready={pageReady && Boolean(order)} label="Loading request…">
      {order ? (
        <section className="relative min-h-[calc(100dvh-4.5rem)] bg-surface py-10 md:py-14">
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
          <div className="bg-hero-glow pointer-events-none absolute inset-0 opacity-70" />
          <Container className="relative">
            <Link
              href="/account"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-grey-olive hover:text-taupe"
            >
              <ArrowLeft size={16} />
              Back to account
            </Link>

            <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-eyebrow text-brand-accent-dark">
                  Order request
                </p>
                <h1 className="mt-2 text-2xl font-bold tracking-tight text-taupe md:text-3xl">
                  Request {order.id.slice(0, 8).toUpperCase()}
                </h1>
                <p className="mt-1 text-sm text-grey-olive">
                  Submitted {formatOrderDate(order.createdAt)}
                  {order.delivery?.needByDate
                    ? ` · Needed by ${formatOrderDate(order.delivery.needByDate)}`
                    : ""}
                </p>
              </div>
              <span className="rounded-full bg-brand-accent-light px-2.5 py-1 text-[11px] font-semibold text-brand-accent-dark">
                {statusLabel(order.status)}
              </span>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonNative
                type="button"
                variant="primary"
                disabled={!canReorder || reordering}
                onClick={handleReorder}
              >
                <RotateCcw size={16} />
                {reordering ? "Starting reorder…" : "Reorder this request"}
              </ButtonNative>
              <Button href="/quote" variant="outline">
                Build a new quote
              </Button>
            </div>
            {reorderError ? (
              <p className="mt-3 text-sm text-red-700">{reorderError}</p>
            ) : (
              <p className="mt-3 max-w-xl text-sm text-grey-olive">
                Reorder loads these products into a new order request so you can
                confirm timeline and shipping, then submit again.
              </p>
            )}

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-white px-5 py-4">
                <p className="text-xs font-medium uppercase tracking-wide text-grey-olive">
                  Products
                </p>
                <p className="mt-1 text-lg font-semibold text-taupe">
                  {items.length}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-white px-5 py-4">
                <p className="text-xs font-medium uppercase tracking-wide text-grey-olive">
                  Pieces
                </p>
                <p className="mt-1 text-lg font-semibold text-taupe">
                  {pieceCount || "—"}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-white px-5 py-4">
                <p className="text-xs font-medium uppercase tracking-wide text-grey-olive">
                  Est. total
                </p>
                <p className="mt-1 text-lg font-semibold text-taupe">
                  {typeof order.estimatedTotal === "number"
                    ? `$${order.estimatedTotal.toFixed(2)}`
                    : "—"}
                </p>
              </div>
            </div>

            <div className="mt-10">
              <h2 className="text-lg font-semibold text-taupe">What you ordered</h2>
              <ul className="mt-4 space-y-4">
                {items.map((item, index) => {
                  const qty = itemPieceCount(item);
                  const artworkUrl = item.design?.artworkUrl?.trim();
                  return (
                    <li
                      key={`${item.productId || "item"}-${index}`}
                      className="rounded-2xl border border-border bg-white p-5 md:p-6"
                    >
                      <div className="flex flex-col gap-5 sm:flex-row">
                        <div className="relative flex h-28 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl bg-surface sm:h-28 sm:w-28">
                          {item.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.imageUrl}
                              alt={item.productName || "Product"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="text-grey-olive">
                              <Package size={28} strokeWidth={1.5} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <h3 className="text-base font-semibold text-taupe">
                                {item.productName || "Product"}
                              </h3>
                              {item.brand ? (
                                <p className="mt-0.5 text-sm text-grey-olive">
                                  {item.brand}
                                </p>
                              ) : null}
                            </div>
                            {qty > 0 ? (
                              <p className="text-sm font-medium text-taupe">
                                {qty} piece{qty === 1 ? "" : "s"}
                              </p>
                            ) : null}
                          </div>

                          {(item.variants || []).length > 0 ? (
                            <ul className="mt-4 space-y-3">
                              {(item.variants || []).map((variant, vIdx) => {
                                const colorName =
                                  variant.color?.name ||
                                  variant.colorName ||
                                  "Color";
                                const hex = variant.color?.hex || variant.hex;
                                return (
                                  <li key={`${colorName}-${vIdx}`}>
                                    <div className="flex items-center gap-2 text-sm font-medium text-taupe">
                                      {hex ? (
                                        <span
                                          className="h-3.5 w-3.5 rounded-full border border-border"
                                          style={{ backgroundColor: hex }}
                                          aria-hidden
                                        />
                                      ) : null}
                                      {colorName}
                                    </div>
                                    <p className="mt-1 text-sm text-grey-olive">
                                      {(variant.sizes || [])
                                        .filter((row) => Number(row.qty) > 0)
                                        .map(
                                          (row) =>
                                            `${row.size} × ${row.qty}`,
                                        )
                                        .join(" · ") || "No sizes listed"}
                                    </p>
                                  </li>
                                );
                              })}
                            </ul>
                          ) : null}

                          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-grey-olive">
                            {item.decoration?.method ? (
                              <span>
                                Decoration:{" "}
                                <span className="text-taupe">
                                  {item.decoration.method}
                                </span>
                              </span>
                            ) : null}
                            {item.decoration?.locations?.length ? (
                              <span>
                                Placement:{" "}
                                <span className="text-taupe">
                                  {item.decoration.locations.join(", ")}
                                </span>
                              </span>
                            ) : null}
                            {typeof item.decoration?.colors === "number" &&
                            item.decoration.colors > 0 ? (
                              <span>
                                Colors:{" "}
                                <span className="text-taupe">
                                  {item.decoration.colors}
                                </span>
                              </span>
                            ) : null}
                          </div>

                          {item.design?.notes ? (
                            <p className="mt-3 text-sm leading-relaxed text-grey-olive">
                              Design notes: {item.design.notes}
                            </p>
                          ) : null}

                          {artworkUrl ? (
                            <ArtworkAttachmentCard
                              url={artworkUrl}
                              fileName="Artwork"
                              className="mt-4"
                            />
                          ) : null}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-white p-5 md:p-6">
                <h2 className="text-base font-semibold text-taupe">Timeline</h2>
                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="text-grey-olive">Speed</dt>
                    <dd className="mt-0.5 font-medium text-taupe">
                      {order.delivery?.speed || "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-grey-olive">Need by</dt>
                    <dd className="mt-0.5 font-medium text-taupe">
                      {formatOrderDate(order.delivery?.needByDate)}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-2xl border border-border bg-white p-5 md:p-6">
                <h2 className="text-base font-semibold text-taupe">Shipping</h2>
                {shippingLine ? (
                  <div className="mt-4 text-sm">
                    {order.shipping?.label ? (
                      <p className="font-medium text-taupe">
                        {order.shipping.label}
                      </p>
                    ) : null}
                    <p
                      className={cn(
                        "leading-relaxed text-grey-olive",
                        order.shipping?.label && "mt-1",
                      )}
                    >
                      {shippingLine}
                    </p>
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-grey-olive">
                    No shipping destination saved on this request.
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-border bg-white p-5 md:p-6">
                <h2 className="text-base font-semibold text-taupe">Contact</h2>
                <dl className="mt-4 space-y-2 text-sm text-taupe">
                  <div>{order.contact?.name || "—"}</div>
                  <div className="text-grey-olive">
                    {order.contact?.email || "—"}
                  </div>
                  {order.contact?.phone ? (
                    <div className="text-grey-olive">{order.contact.phone}</div>
                  ) : null}
                  {order.contact?.company ? (
                    <div className="text-grey-olive">
                      {order.contact.company}
                    </div>
                  ) : null}
                </dl>
              </div>

              <div className="rounded-2xl border border-border bg-white p-5 md:p-6">
                <h2 className="text-base font-semibold text-taupe">
                  Special instructions
                </h2>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-grey-olive">
                  {order.specialInstructions?.trim() ||
                    "None noted on this request."}
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-3 border-t border-border pt-8">
              <ButtonNative
                type="button"
                variant="primary"
                disabled={!canReorder || reordering}
                onClick={handleReorder}
              >
                <RotateCcw size={16} />
                {reordering ? "Starting reorder…" : "Reorder this request"}
              </ButtonNative>
              <Button href="/account" variant="outline">
                Back to account
              </Button>
            </div>
          </Container>
        </section>
      ) : null}
    </PageEnter>
  );
}

export function OrderRequestDetailContent() {
  return (
    <Suspense fallback={<DetailLoaderFallback />}>
      <div className="flex flex-1 flex-col">
        <OrderRequestDetailInner />
      </div>
    </Suspense>
  );
}
