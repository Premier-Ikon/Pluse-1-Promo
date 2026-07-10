import { Hero } from "@/components/home/Hero";
import { TrustedBy } from "@/components/home/TrustedBy";
import { Services } from "@/components/home/Services";
import { Categories } from "@/components/home/Categories";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Portfolio } from "@/components/home/Portfolio";
import { Testimonials } from "@/components/home/Testimonials";
import { Stats } from "@/components/home/Stats";
import { CTA } from "@/components/home/CTA";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <Services />
      <Categories />
      <Stats />
      <HowItWorks />
      <Portfolio />
      <Testimonials />
      <CTA />
    </>
  );
}
