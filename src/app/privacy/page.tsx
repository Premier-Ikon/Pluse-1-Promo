import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${siteConfig.name}.`,
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="How Plus One Promo collects, uses, and protects your information."
      />

      <section className="py-12 md:py-16">
        <Container>
          <div className="prose-taupe mx-auto max-w-3xl space-y-6 text-sm leading-relaxed text-grey-olive md:text-base">
            <p>
              {siteConfig.name} respects your privacy. This policy describes
              how we handle information you provide when contacting us or
              requesting a quote through our website.
            </p>
            <div>
              <h2 className="text-lg font-semibold text-taupe">
                Information we collect
              </h2>
              <p className="mt-2">
                When you submit our contact form, we may collect your name,
                email address, company, phone number, project details, and any
                other information you choose to include in your message.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-taupe">
                How we use your information
              </h2>
              <p className="mt-2">
                We use this information to respond to inquiries, prepare quotes,
                and provide the promotional products and services you request.
                We do not sell your personal information to third parties.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-taupe">Contact</h2>
              <p className="mt-2">
                Questions about this policy? Email us at{" "}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="font-medium text-taupe underline-offset-2 hover:underline"
                >
                  {siteConfig.email}
                </a>
                .
              </p>
            </div>
            <p className="text-xs text-grey-olive">
              Last updated: July 2026
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
