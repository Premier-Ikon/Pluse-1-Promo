"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { LogOut, Package } from "lucide-react";
import { Button, ButtonNative } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { useCustomerAuth } from "@/lib/customerAuth";
import { cn } from "@/lib/utils";

type OrderRequestRow = {
  id: string;
  createdAt?: string;
  status?: string;
  estimatedTotal?: number;
  contact?: { name?: string; email?: string; company?: string };
  items?: Array<{
    productName?: string;
    quantity?: number;
    variants?: Array<{
      sizes?: Array<{ size?: string; qty?: number }>;
    }>;
  }>;
  delivery?: { speed?: string; needByDate?: string };
};

function itemPieceCount(item: NonNullable<OrderRequestRow["items"]>[number]) {
  if (typeof item.quantity === "number") return item.quantity;
  return (item.variants || []).reduce(
    (sum, variant) =>
      sum +
      (variant.sizes || []).reduce((s, row) => s + (Number(row.qty) || 0), 0),
    0,
  );
}

function statusLabel(status?: string) {
  const value = (status || "new").toLowerCase();
  if (value === "quoted") return "Quoted";
  if (value === "in_progress" || value === "in-progress") return "In progress";
  if (value === "completed" || value === "fulfilled") return "Completed";
  if (value === "cancelled" || value === "canceled") return "Cancelled";
  return "Received";
}

function formatDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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
  const [orders, setOrders] = useState<OrderRequestRow[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

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
      return;
    }
    let cancelled = false;
    (async () => {
      setOrdersLoading(true);
      try {
        const rows = (await fetchMyOrders()) as OrderRequestRow[];
        if (!cancelled) setOrders(rows);
      } finally {
        if (!cancelled) setOrdersLoading(false);
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

  if (loading) {
    return (
      <section className="bg-surface py-16 md:py-24">
        <Container className="max-w-lg text-center text-sm text-grey-olive">
          Loading account…
        </Container>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="bg-surface py-12 md:py-20">
        <Container className="max-w-md">
          <p className="text-eyebrow text-brand-accent-dark">Account</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-taupe md:text-3xl">
            Sign in to track your quotes
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-grey-olive">
            We&apos;ll email you a one-time code — no password needed.
          </p>

          {error && (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}
          {message && (
            <p className="mt-4 rounded-xl border border-brand-accent/30 bg-brand-accent-light px-4 py-3 text-sm text-taupe">
              {message}
            </p>
          )}

          {step === "email" ? (
            <form onSubmit={onRequestCode} className="mt-8 space-y-4">
              <label className="block text-sm">
                <span className="font-medium text-taupe">Email</span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-accent"
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
            <form onSubmit={onVerifyCode} className="mt-8 space-y-4">
              <label className="block text-sm">
                <span className="font-medium text-taupe">Email</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-accent"
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
                  className="mt-1.5 w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm tracking-[0.2em] outline-none focus:border-brand-accent"
                  placeholder="6-digit code"
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
                className="w-full text-sm text-grey-olive underline"
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

          <p className="mt-8 text-center text-sm text-grey-olive">
            Need a quote first?{" "}
            <Link href="/quote" className="font-medium text-taupe underline">
              Build a Quote
            </Link>
          </p>
        </Container>
      </section>
    );
  }

  return (
    <section className="bg-surface py-12 md:py-16">
      <Container>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-eyebrow text-brand-accent-dark">Your account</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-taupe md:text-3xl">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-grey-olive">{user.email}</p>
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
                  <li
                    key={order.id}
                    className="rounded-2xl border border-border bg-white p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-taupe">
                          Request {order.id.slice(0, 8).toUpperCase()}
                        </p>
                        <p className="mt-0.5 text-xs text-grey-olive">
                          Submitted {formatDate(order.createdAt)}
                          {order.delivery?.needByDate
                            ? ` · Need by ${formatDate(order.delivery.needByDate)}`
                            : ""}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                          "bg-brand-accent-light text-brand-accent-dark",
                        )}
                      >
                        {statusLabel(order.status)}
                      </span>
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
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Container>
    </section>
  );
}

export function AccountPageContent() {
  return (
    <Suspense
      fallback={
        <section className="bg-surface py-16 md:py-24">
          <Container className="max-w-lg text-center text-sm text-grey-olive">
            Loading account…
          </Container>
        </section>
      }
    >
      <AccountInner />
    </Suspense>
  );
}
