"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, FileImage } from "lucide-react";
import {
  collectDesigns,
  designFileLabel,
  isPreviewableImage,
  type DesignLibraryItem,
} from "@/lib/designLibrary";
import { useCustomerAuth } from "@/lib/customerAuth";
import { cn } from "@/lib/utils";

type Props = {
  selectedUrl?: string;
  onSelect: (design: DesignLibraryItem) => void;
  className?: string;
};

export function PastDesignPicker({
  selectedUrl,
  onSelect,
  className,
}: Props) {
  const { user, loading: authLoading, fetchMyOrders } = useCustomerAuth();
  const [designs, setDesigns] = useState<DesignLibraryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setDesigns([]);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const orders = await fetchMyOrders();
        if (!cancelled) {
          setDesigns(collectDesigns(orders as Parameters<typeof collectDesigns>[0]));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, fetchMyOrders]);

  if (authLoading) return null;

  if (!user) {
    return (
      <div
        className={cn(
          "rounded-xl border border-border bg-surface px-4 py-3 text-sm text-grey-olive",
          className,
        )}
      >
        <Link
          href="/account"
          className="font-medium text-taupe underline underline-offset-2 hover:text-brand-accent-dark"
        >
          Sign in
        </Link>{" "}
        to reuse artwork from past quotes.
      </div>
    );
  }

  if (loading) {
    return (
      <p className={cn("text-sm text-grey-olive", className)}>
        Loading your design library…
      </p>
    );
  }

  if (!designs.length) {
    return (
      <p className={cn("text-sm text-grey-olive", className)}>
        No past designs yet. Upload artwork below and it will appear in your
        library after you submit.
      </p>
    );
  }

  return (
    <div className={className}>
      <p className="text-sm font-medium text-taupe">Reuse a past design</p>
      <p className="mt-1 text-xs text-grey-olive">
        Pick artwork from a previous quote instead of uploading again.
      </p>
      <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {designs.map((design) => {
          const selected = selectedUrl === design.url;
          const preview = isPreviewableImage(design.url);
          return (
            <li key={design.id}>
              <button
                type="button"
                onClick={() => onSelect(design)}
                className={cn(
                  "group relative w-full overflow-hidden rounded-xl border bg-white text-left transition",
                  selected
                    ? "border-brand-accent ring-2 ring-brand-accent/25"
                    : "border-border hover:border-brand-accent/45",
                )}
              >
                <div className="relative aspect-square bg-[#f7f4ef]">
                  {preview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={design.url}
                      alt=""
                      className="h-full w-full object-contain p-2"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-1 px-2 text-center">
                      <FileImage
                        size={22}
                        className="text-brand-accent-dark"
                        strokeWidth={1.5}
                      />
                      <span className="line-clamp-2 text-[10px] font-medium text-taupe">
                        {designFileLabel(design.url)}
                      </span>
                    </div>
                  )}
                  {selected && (
                    <span className="absolute right-1.5 top-1.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-taupe text-white">
                      <Check size={12} strokeWidth={2.5} />
                    </span>
                  )}
                </div>
                <div className="border-t border-border px-2 py-1.5">
                  <p className="truncate text-[11px] font-medium text-taupe">
                    {design.productName || "Past artwork"}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
