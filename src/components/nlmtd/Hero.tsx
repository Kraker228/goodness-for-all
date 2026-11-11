import Image from "next/image";
import { HeroCoinDesktop, HeroCoinMobile, HeroCoinProvider, HeroTitle } from "./HeroCoin";
import { NLMTD_ALT } from "./NlmtdHeader";
import { focusRingOnDark, primaryButton } from "./styles";

const FACTS = [
  "€6 per maaltijd*, normaal €8",
  "Eerste levering maandag 11 januari",
  "Aanmelden kan tot en met 15 december",
];

export default function Hero() {
  return (
    <section className="bg-evergreen text-sandstone-beige overflow-hidden">
      <HeroCoinProvider>
      <div className="max-w-[1200px] mx-auto px-container-margin py-section-gap-sm md:py-section-gap-lg grid gap-section-gap-sm lg:grid-cols-[1.15fr_0.85fr] items-center">
        <div>
          <HeroTitle />
          <HeroCoinMobile />
          <p className="font-body-lg text-body-lg md:text-xl mt-6 max-w-xl text-sandstone-beige/90">
            Exclusief voor NLMTD: Gezonde maaltijden van Goodness for All, direct vanuit kantoor mee
            naar huis. Stel je eigen abonnement samen en help ons te laten zien dat dit werkt.
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

        <HeroCoinDesktop />
      </div>
      </HeroCoinProvider>
    </section>
  );
}
