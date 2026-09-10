import type { Metadata } from "next";
import { ServicesPageContent } from "@/components/services/ServicesPageContent";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Plus One Promo services — custom merchandise, embroidered goods, print & direct mail, corporate gifting, events, and company store programs.",
};

export default function ServicesPage() {
  return <ServicesPageContent />;
}
