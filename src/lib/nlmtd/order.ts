import {
  DEBIT_DAY_OF_MONTH,
  FIRST_DEBIT,
  FIRST_DELIVERY,
  NOTICE_DAYS,
  PRICE_CENTS,
} from "./config";
import { calculatePrice } from "./pricing";

/** Alles wat de samensteller verzamelt. */
export type OrderFormState = {
  perDelivery: number;
  frequency: number;
  naam: string;
  email: string;
  telefoon: string;
  allergieen: string;
  spreektAan: string[];
  spreektAanAnders: string;
  akkoordVoorwaarden: boolean;
  machtigingIncasso: boolean;
};

/**
 * Het bestelobject zoals het in fase 2 naar de server gaat. Veldnamen gelijk
 * aan het prototype. Bedragen in centen; de server rekent ze in fase 2 altijd
 * opnieuw uit en vertrouwt deze waarden niet.
 */
export type OrderPayload = {
  aangemaakt: string;
  naam: string;
  email: string;
  telefoon: string;
  allergieen: string;
  spreekt_aan: string[];
  maaltijden_per_levering: number;
  leveringen_per_maand: number;
  maaltijden_per_maand: number;
  prijs_per_maaltijd_cent: number;
  eerste_betaling_cent: number;
  maandbedrag_cent: number;
  eerste_levering: string;
  /** Restant van de eerste maand, af te schrijven rond 11 januari (0 bij 1x per maand). */
  rest_eerste_maand_cent: number;
  eerste_incasso: string;
  /** Dag van de maand waarop de maandelijkse incasso ongeveer plaatsvindt. */
  incassodag: number;
  opzegtermijn_dagen: number;
  akkoord_voorwaarden: boolean;
  machtiging_incasso: boolean;
};

export const INTEREST_OPTIONS = [
  "Gemak en tijd besparen",
  "Gezond eten",
  "Anderen helpen",
  "Anders",
] as const;

export function buildOrderPayload(state: OrderFormState, now: Date = new Date()): OrderPayload {
  const price = calculatePrice(state.perDelivery, state.frequency);
  const anders = state.spreektAanAnders.trim();

  return {
    aangemaakt: now.toISOString(),
    naam: state.naam.trim(),
    email: state.email.trim(),
    telefoon: state.telefoon.trim(),
    allergieen: state.allergieen.trim(),
    spreekt_aan: state.spreektAan.map((value) =>
      value === "Anders" ? (anders ? `Anders: ${anders}` : "Anders") : value,
    ),
    maaltijden_per_levering: price.perDelivery,
    leveringen_per_maand: price.frequency,
    maaltijden_per_maand: price.maaltijdenPerMaand,
    prijs_per_maaltijd_cent: PRICE_CENTS,
    eerste_betaling_cent: price.eersteBetalingCents,
    maandbedrag_cent: price.maandbedragCents,
    eerste_levering: FIRST_DELIVERY,
    rest_eerste_maand_cent: price.restEersteMaandCents,
    eerste_incasso: FIRST_DEBIT,
    incassodag: DEBIT_DAY_OF_MONTH,
    opzegtermijn_dagen: NOTICE_DAYS,
    akkoord_voorwaarden: state.akkoordVoorwaarden,
    machtiging_incasso: state.machtigingIncasso,
  };
}
