import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  light?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  light = false,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "text-eyebrow mb-3",
            light ? "text-brand-accent-light" : "text-brand-accent-dark",
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "text-section-title",
          light ? "text-parchment" : "text-taupe",
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed md:text-lg",
            light ? "text-silver" : "text-grey-olive",
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
