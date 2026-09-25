import type { Metadata } from "next";
import { OrderRequestDetailContent } from "@/components/account/OrderRequestDetailContent";

export const metadata: Metadata = {
  title: "Order request",
  description: "View a past Plus One Promo quote or order request and reorder it.",
};

export default function OrderRequestDetailPage() {
  return <OrderRequestDetailContent />;
}
