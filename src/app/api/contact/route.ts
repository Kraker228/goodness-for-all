import nodemailer from "nodemailer";
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

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT ?? 587);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const siteEmail = getSiteContent().settings.email;
  const to = process.env.CONTACT_TO ?? siteEmail;
  const from = process.env.SMTP_FROM ?? smtpUser;

  if (!smtpHost || !smtpUser || !smtpPass || !from) {
    return Response.json(
      { message: "Mail is nog niet geconfigureerd op de server." },
      { status: 500 },
    );
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const subject =
    kind === "partner"
      ? "Nieuw partnerformulier - Goodness for All"
      : "Nieuw contactformulier - Goodness for All";

  try {
    await transporter.sendMail({
      from,
      to,
      replyTo: email,
      subject,
      text: buildBody(kind, fields),
    });
  } catch (error) {
    console.error("Contact mail failed", error);
    return Response.json(
      { message: "Het versturen is mislukt. Probeer het later opnieuw." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
