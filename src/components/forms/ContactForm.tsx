"use client";

import { useRef, useState } from "react";
import type { SiteContent } from "@/lib/content";

type ContactFormContent = SiteContent["forms"]["contact"];
type SubmitState = "idle" | "sending" | "sent" | "error";

export default function ContactForm({ content }: { content: ContactFormContent }) {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    setState("sending");
    setMessage("");

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        kind: "contact",
        naam: formData.get("naam"),
        email: formData.get("email"),
        bericht: formData.get("bericht"),
      }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { message?: string } | null;
      setState("error");
      setMessage(data?.message ?? "Het versturen is mislukt. Probeer het later opnieuw.");
      return;
    }

    setState("sent");
    setMessage(content.sentLabel);
    form.reset();
    setTimeout(() => {
      setState("idle");
      setMessage("");
    }, 3000);
  }

  const labelCls =
    "block font-label-sm text-label-sm text-evergreen uppercase mb-2 transition-colors focus-within:text-harvest-orange";
  const inputCls =
    "w-full bg-pure-mist border-2 border-evergreen focus:outline-none focus:border-harvest-orange text-body-md font-body-md p-base placeholder-evergreen/30";
  const isBusy = state === "sending" || state === "sent";

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-base">
      {content.fields.map((field) => (
        <div className="group" key={field.id}>
          <label className={labelCls} htmlFor={field.id}>
            {field.label}
          </label>
          {field.type === "textarea" ? (
            <textarea
              className={inputCls}
              id={field.id}
              name={field.name}
              placeholder={field.placeholder}
              required
              rows={6}
            />
          ) : (
            <input
              className={inputCls}
              id={field.id}
              name={field.name}
              placeholder={field.placeholder}
              required
              type={field.type}
            />
          )}
        </div>
      ))}
      <div className="pt-4">
        <button
          className={`w-full md:w-auto font-cta text-cta px-12 py-4 uppercase border-2 border-evergreen transition-all duration-300 active:scale-95 ${
            state === "sent"
              ? "bg-asparagus text-evergreen"
              : "bg-harvest-orange text-evergreen hover:bg-evergreen hover:text-harvest-orange"
          } ${state === "sending" ? "opacity-50 pointer-events-none" : ""}`}
          type="submit"
          disabled={isBusy}
        >
          {state === "sending" ? "Versturen..." : state === "sent" ? content.sentLabel : content.submitLabel}
        </button>
      </div>
      {message && (
        <p
          aria-live="polite"
          className={`font-body-md text-body-md ${
            state === "error" ? "text-red-700" : "text-evergreen"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
