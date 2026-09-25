"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = {
  value: string;
  label: string;
};

type Props = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  "aria-label"?: string;
};

export function BrandSelect({
  options,
  value,
  onChange,
  placeholder = "All brands",
  className,
  buttonClassName,
  "aria-label": ariaLabel = "Filter by brand",
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const selected =
    options.find((row) => row.value === value) ||
    options[0] ||
    ({ value: "", label: placeholder } as Option);

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

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex w-full min-w-[11.5rem] items-center gap-2 rounded-xl border bg-white py-2.5 pl-3.5 pr-4 text-left text-sm text-taupe transition",
          open
            ? "border-brand-accent shadow-sm"
            : "border-border hover:border-brand-accent/40",
          buttonClassName,
        )}
      >
        <span className="min-w-0 flex-1 truncate font-medium">
          {selected.label}
        </span>
        <ChevronDown
          size={16}
          className={cn(
            "ml-1 shrink-0 text-grey-olive transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-label={ariaLabel}
          className="absolute left-0 right-0 z-30 mt-2 max-h-64 overflow-auto rounded-xl border border-border bg-white p-1.5 shadow-[0_12px_32px_rgba(0,0,0,0.08)]"
        >
          {options.map((row) => {
            const isActive = row.value === selected.value;
            return (
              <li key={row.value || "all"} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(row.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition",
                    isActive
                      ? "bg-brand-accent-light text-taupe"
                      : "text-taupe hover:bg-surface",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                      isActive
                        ? "border-brand-accent-dark bg-brand-accent-dark text-white"
                        : "border-border bg-white",
                    )}
                  >
                    {isActive ? <Check size={10} strokeWidth={3} /> : null}
                  </span>
                  <span className="font-medium">{row.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
