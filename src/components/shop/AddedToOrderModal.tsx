"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Check, Package, X } from "lucide-react";
import { Button, ButtonNative } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  productName: string;
  productImage?: string;
  description?: string;
  keepBrowsingLabel?: string;
  onClose: () => void;
};

export function AddedToOrderModal({
  open,
  productName,
  productImage,
  description = "Keep browsing products, or head to your request anytime to review and submit.",
  keepBrowsingLabel = "Keep browsing",
  onClose,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="added-to-order-title"
    >
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/45 animate-[added-modal-backdrop_0.28s_ease-out_forwards]"
        onClick={onClose}
      />

      <div
        className={cn(
          "relative w-full max-w-md overflow-hidden rounded-2xl border border-border bg-white shadow-[0_24px_64px_rgba(0,0,0,0.18)]",
          "animate-[added-modal-in_0.38s_cubic-bezier(0.22,1,0.36,1)_forwards]",
        )}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-lg p-2 text-grey-olive transition hover:bg-surface hover:text-taupe"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="px-6 pb-6 pt-8 text-center sm:px-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-accent-light text-brand-accent-dark">
            <Check size={22} strokeWidth={2.25} />
          </div>

          <p className="mt-4 text-eyebrow text-brand-accent-dark">Added</p>
          <h2
            id="added-to-order-title"
            className="mt-1 text-xl font-bold tracking-tight text-taupe sm:text-2xl"
          >
            Added to your order request
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-grey-olive">
            {description}
          </p>

          <div className="mt-5 flex items-center gap-3 rounded-xl border border-border bg-surface px-3.5 py-3 text-left">
            <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-lg bg-[#efeae2]">
              {productImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={productImage}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-brand-accent-dark">
                  <Package size={18} strokeWidth={1.75} />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-taupe">
                {productName}
              </p>
              <p className="mt-0.5 text-xs text-grey-olive">
                Ready in your order request
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row-reverse">
            <Button href="/order-request" variant="primary" className="flex-1">
              Go to order request
            </Button>
            <ButtonNative
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              {keepBrowsingLabel}
            </ButtonNative>
          </div>

          <Link
            href="/apparel"
            onClick={onClose}
            className="mt-4 inline-flex text-xs font-medium text-grey-olive underline underline-offset-2 transition hover:text-taupe"
          >
            Back to all products
          </Link>
        </div>
      </div>
    </div>
  );
}
