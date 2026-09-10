"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { ButtonNative } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type FormState = "idle" | "loading" | "success" | "error";

type ContactFormProps = {
  className?: string;
};

const CONTACT_API_URL =
  process.env.NEXT_PUBLIC_CONTACT_API_URL?.trim() ||
  "https://us-west1-plus-one-promo.cloudfunctions.net/contactFormP1P";

const fieldClass =
  "w-full rounded-lg border border-border bg-white px-4 py-3 text-base text-taupe outline-none transition-colors placeholder:text-grey-olive/60 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/25";

export function ContactForm({ className }: ContactFormProps) {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setFormState("loading");
    setErrorMessage("");

    const formData = new FormData(form);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      company: formData.get("company") as string,
      phone: formData.get("phone") as string,
      projectType: formData.get("projectType") as string,
      message: formData.get("message") as string,
    };

    try {
      const response = await fetch(CONTACT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          (result as { error?: string }).error || "Something went wrong",
        );
      }

      form.reset();
      setFormState("success");
    } catch (error) {
      setFormState("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to send message",
      );
    }
  }

  if (formState === "success") {
    return (
      <div
        className={cn(
          "flex flex-col items-center rounded-2xl border border-border bg-white px-6 py-12 text-center sm:px-10",
          className,
        )}
      >
        <CheckCircle size={40} className="text-brand-accent-dark" />
        <h3 className="mt-4 text-xl font-semibold text-taupe">
          Message sent
        </h3>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-grey-olive">
          Thanks for reaching out. We&apos;ll reply within one business day —
          check your inbox for a confirmation.
        </p>
        <ButtonNative
          variant="outline"
          size="sm"
          className="mt-6"
          onClick={() => setFormState("idle")}
        >
          Send another message
        </ButtonNative>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "rounded-2xl border border-border bg-white p-5 sm:p-8 md:p-10",
        className,
      )}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block text-sm font-medium text-taupe"
          >
            Full name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className={fieldClass}
            placeholder="Jane Smith"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-taupe"
          >
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={fieldClass}
            placeholder="jane@organization.com"
          />
        </div>
        <div>
          <label
            htmlFor="company"
            className="mb-1.5 block text-sm font-medium text-taupe"
          >
            Organization
          </label>
          <input
            id="company"
            name="company"
            type="text"
            className={fieldClass}
            placeholder="Business, church, team, etc."
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="mb-1.5 block text-sm font-medium text-taupe"
          >
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className={fieldClass}
            placeholder="(951) 696-0008"
          />
        </div>
      </div>

      <div className="mt-5">
        <label
          htmlFor="projectType"
          className="mb-1.5 block text-sm font-medium text-taupe"
        >
          Project type
        </label>
        <select id="projectType" name="projectType" className={fieldClass}>
          <option value="">Select a project type</option>
          <option value="custom-merchandise">Custom Merchandise</option>
          <option value="embroidery">Embroidered Goods</option>
          <option value="print-direct-mail">Print & Direct Mail</option>
          <option value="business-cards">Business Cards</option>
          <option value="postcards-mailers">Postcards & Mailers</option>
          <option value="eddm">EDDM Campaign</option>
          <option value="yard-signs">Yard Signs & Signage</option>
          <option value="corporate-gifting">Corporate Gifting</option>
          <option value="event-tradeshow">Event & Trade Show</option>
          <option value="company-store">Company Store</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="mt-5">
        <label
          htmlFor="message"
          className="mb-1.5 block text-sm font-medium text-taupe"
        >
          Tell us about your project *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={cn(fieldClass, "resize-none")}
          placeholder="What do you need, about how many, and when do you need it?"
        />
      </div>

      {formState === "error" && (
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={16} />
          {errorMessage}
        </div>
      )}

      <ButtonNative
        type="submit"
        variant="secondary"
        size="lg"
        className="mt-6 w-full"
        disabled={formState === "loading"}
      >
        {formState === "loading" ? (
          "Sending..."
        ) : (
          <>
            Request a quote
            <ArrowRight size={16} />
          </>
        )}
      </ButtonNative>
    </form>
  );
}
