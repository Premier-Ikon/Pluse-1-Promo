"use client";

import { useEffect, useState } from "react";
import { MapPin, X } from "lucide-react";
import { AddressAutocomplete } from "@/components/account/AddressAutocomplete";
import { ButtonNative } from "@/components/ui/Button";
import type { CustomerAddress, ShippingAddress } from "@/lib/customerAuth";

type Props = {
  open: boolean;
  mode: "add" | "edit";
  initial?: ShippingAddress | null;
  onClose: () => void;
  onSave: (value: {
    id?: string;
    label: string;
    address: CustomerAddress;
  }) => Promise<{ ok: boolean; error?: string }>;
};

export function ShippingAddressModal({
  open,
  mode,
  initial,
  onClose,
  onSave,
}: Props) {
  const [label, setLabel] = useState("");
  const [addressQuery, setAddressQuery] = useState("");
  const [address, setAddress] = useState<CustomerAddress | null>(null);
  const [line2, setLine2] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setLabel(initial?.label || "");
    setAddress(initial || null);
    setAddressQuery(initial?.formatted || initial?.line1 || "");
    setLine2(initial?.line2 || "");
    setError("");
    setBusy(false);
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!label.trim()) {
      setError("Give this location a short name.");
      return;
    }
    if (!address?.line1 || !address.city || !address.state || !address.postalCode) {
      setError("Please select a confirmed address from the suggestions.");
      return;
    }
    setBusy(true);
    const result = await onSave({
      id: initial?.id,
      label: label.trim(),
      address: {
        ...address,
        line2: line2.trim() || null,
      },
    });
    setBusy(false);
    if (!result.ok) {
      setError(result.error || "Could not save this address");
      return;
    }
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center bg-black/50 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shipping-address-title"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-accent-light text-brand-accent-dark">
              <MapPin size={18} strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <p className="text-eyebrow text-brand-accent-dark">
                Shipping location
              </p>
              <h2
                id="shipping-address-title"
                className="mt-1 text-xl font-bold tracking-tight text-taupe"
              >
                {mode === "edit" ? "Edit address" : "Add shipping address"}
              </h2>
              <p className="mt-1 text-sm text-grey-olive">
                Save locations you ship to so quotes and orders can use them.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-grey-olive transition hover:bg-surface hover:text-taupe"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 px-5 py-5 sm:px-6">
          {error ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <label className="block text-sm">
            <span className="font-medium text-taupe">Location name</span>
            <input
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-3 text-sm outline-none focus:border-brand-accent focus:bg-white"
              placeholder="Warehouse, Office, Event venue…"
              maxLength={60}
            />
          </label>

          <div className="text-sm">
            <span className="font-medium text-taupe">Street address</span>
            <div className="mt-1.5">
              <AddressAutocomplete
                value={addressQuery}
                onChange={setAddressQuery}
                onAddressResolved={setAddress}
                placeholder="Start typing the shipping address"
              />
            </div>
          </div>

          <label className="block text-sm">
            <span className="font-medium text-taupe">
              Apt / suite (optional)
            </span>
            <input
              value={line2}
              onChange={(e) => setLine2(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-3 text-sm outline-none focus:border-brand-accent focus:bg-white"
              placeholder="Suite 200"
            />
          </label>

          {address?.city ? (
            <p className="rounded-xl border border-brand-accent/25 bg-brand-accent-light/50 px-3.5 py-2.5 text-xs text-taupe">
              Confirmed: {address.line1}
              {line2.trim() ? `, ${line2.trim()}` : ""}, {address.city},{" "}
              {address.state} {address.postalCode}
            </p>
          ) : null}

          <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
            <ButtonNative
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={busy}
            >
              Cancel
            </ButtonNative>
            <ButtonNative type="submit" variant="primary" disabled={busy}>
              {busy
                ? "Saving…"
                : mode === "edit"
                  ? "Save changes"
                  : "Add address"}
            </ButtonNative>
          </div>
        </form>
      </div>
    </div>
  );
}
