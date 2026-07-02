"use client";

import { useState } from "react";
import type { SiteContent } from "@/lib/content";

/**
 * Multi-step meal order form for buurthuizen — a faithful React port of the
 * original Stitch inline flow. Step indices match the original:
 *   0 welcome, 1 organisatie, 2 aantal, 3 leveringsbevestiging,
 *   4 ophaalbevestiging, 5 smakenkeuze, 6 smakenselectie, 7 opmerkingen,
 *   8 contactgegevens, 9 success, 10 rejection.
 * Submit is stubbed (see submitOrder) — no live endpoint shipped.
 */

const STEP_HEIGHT = 600;

type OrderFlowContent = SiteContent["forms"]["order"];

type FormData = {
  organisatie: string;
  aantalDoosjes: number;
  totaalMaaltijden: number;
  bevestigingType: string;
  bevestigingStatus: boolean | null;
  keuzeType: string;
  smaken: string[];
  opmerkingen: string;
  voornaam: string;
  achternaam: string;
  telefoon: string;
};

const INITIAL: FormData = {
  organisatie: "",
  aantalDoosjes: 0,
  totaalMaaltijden: 0,
  bevestigingType: "",
  bevestigingStatus: null,
  keuzeType: "",
  smaken: [],
  opmerkingen: "",
  voornaam: "",
  achternaam: "",
  telefoon: "",
};

