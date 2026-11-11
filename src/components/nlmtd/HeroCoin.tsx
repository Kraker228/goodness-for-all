"use client";

import { useState } from "react";
import PlateCoin, { type PlateCoinFace } from "@/components/PlateCoin";
import { COIN_IMAGES } from "@/lib/nlmtd/meals";

/**
 * Draaiende munt in de NLMTD-hero. De voorkant is "voor jou", de achterkant
 * "voor een ander". Het label van het zichtbare vlak is vol, het andere 40%.
 */
export default function HeroCoin() {
  const [face, setFace] = useState<PlateCoinFace>("front");

  const label = (active: boolean) =>
    `hero-title font-bold text-[28px] md:text-[34px] leading-none motion-safe:transition-opacity motion-safe:duration-300 ${
      active ? "opacity-100" : "opacity-40"
    }`;

  return (
    <div className="w-full max-w-[400px] justify-self-center mb-12 lg:mb-0">
      <PlateCoin
        images={COIN_IMAGES}
        diameter={340}
        onFaceChange={(f) => setFace(f)}
        label="Draaiend bord: de ene kant voor jou, de andere kant voor een ander, steeds met een andere maaltijd"
      />
      <p className="mt-4 flex justify-center gap-6 md:gap-8" aria-hidden="true">
        <span className={`${label(face === "front")} text-white`}>Voor jou</span>
        <span className={`${label(face === "back")} text-harvest-orange`}>voor een ander</span>
      </p>
    </div>
  );
}
