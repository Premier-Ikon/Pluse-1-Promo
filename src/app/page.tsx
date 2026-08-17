import { Hero } from "@/components/home/Hero";
import { TrustedBy } from "@/components/home/TrustedBy";
import { ProductBento } from "@/components/home/ProductBento";
import { Services } from "@/components/home/Services";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Portfolio } from "@/components/home/Portfolio";
import { AtmosphereBand } from "@/components/home/AtmosphereBand";
import { Testimonials } from "@/components/home/Testimonials";
import { Stats } from "@/components/home/Stats";
import { CTA } from "@/components/home/CTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <ProductBento />
      <Services />
      <Stats />
      <HowItWorks />
      <Portfolio />
      <AtmosphereBand />
      <Testimonials />
      <CTA />
    </>
  );
}
