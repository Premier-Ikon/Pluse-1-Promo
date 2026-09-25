"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown, MapPin } from "lucide-react";
import {
  formatCustomerAddress,
  type ShippingAddress,
} from "@/lib/customerAuth";
import { cn } from "@/lib/utils";

type Props = {
  options: ShippingAddress[];
  value: string;
  onChange: (id: string) => void;
  defaultId?: string | null;
  className?: string;
};

export function ShippingAddressSelect({
  options,
  value,
  onChange,
  defaultId,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected = options.find((row) => row.id === value) || options[0] || null;

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!selected) return null;

  return (
    <div ref={rootRef} className={cn("relative mt-2", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-xl border bg-surface px-3 py-2.5 text-left transition",
          open
            ? "border-brand-accent bg-white shadow-sm"
            : "border-border hover:border-brand-accent/40",
        )}
      >
        <MapPin
          size={15}
          className="shrink-0 text-brand-accent-dark"
          strokeWidth={1.75}
        />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-taupe">
            {selected.label}
            {selected.id === defaultId ? (
              <span className="ml-1.5 text-[11px] font-normal text-brand-accent-dark">
                Default
              </span>
            ) : null}
          </span>
          <span className="mt-0.5 block truncate text-xs text-grey-olive">
            {selected.line1}, {selected.city}
          </span>
        </span>
        <ChevronDown
          size={16}
          className={cn(
            "shrink-0 text-grey-olive transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label="Shipping destinations"
          className="absolute left-0 right-0 z-30 mt-2 max-h-64 overflow-auto rounded-xl border border-border bg-white p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.08)]"
        >
          {options.map((row) => {
            const isActive = row.id === selected.id;
            return (
              <li key={row.id} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(row.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-start gap-2.5 rounded-lg px-3 py-2.5 text-left transition",
                    isActive
                      ? "bg-brand-accent-light text-taupe"
                      : "text-taupe hover:bg-surface",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                      isActive
                        ? "border-brand-accent-dark bg-brand-accent-dark text-white"
                        : "border-border bg-white",
                    )}
                  >
                    {isActive ? <Check size={10} strokeWidth={3} /> : null}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-1.5">
                      <span className="text-sm font-medium">{row.label}</span>
                      {row.id === defaultId ? (
                        <span className="rounded-full bg-white/80 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-accent-dark">
                          Default
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-grey-olive">
                      {formatCustomerAddress(row)}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      <p className="mt-2 rounded-xl border border-brand-accent/20 bg-brand-accent-light/40 px-3 py-2 text-xs leading-relaxed text-taupe">
        {formatCustomerAddress(selected)}
      </p>
    </div>
  );
}
