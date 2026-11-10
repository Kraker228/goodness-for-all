import Image from "next/image";

const sectionTitle =
  "hero-title font-bold text-headline-lg-mobile md:text-headline-lg text-evergreen";

export function WhySection() {
  return (
    <section className="bg-surface py-section-gap-sm md:py-section-gap-lg">
      <div className="max-w-[1200px] mx-auto px-container-margin grid gap-section-gap-sm lg:grid-cols-2 lg:gap-16 items-start">
        <div>
          <h2 className={sectionTitle}>Waarom deze maaltijden?</h2>
          <ul className="mt-6 space-y-5">
            <li className="border-l-4 border-harvest-orange pl-4">
              <strong className="block hero-title font-bold text-headline-md text-evergreen">
                Lekker, makkelijk, gezond
              </strong>
              <span className="font-body-lg text-body-lg text-on-surface-variant">
                Plantaardige maaltijden vol groenten, binnen 8 minuten klaar in de pan of magnetron.
              </span>
            </li>
            <li className="border-l-4 border-harvest-orange pl-4">
              <strong className="block hero-title font-bold text-headline-md text-evergreen">
                Geen gedoe
              </strong>
              <span className="font-body-lg text-body-lg text-on-surface-variant">
                Geen tocht naar de supermarkt, geen uren in de keuken en geen bezorgkosten. Je pakt
                ze gewoon mee op kantoor.
              </span>
            </li>
          </ul>
        </div>
        <div className="bg-harvest-orange text-evergreen border-2 border-evergreen p-gutter md:p-10 shadow-[8px_8px_0_0_var(--color-evergreen)]">
          {/* Tweede foto uit de carrousel op de homepage (content/site.json). */}
          <Image
            src="/images/home/carrousel-2.jpg"
            alt="Vrijwilligers en een partner leveren Korean Noodles af in een buurthuis"
            width={1200}
            height={800}
            sizes="(min-width: 1200px) 520px, (min-width: 1024px) 45vw, 100vw"
            className="w-full h-auto border-2 border-evergreen mb-6"
          />
          <p className="hero-title font-bold text-headline-md md:text-[32px] leading-tight">
            Het belangrijkste: elke maaltijd die jij koopt, wordt ook gegeven aan iemand die nu geen
            toegang heeft tot gezond eten.
          </p>
          <p className="mt-4 font-body-md text-body-md">
            Goodness for All is een Rotterdamse stichting die gezonde maaltijden via buurthuizen
            beschikbaar maakt. Jouw abonnement betaalt voor beide kanten.
          </p>
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    title: "Stel samen",
    text: "Kies hoeveel maaltijden je per levering wilt en hoe vaak per maand.",
  },
  {
    title: "Betaal je eerste bestelling",
    text: "Met iDEAL. Daarbij geef je toestemming voor een maandelijkse automatische incasso.",
  },
  {
    title: "Haal op bij NLMTD",
    text: "Vanaf maandag 11 januari. Je eerste bestelling is gegarandeerd. Pak je maaltijden uit de vriezer en vink ze af op de lijst.",
  },
  {
    title: "Doorgaan als er genoeg animo is",
    text: "Bij voldoende animo start je abonnement op 1 februari. Zo niet, dan blijft het bij die ene levering, zonder verplichtingen. Opzeggen kan altijd, met 2 weken opzegtermijn.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-sandstone-beige py-section-gap-sm md:py-section-gap-lg">
      <div className="max-w-[1200px] mx-auto px-container-margin">
        <h2 className={sectionTitle}>Zo werkt het</h2>
        <ol className="mt-8 grid gap-gutter md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.title} className="border-t-4 border-evergreen pt-4">
              <span aria-hidden="true" className="block hero-title text-[40px] text-harvest-orange">
                {i + 1}
              </span>
              <strong className="block hero-title font-bold text-headline-md text-evergreen mt-1 mb-2">
                {step.title}
              </strong>
              <p className="font-body-md text-body-md text-on-surface-variant">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export { sectionTitle };
