import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { services, getServiceById } from "@/data/services";
import { ServiceDetailContent } from "@/components/services/ServiceDetailContent";

type ServicePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.id }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceById(slug);
  if (!service) {
    return { title: "Service" };
  }
  return {
    title: service.title,
    description: service.pageIntro,
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceById(slug);
  if (!service) notFound();
  return <ServiceDetailContent service={service} />;
}
