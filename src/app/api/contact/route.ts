import { getSiteContent } from "@/lib/content";

export const runtime = "nodejs";

const MAX_FIELD_LENGTH = 5000;

type FormKind = "contact" | "partner";

type MailField = {
  label: string;
  value: string;
};

function readText(data: Record<string, unknown>, key: string): string {
  const value = data[key];
  return typeof value === "string" ? value.trim().slice(0, MAX_FIELD_LENGTH) : "";
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function buildFields(kind: FormKind, data: Record<string, unknown>): MailField[] {
  if (kind === "partner") {
    return [
      { label: "Naam", value: readText(data, "naam") },
      { label: "Bedrijf", value: readText(data, "bedrijf") },
      { label: "Rol", value: readText(data, "rol") },
      { label: "Email", value: readText(data, "email") },
      { label: "Bericht", value: readText(data, "bericht") },
    ];
  }

  return [
    { label: "Naam", value: readText(data, "naam") },
    { label: "Email", value: readText(data, "email") },
    { label: "Bericht", value: readText(data, "bericht") },
  ];
}

function buildBody(kind: FormKind, fields: MailField[]): string {
  const title =
    kind === "partner"
      ? "Nieuw partnerbericht via goodnessforall.nl"
      : "Nieuw contactbericht via goodnessforall.nl";

  return [
    title,
    "",
    ...fields.map((field) => `${field.label}: ${field.value || "-"}`),
  ].join("\n");
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildHtmlBody(kind: FormKind, fields: MailField[]): string {
  const title =
    kind === "partner"
      ? "Nieuw partnerbericht via goodnessforall.nl"
      : "Nieuw contactbericht via goodnessforall.nl";

  const rows = fields
    .map(
      (field) => `
        <tr>
          <th align="left" style="padding:8px 12px;border-bottom:1px solid #e5e5e5;">${escapeHtml(field.label)}</th>
          <td style="padding:8px 12px;border-bottom:1px solid #e5e5e5;">${escapeHtml(field.value || "-").replaceAll("\n", "<br>")}</td>
        </tr>`,
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;color:#173b2f;">
      <h1 style="font-size:20px;margin:0 0 16px;">${escapeHtml(title)}</h1>
      <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:720px;">
        ${rows}
      </table>
    </div>`;
}

export async function POST(request: Request) {
  const data = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!data) {
    return Response.json({ message: "Ongeldige aanvraag." }, { status: 400 });
  }

  const kind = readText(data, "kind") as FormKind;
  if (kind !== "contact" && kind !== "partner") {
    return Response.json({ message: "Onbekend formulier." }, { status: 400 });
  }

  const fields = buildFields(kind, data);
  const missing = fields.find((field) => field.value.length === 0);

  if (missing) {
    return Response.json({ message: `${missing.label} is verplicht.` }, { status: 400 });
  }

  const email = fields.find((field) => field.label === "Email")?.value ?? "";
  if (!validateEmail(email)) {
    return Response.json({ message: "Vul een geldig e-mailadres in." }, { status: 400 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const siteEmail = getSiteContent().settings.email;
  const to = process.env.CONTACT_TO ?? siteEmail;
  const from = process.env.RESEND_FROM ?? "Goodness for All <noreply@goodnessforall.nl>";

  if (!resendApiKey || !from) {
    return Response.json(
      { message: "Resend is nog niet geconfigureerd op de server." },
      { status: 500 },
    );
  }

  const subject =
    kind === "partner"
      ? "Nieuw partnerformulier - Goodness for All"
      : "Nieuw contactformulier - Goodness for All";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: [email],
        subject,
        text: buildBody(kind, fields),
        html: buildHtmlBody(kind, fields),
      }),
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { message?: string } | null;
      console.error("Resend mail failed", response.status, data);
      return Response.json(
        { message: "Het versturen is mislukt. Probeer het later opnieuw." },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("Resend mail failed", error);
    return Response.json(
      { message: "Het versturen is mislukt. Probeer het later opnieuw." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
