import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PartnerForm from "@/components/forms/PartnerForm";
import PartnerHero from "@/components/partners/PartnerHero";
import WaveLines from "@/components/partners/WaveLines";
import ImpactCard, { type Plan } from "@/components/partners/ImpactCard";
import YouTubeFacade from "@/components/partners/YouTubeFacade";
import PartnerStrip from "@/components/home/PartnerStrip";
import { getSiteContent } from "@/lib/content";

const site = getSiteContent();

export const metadata: Metadata = {
  title: site.partners.metaTitle,
};

export default async function PartnersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { settings, partners, forms } = getSiteContent();
  const params = await searchParams;
  const choice = typeof params.keuze === "string" ? params.keuze : undefined;

  return (
    <>
      <Header active="/partners" settings={settings} />
      <main>
        <PartnerHero content={partners.hero} />

        <section
          id="impact-niveau"
          className="scroll-mt-28 py-section-gap-lg px-container-margin max-w-[1200px] mx-auto"
        >
          <div className="text-center mb-12">
            <h2 className="hero-title font-bold text-headline-lg text-evergreen">
              {partners.pricingTitle}
            </h2>
            <p className="text-body-lg text-body-lg mt-4">{partners.pricingText}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {partners.plans.map((plan) => (
              <ImpactCard
                key={plan.name}
                plan={plan as unknown as Plan}
                mealsTooltip={partners.mealsTooltip}
                freezerTooltip={partners.freezerTooltip}
              />
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 bg-sandstone-beige items-stretch">
          <div className="h-[400px] md:h-[600px] relative overflow-hidden">
            <YouTubeFacade
              videoId={partners.freezer.youtubeId}
              title={partners.freezer.title}
              playLabel={partners.freezer.playLabel}
            />
          </div>
          <div className="relative overflow-hidden p-container-margin md:p-section-gap-sm flex flex-col justify-center">
            <WaveLines />
            <div className="relative z-10">
              <h3 className="hero-title font-bold text-headline-lg text-evergreen mb-6">
                {partners.freezer.title}
              </h3>
              <p className="text-body-lg text-body-lg mb-4 max-w-md">{partners.freezer.intro}</p>
              <ol className="space-y-2 mb-4 max-w-md list-decimal list-inside text-body-md text-body-md text-evergreen/90">
                {partners.freezer.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ol>
              <p className="text-body-lg text-body-lg mb-8 max-w-md">{partners.freezer.outro}</p>
              <div className="border-l-4 border-harvest-orange pl-6 py-2">
                <p className="italic text-body-md font-bold text-evergreen">
                  &quot;{partners.freezer.quote}&quot;
                </p>
                <p className="text-label-sm mt-2 text-on-surface-variant">
                  {partners.freezer.quoteAuthor}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-section-gap-lg text-center overflow-hidden bg-white">
          <h2 className="hero-title font-bold text-headline-md text-evergreen mb-12 px-container-margin">
            {partners.logoGridTitle}
          </h2>
          <PartnerStrip />
        </section>

        <section
          id="partner-formulier"
          className="scroll-mt-28 py-section-gap-lg bg-evergreen px-container-margin"
        >
          <div className="max-w-[800px] mx-auto bg-pure-mist p-8 md:p-12 border-2 border-harvest-orange">
            <div className="mb-10">
              <h2 className="font-headline-lg text-headline-lg text-evergreen mb-2">
                {partners.formTitle}
              </h2>
              <p className="text-body-md text-evergreen">
                {partners.formText}
              </p>
            </div>
            <PartnerForm content={forms.partner} initialChoice={choice} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
