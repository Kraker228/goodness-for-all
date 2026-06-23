"use client";

import { useState } from "react";

type HoverSide = "left" | "right" | null;

/**
 * Split hero waarbij hoveren over één helft beide helften kleurt.
 * De kleurkeuze hangt af van WELKE helft gehoverd wordt, zodat
 * "links hoveren" een andere combinatie geeft dan "rechts hoveren".
 */
export default function PartnerHero() {
  const [hover, setHover] = useState<HoverSide>(null);

  const leftBg =
    hover === "left"
      ? "bg-sandstone-beige" // je hovert links zelf
      : hover === "right"
        ? "bg-pure-mist" // de andere helft (rechts) wordt gehoverd
        : "bg-white"; // niets gehoverd

  const rightBg =
    hover === "right"
      ? "bg-primary" // je hovert rechts zelf
      : hover === "left"
        ? "bg-evergreen/80" // de andere helft (links) wordt gehoverd
        : "bg-evergreen"; // niets gehoverd

  return (
    <section className="flex flex-col md:flex-row min-h-[618px] border-b-2 border-evergreen">
      <div
        onMouseEnter={() => setHover("left")}
        onMouseLeave={() => setHover(null)}
        className={`${leftBg} w-full md:w-1/2 transition-colors duration-300 p-container-margin md:p-section-gap-sm flex flex-col justify-center cursor-pointer`}
      >
        <h1 className="font-headline-lg text-headline-lg text-evergreen max-w-md">
          Rotterdam is ook jullie stad.
        </h1>
        <p className="mt-6 text-body-lg text-body-lg text-on-surface-variant max-w-sm">
          Samen bouwen we aan een stad zonder honger. Uw organisatie kan het verschil maken voor
          duizenden buurtgenoten.
        </p>
      </div>
      <div
        onMouseEnter={() => setHover("right")}
        onMouseLeave={() => setHover(null)}
        className={`${rightBg} w-full md:w-1/2 transition-colors duration-300 p-container-margin md:p-section-gap-sm flex flex-col justify-center cursor-pointer`}
      >
        <h2 className="font-headline-lg text-headline-lg text-harvest-orange">
          Word Goodness Impact Partner.
        </h2>
        <div className="mt-8 flex flex-wrap gap-4">
          <div className="bg-asparagus text-evergreen px-4 py-2 font-label-sm text-label-sm">
            CSRD PROOF
          </div>
          <div className="bg-asparagus text-evergreen px-4 py-2 font-label-sm text-label-sm">
            ESG COMPLIANT
          </div>
        </div>
        <p className="mt-6 text-body-md text-body-md text-sandstone-beige max-w-md">
          Voldoe aan uw duurzaamheidsdoelstellingen en rapportageverplichtingen (CSRD/ESG) terwijl u
          direct bijdraagt aan lokale voedselzekerheid in Rotterdam.
        </p>
      </div>
    </section>
  );
}
