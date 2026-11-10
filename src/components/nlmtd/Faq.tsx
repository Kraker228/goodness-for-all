import { sectionTitle } from "./InfoSections";
import { focusRing } from "./styles";

const FAQ = [
  {
    q: "Wat gebeurt er als er niet genoeg mensen meedoen?",
    a: "Dan krijg je alleen je eerste bestelling, die je een week lang kunt ophalen. Er volgen geen afschrijvingen en er zijn geen verplichtingen, van jouw kant of van ons.",
  },
  {
    q: "Hoe haal ik mijn maaltijden op?",
    a: "Bij NLMTD op kantoor staat een vriezer. Pak je maaltijden en vink ze af op de lijst met je voornaam. Dat kan elke werkdag.",
  },
  {
    q: "Hoe zeg ik op?",
    a: "Stuur een e-mail naar info@goodnessforall.nl. De opzegtermijn is 2 weken.",
  },
  {
    q: "Krijg ik een factuur?",
    a: "Op aanvraag, per maand. Mail naar info@goodnessforall.nl.",
  },
  {
    q: "Wat als ik een allergie heb?",
    a: "Geef het door in het formulier en lees bij elke smaak de ingrediënten. Op het etiket van de verpakking staat altijd de definitieve informatie.",
  },
  {
    q: "Hoe maak ik de maaltijden klaar?",
    a: "Uit de vriezer in de pan, 8 tot 10 minuten op matig vuur met wat olie. Of in een magnetronbakje, ongeveer 6 minuten op 900 W. Steeds tussendoor roeren.",
  },
];

export default function Faq() {
  return (
    <section className="bg-surface py-section-gap-sm md:py-section-gap-lg">
      <div className="max-w-[1200px] mx-auto px-container-margin">
        <h2 className={`${sectionTitle} mb-6`}>Veelgestelde vragen</h2>
        <div className="border-b-2 border-evergreen max-w-3xl">
          {FAQ.map((item) => (
            <details key={item.q} className="border-t-2 border-evergreen py-4">
              <summary
                className={`cursor-pointer hero-title font-bold text-body-lg md:text-headline-md text-evergreen marker:text-harvest-orange ${focusRing}`}
              >
                {item.q}
              </summary>
              <p className="mt-3 font-body-md text-body-md text-on-surface-variant">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
