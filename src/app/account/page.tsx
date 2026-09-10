import type { Metadata } from "next";
import { AccountPageContent } from "@/components/account/AccountPageContent";

export const metadata: Metadata = {
  title: "Account",
  description:
    "Sign in to Plus One Promo to view past quote requests and track your orders.",
};

export default function AccountPage() {
  return <AccountPageContent />;
}
