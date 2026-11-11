"use client";

import Image from "next/image";
import { useRef, useState, type ReactNode } from "react";
import {
  FREQUENCY_DEFAULT,
  MEALS_DEFAULT,
  MEALS_MAX,
  MEALS_MIN,
  isSignupOpen,
} from "@/lib/nlmtd/config";
import { MEALS } from "@/lib/nlmtd/meals";
import { INTEREST_OPTIONS, buildOrderPayload, type OrderPayload } from "@/lib/nlmtd/order";
import { calculatePrice, formatEuro, mealsLabel } from "@/lib/nlmtd/pricing";
import {
  firstInvalidField,
  validateContact,
  type FieldName,
  type ValidationErrors,
} from "@/lib/nlmtd/validation";
import Dialog from "./Dialog";
import { SignupClosed } from "./SignupClosed";
import TermsButton from "./TermsButton";
import {
  fieldError,
  fieldLabel,
  focusRing,
  focusRingOnDark,
  inputField,
  primaryButton,
  textLink,
} from "./styles";

const FREQUENCY_OPTIONS = [
  { value: 1, title: "1x per maand", sub: "1 keer ophalen" },
  { value: 2, title: "2x per maand", sub: "ongeveer elke 2 weken" },
  { value: 3, title: "3x per maand", sub: "3 keer ophalen" },
  { value: 4, title: "4x per maand", sub: "elke week" },
];

const stepCard = "bg-pure-mist border-2 border-evergreen p-gutter md:p-8 mb-gutter min-w-0";
const stepTitle = "hero-title font-bold text-headline-md text-evergreen p-0";
const hint = "font-body-md text-body-md text-on-surface-variant mt-1 mb-4";

function StepCard({
  as = "div",
  titleId,
  title,
  hintText,
  children,
}: {
  as?: "div" | "fieldset";
  titleId: string;
  title: string;
  hintText?: string;
  children: ReactNode;
}) {
  if (as === "fieldset") {
    return (
      <fieldset className={stepCard} aria-describedby={hintText ? `${titleId}-hint` : undefined}>
        <legend id={titleId} className={`${stepTitle} float-left w-full`}>
          {title}
        </legend>
        {hintText && (
          <p id={`${titleId}-hint`} className={`${hint} clear-left`}>
            {hintText}
          </p>
        )}
        <div className="clear-left">{children}</div>
      </fieldset>
    );
  }
  return (
    <section className={stepCard} aria-labelledby={titleId}>
      <h3 id={titleId} className={stepTitle}>
        {title}
      </h3>
      {hintText && <p className={hint}>{hintText}</p>}
      {children}
    </section>
  );
}

/**
 * Fase 1: toont een placeholder voor de Mollie-betaling. In fase 2 stuurt
 * deze functie het payload naar /api/nlmtd/order en volgt de checkoutUrl.
 */
function useSubmitOrder() {
  const [placeholder, setPlaceholder] = useState<OrderPayload | null>(null);
  function submitOrder(payload: OrderPayload) {
    setPlaceholder(payload);
  }
  return { placeholder, closePlaceholder: () => setPlaceholder(null), submitOrder };
}

