"use client";

import { useState } from "react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { ButtonNative } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type FormState = "idle" | "loading" | "success" | "error";

type ContactFormProps = {
  className?: string;
};

/** Public Cloud Function URL (not a secret). Env var can override. */
const CONTACT_API_URL =
  process.env.NEXT_PUBLIC_CONTACT_API_URL?.trim() ||
  "https://us-west1-contact-form-404005.cloudfunctions.net/contactFormP1P";

export function ContactForm({ className }: ContactFormProps) {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("loading");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      company: formData.get("company") as string,
      phone: formData.get("phone") as string,
      projectType: formData.get("projectType") as string,
      message: formData.get("message") as string,
    };

    const endpoint = CONTACT_API_URL;

    try {
      const response = await fetch(endpoint, {
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

      setFormState("success");
      e.currentTarget.reset();
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
          "flex flex-col items-center rounded-2xl border border-border bg-white p-12 text-center",
          className,
        )}
      >
        <CheckCircle size={48} className="text-brand-accent" />
        <h3 className="mt-4 text-xl font-semibold text-taupe">
          Message sent successfully
        </h3>
        <p className="mt-2 text-sm text-grey-olive">
          Thank you for reaching out. We&apos;ll get back to you within one
          business day — check your inbox for a confirmation email.
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
        "rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-8 md:p-10",
        className,
      )}
    >
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-taupe">
            Full Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-base text-taupe outline-none transition-colors placeholder:text-grey-olive/60 focus:border-taupe focus:ring-1 focus:ring-taupe/20"
            placeholder="Jane Smith"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-taupe">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-base text-taupe outline-none transition-colors placeholder:text-grey-olive/60 focus:border-taupe focus:ring-1 focus:ring-taupe/20"
            placeholder="jane@company.com"
          />
        </div>
        <div>
          <label htmlFor="company" className="mb-1.5 block text-sm font-medium text-taupe">
            Company
          </label>
          <input
            id="company"
            name="company"
            type="text"
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-base text-taupe outline-none transition-colors placeholder:text-grey-olive/60 focus:border-taupe focus:ring-1 focus:ring-taupe/20"
            placeholder="Your Company"
          />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-taupe">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-base text-taupe outline-none transition-colors placeholder:text-grey-olive/60 focus:border-taupe focus:ring-1 focus:ring-taupe/20"
            placeholder="(951) 696-0008"
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="projectType" className="mb-1.5 block text-sm font-medium text-taupe">
          Project Type
        </label>
        <select
          id="projectType"
          name="projectType"
          className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-base text-taupe outline-none transition-colors focus:border-taupe focus:ring-1 focus:ring-taupe/20"
        >
          <option value="">Select a project type</option>
          <option value="branded-merchandise">Branded Merchandise</option>
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
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-taupe">
          Tell us about your project *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full resize-none rounded-lg border border-border bg-surface px-4 py-3 text-base text-taupe outline-none transition-colors placeholder:text-grey-olive/60 focus:border-taupe focus:ring-1 focus:ring-taupe/20"
          placeholder="What products are you interested in? What's your timeline and estimated quantity?"
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
        variant="primary"
        size="lg"
        className="mt-6 w-full"
        disabled={formState === "loading"}
      >
        {formState === "loading" ? (
          "Sending..."
        ) : (
          <>
            Send Message
            <Send size={18} />
          </>
        )}
      </ButtonNative>
    </form>
  );
}
