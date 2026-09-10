import type { Metadata } from "next";
import { AboutPageContent } from "@/components/about/AboutPageContent";

export const metadata: Metadata = {
  title: "About",
  description:
    "Plus One Promo is a women-owned promotional partner with 15+ years of experience — helping every business get high-quality custom goods made to last at an affordable price.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
