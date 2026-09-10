import type { Metadata } from "next";
import { ContactPageContent } from "@/components/contact/ContactPageContent";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Plus One Promo for a free quote on custom merchandise, embroidery, print, gifts, and more. Clear quotes before production.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}
