"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

function looksLikeHtml(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

/** Allow common product-spec tags; strip scripts and event handlers. */
export function sanitizeProductHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "");
}

export function ProductDescription({ description }: { description?: string }) {
  const [open, setOpen] = useState(false);
  const text = description?.trim();
  if (!text) return null;

  const isHtml = looksLikeHtml(text);

  return (
    <div className="border-t border-border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-taupe">Description</span>
        <ChevronDown
          size={18}
          className={cn(
            "shrink-0 text-grey-olive transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          open ? "max-h-[2000px] pb-5 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        {isHtml ? (
          <div
            className="product-description text-sm leading-relaxed text-grey-olive [&_li]:mt-1 [&_p]:mt-2 [&_p:first-child]:mt-0 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5"
            dangerouslySetInnerHTML={{ __html: sanitizeProductHtml(text) }}
          />
        ) : (
          <p className="text-sm leading-relaxed text-grey-olive whitespace-pre-line">
            {text}
          </p>
        )}
      </div>
    </div>
  );
}
