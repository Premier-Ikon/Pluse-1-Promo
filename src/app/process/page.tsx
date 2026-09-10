import type { Metadata } from "next";
import { ProcessPageContent } from "@/components/process/ProcessPageContent";

export const metadata: Metadata = {
  title: "Process",
  description:
    "Learn how Plus One Promo works — from initial consultation to design, production, and delivery of your custom goods and print materials.",
};

export default function ProcessPage() {
  return <ProcessPageContent />;
}
