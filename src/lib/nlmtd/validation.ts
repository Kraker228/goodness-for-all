/**
 * Validatie van het aanmeldformulier. Gedeeld door client en (in fase 2)
 * server, zodat de regels op één plek staan.
 */

export type ContactInput = {
  naam: string;
  email: string;
  telefoon: string;
  akkoordVoorwaarden: boolean;
  machtigingIncasso: boolean;
};

export type FieldName = keyof ContactInput;

/** Volgorde waarin velden op de pagina staan, voor de focus op de eerste fout. */
export const FIELD_ORDER: FieldName[] = [
  "naam",
  "email",
  "telefoon",
  "akkoordVoorwaarden",
  "machtigingIncasso",
];

export const ERROR_MESSAGES: Record<FieldName, string> = {
  naam: "Vul je naam in.",
  email: "Vul een geldig e-mailadres in, bijvoorbeeld naam@bedrijf.nl.",
  telefoon: "Vul je telefoonnummer in, zodat we je kunnen bereiken over de levering.",
  akkoordVoorwaarden: "Ga akkoord met de algemene voorwaarden om verder te gaan.",
  machtigingIncasso: "Geef toestemming voor de automatische incasso om je abonnement af te sluiten.",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidName(naam: string): boolean {
  return naam.trim().length >= 2;
}

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

export function isValidPhone(telefoon: string): boolean {
  return telefoon.replace(/\D/g, "").length >= 8;
}

export type ValidationErrors = Partial<Record<FieldName, string>>;

export function validateContact(input: ContactInput): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!isValidName(input.naam)) errors.naam = ERROR_MESSAGES.naam;
  if (!isValidEmail(input.email)) errors.email = ERROR_MESSAGES.email;
  if (!isValidPhone(input.telefoon)) errors.telefoon = ERROR_MESSAGES.telefoon;
  if (input.akkoordVoorwaarden !== true) errors.akkoordVoorwaarden = ERROR_MESSAGES.akkoordVoorwaarden;
  if (input.machtigingIncasso !== true) errors.machtigingIncasso = ERROR_MESSAGES.machtigingIncasso;
  return errors;
}

/** Het eerste foute veld in paginavolgorde, of null als alles klopt. */
export function firstInvalidField(errors: ValidationErrors): FieldName | null {
  return FIELD_ORDER.find((field) => errors[field]) ?? null;
}
