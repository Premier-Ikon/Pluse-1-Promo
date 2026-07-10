import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Cache-bust when brand fill color changes (browser/CDN sticky PNGs). */
const SIGNET_SRC = "/brand/logo-mark-gold.png?v=original";
const WORDMARK_SRC = "/brand/wordmark-horizontal-web.png?v=1";

type LogoProps = {
  variant?: "header" | "footer" | "full";
  className?: string;
  href?: string;
};

export function Logo({
  variant = "header",
  className,
  href = "/",
}: LogoProps) {
  const content =
    variant === "full" ? (
      <Image
        src="/brand/logo-full.png?v=gold"
        alt="Plus One Promo"
        width={220}
        height={80}
        className={cn("h-10 w-auto md:h-11", className)}
        priority
      />
    ) : variant === "footer" ? (
      <div className={cn("flex items-center gap-2.5", className)}>
        <Image
          src={SIGNET_SRC}
          alt=""
          width={112}
          height={149}
          className="h-9 w-auto shrink-0"
          aria-hidden
          unoptimized
        />
        <Image
          src={WORDMARK_SRC}
          alt="Plus One Promo"
          width={140}
          height={40}
          className="h-9 w-auto max-w-[140px]"
          unoptimized
        />
      </div>
    ) : (
      <div className={cn("flex items-center gap-2", className)}>
        <Image
          src={SIGNET_SRC}
          alt=""
          width={112}
          height={149}
          className="h-8 w-auto shrink-0 md:h-9"
          priority
          aria-hidden
          unoptimized
        />
        <Image
          src={WORDMARK_SRC}
          alt="Plus One Promo"
          width={160}
          height={32}
          className="hidden h-7 w-auto sm:block md:h-8"
          priority
          unoptimized
        />
        <span className="text-sm font-bold tracking-tight text-black sm:hidden">
          Plus One
        </span>
      </div>
    );

  return (
    <Link href={href} className="inline-flex shrink-0 items-center">
      {content}
    </Link>
  );
}
