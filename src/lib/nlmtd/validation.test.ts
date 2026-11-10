import { describe, expect, it } from "vitest";
import {
  firstInvalidField,
  isValidEmail,
  isValidName,
  isValidPhone,
  validateContact,
  type ContactInput,
} from "./validation";

const valid: ContactInput = {
  naam: "Sam de Vries",
  email: "sam@nlmtd.nl",
  telefoon: "06 12345678",
  akkoordVoorwaarden: true,
  machtigingIncasso: true,
};

describe("losse regels", () => {
  it("naam minimaal 2 tekens, zonder spaties mee te tellen", () => {
    expect(isValidName("Jo")).toBe(true);
    expect(isValidName(" J ")).toBe(false);
    expect(isValidName("")).toBe(false);
  });

  it("e-mailadres", () => {
    expect(isValidEmail("naam@bedrijf.nl")).toBe(true);
    expect(isValidEmail(" naam@bedrijf.nl ")).toBe(true);
    expect(isValidEmail("naam@bedrijf")).toBe(false);
    expect(isValidEmail("naam bedrijf.nl")).toBe(false);
    expect(isValidEmail("naam@bedrijf.n")).toBe(false);
  });

  it("telefoon minimaal 8 cijfers, opmaak telt niet mee", () => {
    expect(isValidPhone("06-1234 5678")).toBe(true);
    expect(isValidPhone("+31 6 12345678")).toBe(true);
    expect(isValidPhone("1234567")).toBe(false);
    expect(isValidPhone("telefoon")).toBe(false);
  });
});

describe("validateContact", () => {
  it("geldige invoer geeft geen fouten", () => {
    expect(validateContact(valid)).toEqual({});
    expect(firstInvalidField({})).toBeNull();
  });

  it("geeft per veld een melding en de eerste fout in paginavolgorde", () => {
    const errors = validateContact({
      ...valid,
      email: "fout",
      akkoordVoorwaarden: false,
      machtigingIncasso: false,
    });
    expect(Object.keys(errors).sort()).toEqual(["akkoordVoorwaarden", "email", "machtigingIncasso"]);
    expect(firstInvalidField(errors)).toBe("email");
  });

  it("lege invoer: alle vijf velden fout, eerste is naam", () => {
    const errors = validateContact({
      naam: "",
      email: "",
      telefoon: "",
      akkoordVoorwaarden: false,
      machtigingIncasso: false,
    });
    expect(Object.keys(errors)).toHaveLength(5);
    expect(firstInvalidField(errors)).toBe("naam");
  });
});
