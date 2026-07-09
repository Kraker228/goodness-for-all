import "server-only";

import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import crypto from "node:crypto";
import path from "node:path";

const CSV_HEADERS = [
  "ingediend_op",
  "vraag_1_organisatie",
  "vraag_2_aantal_doosjes",
  "vraag_2_totaal_maaltijden",
  "vraag_3_4_bevestiging_type",
  "vraag_3_4_bevestiging_antwoord",
  "vraag_5_keuze_type",
  "vraag_6_smaken",
  "vraag_7_opmerkingen",
  "vraag_8_voornaam",
  "vraag_8_achternaam",
  "vraag_8_telefoon",
  "bron",
] as const;

type CsvHeader = (typeof CSV_HEADERS)[number];

export type OrderSubmission = {
  organisatie: string;
  aantalDoosjes: number;
  totaalMaaltijden: number;
  bevestigingType: string;
  bevestigingStatus: boolean;
  keuzeType: string;
  smaken: string[];
  opmerkingen: string;
  voornaam: string;
  achternaam: string;
  telefoon: string;
  source?: string;
};

type OrderLogRow = Record<CsvHeader, string | number>;

type GithubContentResponse = {
  content?: string;
  encoding?: string;
  sha?: string;
};

type GoogleTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

type GoogleSpreadsheetResponse = {
  sheets?: Array<{
    properties?: {
      title?: string;
    };
  }>;
};

function requiredString(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${field} ontbreekt.`);
  }

  return value.trim();
}

function optionalString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function requiredNumber(value: unknown, field: string): number {
  const numberValue = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(numberValue) || numberValue <= 0) {
    throw new Error(`${field} is ongeldig.`);
  }

  return numberValue;
}

export function parseOrderSubmission(payload: unknown): OrderSubmission {
  if (!payload || typeof payload !== "object") {
    throw new Error("Geen formulierdata ontvangen.");
  }

  const record = payload as Record<string, unknown>;
  const smaken = Array.isArray(record.smaken)
    ? record.smaken.filter((flavor): flavor is string => typeof flavor === "string")
    : [];
  const bevestigingStatus = record.bevestigingStatus;

  if (typeof bevestigingStatus !== "boolean") {
    throw new Error("Bevestiging ontbreekt.");
  }

  return {
    organisatie: requiredString(record.organisatie, "Organisatie"),
    aantalDoosjes: requiredNumber(record.aantalDoosjes, "Aantal doosjes"),
    totaalMaaltijden: requiredNumber(record.totaalMaaltijden, "Totaal maaltijden"),
    bevestigingType: requiredString(record.bevestigingType, "Bevestigingstype"),
    bevestigingStatus,
    keuzeType: requiredString(record.keuzeType, "Keuzetype"),
    smaken,
    opmerkingen: optionalString(record.opmerkingen),
    voornaam: requiredString(record.voornaam, "Voornaam"),
    achternaam: requiredString(record.achternaam, "Achternaam"),
    telefoon: requiredString(record.telefoon, "Telefoon"),
    source: optionalString(record.source),
  };
}

function toCsvValue(value: string | number): string {
  const text = String(value);

  if (!/[",\n\r]/.test(text)) return text;

  return `"${text.replaceAll('"', '""')}"`;
}

function toCsvLine(row: OrderLogRow): string {
  return CSV_HEADERS.map((header) => toCsvValue(row[header])).join(",");
}

