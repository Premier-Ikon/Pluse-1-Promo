import { trustedIndustries } from "@/data/site";
import { Container } from "@/components/ui/Container";

export function TrustedBy() {
  const items = [...trustedIndustries, ...trustedIndustries];

  return (
    <section className="overflow-hidden border-b border-border bg-white py-6">
      <Container>
        <p className="text-eyebrow mb-4 text-center text-grey-olive">
          Trusted by businesses across every industry
        </p>

        {/* Static wrap on mobile — avoids marquee overflow */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 md:hidden">
          {trustedIndustries.map((industry) => (
            <span
              key={industry}
              className="text-xs font-medium text-silver sm:text-sm"
            >
              {industry}
            </span>
          ))}
        </div>

        <div className="relative hidden overflow-hidden md:block">
          <div className="animate-marquee flex w-max gap-12 lg:gap-16">
            {items.map((industry, i) => (
              <span
                key={`${industry}-${i}`}
                className="whitespace-nowrap text-sm font-medium text-silver lg:text-base"
              >
                {industry}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
