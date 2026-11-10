/**
 * Alle vaste waarden voor de NLMTD-abonnementspagina op één plek.
 * Bedragen staan in centen, datums als ISO-string.
 */

/** Prijs per maaltijd in het abonnement: €6, na 25% korting. */
export const PRICE_CENTS = 600;
/** Normale prijs per maaltijd: €8. */
export const NORMAL_PRICE_CENTS = 800;

export const MEALS_MIN = 2;
export const MEALS_MAX = 12;
export const MEALS_DEFAULT = 3;
/** Snelkeuzes voor het aantal maaltijden per levering. */
export const MEAL_CHIPS = [2, 3, 4, 6, 8, 12] as const;

/** Toegestane aantallen leveringen per maand. */
export const FREQUENCIES = [1, 2, 3, 4] as const;
export type Frequency = (typeof FREQUENCIES)[number];
export const FREQUENCY_DEFAULT: Frequency = 2;

/** Laatste moment om aan te melden: 15 december 2026, 23:59 Nederlandse tijd (CET, UTC+1). */
export const SIGNUP_DEADLINE = "2026-12-15T23:59:00+01:00";
/** Eerste levering: maandag 11 januari 2027. */
export const FIRST_DELIVERY = "2027-01-11";
/** Eerste maandelijkse incasso, als het abonnement doorgaat. */
export const FIRST_DEBIT = "2027-02-01";
/** Opzegtermijn in dagen. */
export const NOTICE_DAYS = 14;

export const CONTACT_EMAIL = "info@goodnessforall.nl";

/** True zolang aanmelden nog kan. */
export function isSignupOpen(now: Date = new Date()): boolean {
  return now.getTime() <= new Date(SIGNUP_DEADLINE).getTime();
}