export default function OrderFlow({ content }: { content: OrderFlowContent }) {
  const [step, setStep] = useState(0);
  // History stack of visited steps (used only via the functional updater in prevStep).
  const [, setHistory] = useState<number[]>([0]);
  const [data, setData] = useState<FormData>(INITIAL);
  const [calcText, setCalcText] = useState("");
  const [rejectionText, setRejectionText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function goTo(index: number) {
    setHistory((h) => [...h, index]);
    setStep(index);
  }

  function nextStep() {
    goTo(step + 1);
  }

  function prevStep() {
    setHistory((h) => {
      if (h.length <= 1) return h;
      const next = h.slice(0, -1);
      setStep(next[next.length - 1]);
      return next;
    });
  }

  function handleSelect(value: string) {
    setData((d) => ({ ...d, organisatie: value }));
    if (value) goTo(2);
  }

  function calculateMaaltijden(val: string) {
    const n = parseInt(val, 10) || 0;
    if (n >= 5) {
      setCalcText(content.screens.amountCalculation.replace("{count}", String(n * 9)));
      setData((d) => ({ ...d, aantalDoosjes: n, totaalMaaltijden: n * 9 }));
    } else {
      setCalcText("");
      setData((d) => ({ ...d, aantalDoosjes: n, totaalMaaltijden: 0 }));
    }
  }

  function checkAmountAndProceed() {
    if (data.aantalDoosjes < 5) {
      window.alert(content.minimumAlert);
      return;
    }
    goTo(data.aantalDoosjes <= 30 ? 3 : 4);
  }

  function handleConfirmation(type: string, confirmed: boolean) {
    setData((d) => ({ ...d, bevestigingType: type, bevestigingStatus: confirmed }));
    if (confirmed) {
      goTo(5);
    } else {
      setRejectionText(
        type === "levering"
          ? content.screens.deliveryRejection
          : content.screens.pickupRejection,
      );
      goTo(10);
    }
  }

  function handleChoice(choice: string) {
    setData((d) => ({
      ...d,
      keuzeType: choice,
      smaken: choice === "mix" ? ["Mix"] : d.smaken,
    }));
    if (choice === "zelf") {
      goTo(6);
    } else {
      goTo(7);
    }
  }

  function toggleFlavor(flavor: string) {
    setData((d) => ({
      ...d,
      smaken: d.smaken.includes(flavor)
        ? d.smaken.filter((f) => f !== flavor)
        : [...d.smaken, flavor],
    }));
  }

  async function submitOrder() {
    if (!data.voornaam || !data.achternaam || !data.telefoon) {
      window.alert(content.contactAlert);
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          source: "voor-buurthuizen",
        }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? "Bestelling kon niet worden verzonden.");
      }

      setSubmitting(false);
      goTo(9);
    } catch (error) {
      setSubmitting(false);
      setSubmitError(
        error instanceof Error ? error.message : "Bestelling kon niet worden verzonden.",
      );
    }
  }

  function reset() {
    setData(INITIAL);
    setCalcText("");
    setRejectionText("");
    setSubmitError("");
    setHistory([0]);
    setStep(0);
  }

  const showNav = step !== 0 && step < 9;

  return (
    <div className="w-full">
      {/* Progress / back controls (between steps) */}
      <div
        className={`mb-8 ${showNav ? "flex" : "hidden"} items-center justify-between`}
      >
        <button
          type="button"
          onClick={prevStep}
          className="flex items-center gap-2 text-evergreen font-bold hover:opacity-70 transition-opacity"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span>{content.backLabel}</span>
        </button>
        <div className="text-evergreen/60 font-bold tracking-widest text-sm uppercase">
          {content.progressPrefix} <span>{step}</span> {content.progressSuffix}
        </div>
      </div>

      {/* Stepped viewport */}
      <div
        className="overflow-hidden border-2 border-evergreen bg-white shadow-xl"
        style={{ height: STEP_HEIGHT }}
      >
        <div
          className="flex flex-col"
          style={{
            transition: "transform 0.6s cubic-bezier(0.65, 0, 0.35, 1)",
            transform: `translateY(-${step * STEP_HEIGHT}px)`,
          }}
        >
          {/* SCREEN 0: WELCOME */}
          <Screen>
            <div className="mb-6">
              <span className="material-symbols-outlined text-harvest-orange text-5xl">eco</span>
            </div>
            <h2 className="font-headline-md text-headline-md text-evergreen leading-tight mb-4">
              {content.screens.welcomeTitle}
            </h2>
            <p className="text-body-md text-evergreen/80 mb-6">
              {content.screens.welcomeTextBeforeLink}{" "}
              <a className="text-harvest-orange underline font-bold" href={content.registrationHref}>
                {content.registrationLabel}
              </a>
              {content.screens.welcomeTextAfterLink}
            </p>
            <button
              type="button"
              onClick={nextStep}
              className="bg-harvest-orange text-white font-cta font-extrabold py-4 px-8 inline-flex items-center gap-4 hover:bg-evergreen transition-colors w-fit"
            >
              {content.startLabel} <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </Screen>

          {/* Q1: ORGANISATIE */}
          <Screen>
            <label className="font-headline-md text-headline-md text-evergreen mb-6 block">
              {content.screens.organizationQuestion}
            </label>
            <div className="relative">
              <select
                className="w-full border-2 border-evergreen p-4 text-lg bg-white focus:outline-none appearance-none cursor-pointer"
                value={data.organisatie}
                onChange={(e) => handleSelect(e.target.value)}
              >
                <option disabled value="">
                  {content.screens.organizationPlaceholder}
                </option>
                {content.organizations.map((organization) => (
                  <option key={organization} value={organization}>
                    {organization}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                expand_more
              </span>
            </div>
          </Screen>

          {/* Q2: AANTAL DOOSJES */}
          <Screen>
            <label className="font-headline-md text-headline-md text-evergreen mb-2 block">
              {content.screens.amountQuestion}
            </label>
            <p className="text-evergreen/60 mb-6 text-sm">{content.screens.amountHint}</p>
            <input
              className="w-full border-2 border-evergreen p-4 text-3xl font-bold focus:outline-none mb-4"
              min={5}
              onChange={(e) => calculateMaaltijden(e.target.value)}
              placeholder={content.screens.amountPlaceholder}
              type="number"
            />
            <p className="text-xl font-bold text-harvest-orange h-8">{calcText}</p>
            <button
              type="button"
              onClick={checkAmountAndProceed}
              className="mt-4 bg-evergreen text-white font-cta font-bold py-4 px-8 w-fit hover:bg-harvest-orange transition-colors"
            >
              {content.nextLabel}
            </button>
          </Screen>

          {/* Q3: LEVERINGSBEVESTIGING */}
          <Screen>
            <h2 className="font-headline-md text-headline-md text-evergreen mb-6">
              {content.screens.deliveryQuestion}
            </h2>
            <YesNo
              onYes={() => handleConfirmation("levering", true)}
              onNo={() => handleConfirmation("levering", false)}
              yesLabel={content.yesLabel}
              noLabel={content.noLabel}
            />
          </Screen>

          {/* Q4: OPHAALBEVESTIGING */}
          <Screen>
            <h2 className="font-headline-md text-headline-md text-evergreen mb-6">
              {content.screens.pickupQuestion}
            </h2>
            <YesNo
              onYes={() => handleConfirmation("ophaal", true)}
              onNo={() => handleConfirmation("ophaal", false)}
              yesLabel={content.yesLabel}
              noLabel={content.noLabel}
            />
          </Screen>

          {/* Q5: SMAKENKEUZE */}
          <Screen>
            <h2 className="font-headline-md text-headline-md text-evergreen mb-6">
              {content.screens.choiceQuestion}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleChoice("zelf")}
                className="bg-evergreen text-white font-bold py-6 text-xl hover:opacity-90"
              >
                {content.screens.selfChoiceLabel}
              </button>
              <button
                type="button"
                onClick={() => handleChoice("mix")}
                className="border-2 border-evergreen text-evergreen font-bold py-6 text-xl hover:bg-sandstone-beige"
              >
                {content.screens.mixChoiceLabel}
              </button>
            </div>
          </Screen>

          {/* Q6: SMAKENSELECTIE */}
          <Screen>
            <h2 className="font-headline-md text-headline-md text-evergreen mb-2">
              {content.screens.flavorsQuestion}
            </h2>
            <p className="text-sm text-evergreen/60 mb-4">
              {content.screens.flavorsHint}
            </p>
            <div className="grid grid-cols-2 gap-3 overflow-y-auto max-h-[250px] pr-2 custom-scrollbar">
              {content.flavors.map((flavor) => {
                const selected = data.smaken.includes(flavor);
                return (
                  <button
                    type="button"
                    key={flavor}
                    onClick={() => toggleFlavor(flavor)}
                    className={`border-2 border-evergreen p-2 cursor-pointer font-bold text-center flex items-center justify-center h-16 transition-colors ${
                      selected ? "bg-evergreen text-white" : ""
                    }`}
                  >
                    {flavor}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => goTo(7)}
              className="mt-6 bg-evergreen text-white font-cta font-bold py-4 px-8 w-fit hover:bg-harvest-orange transition-colors"
            >
              {content.nextLabel}
            </button>
          </Screen>

          {/* Q7: OPMERKINGEN */}
          <Screen>
            <label className="font-headline-md text-headline-md text-evergreen mb-6 block">
              {content.screens.notesQuestion}
            </label>
            <textarea
              className="w-full border-2 border-evergreen p-4 text-lg focus:outline-none bg-white"
              placeholder={content.screens.notesPlaceholder}
              rows={3}
              value={data.opmerkingen}
              onChange={(e) => setData((d) => ({ ...d, opmerkingen: e.target.value }))}
            />
            <button
              type="button"
              onClick={() => goTo(8)}
              className="mt-6 bg-evergreen text-white font-cta font-bold py-4 px-8 w-fit hover:bg-harvest-orange transition-colors"
            >
              {content.nextLabel}
            </button>
          </Screen>

          {/* Q8: CONTACTGEGEVENS */}
          <Screen>
            <h2 className="font-headline-md text-headline-md text-evergreen mb-1">
              {content.screens.contactQuestion}
            </h2>
            <p className="text-body-md text-evergreen/70 mb-6">
              {content.screens.contactSubtitle}
            </p>
            <div className="space-y-3">
              <input
                className="w-full border-2 border-evergreen p-3 text-lg focus:outline-none"
                placeholder={content.screens.firstNamePlaceholder}
                type="text"
                value={data.voornaam}
                onChange={(e) => setData((d) => ({ ...d, voornaam: e.target.value }))}
              />
              <input
                className="w-full border-2 border-evergreen p-3 text-lg focus:outline-none"
                placeholder={content.screens.lastNamePlaceholder}
                type="text"
                value={data.achternaam}
                onChange={(e) => setData((d) => ({ ...d, achternaam: e.target.value }))}
              />
              <input
                className="w-full border-2 border-evergreen p-3 text-lg focus:outline-none"
                pattern="[0-9]{10}"
                placeholder={content.screens.phonePlaceholder}
                type="tel"
                value={data.telefoon}
                onChange={(e) => setData((d) => ({ ...d, telefoon: e.target.value }))}
              />
            </div>
            <button
              type="button"
              onClick={submitOrder}
              disabled={submitting}
              className="mt-6 bg-harvest-orange text-white font-cta font-extrabold py-4 px-8 w-full text-lg hover:bg-evergreen transition-colors flex items-center justify-center gap-4 disabled:opacity-70"
            >
              {submitting ? content.submittingLabel : content.submitLabel}
              {!submitting && <span className="material-symbols-outlined">send</span>}
            </button>
            {submitError && (
              <p className="mt-3 text-sm font-bold text-red-700" role="alert">
                {submitError}
              </p>
            )}
          </Screen>

          {/* SUCCESS */}
          <Screen>
            <span className="material-symbols-outlined text-evergreen text-6xl mb-4">
              check_circle
            </span>
            <h2 className="font-headline-md text-headline-md text-evergreen mb-4">
              {content.screens.successTitle}
            </h2>
            <p className="text-body-md text-evergreen/80 mb-6">
              {content.screens.successText}
            </p>
            <button
              type="button"
              onClick={reset}
              className="bg-harvest-orange text-white font-bold py-4 px-8 w-fit"
            >
              {content.newOrderLabel}
            </button>
          </Screen>

          {/* REJECTION */}
          <Screen>
            <span className="material-symbols-outlined text-evergreen text-6xl mb-4">info</span>
            <h2 className="font-headline-md text-headline-md text-evergreen mb-4">
              {content.screens.rejectionTitle}
            </h2>
            <p className="text-body-md text-evergreen/80 mb-6">{rejectionText}</p>
            <button
              type="button"
              onClick={prevStep}
              className="bg-evergreen text-white font-bold py-4 px-8 w-fit"
            >
              {content.backLabel}
            </button>
          </Screen>
        </div>
      </div>
    </div>
  );
}

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <section
      className="w-full flex-shrink-0 flex flex-col justify-center p-8 max-w-[800px] mx-auto"
      style={{ height: STEP_HEIGHT }}
    >
      {children}
    </section>
  );
}

function YesNo({
  onYes,
  onNo,
  yesLabel,
  noLabel,
}: {
  onYes: () => void;
  onNo: () => void;
  yesLabel: string;
  noLabel: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <button
        type="button"
        onClick={onYes}
        className="bg-evergreen text-white font-bold py-6 text-xl hover:opacity-90"
      >
        {yesLabel}
      </button>
      <button
        type="button"
        onClick={onNo}
        className="border-2 border-evergreen text-evergreen font-bold py-6 text-xl hover:bg-sandstone-beige"
      >
        {noLabel}
      </button>
    </div>
  );
}
