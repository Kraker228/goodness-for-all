"use client";

import { useRef, useState } from "react";
import type { SiteContent } from "@/lib/content";

type SubmitState = "idle" | "sending" | "sent" | "error";
type PartnerFormContent = SiteContent["forms"]["partner"];

export default function PartnerForm({ content }: { content: PartnerFormContent }) {
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
        kind: "partner",
        naam: formData.get("naam"),
        bedrijf: formData.get("bedrijf"),
        rol: formData.get("rol"),
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

  const inputCls =
    "w-full bg-white border border-evergreen p-4 font-body-md focus:ring-2 focus:ring-harvest-orange outline-none";
  const labelCls = "font-label-sm text-label-sm text-evergreen uppercase";
  const buttonText =
    state === "sending" ? content.sendingLabel : state === "sent" ? content.sentLabel : content.submitLabel;
  const firstRow = content.fields.slice(0, 2);
  const secondRow = content.fields.slice(2, 4);
  const messageField = content.fields[4];
  const fieldNames = ["naam", "bedrijf", "rol", "email"] as const;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {firstRow.map((field, index) => (
          <div className="flex flex-col gap-2" key={field.label}>
            <label className={labelCls} htmlFor={`partner-${fieldNames[index]}`}>
              {field.label}
            </label>
            <input
              className={inputCls}
              id={`partner-${fieldNames[index]}`}
              name={fieldNames[index]}
              placeholder={field.placeholder}
              required
              type={field.type}
            />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {secondRow.map((field, index) => (
          <div className="flex flex-col gap-2" key={field.label}>
            <label className={labelCls} htmlFor={`partner-${fieldNames[index + 2]}`}>
              {field.label}
            </label>
            <input
              className={inputCls}
              id={`partner-${fieldNames[index + 2]}`}
              name={fieldNames[index + 2]}
              placeholder={field.placeholder}
              required
              type={field.type}
            />
          </div>
        ))}
      </div>
      {messageField && (
        <div className="flex flex-col gap-2">
          <label className={labelCls} htmlFor="partner-bericht">
            {messageField.label}
          </label>
          <textarea
            className={inputCls}
            id="partner-bericht"
            name="bericht"
            placeholder={messageField.placeholder}
            required
            rows={4}
          />
        </div>
      )}
      <button
        className={`w-full md:w-auto text-evergreen px-12 py-5 font-cta text-cta transition-all cursor-pointer active:scale-95 ${
          state === "sent" ? "bg-asparagus" : "bg-harvest-orange hover:bg-secondary-container"
        } ${state === "sending" ? "opacity-50 pointer-events-none" : ""}`}
        type="submit"
        disabled={state !== "idle"}
      >
        {buttonText}
      </button>
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