function amsterdamTimestamp(date = new Date()): string {
  const parts = new Intl.DateTimeFormat("nl-NL", {
    timeZone: "Europe/Amsterdam",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}:${get("second")}`;
}

function toOrderRow(order: OrderSubmission): OrderLogRow {
  return {
    ingediend_op: amsterdamTimestamp(),
    vraag_1_organisatie: order.organisatie,
    vraag_2_aantal_doosjes: order.aantalDoosjes,
    vraag_2_totaal_maaltijden: order.totaalMaaltijden,
    vraag_3_4_bevestiging_type: order.bevestigingType,
    vraag_3_4_bevestiging_antwoord: order.bevestigingStatus ? "ja" : "nee",
    vraag_5_keuze_type: order.keuzeType,
    vraag_6_smaken: order.smaken.join(", "),
    vraag_7_opmerkingen: order.opmerkingen,
    vraag_8_voornaam: order.voornaam,
    vraag_8_achternaam: order.achternaam,
    vraag_8_telefoon: order.telefoon,
    bron: order.source ?? "",
  };
}

async function appendLocalCsv(line: string): Promise<string> {
  const filePath = path.join(process.cwd(), "content", "buurthuis-bestellingen.csv");

  await mkdir(path.dirname(filePath), { recursive: true });

  try {
    await readFile(filePath, "utf8");
  } catch {
    await writeFile(filePath, `${CSV_HEADERS.join(",")}\n`, "utf8");
  }

  await appendFile(filePath, `${line}\n`, "utf8");

  return filePath;
}

function getEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

function base64Url(value: string | Buffer): string {
  return Buffer.from(value)
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function getGooglePrivateKey(): string | undefined {
  const rawKey = getEnv("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY");
  const base64Key = getEnv("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY_BASE64");

  if (base64Key) {
    return Buffer.from(base64Key, "base64").toString("utf8");
  }

  return rawKey?.replaceAll("\\n", "\n");
}

async function getGoogleAccessToken(): Promise<string> {
  const clientEmail = getEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL");
  const privateKey = getGooglePrivateKey();

  if (!clientEmail || !privateKey) {
    throw new Error("Google Sheets service-account ontbreekt.");
  }

  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = base64Url(
    JSON.stringify({
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    }),
  );
  const unsignedToken = `${header}.${claim}`;
  const signature = crypto.createSign("RSA-SHA256").update(unsignedToken).sign(privateKey);
  const assertion = `${unsignedToken}.${base64Url(signature)}`;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  const payload = (await response.json().catch(() => null)) as GoogleTokenResponse | null;

  if (!response.ok || !payload?.access_token) {
    throw new Error(
      payload?.error_description ??
        payload?.error ??
        `Google OAuth token-aanvraag is mislukt (${response.status}).`,
    );
  }

  return payload.access_token;
}

function getGoogleSheetConfig(): { spreadsheetId: string; sheetName: string } | undefined {
  const spreadsheetId = getEnv("GOOGLE_SHEETS_SPREADSHEET_ID");

  if (!spreadsheetId) return undefined;

  return {
    spreadsheetId,
    sheetName: getEnv("GOOGLE_SHEETS_SHEET_NAME") ?? "Bestellingen",
  };
}

function getGoogleSheetsWebhookConfig(): { url: string; secret?: string } | undefined {
  const url = getEnv("GOOGLE_SHEETS_WEBHOOK_URL");

  if (!url) return undefined;

  return {
    url,
    secret: getEnv("GOOGLE_SHEETS_WEBHOOK_SECRET"),
  };
}

function toSheetValues(row: OrderLogRow): (string | number)[] {
  return CSV_HEADERS.map((header) => row[header]);
}

async function fetchSheetsApi(
  accessToken: string,
  url: string,
  init: RequestInit = {},
): Promise<Response> {
  return fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
}

async function ensureGoogleSheetHeaders(
  accessToken: string,
  spreadsheetId: string,
  sheetName: string,
): Promise<void> {
  const spreadsheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties.title`;
  const spreadsheet = await fetchSheetsApi(accessToken, spreadsheetUrl);

  if (!spreadsheet.ok) {
    throw new Error(`Google Sheets kon de spreadsheet niet lezen (${spreadsheet.status}).`);
  }

  const spreadsheetPayload = (await spreadsheet.json()) as GoogleSpreadsheetResponse;
  const sheetExists = spreadsheetPayload.sheets?.some(
    (sheet) => sheet.properties?.title === sheetName,
  );

  if (!sheetExists) {
    const create = await fetchSheetsApi(
      accessToken,
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
      {
        method: "POST",
        body: JSON.stringify({
          requests: [{ addSheet: { properties: { title: sheetName } } }],
        }),
      },
    );

    if (!create.ok) {
      throw new Error(`Google Sheets kon het tabblad niet aanmaken (${create.status}).`);
    }
  }

  const range = encodeURIComponent(`'${sheetName}'!A1:${String.fromCharCode(64 + CSV_HEADERS.length)}1`);
  const getUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`;
  const current = await fetchSheetsApi(accessToken, getUrl);

  if (!current.ok) {
    throw new Error(`Google Sheets kon de header niet lezen (${current.status}).`);
  }

  const payload = (await current.json()) as { values?: string[][] };
  const hasHeaders = payload.values?.[0]?.some(Boolean);

  if (hasHeaders) return;

  const updateUrl = `${getUrl}?valueInputOption=RAW`;
  const update = await fetchSheetsApi(accessToken, updateUrl, {
    method: "PUT",
    body: JSON.stringify({ values: [CSV_HEADERS] }),
  });

  if (!update.ok) {
    throw new Error(`Google Sheets kon de header niet schrijven (${update.status}).`);
  }
}

async function appendGoogleSheetRow(row: OrderLogRow): Promise<string> {
  const config = getGoogleSheetConfig();

  if (!config) {
    throw new Error("GOOGLE_SHEETS_SPREADSHEET_ID ontbreekt.");
  }

  const accessToken = await getGoogleAccessToken();
  await ensureGoogleSheetHeaders(accessToken, config.spreadsheetId, config.sheetName);

  const range = encodeURIComponent(`'${config.sheetName}'!A:M`);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;
  const response = await fetchSheetsApi(accessToken, url, {
    method: "POST",
    body: JSON.stringify({ values: [toSheetValues(row)] }),
  });

  if (!response.ok) {
    throw new Error(`Google Sheets kon de bestelling niet opslaan (${response.status}).`);
  }

  return `Google Sheets ${config.spreadsheetId}/${config.sheetName}`;
}

async function appendGoogleSheetsWebhookRow(row: OrderLogRow): Promise<string> {
  const config = getGoogleSheetsWebhookConfig();

  if (!config) {
    throw new Error("GOOGLE_SHEETS_WEBHOOK_URL ontbreekt.");
  }

  const response = await fetch(config.url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret: config.secret,
      headers: CSV_HEADERS,
      row,
      values: toSheetValues(row),
    }),
  });

  if (!response.ok) {
    throw new Error(`Google Sheets webhook kon de bestelling niet opslaan (${response.status}).`);
  }

  return "Google Sheets webhook";
}

async function appendGithubCsv(line: string, attempt = 1): Promise<string> {
  const token = getEnv("ORDER_LOG_GITHUB_TOKEN");

  if (!token) {
    throw new Error("ORDER_LOG_GITHUB_TOKEN ontbreekt.");
  }

  const repo = getEnv("ORDER_LOG_GITHUB_REPO") ?? "Kraker228/goodness-for-all";
  const branch = getEnv("ORDER_LOG_GITHUB_BRANCH") ?? "master";
  const filePath = getEnv("ORDER_LOG_GITHUB_PATH") ?? "content/buurthuis-bestellingen.csv";
  const url = `https://api.github.com/repos/${repo}/contents/${filePath}`;
  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const current = await fetch(`${url}?ref=${encodeURIComponent(branch)}`, { headers });
  let existing = "";
  let sha: string | undefined;

  if (current.ok) {
    const payload = (await current.json()) as GithubContentResponse;
    sha = payload.sha;

    if (payload.content && payload.encoding === "base64") {
      existing = Buffer.from(payload.content, "base64").toString("utf8");
    }
  } else if (current.status !== 404) {
    throw new Error(`GitHub kon het logbestand niet lezen (${current.status}).`);
  }

  const prefix = existing.trim() ? existing.replace(/\s*$/, "\n") : `${CSV_HEADERS.join(",")}\n`;
  const content = Buffer.from(`${prefix}${line}\n`, "utf8").toString("base64");
  const update = await fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      branch,
      content,
      message: "Log buurthuis bestelling",
      sha,
    }),
  });

  if (update.status === 409 && attempt < 3) {
    return appendGithubCsv(line, attempt + 1);
  }

  if (!update.ok) {
    throw new Error(`GitHub kon het logbestand niet bijwerken (${update.status}).`);
  }

  return `${repo}/${filePath}`;
}

export async function logOrderSubmission(order: OrderSubmission): Promise<{
  location: string;
  row: OrderLogRow;
}> {
  const row = toOrderRow(order);
  const line = toCsvLine(row);
  const location = getGoogleSheetsWebhookConfig()
    ? await appendGoogleSheetsWebhookRow(row)
    : getGoogleSheetConfig()
    ? await appendGoogleSheetRow(row)
    : process.env.NODE_ENV === "production" || getEnv("ORDER_LOG_GITHUB_TOKEN")
      ? await appendGithubCsv(line)
      : await appendLocalCsv(line);

  console.info("Buurthuis bestelling gelogd", row);

  return { location, row };
}