export default function SubscriptionBuilder() {
  const [perDelivery, setPerDelivery] = useState(MEALS_DEFAULT);
  const [frequency, setFrequency] = useState<number>(FREQUENCY_DEFAULT);
  const [naam, setNaam] = useState("");
  const [email, setEmail] = useState("");
  const [telefoon, setTelefoon] = useState("");
  const [allergieen, setAllergieen] = useState("");
  const [spreektAan, setSpreektAan] = useState<string[]>([]);
  const [spreektAanAnders, setSpreektAanAnders] = useState("");
  const [akkoordVoorwaarden, setAkkoordVoorwaarden] = useState(false);
  const [machtigingIncasso, setMachtigingIncasso] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [closed, setClosed] = useState(false);
  const { placeholder, closePlaceholder, submitOrder } = useSubmitOrder();

  const fieldRefs = useRef<Partial<Record<FieldName, HTMLInputElement | null>>>({});

  const price = calculatePrice(perDelivery, frequency);

  const contact = { naam, email, telefoon, akkoordVoorwaarden, machtigingIncasso };

  // Na een eerste poging tot afrekenen valideren we live mee, zodat meldingen
  // verdwijnen zodra een veld klopt.
  function update<T>(setter: (v: T) => void, field: FieldName | null) {
    return (value: T) => {
      setter(value);
      if (attempted && field) {
        setErrors(validateContact({ ...contact, [field]: value }));
      }
    };
  }

  function toggle(list: string[], value: string): string[] {
    return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
  }

  function handlePay() {
    if (!isSignupOpen()) {
      setClosed(true);
      return;
    }
    setAttempted(true);
    const nextErrors = validateContact(contact);
    setErrors(nextErrors);
    const first = firstInvalidField(nextErrors);
    if (first) {
      fieldRefs.current[first]?.focus();
      return;
    }
    submitOrder(
      buildOrderPayload({
        perDelivery,
        frequency,
        naam,
        email,
        telefoon,
        allergieen,
        spreektAan,
        spreektAanAnders,
        akkoordVoorwaarden,
        machtigingIncasso,
      }),
    );
  }

  if (closed) {
    return <SignupClosed />;
  }

  function errorProps(field: FieldName) {
    return {
      "aria-invalid": errors[field] ? true : undefined,
      "aria-describedby": errors[field] ? `fout-${field}` : undefined,
    } as const;
  }

  function errorText(field: FieldName) {
    if (!errors[field]) return null;
    return (
      <p id={`fout-${field}`} className={fieldError}>
        {errors[field]}
      </p>
    );
  }

  const checkbox = `mt-0.5 h-[22px] w-[22px] shrink-0 accent-evergreen cursor-pointer ${focusRing}`;

  return (
    <div className="grid gap-gutter lg:grid-cols-[minmax(0,1fr)_370px] lg:gap-12 items-start mt-8">
      <div className="min-w-0">
        {/* Stap A: aantal per levering */}
        <StepCard
          as="fieldset"
          titleId="stap-aantal"
          title="Hoeveel maaltijden per levering?"
          hintText={`Kies tussen ${MEALS_MIN} en ${MEALS_MAX} maaltijden.`}
        >
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setPerDelivery((m) => Math.max(MEALS_MIN, m - 1))}
              disabled={perDelivery <= MEALS_MIN}
              aria-label="Eén maaltijd minder"
              className={`w-14 h-14 border-2 border-evergreen text-evergreen flex items-center justify-center cursor-pointer hover:bg-evergreen hover:text-sandstone-beige disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-evergreen ${focusRing}`}
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                remove
              </span>
            </button>
            <output
              aria-live="polite"
              className="hero-title text-[48px] min-w-[3ch] text-center text-evergreen"
            >
              {perDelivery}
            </output>
            <button
              type="button"
              onClick={() => setPerDelivery((m) => Math.min(MEALS_MAX, m + 1))}
              disabled={perDelivery >= MEALS_MAX}
              aria-label="Eén maaltijd meer"
              className={`w-14 h-14 border-2 border-evergreen text-evergreen flex items-center justify-center cursor-pointer hover:bg-evergreen hover:text-sandstone-beige disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-evergreen ${focusRing}`}
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                add
              </span>
            </button>
            <span className="font-body-md text-body-md text-on-surface-variant">
              maaltijden per levering
            </span>
          </div>
        </StepCard>

        {/* Stap B: frequentie */}
        <StepCard
          as="fieldset"
          titleId="stap-frequentie"
          title="Hoe vaak per maand?"
          hintText="Neem de maaltijden mee vanuit NLMTD wanneer het jou uitkomt."
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {FREQUENCY_OPTIONS.map((option) => (
              <label key={option.value} className="block cursor-pointer">
                <input
                  type="radio"
                  name="frequentie"
                  value={option.value}
                  checked={frequency === option.value}
                  onChange={() => setFrequency(option.value)}
                  className="peer sr-only"
                />
                <span className="block h-full border-2 border-evergreen p-3 text-evergreen hover:bg-sandstone-beige peer-checked:bg-evergreen peer-checked:text-sandstone-beige peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-evergreen">
                  <b className="block hero-title text-headline-md leading-tight">{option.title}</b>
                  <small className="font-body-md text-label-sm opacity-85">{option.sub}</small>
                </span>
              </label>
            ))}
          </div>
        </StepCard>

        {/* Stap C: smaken */}
        <StepCard
          titleId="stap-smaken"
          title="Dit komt er in de vriezer"
          hintText="Elke week ligt er een andere smaak gegarandeerd. De andere smaken wisselen. Het label bij elke smaak laat zien in welke week hij gegarandeerd in de vriezer ligt. Pak per keer waar je zin in hebt."
        >
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {MEALS.map((meal) => {
              return (
                <li key={meal.id} className="flex flex-col gap-1.5">
                  <div className="aspect-square bg-sandstone-beige border-2 border-evergreen p-[6%] flex items-center justify-center">
                    <Image
                      src={meal.plate.src}
                      alt=""
                      width={meal.plate.width}
                      height={meal.plate.height}
                      sizes="(min-width: 1024px) 160px, (min-width: 640px) 22vw, 42vw"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="self-start whitespace-nowrap bg-harvest-orange text-evergreen px-2 py-0.5 font-label-sm text-[12px] font-bold">
                    Week van {meal.week}
                  </span>
                  <h4 className="hero-title font-bold text-body-lg leading-tight text-evergreen">
                    {meal.name}
                  </h4>
                  <p className="font-body-md text-label-sm leading-snug text-on-surface-variant">
                    {meal.sub}
                  </p>
                  <div className="mt-auto pt-1 text-label-sm">
                    <a href={`#smaak-${meal.id}`} className={textLink}>
                      Meer over deze smaak
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
        </StepCard>

        {/* Stap D: gegevens */}
        <StepCard titleId="stap-gegevens" title="Over jou">
          <div className="grid gap-4 sm:grid-cols-2 mt-4">
            <div>
              <label htmlFor="nlmtd-naam" className={fieldLabel}>
                Naam
              </label>
              <input
                id="nlmtd-naam"
                type="text"
                autoComplete="name"
                required
                value={naam}
                onChange={(e) => update(setNaam, "naam")(e.target.value)}
                ref={(el) => {
                  fieldRefs.current.naam = el;
                }}
                className={inputField}
                {...errorProps("naam")}
              />
              {errorText("naam")}
            </div>
            <div>
              <label htmlFor="nlmtd-email" className={fieldLabel}>
                E-mailadres
              </label>
              <input
                id="nlmtd-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => update(setEmail, "email")(e.target.value)}
                ref={(el) => {
                  fieldRefs.current.email = el;
                }}
                className={inputField}
                {...errorProps("email")}
              />
              {errorText("email")}
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="nlmtd-telefoon" className={fieldLabel}>
              Telefoonnummer
            </label>
            <input
              id="nlmtd-telefoon"
              type="tel"
              autoComplete="tel"
              required
              value={telefoon}
              onChange={(e) => update(setTelefoon, "telefoon")(e.target.value)}
              ref={(el) => {
                fieldRefs.current.telefoon = el;
              }}
              className={inputField}
              {...errorProps("telefoon")}
            />
            {errorText("telefoon")}
          </div>
          <div className="mt-4">
            <label htmlFor="nlmtd-allergieen" className={fieldLabel}>
              Allergieën <span className="normal-case font-normal opacity-75">(optioneel)</span>
            </label>
            <textarea
              id="nlmtd-allergieen"
              rows={3}
              value={allergieen}
              onChange={(e) => setAllergieen(e.target.value)}
              placeholder="Laat leeg als je geen allergieën hebt"
              className={`${inputField} resize-y`}
            />
          </div>
          <fieldset className="mt-4">
            <legend className={fieldLabel}>
              Wat spreekt je aan in Goodness for All?{" "}
              <span className="normal-case font-normal opacity-75">
                (optioneel, meer keuzes mogelijk)
              </span>
            </legend>
            <div className="space-y-2">
              {INTEREST_OPTIONS.map((option, i) => (
                <div key={option} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id={`nlmtd-interesse-${i}`}
                    checked={spreektAan.includes(option)}
                    onChange={() => setSpreektAan((list) => toggle(list, option))}
                    className={checkbox}
                  />
                  <label
                    htmlFor={`nlmtd-interesse-${i}`}
                    className="font-body-md text-body-md cursor-pointer"
                  >
                    {option === "Anders" ? "Anders, namelijk" : option}
                  </label>
                </div>
              ))}
              {spreektAan.includes("Anders") && (
                <input
                  type="text"
                  value={spreektAanAnders}
                  onChange={(e) => setSpreektAanAnders(e.target.value)}
                  placeholder="Wat spreekt je aan?"
                  aria-label="Wat spreekt je nog meer aan?"
                  className={`${inputField} mt-1`}
                />
              )}
            </div>
          </fieldset>
        </StepCard>

        {/* Stap E: akkoord */}
        <StepCard titleId="stap-akkoord" title="Akkoord">
          <div className="mt-4 space-y-4">
            <div>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="nlmtd-voorwaarden"
                  checked={akkoordVoorwaarden}
                  onChange={(e) => update(setAkkoordVoorwaarden, "akkoordVoorwaarden")(e.target.checked)}
                  ref={(el) => {
                    fieldRefs.current.akkoordVoorwaarden = el;
                  }}
                  className={checkbox}
                  {...errorProps("akkoordVoorwaarden")}
                />
                <span className="font-body-md text-body-md">
                  <label htmlFor="nlmtd-voorwaarden" className="cursor-pointer">
                    Ik ga akkoord met de
                  </label>{" "}
                  <TermsButton>algemene voorwaarden</TermsButton>.
                </span>
              </div>
              {errorText("akkoordVoorwaarden")}
            </div>
            <div>
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="nlmtd-incasso"
                  checked={machtigingIncasso}
                  onChange={(e) => update(setMachtigingIncasso, "machtigingIncasso")(e.target.checked)}
                  ref={(el) => {
                    fieldRefs.current.machtigingIncasso = el;
                  }}
                  className={checkbox}
                  {...errorProps("machtigingIncasso")}
                />
                <label htmlFor="nlmtd-incasso" className="font-body-md text-body-md cursor-pointer">
                  Ik geef Stichting Goodness for All toestemming om, als het abonnement doorgaat,
                  rond de 11e van elke maand het bedrag van mijn abonnement automatisch van mijn
                  rekening af te schrijven. Opzeggen kan altijd met 2 weken opzegtermijn.
                </label>
              </div>
              {errorText("machtigingIncasso")}
            </div>
          </div>
        </StepCard>
      </div>

      {/* Samenvatting */}
      <aside
        aria-labelledby="samenvatting-titel"
        className="bg-evergreen text-sandstone-beige border-2 border-evergreen p-6 shadow-[8px_8px_0_0_var(--color-harvest-orange)] lg:sticky lg:top-[124px]"
      >
        <h3 id="samenvatting-titel" className="hero-title font-bold text-headline-md mb-4">
          Jouw abonnement
        </h3>
        <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1.5 font-body-md text-body-md">
          <dt className="opacity-90">Per levering</dt>
          <dd className="text-right font-bold tabular-nums">{mealsLabel(price.perDelivery)}</dd>
          <dt className="opacity-90">Leveringen per maand</dt>
          <dd className="text-right font-bold tabular-nums">{price.frequency}x</dd>
          <dt className="opacity-90">Maaltijden per maand</dt>
          <dd className="text-right font-bold tabular-nums">{price.maaltijdenPerMaand}</dd>
          <dt className="opacity-90">Normale prijs per maand</dt>
          <dd className="text-right tabular-nums line-through opacity-75">
            {formatEuro(price.normaalPerMaandCents)}
          </dd>
          <dt className="opacity-90">Jouw prijs per maand</dt>
          <dd className="text-right font-bold tabular-nums">{formatEuro(price.maandbedragCents)}</dd>
          <dt className="opacity-90">Je bespaart per maand</dt>
          <dd className="text-right font-bold tabular-nums text-harvest-orange">
            {formatEuro(price.besparingCents)}
          </dd>
        </dl>
        <p className="my-4 border-l-4 border-harvest-orange bg-white/10 px-4 py-3 font-body-md text-body-md font-bold">
          Jouw abonnement betekent {mealsLabel(price.maaltijdenPerMaand)} per maand voor iemand die
          nu geen toegang heeft tot gezond eten.
        </p>
        <hr className="border-0 border-t-2 border-sandstone-beige/30 my-4" />
        <p className="font-body-md text-body-md">Nu betalen, eerste levering op 11 januari:</p>
        <p
          aria-live="polite"
          className="hero-title text-[44px] leading-none my-1 tabular-nums"
        >
          {formatEuro(price.eersteBetalingCents)}
        </p>
        <p className="font-body-md text-label-sm leading-snug opacity-90 mb-4">
          Daarna, als het abonnement doorgaat: {formatEuro(price.maandbedragCents)} per maand.
          {price.restEersteMaandCents > 0 && (
            <>
              {" "}
              De resterende {formatEuro(price.restEersteMaandCents)} van de eerste maand wordt rond 11
              januari afgeschreven.
            </>
          )}
        </p>
        <button type="button" onClick={handlePay} className={`${primaryButton} w-full ${focusRingOnDark}`}>
          Betaal met iDEAL
        </button>
        <p className="mt-4 font-body-md text-[13px] leading-snug opacity-85">
          Je eerste bestelling wordt gegarandeerd geleverd. Of je abonnement doorgaat, hangt af van
          genoeg animo. Zo niet, dan blijft het bij die ene levering. Verder geen verplichtingen.
        </p>
      </aside>

      <Dialog open={placeholder !== null} onClose={closePlaceholder} title="Hier volgt de betaling">
        {placeholder && <PaymentPlaceholder payload={placeholder} onClose={closePlaceholder} />}
      </Dialog>
    </div>
  );
}

function PaymentPlaceholder({ payload, onClose }: { payload: OrderPayload; onClose: () => void }) {
  return (
    <div>
      <div className="border-2 border-dashed border-evergreen bg-pure-mist p-4">
        <strong>Placeholder voor Mollie.</strong>
        <p className="mt-2">
          In de echte versie word je hier doorgestuurd naar Mollie. Je betaalt{" "}
          <b>{formatEuro(payload.eerste_betaling_cent)}</b> met iDEAL. Met diezelfde betaling geef
          je een eenmalige machtiging voor de maandelijkse incasso. Het bedrag is al voor jou
          uitgerekend, je hoeft niets over te typen.
        </p>
      </div>
      <h3 className="font-headline-md text-body-lg font-bold mt-5 mb-1">Jouw bestelling</h3>
      <p>
        {mealsLabel(payload.maaltijden_per_levering)} per levering, {payload.leveringen_per_maand}x
        per maand ({mealsLabel(payload.maaltijden_per_maand)} per maand).
      </p>
      <p className="mt-2">
        Nu: <b>{formatEuro(payload.eerste_betaling_cent)}</b> voor je eerste levering op maandag 11
        januari.
        <br />
        Daarna, als het abonnement doorgaat: <b>{formatEuro(payload.maandbedrag_cent)}</b> per maand,
        steeds rond de 11e van de maand.
        {payload.rest_eerste_maand_cent > 0 && (
          <>
            {" "}
            De resterende <b>{formatEuro(payload.rest_eerste_maand_cent)}</b> van de eerste maand
            wordt rond 11 januari afgeschreven.
          </>
        )}
      </p>
      <h3 className="font-headline-md text-body-lg font-bold mt-5 mb-1">
        Wat er in de bestelsheet terechtkomt
      </h3>
      <pre className="bg-surface border-2 border-evergreen p-3 overflow-x-auto text-[13px] leading-snug">
        {JSON.stringify(payload, null, 2)}
      </pre>
      <button type="button" onClick={onClose} className={`${primaryButton} mt-4 ${focusRing}`}>
        Terug naar de pagina
      </button>
    </div>
  );
}
