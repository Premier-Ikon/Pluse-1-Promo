import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-border bg-surface py-12 md:py-24",
        className,
      )}
    >
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <div className="bg-hero-glow pointer-events-none absolute inset-0" />
      <Container className="relative">
        <div
          className={cn(
            "max-w-3xl",
            align === "center" && "mx-auto text-center",
          )}
        >
          {eyebrow && (
            <span className="inline-flex items-center rounded-full border border-border bg-white px-3 py-1 text-eyebrow text-grey-olive">
              {eyebrow}
            </span>
          )}
          <h1 className="text-section-title mt-4 text-taupe">{title}</h1>
          {description && (
            <p className="mt-5 text-base leading-relaxed text-grey-olive md:text-lg">
              {description}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
