import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  children?: React.ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  children,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-border bg-surface py-16 md:py-24",
        className,
      )}
    >
      <div className="bg-hero-glow pointer-events-none absolute inset-0 opacity-80" />
      <Container className="relative">
        <div
          className={cn(
            "max-w-2xl",
            align === "center" && "mx-auto text-center",
          )}
        >
          {eyebrow && (
            <p className="text-eyebrow text-brand-accent-dark">{eyebrow}</p>
          )}
          <h1 className="mt-3 text-section-title text-taupe">{title}</h1>
          {description && (
            <p className="mt-4 text-sm leading-relaxed text-grey-olive md:text-base">
              {description}
            </p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </Container>
    </section>
  );
}
