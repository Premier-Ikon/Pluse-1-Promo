"use client";

import { useEffect, useState } from "react";
import { ExternalLink, FileImage, X } from "lucide-react";
import {
  designFileLabel,
  isPreviewableImage,
} from "@/lib/designLibrary";
import { cn } from "@/lib/utils";

type Props = {
  url: string;
  fileName?: string;
  onRemove?: () => void;
  className?: string;
};

export function ArtworkAttachmentCard({
  url,
  fileName,
  onRemove,
  className,
}: Props) {
  const preview = isPreviewableImage(url);
  const label = fileName || designFileLabel(url);
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border border-border bg-white px-3 py-2.5",
          className,
        )}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-[#f7f4ef]"
          aria-label="Preview artwork"
        >
          {preview ? (
            <>
              {/* Fill letterbox with the image's own colors */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full scale-110 object-cover blur-[10px]"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className="relative h-full w-full object-contain p-1.5"
              />
            </>
          ) : (
            <span className="flex h-full w-full items-center justify-center">
              <FileImage
                size={18}
                className="text-brand-accent-dark"
                strokeWidth={1.5}
              />
            </span>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-taupe">{label}</p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-0.5 text-xs font-medium text-brand-accent-dark underline underline-offset-2"
          >
            View file
          </button>
        </div>

        {onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="shrink-0 rounded-md p-1.5 text-grey-olive hover:bg-surface hover:text-taupe"
            aria-label="Remove artwork"
          >
            <X size={16} />
          </button>
        ) : null}
      </div>

      {open ? (
        <ArtworkPreviewModal
          url={url}
          label={label}
          preview={preview}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}

export function ArtworkThumb({
  url,
  fileName,
  caption = "Artwork",
  className,
  size = "md",
}: {
  url: string;
  fileName?: string;
  caption?: string;
  className?: string;
  size?: "sm" | "md";
}) {
  const preview = isPreviewableImage(url);
  const label = fileName || designFileLabel(url);
  const [open, setOpen] = useState(false);
  const box = size === "sm" ? "h-20 w-16" : "h-24 w-20";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "group relative shrink-0 overflow-hidden rounded-xl border border-border bg-[#f7f4ef] text-left transition hover:border-brand-accent/50",
          box,
          className,
        )}
        aria-label={`Preview ${caption.toLowerCase()}`}
      >
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full scale-110 object-cover blur-[10px]"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt=""
              className="relative h-full w-full object-contain p-1.5 pb-5"
            />
          </>
        ) : (
          <span className="flex h-full w-full flex-col items-center justify-center gap-1 px-1 pb-4">
            <FileImage
              size={18}
              className="text-brand-accent-dark"
              strokeWidth={1.5}
            />
          </span>
        )}
        <span className="absolute inset-x-0 bottom-0 bg-black/50 px-1 py-0.5 text-center text-[9px] font-semibold uppercase tracking-wide text-white">
          {caption}
        </span>
      </button>

      {open ? (
        <ArtworkPreviewModal
          url={url}
          label={label}
          preview={preview}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}

function ArtworkPreviewModal({
  url,
  label,
  preview,
  onClose,
}: {
  url: string;
  label: string;
  preview: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Artwork preview"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-border bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
          <p className="truncate text-sm font-semibold text-taupe">{label}</p>
          <div className="flex items-center gap-1">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium text-brand-accent-dark hover:bg-surface"
            >
              Open
              <ExternalLink size={12} />
            </a>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-grey-olive hover:bg-surface hover:text-taupe"
              aria-label="Close preview"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="relative flex max-h-[75vh] min-h-[240px] items-center justify-center overflow-hidden bg-[#f7f4ef] p-4">
          {preview ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={label}
                className="relative max-h-[70vh] w-auto max-w-full object-contain"
              />
            </>
          ) : (
            <div className="relative rounded-xl bg-white/90 px-6 py-10 text-center">
              <FileImage
                size={40}
                className="mx-auto text-brand-accent-dark"
                strokeWidth={1.5}
              />
              <p className="mt-3 text-sm text-grey-olive">
                Preview isn&apos;t available for this file type.
              </p>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-accent-dark underline"
              >
                Open file
                <ExternalLink size={14} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
