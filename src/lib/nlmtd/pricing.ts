import {
  FREQUENCIES,
  MEALS_MAX,
  MEALS_MIN,
  NORMAL_PRICE_CENTS,
  PRICE_CENTS,
  type Frequency,
} from "./config";

export type PriceBreakdown = {
  /** Maaltijden per levering (m). */
  perDelivery: number;
  /** Leveringen per maand (f). */
  frequency: number;
  maaltijdenPerMaand: number;
  maandbedragCents: number;
  normaalPerMaandCents: number;
  besparingCents: number;
  /** Alleen de eerste levering, nu te betalen. */
  eersteBetalingCents: number;
};

export function isValidMealCount(m: unknown): m is number {
  return typeof m === "number" && Number.isInteger(m) && m >= MEALS_MIN && m <= MEALS_MAX;
}

export function isValidFrequency(f: unknown): f is Frequency {
  return typeof f === "number" && (FREQUENCIES as readonly number[]).includes(f);
}

/**
 * Rekent het abonnement uit. Eén pure functie, gebruikt door client en
 * (in fase 2) server. Gooit een fout bij ongeldige invoer.
 */
export function calculatePrice(m: number, f: number): PriceBreakdown {
  if (!isValidMealCount(m)) {
    throw new RangeError(`Aantal maaltijden per levering moet tussen ${MEALS_MIN} en ${MEALS_MAX} liggen.`);
  }
  if (!isValidFrequency(f)) {
    throw new RangeError(`Aantal leveringen per maand moet een van ${FREQUENCIES.join(", ")} zijn.`);
  }

  const maaltijdenPerMaand = m * f;
  const maandbedragCents = maaltijdenPerMaand * PRICE_CENTS;
  const normaalPerMaandCents = maaltijdenPerMaand * NORMAL_PRICE_CENTS;

  return {
    perDelivery: m,
    frequency: f,
    maaltijdenPerMaand,
    maandbedragCents,
    normaalPerMaandCents,
    besparingCents: normaalPerMaandCents - maandbedragCents,
    eersteBetalingCents: m * PRICE_CENTS,
  };
}

const euroFormatter = new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" });

/** Formatteert centen als bedrag, bijvoorbeeld 1800 wordt "€ 18,00". */
export function formatEuro(cents: number): string {
  // Intl gebruikt een vaste spatie (U+00A0) tussen € en bedrag; dat houden we zo,
  // zodat het teken nooit los van het bedrag op een nieuwe regel valt.
  return euroFormatter.format(cents / 100);
}

/** "1 maaltijd" of "3 maaltijden". */
export function mealsLabel(n: number): string {
  return `${n} ${n === 1 ? "maaltijd" : "maaltijden"}`;
}
