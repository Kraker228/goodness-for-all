"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import PlateCoin, { type PlateCoinFace } from "@/components/PlateCoin";
import { COIN_IMAGES } from "@/lib/nlmtd/meals";

/**
 * Draaiende munt in de NLMTD-hero. De voorkant is "voor jou", de achterkant
 * "voor een ander". Het zichtbare vlak wordt gedeeld via context, zodat op
 * mobiel de twee zinnen van de koptekst kunnen meewisselen.
 */

type FaceContext = { face: PlateCoinFace; setFace: (face: PlateCoinFace) => void };
const CoinFace = createContext<FaceContext>({ face: "front", setFace: () => {} });

export function HeroCoinProvider({ children }: { children: ReactNode }) {
  const [face, setFace] = useState<PlateCoinFace>("front");
  return <CoinFace.Provider value={{ face, setFace }}>{children}</CoinFace.Provider>;
}

/** Ingestelde waarden na tunen op /dev/plate-coin. */
const COIN_SETTINGS = {
  diameter: 370,
  thickness: 0.065,
  halfTurnMs: 850,
  restMs: 1200,
  glare: 0.9,
  wobble: 1,
} as const;

const fade = "motion-safe:transition-opacity motion-safe:duration-300";
const COIN_LABEL =
  "Draaiend bord: de ene kant voor jou, de andere kant voor een ander, steeds met een andere maaltijd";

/** Op mobiel wisselen de twee zinnen mee (vol of 40%); op desktop staan ze altijd vol. */
export function HeroTitle() {
  const { face } = useContext(CoinFace);
  const dim = (active: boolean) => (active ? "" : "max-lg:opacity-40");
  return (
    <h1 className="hero-title text-[40px] md:text-[60px] text-sandstone-beige">
      <span className={`${fade} ${dim(face === "front")}`}>
        Eindelijk kan je lekker, gezond, snel én betaalbaar eten.
      </span>{" "}
      <span className={`text-harvest-orange ${fade} ${dim(face === "back")}`}>
        En sponsor je ook de maaltijd van een ander.
      </span>
    </h1>
  );
}

/** Mobiel: alleen de munt, tussen de koptekst en de introtekst. */
export function HeroCoinMobile() {
  const { setFace } = useContext(CoinFace);
  return (
    <div className="lg:hidden mt-8">
      <PlateCoin images={COIN_IMAGES} {...COIN_SETTINGS} onFaceChange={setFace} label={COIN_LABEL} />
    </div>
  );
}

/** Desktop: de munt met de twee zinnen groot onder elkaar. */
export function HeroCoinDesktop() {
  const { face, setFace } = useContext(CoinFace);
  const label = (active: boolean) =>
    `block hero-title font-bold text-[52px] xl:text-[60px] leading-[1.05] ${fade} ${
      active ? "opacity-100" : "opacity-40"
    }`;
  return (
    <div className="hidden lg:block w-full max-w-[420px] justify-self-center">
      <PlateCoin images={COIN_IMAGES} {...COIN_SETTINGS} onFaceChange={setFace} label={COIN_LABEL} />
      <p className="mt-4 text-center" aria-hidden="true">
        <span className={`${label(face === "front")} text-white`}>Voor jou</span>
        <span className={`${label(face === "back")} text-harvest-orange`}>voor een ander</span>
      </p>
    </div>
  );
}
