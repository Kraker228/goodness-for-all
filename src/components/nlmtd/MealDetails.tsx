import Image from "next/image";
import { MEALS } from "@/lib/nlmtd/meals";
import { sectionTitle } from "./InfoSections";
import { focusRing, textLink } from "./styles";

export default function MealDetails() {
  return (
    <section className="bg-pure-mist py-section-gap-sm md:py-section-gap-lg">
      <div className="max-w-[1200px] mx-auto px-container-margin">
        <h2 className={sectionTitle}>De smaken</h2>
        <p className="mt-2 font-body-lg text-body-lg text-on-surface-variant">
          Alle maaltijden zijn plantaardig en worden gemaakt door LAZY, een B Corp.
        </p>

        <div className="mt-8">
          {MEALS.map((meal, i) => (
            <article
              key={meal.id}
              id={`smaak-${meal.id}`}
              className="scroll-mt-[184px] md:scroll-mt-[124px] grid gap-6 md:grid-cols-2 md:gap-14 items-center py-8 border-t-2 border-evergreen"
            >
              <div
                className={`relative aspect-[4/3] overflow-hidden border-2 border-evergreen bg-sandstone-beige ${
                  i % 2 === 1 ? "md:order-2" : ""
                }`}
              >
                <Image
                  src={meal.mood.src}
                  alt={meal.name}
                  fill
                  sizes="(min-width: 1200px) 560px, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="hero-title font-bold text-headline-md md:text-[32px] text-evergreen">
                  {meal.name}
                </h3>
                <p className="mt-2 font-body-md text-body-md text-on-surface-variant">{meal.desc}</p>
                <ul className="flex flex-wrap gap-2 my-4">
                  {[
                    `${meal.kcal} kcal`,
                    `${meal.veg} g groenten`,
                    `${meal.protein} g eiwit`,
                    `${meal.weight}, 1 persoon`,
                  ].map((stat) => (
                    <li
                      key={stat}
                      className="border-2 border-evergreen bg-surface px-3 py-1 font-label-sm text-label-sm"
                    >
                      {stat}
                    </li>
                  ))}
                </ul>
                <p className="font-body-md text-body-md">
                  <strong>Allergenen:</strong> {meal.allergens} Check altijd het etiket.
                </p>
                <details className="mt-3 group">
                  <summary
                    className={`cursor-pointer font-bold py-1 marker:text-harvest-orange ${focusRing}`}
                  >
                    Ingrediënten
                  </summary>
                  <p className="mt-2 font-body-md text-label-sm leading-relaxed text-on-surface-variant">
                    {meal.ingredients}
                  </p>
                </details>
                <a href="#samenstellen" className={`inline-block mt-4 ${textLink}`}>
                  Terug naar je abonnement
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
