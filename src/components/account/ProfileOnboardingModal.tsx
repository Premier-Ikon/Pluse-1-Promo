"use client";

import { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import { AddressAutocomplete } from "@/components/account/AddressAutocomplete";
import { ButtonNative } from "@/components/ui/Button";
import {
  useCustomerAuth,
  type CustomerAddress,
} from "@/lib/customerAuth";

type Props = {
  open: boolean;
  onComplete: () => void;
};

export function ProfileOnboardingModal({ open, onComplete }: Props) {
  const { user, updateProfile } = useCustomerAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [addressQuery, setAddressQuery] = useState("");
  const [address, setAddress] = useState<CustomerAddress | null>(null);
  const [line2, setLine2] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !user) return;
    setName(user.name || "");
    setPhone(user.phone || "");
    setCompany(user.company || "");
    setAddress(user.address || null);
    setAddressQuery(user.address?.formatted || user.address?.line1 || "");
    setLine2(user.address?.line2 || "");
    setError("");
  }, [open, user]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || !user) return null;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!address?.line1 || !address.city || !address.state || !address.postalCode) {
      setError("Please select a confirmed address from the suggestions.");
      return;
    }
    setBusy(true);
    const result = await updateProfile({
      name: name.trim(),
      phone: phone.trim(),
      company: company.trim(),
      address: {
        ...address,
        line2: line2.trim() || null,
      },
    });
    setBusy(false);
    if (!result.ok) {
      setError(result.error || "Could not save your profile");
      return;
    }
    onComplete();
  }

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center bg-black/50 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-onboarding-title"
    >
      <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-border bg-white shadow-xl">
        <div className="border-b border-border px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-accent-light text-brand-accent-dark">
              <Building2 size={18} strokeWidth={1.75} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-eyebrow text-brand-accent-dark">Welcome</p>
              <h2
                id="profile-onboarding-title"
                className="mt-1 text-xl font-bold tracking-tight text-taupe"
              >
                Tell us about your business
              </h2>
              <p className="mt-1 text-sm text-grey-olive">
                One quick setup so quotes and order requests autofill next time.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 px-5 py-5 sm:px-6">
          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <label className="block text-sm">
            <span className="font-medium text-taupe">Full name</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-3 text-sm outline-none focus:border-brand-accent focus:bg-white"
              placeholder="Jordan Lee"
            />
          </label>

          <label className="block text-sm">
            <span className="font-medium text-taupe">Email</span>
            <input
              value={user.email}
              disabled
              className="mt-1.5 w-full rounded-xl border border-border bg-[#f7f4ef] px-3.5 py-3 text-sm text-grey-olive"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium text-taupe">Phone</span>
              <input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-3 text-sm outline-none focus:border-brand-accent focus:bg-white"
                placeholder="(555) 123-4567"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium text-taupe">Company</span>
              <input
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-3 text-sm outline-none focus:border-brand-accent focus:bg-white"
                placeholder="Your company"
              />
            </label>
          </div>

          <div className="text-sm">
            <span className="font-medium text-taupe">Business address</span>
            <div className="mt-1.5">
              <AddressAutocomplete
                value={addressQuery}
                onChange={setAddressQuery}
                onAddressResolved={setAddress}
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

          <ButtonNative
            type="submit"
            variant="primary"
            className="w-full"
            disabled={busy}
          >
            {busy ? "Saving…" : "Save & continue"}
          </ButtonNative>
        </form>
      </div>
    </div>
  );
}
