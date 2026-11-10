import Image from "next/image";
import { getMeal } from "@/lib/nlmtd/meals";
import { NLMTD_ALT } from "./NlmtdHeader";
import { focusRingOnDark, primaryButton } from "./styles";

const FACTS = [
  "€6 per maaltijd*, normaal €8",
  "Eerste levering maandag 11 januari",
  "Aanmelden kan tot en met 15 december",
];

export default function Hero() {
  const plates = [
    { meal: getMeal("gnocchi")!, caption: "voor jou" },
    { meal: getMeal("tikka")!, caption: "voor iemand anders" },
  ];

  return (
    <section className="bg-evergreen text-sandstone-beige overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-container-margin py-section-gap-sm md:py-section-gap-lg grid gap-section-gap-sm lg:grid-cols-[1.15fr_0.85fr] items-center">
        <div>
          <h1 className="hero-title text-[48px] md:text-[72px] text-sandstone-beige">
            Jij eet lekker. <span className="text-harvest-orange">Iemand anders eet mee.</span>
          </h1>
          <p className="font-body-lg text-body-lg md:text-xl mt-6 max-w-xl text-sandstone-beige/90">
            Gezonde maaltijden van Goodness for All, speciaal voor de collega’s van NLMTD. Stel je
            eigen abonnement samen en help ons te laten zien dat dit werkt.
          </p>
          <ul className="flex flex-wrap gap-2 mt-8 mb-8">
            {FACTS.map((fact) => (
              <li
                key={fact}
                className="border-2 border-sandstone-beige/60 px-4 py-2 font-label-sm text-label-sm"
              >
                {fact}
              </li>
            ))}
          </ul>
          <a href="#samenstellen" className={`${primaryButton} ${focusRingOnDark}`}>
            Stel je abonnement samen
          </a>
          <p className="mt-4 max-w-xl font-body-md text-label-sm leading-relaxed text-sandstone-beige/75">
            * De 25% korting geldt bij een abonnement. Koop je los, dan krijg je steeds de vierde
            maaltijd gratis. Met een abonnement krijg je gewoon 25% korting op het totale aantal
            maaltijden, ook als je er minder dan vier per keer neemt.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <span className="font-body-md text-body-md">Een samenwerking met</span>
            <Image
              src="/nlmtd/Logo_wit___tekst.png"
              alt={NLMTD_ALT}
              width={2000}
              height={2000}
              sizes="80px"
              className="h-16 md:h-20 w-auto"
            />
          </div>
        </div>

        <div
          className="grid grid-cols-[1.15fr_0.85fr] gap-4 items-end w-full max-w-[460px] justify-self-center"
          aria-hidden="true"
        >
          {plates.map(({ meal, caption }, i) => (
            <figure key={meal.id} className={`m-0 text-center ${i === 1 ? "-translate-y-[14%]" : ""}`}>
              <Image
                src={meal.plate.src}
                alt=""
                width={meal.plate.width}
                height={meal.plate.height}
                sizes="(min-width: 1024px) 260px, 50vw"
                preload={i === 0}
                className="w-full h-auto drop-shadow-[6px_6px_0_rgba(0,0,0,0.25)]"
              />
              <figcaption className="mt-2 font-label-sm text-label-sm uppercase tracking-widest">
                {caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
