import { describe, expect, it } from "vitest";
import { calculatePrice, formatEuro, mealsLabel } from "./pricing";
import { isSignupOpen } from "./config";

// Intl zet een vaste spatie (U+00A0) tussen € en het bedrag.
const nbsp = (s: string) => s.replace(" ", " ");

describe("calculatePrice", () => {
  it("m=3, f=2: 6 maaltijden, € 36,00 per maand, € 18,00 nu", () => {
    const p = calculatePrice(3, 2);
    expect(p.maaltijdenPerMaand).toBe(6);
    expect(p.maandbedragCents).toBe(3600);
    expect(p.eersteBetalingCents).toBe(1800);
    expect(p.normaalPerMaandCents).toBe(4800);
    expect(p.besparingCents).toBe(1200);
    expect(p.restEersteMaandCents).toBe(1800);
    expect(formatEuro(p.maandbedragCents)).toBe(nbsp("€ 36,00"));
    expect(formatEuro(p.eersteBetalingCents)).toBe(nbsp("€ 18,00"));
  });

  it("m=5, f=4: 20 maaltijden, € 120,00 per maand, € 30,00 nu", () => {
    const p = calculatePrice(5, 4);
    expect(p.maaltijdenPerMaand).toBe(20);
    expect(p.maandbedragCents).toBe(12000);
    expect(p.eersteBetalingCents).toBe(3000);
    expect(p.besparingCents).toBe(4000);
    expect(p.restEersteMaandCents).toBe(9000);
    expect(formatEuro(p.maandbedragCents)).toBe(nbsp("€ 120,00"));
    expect(formatEuro(p.eersteBetalingCents)).toBe(nbsp("€ 30,00"));
  });

  it("1 keer per maand: geen restbedrag voor de eerste maand", () => {
    expect(calculatePrice(4, 1).restEersteMaandCents).toBe(0);
  });

  it("randen: 2 en 12 maaltijden, 1 en 4 keer per maand", () => {
    expect(calculatePrice(2, 1).maandbedragCents).toBe(1200);
    expect(calculatePrice(12, 4).maandbedragCents).toBe(28800);
  });

  it("weigert ongeldige invoer", () => {
    expect(() => calculatePrice(1, 2)).toThrow(RangeError);
    expect(() => calculatePrice(13, 2)).toThrow(RangeError);
    expect(() => calculatePrice(3.5, 2)).toThrow(RangeError);
    expect(() => calculatePrice(3, 0)).toThrow(RangeError);
    expect(() => calculatePrice(3, 5)).toThrow(RangeError);
  });
});

describe("formatEuro en mealsLabel", () => {
  it("formatteert duizendtallen", () => {
    expect(formatEuro(123456)).toBe(nbsp("€ 1.234,56"));
  });
  it("enkelvoud en meervoud", () => {
    expect(mealsLabel(1)).toBe("1 maaltijd");
    expect(mealsLabel(6)).toBe("6 maaltijden");
  });
});

describe("isSignupOpen", () => {
  it("open tot en met 15 december 23:59 Nederlandse tijd", () => {
    expect(isSignupOpen(new Date("2026-12-15T22:58:59Z"))).toBe(true);
    expect(isSignupOpen(new Date("2026-12-15T22:59:00Z"))).toBe(true);
    expect(isSignupOpen(new Date("2026-12-15T23:00:00Z"))).toBe(false);
  });
});
