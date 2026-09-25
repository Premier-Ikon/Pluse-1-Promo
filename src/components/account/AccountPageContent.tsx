"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { AccountSettingsPanel } from "@/components/account/AccountSettingsPanel";
import { ProfileOnboardingModal } from "@/components/account/ProfileOnboardingModal";
import { Button, ButtonNative } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageEnter } from "@/components/ui/PageEnter";
import { ArtworkAttachmentCard } from "@/components/ui/ArtworkAttachmentCard";
import { collectDesigns } from "@/lib/designLibrary";
import { useCustomerAuth } from "@/lib/customerAuth";
import {
  formatOrderDate,
  itemPieceCount,
  statusLabel,
  type PastOrderRequest,
} from "@/lib/pastOrderRequest";
import { cn } from "@/lib/utils";
import {
  ClipboardList,
  LogOut,
  Mail,
  Package,
  RotateCcw,
  Settings,
  ShieldCheck,
  Sparkles,
  ChevronRight,
} from "lucide-react";

type AccountTab = "activity" | "settings";

function AccountShell({
  children,
  centered = false,
}: {
  children: React.ReactNode;
  centered?: boolean;
}) {
  return (
    <section
      className={cn(
        "relative flex min-h-[calc(100dvh-4.5rem)] flex-1 flex-col overflow-hidden bg-surface py-10 md:py-14",
        centered && "justify-center",
      )}
    >
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="bg-hero-glow pointer-events-none absolute inset-0 opacity-70" />
      <Container
        className={cn(
          "relative flex w-full flex-1 flex-col",
          centered && "justify-center",
        )}
      >
        {children}
      </Container>
    </section>
  );
}

function AccountInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, requestCode, verify, logout, fetchMyOrders } =
    useCustomerAuth();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [orders, setOrders] = useState<PastOrderRequest[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersReady, setOrdersReady] = useState(false);
  const [tab, setTab] = useState<AccountTab>("activity");

  const designs = useMemo(() => collectDesigns(orders), [orders]);
  const hasMagicLink = Boolean(
    searchParams.get("token") && searchParams.get("email"),
  );
  const pageReady =
    !loading &&
    !(hasMagicLink && !user && busy) &&
    (!user || ordersReady);

  useEffect(() => {
    const requested = searchParams.get("tab");
    if (requested === "settings") setTab("settings");
    else if (requested === "activity") setTab("activity");
  }, [searchParams]);

  useEffect(() => {
    const token = searchParams.get("token");
    const magicEmail = searchParams.get("email");
    if (!token || !magicEmail || user) return;

    let cancelled = false;
    (async () => {
      setBusy(true);
      setError("");
      const result = await verify({ email: magicEmail, token });
      if (cancelled) return;
      setBusy(false);
      if (!result.ok) {
        setError(result.error || "Magic link expired. Request a new code.");
        setEmail(magicEmail);
        setStep("code");
        return;
      }
      router.replace("/account");
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams, user, verify, router]);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setOrdersLoading(false);
      setOrdersReady(true);
      return;
    }
    setOrdersReady(false);
    let cancelled = false;
    (async () => {
      setOrdersLoading(true);
      try {
        const rows = (await fetchMyOrders()) as PastOrderRequest[];
        if (!cancelled) setOrders(rows);
      } finally {
        if (!cancelled) {
          setOrdersLoading(false);
          setOrdersReady(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, fetchMyOrders]);

  async function onRequestCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    const result = await requestCode(email.trim());
    setBusy(false);
    if (!result.ok) {
      setError(result.error || "Could not send sign-in email");
      return;
    }
    setMessage(result.message || "Check your email for a sign-in code.");
    setStep("code");
  }

  async function onVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const result = await verify({ email: email.trim(), code: code.trim() });
    setBusy(false);
    if (!result.ok) {
      setError(result.error || "Invalid code");
      return;
    }
  }

  if (!user) {
    return (
      <PageEnter ready={pageReady} label="Loading account…">
      <AccountShell centered>
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-2xl border border-border bg-white p-7 shadow-sm md:p-9">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-brand-accent-light text-brand-accent-dark">
              <Mail size={20} strokeWidth={1.75} />
            </div>
            <p className="mt-5 text-center text-eyebrow text-brand-accent-dark">
              Account
            </p>
            <h1 className="mt-2 text-center text-2xl font-bold tracking-tight text-taupe md:text-[1.75rem]">
              Sign in to track your quotes and past jobs
            </h1>
            <p className="mt-2 text-center text-sm leading-relaxed text-grey-olive">
              We&apos;ll email you a one-time code — no password needed.
            </p>

            {error && (
              <p className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}
            {message && (
              <p className="mt-5 rounded-xl border border-brand-accent/30 bg-brand-accent-light px-4 py-3 text-sm text-taupe">
                {message}
              </p>
            )}

            {step === "email" ? (
              <form onSubmit={onRequestCode} className="mt-7 space-y-4">
                <label className="block text-sm">
                  <span className="font-medium text-taupe">Email</span>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-3 text-sm outline-none transition focus:border-brand-accent focus:bg-white"
                    placeholder="you@company.com"
                  />
                </label>
                <ButtonNative
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={busy}
                >
                  {busy ? "Sending…" : "Email me a code"}
                </ButtonNative>
              </form>
            ) : (
              <form onSubmit={onVerifyCode} className="mt-7 space-y-4">
                <label className="block text-sm">
                  <span className="font-medium text-taupe">Email</span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-3 text-sm outline-none transition focus:border-brand-accent focus:bg-white"
                  />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-taupe">One-time code</span>
                  <input
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-3 text-center text-sm tracking-[0.28em] outline-none transition focus:border-brand-accent focus:bg-white"
                    placeholder="••••••"
                  />
                </label>
                <ButtonNative
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={busy}
                >
                  {busy ? "Signing in…" : "Sign in"}
                </ButtonNative>
                <button
                  type="button"
                  className="w-full text-sm text-grey-olive underline underline-offset-2"
                  onClick={() => {
                    setStep("email");
                    setCode("");
                    setError("");
                    setMessage("");
                  }}
                >
                  Use a different email
                </button>
              </form>
            )}

            <ul className="mt-8 space-y-2.5 border-t border-border pt-6">
              {[
                {
                  icon: ClipboardList,
                  text: "View past quote and order requests",
                },
                {
                  icon: Sparkles,
                  text: "Access past designs and artwork",
                },
                {
                  icon: RotateCcw,
                  text: "Reorder past jobs in a few clicks",
                },
                {
                  icon: ShieldCheck,
                  text: "Password-free sign-in with a secure code",
                },
              ].map((item) => (
                <li
                  key={item.text}
                  className="flex items-start gap-2.5 text-sm text-grey-olive"
                >
                  <item.icon
                    size={16}
                    className="mt-0.5 shrink-0 text-brand-accent-dark"
                    strokeWidth={1.75}
                  />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-6 text-center text-sm text-grey-olive">
            Need a quote first?{" "}
            <Link
              href="/quote"
              className="font-medium text-taupe underline underline-offset-2 transition hover:text-brand-accent-dark"
            >
              Build a Quote
            </Link>
          </p>
        </div>
      </AccountShell>
      </PageEnter>
    );
  }

  return (
    <PageEnter ready={pageReady} label="Loading account…">
      <ProfileOnboardingModal
        open={Boolean(user && !user.profileComplete)}
        onComplete={() => {
          /* user state updates via updateProfile */
        }}
      />
      <AccountShell>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-eyebrow text-brand-accent-dark">Your account</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-taupe md:text-3xl">
            Welcome back{user.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-1 text-sm text-grey-olive">{user.email}</p>
          {user.profileComplete && (user.company || user.phone) ? (
            <p className="mt-1 text-sm text-grey-olive">
              {[user.company, user.phone].filter(Boolean).join(" · ")}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button href="/quote" variant="secondary" size="sm">
            Build a Quote
          </Button>
          <ButtonNative
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void logout()}
          >
            <LogOut size={16} />
            Sign out
          </ButtonNative>
        </div>
      </div>

      <div
        className="mt-8 flex gap-1 rounded-xl border border-border bg-white p-1"
        role="tablist"
        aria-label="Account sections"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "activity"}
          onClick={() => {
            setTab("activity");
            router.replace("/account");
          }}
          className={cn(
            "inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition",
            tab === "activity"
              ? "bg-taupe text-white"
              : "text-grey-olive hover:bg-surface hover:text-taupe",
          )}
        >
          <Package size={16} />
          Activity
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "settings"}
          onClick={() => {
            setTab("settings");
            router.replace("/account?tab=settings");
          }}
          className={cn(
            "inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition",
            tab === "settings"
              ? "bg-taupe text-white"
              : "text-grey-olive hover:bg-surface hover:text-taupe",
          )}
        >
          <Settings size={16} />
          Settings
        </button>
      </div>

      {tab === "settings" ? (
        <div className="mt-8">
          <AccountSettingsPanel />
        </div>
      ) : (
        <>
      <div className="mt-10">
        <div className="mb-4 flex items-center gap-2">
          <Package size={18} className="text-brand-accent-dark" />
          <h2 className="text-lg font-semibold text-taupe">
            Quote & order requests
          </h2>
        </div>

        {ordersLoading ? (
          <p className="text-sm text-grey-olive">Loading your requests…</p>
        ) : !orders.length ? (
          <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-12 text-center">
            <p className="text-sm text-grey-olive">
              No requests yet. Start a quote and it will show up here.
            </p>
            <Button href="/quote" variant="primary" className="mt-5">
              Build a Quote
            </Button>
          </div>
        ) : (
          <ul className="space-y-3">
            {orders.map((order) => {
              const itemCount = order.items?.length || 0;
              const pieceCount =
                order.items?.reduce(
                  (sum, item) => sum + itemPieceCount(item),
                  0,
                ) || 0;
              return (
                <li key={order.id}>
                  <Link
                    href={`/account/orders/${order.id}`}
                    className="group block rounded-2xl border border-border bg-white p-5 transition hover:border-taupe/25 hover:shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-taupe">
                          Request {order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="mt-0.5 text-xs text-grey-olive">
                          Submitted {formatOrderDate(order.createdAt)}
                          {order.delivery?.needByDate
                            ? ` · Need by ${formatOrderDate(order.delivery.needByDate)}`
                            : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-brand-accent-light px-2.5 py-1 text-[11px] font-semibold text-brand-accent-dark">
                          {statusLabel(order.status)}
                        </span>
                        <ChevronRight
                          size={18}
                          className="text-grey-olive transition group-hover:text-taupe"
                          aria-hidden
                        />
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-grey-olive">
                      {itemCount} product{itemCount === 1 ? "" : "s"}
                      {pieceCount > 0
                        ? ` · ${pieceCount} piece${pieceCount === 1 ? "" : "s"}`
                        : ""}
                      {typeof order.estimatedTotal === "number"
                        ? ` · Est. $${order.estimatedTotal.toFixed(2)}`
                        : ""}
                    </p>
                    {!!order.items?.length && (
                      <ul className="mt-2 space-y-1 text-sm text-taupe">
                        {order.items.slice(0, 4).map((item, idx) => {
                          const qty = itemPieceCount(item);
                          return (
                            <li key={`${order.id}-${idx}`}>
                              {item.productName || "Product"}
                              {qty ? ` × ${qty}` : ""}
                            </li>
                          );
                        })}
                        {order.items.length > 4 && (
                          <li className="text-grey-olive">
                            +{order.items.length - 4} more
                          </li>
                        )}
                      </ul>
                    )}
                    <p className="mt-3 text-xs font-medium text-brand-accent-dark opacity-0 transition group-hover:opacity-100">
                      View details &amp; reorder
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="mt-12">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-brand-accent-dark" />
              <h2 className="text-lg font-semibold text-taupe">
                Design library
              </h2>
            </div>
            <p className="mt-1 text-sm text-grey-olive">
              Artwork from your past quote and order requests — ready to reuse.
            </p>
          </div>
        </div>

        {ordersLoading ? (
          <p className="text-sm text-grey-olive">Loading designs…</p>
        ) : !designs.length ? (
          <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-12 text-center">
            <p className="text-sm text-grey-olive">
              No uploaded designs yet. When you attach artwork to a quote, it
              will show up here.
            </p>
            <Button href="/quote" variant="primary" className="mt-5">
              Build a Quote
            </Button>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {designs.map((design) => (
              <li
                key={design.id}
                className="rounded-2xl border border-border bg-white p-4"
              >
                <ArtworkAttachmentCard url={design.url} />
                <div className="mt-3">
                  <p className="truncate text-sm font-semibold text-taupe">
                    {design.productName || "Uploaded artwork"}
                  </p>
                  <p className="mt-0.5 text-xs text-grey-olive">
                    From request {design.requestId.slice(0, 8).toUpperCase()}
                    {design.createdAt
                      ? ` · ${formatOrderDate(design.createdAt)}`
                      : ""}
                  </p>
                  {design.notes ? (
                    <p className="mt-2 line-clamp-2 text-xs text-grey-olive">
                      {design.notes}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
        </>
      )}
    </AccountShell>
    </PageEnter>
  );
}

function AccountLoaderFallback() {
  return (
    <div className="relative flex min-h-[calc(100dvh-4.5rem)] flex-1 flex-col">
      <div
        className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-surface"
        aria-busy="true"
        aria-live="polite"
      >
        <div className="page-loader-ring" />
        <p className="mt-4 text-sm text-grey-olive">Loading account…</p>
      </div>
    </div>
  );
}

export function AccountPageContent() {
  return (
    <Suspense fallback={<AccountLoaderFallback />}>
      <div className="flex flex-1 flex-col">
        <AccountInner />
      </div>
    </Suspense>
  );
}
