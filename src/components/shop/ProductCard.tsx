"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Check, Shirt } from "lucide-react";
import type { CatalogProduct, ProductColor } from "@/lib/catalog";
import { formatPriceParts } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const MAX_SWATCHES = 8;

type Props = {
  product: CatalogProduct;
  className?: string;
  /** When set, card is selectable instead of linking to the product page. */
  selected?: boolean;
  onSelect?: () => void;
};

function ColorSwatch({
  color,
  selected,
  onSelect,
}: {
  color: ProductColor;
  selected: boolean;
  onSelect: () => void;
}) {
  const swatchSrc = color.swatchUrl || (!color.hex ? color.imageUrl : undefined);

  return (
    <button
      type="button"
      title={color.name}
      aria-label={`Preview ${color.name}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelect();
      }}
      className={cn(
        "relative h-3.5 w-3.5 shrink-0 overflow-hidden rounded-full border transition sm:h-4 sm:w-4",
        selected
          ? "border-brand-accent outline outline-1 outline-offset-1 outline-brand-accent"
          : "border-black/15 hover:border-taupe/50",
      )}
      style={{
        backgroundColor: color.hex || "#e8e4de",
      }}
    >
      {swatchSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={swatchSrc}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : null}
    </button>
  );
}

export function ProductCard({
  product,
  className,
  selected = false,
  onSelect,
}: Props) {
  const selectable = typeof onSelect === "function";
  const colors = product.colors || [];
  const initial =
    colors.find((c) => c.name === product.showcaseColor)?.name ||
    colors[0]?.name ||
    "";
  const [activeName, setActiveName] = useState(initial);

  const activeColor = useMemo(
    () => colors.find((c) => c.name === activeName) || colors[0],
    [colors, activeName],
  );

  const imageSrc =
    activeColor?.imageUrl ||
    product.imageThumbUrl ||
    product.imageUrl ||
    "";

  const visible = colors.slice(0, MAX_SWATCHES);
  const extra = Math.max(0, colors.length - visible.length);
  const price = formatPriceParts(product);
  const href = `/shop/${product.slug}`;

  const shellClass = cn(
    "group flex h-full flex-col overflow-visible rounded-2xl border bg-white transition-colors",
    selectable
      ? selected
        ? "border-brand-accent ring-2 ring-brand-accent/25"
        : "border-border hover:border-brand-accent/45"
      : "border-border hover:border-brand-accent/45",
    className,
  );

  const media = (
    <div className="relative aspect-[5/6] overflow-hidden rounded-t-2xl bg-white">
      {imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain p-3 sm:p-4"
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-white">
          <Shirt className="text-taupe/25" size={48} />
        </div>
      )}
      {selectable && selected && (
        <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-taupe px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm">
          <Check size={11} strokeWidth={2.5} />
          Selected
        </span>
      )}
    </div>
  );

  const details = (
    <>
      {colors.length > 0 && (
        <div className="mb-2.5 flex items-center gap-1.5 overflow-visible py-0.5">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5 overflow-visible">
            {visible.map((color) => (
              <ColorSwatch
                key={color.name}
                color={color}
                selected={color.name === activeColor?.name}
                onSelect={() => setActiveName(color.name)}
              />
            ))}
          </div>
          {extra > 0 && (
            <span className="shrink-0 text-[11px] font-medium text-grey-olive">
              +{extra}
            </span>
          )}
        </div>
      )}

      <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-taupe group-hover:text-brand-accent-dark">
        {product.name}
      </h3>

      <p className="mt-1 text-[11px] text-grey-olive sm:text-xs">
        {product.brand || product.category || "Plus One Promo"}
        {colors.length > 0
          ? ` | ${colors.length} color${colors.length === 1 ? "" : "s"}`
          : ""}
      </p>

      <div className="mt-auto flex items-end justify-between gap-3 pt-3">
        <div>
          {price.kind === "quote" ? (
            <p className="text-sm font-semibold text-taupe">Request quote</p>
          ) : (
            <>
              {price.kind === "from" && (
                <p className="text-[11px] leading-none text-grey-olive">From</p>
              )}
              <p
                className={cn(
                  "font-semibold tracking-tight text-taupe",
                  price.kind === "from" ? "mt-0.5 text-base" : "text-sm",
                )}
              >
                {price.amount}
              </p>
            </>
          )}
        </div>
        {product.sizes?.length ? (
          <p className="max-w-[40%] truncate text-right text-[10px] uppercase tracking-wide text-grey-olive/80">
            {product.sizes[0]}
            {product.sizes.length > 1
              ? `–${product.sizes[product.sizes.length - 1]}`
              : ""}
          </p>
        ) : null}
      </div>
    </>
  );

  if (selectable) {
    return (
      <div
        role="button"
        tabIndex={0}
        aria-pressed={selected}
        onClick={onSelect}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSelect();
          }
        }}
        className={cn(shellClass, "w-full cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/40")}
      >
        {media}
        <div className="flex flex-1 flex-col px-3.5 pb-4 pt-3 sm:px-4">
          {details}
        </div>
      </div>
    );
  }

  return (
    <article className={shellClass}>
      <Link href={href} className="relative block">
        {media}
      </Link>

      <div className="flex flex-1 flex-col px-3.5 pb-4 pt-3 sm:px-4">
        {colors.length > 0 && (
          <div className="mb-2.5 flex items-center gap-1.5 overflow-visible py-0.5">
            <div className="flex min-w-0 flex-wrap items-center gap-1.5 overflow-visible">
              {visible.map((color) => (
                <ColorSwatch
                  key={color.name}
                  color={color}
                  selected={color.name === activeColor?.name}
                  onSelect={() => setActiveName(color.name)}
                />
              ))}
            </div>
            {extra > 0 && (
              <span className="shrink-0 text-[11px] font-medium text-grey-olive">
                +{extra}
              </span>
            )}
          </div>
        )}

        <Link href={href} className="flex flex-1 flex-col">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-taupe group-hover:text-brand-accent-dark">
            {product.name}
          </h3>

          <p className="mt-1 text-[11px] text-grey-olive sm:text-xs">
            {product.brand || product.category || "Plus One Promo"}
            {colors.length > 0
              ? ` | ${colors.length} color${colors.length === 1 ? "" : "s"}`
              : ""}
          </p>

          <div className="mt-auto flex items-end justify-between gap-3 pt-3">
            <div>
              {price.kind === "quote" ? (
                <p className="text-sm font-semibold text-taupe">Request quote</p>
              ) : (
                <>
                  {price.kind === "from" && (
                    <p className="text-[11px] leading-none text-grey-olive">
                      From
                    </p>
                  )}
                  <p
                    className={cn(
                      "font-semibold tracking-tight text-taupe",
                      price.kind === "from" ? "mt-0.5 text-base" : "text-sm",
                    )}
                  >
                    {price.amount}
                  </p>
                </>
              )}
            </div>
            {product.sizes?.length ? (
              <p className="max-w-[40%] truncate text-right text-[10px] uppercase tracking-wide text-grey-olive/80">
                {product.sizes[0]}
                {product.sizes.length > 1
                  ? `–${product.sizes[product.sizes.length - 1]}`
                  : ""}
              </p>
            ) : null}
          </div>
        </Link>
      </div>
    </article>
  );
}
