"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function PageEnter({
  children,
  label,
  ready = true,
}: {
  children: React.ReactNode;
  label?: string;
  /** When false, keep the centered loader until data is ready. */
  ready?: boolean;
}) {
  const [showLoader, setShowLoader] = useState(true);
  const [loaderExiting, setLoaderExiting] = useState(false);
  const [contentReady, setContentReady] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    if (!ready || !showLoader) return;
    const hold = window.setTimeout(() => {
      setLoaderExiting(true);
      setContentReady(true);
    }, 280);
    return () => window.clearTimeout(hold);
  }, [ready, showLoader]);

  useEffect(() => {
    if (!loaderExiting) return;
    const done = window.setTimeout(() => setShowLoader(false), 360);
    return () => window.clearTimeout(done);
  }, [loaderExiting]);

  return (
    <div className="relative min-h-[calc(100dvh-4.5rem)]">
      {showLoader ? (
        <div
          className={cn(
            "absolute inset-0 z-20 flex flex-col items-center justify-center bg-surface",
            loaderExiting && "page-loader-exit",
          )}
          aria-busy="true"
          aria-live="polite"
        >
          <div className="page-loader-ring" />
          {label ? (
            <p className="mt-4 text-sm text-grey-olive">{label}</p>
          ) : null}
        </div>
      ) : null}
      {contentReady ? (
        <div className="page-content-enter">{children}</div>
      ) : null}
    </div>
  );
}
