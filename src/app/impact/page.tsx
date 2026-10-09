import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Counter from "@/components/home/Counter";
import ParticleField from "@/components/impact/ParticleField";
import LocationsMap from "@/components/impact/LocationsMap";
import ReportModal from "@/components/impact/ReportModal";
import ObfuscatedMailto from "@/components/impact/ObfuscatedMailto";
import { getSiteContent } from "@/lib/content";

const site = getSiteContent();

export const metadata: Metadata = {
  title: site.impact.metaTitle,
};

export default function ImpactPage() {
  const { settings, impact } = getSiteContent();

  return (
    <>
      <Header active="/impact" settings={settings} />
      <main>
        {/* Groene teller, identiek vormgegeven aan de home. */}
        <section className="bg-evergreen py-section-gap-lg text-sandstone-beige">
          <div className="max-w-[1200px] mx-auto px-container-margin text-center">
            <div className="mb-4">
              <Counter
                end={impact.counterValue}
                pauseAt={impact.counterPauseValue}
                suffix=""
                className="text-[80px] md:text-[120px] hero-title font-bold leading-none text-white block"
              />
              <span className="text-2xl md:text-4xl hero-title font-bold text-white/90 uppercase tracking-widest block -mt-1">
                {impact.counterLabel}
              </span>
            </div>
            <div className="h-1 w-24 bg-harvest-orange mx-auto mb-8" />
            <p className="font-body-lg text-body-lg opacity-80 max-w-xl mx-auto">
              {impact.counterText}
            </p>
          </div>
        </section>

        {/* Smalle achtergrondstreep. */}
        <div className="h-3 bg-sandstone-beige w-full" />

        {/* Kop "Impact Locaties" + paginabrede kaart. */}
        <section className="py-section-gap-sm">
          <div className="max-w-[1200px] mx-auto px-container-margin">
            <h2 className="hero-title font-bold text-headline-lg md:text-[48px] text-evergreen mb-section-gap-sm">
              Impact Locaties
            </h2>
          </div>
          <div className="px-container-margin">
            <LocationsMap />
          </div>
        </section>

        <section className="max-w-[1200px] mx-auto px-container-margin py-section-gap-sm">
          <div className="relative overflow-hidden bg-sandstone-beige p-section-gap-sm border-evergreen border-2 flex flex-col items-center">
            <ParticleField />
            <div className="relative z-10 flex flex-col items-center">
              <blockquote className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-evergreen text-center max-w-3xl mb-8">
                &quot;{impact.quote.text}&quot;
              </blockquote>
              <cite className="not-italic font-label-sm text-label-sm text-evergreen uppercase tracking-widest">
                {impact.quote.author}
              </cite>
            </div>
          </div>
        </section>

        <section className="max-w-[1200px] mx-auto px-container-margin py-section-gap-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {impact.gallery.map((item, index) =>
              item.placeholder ? (
                <ObfuscatedMailto
                  key={`placeholder-${index}`}
                  user="info"
                  domain="goodnessforall.nl"
                  subject="Foto's voor Goodness for All"
                  className="group aspect-square bg-surface-variant flex items-center justify-center border-2 border-dashed border-evergreen/30 p-base text-center transition-colors hover:border-harvest-orange hover:bg-sandstone-beige/40"
                >
                  <span className="font-label-sm text-label-sm text-evergreen/50 transition-colors group-hover:text-harvest-orange">
                    {item.text}
                  </span>
                </ObfuscatedMailto>
              ) : (
                <div
                  key={item.image}
                  className="aspect-square bg-surface-variant relative overflow-hidden"
                >
                  {/* Standaard in kleur; bij hover wordt de foto zwart-wit. */}
                  <img
                    className="object-cover w-full h-full transition-all duration-500 hover:grayscale"
                    alt={item.alt}
                    src={item.image}
                  />
                </div>
              ),
            )}
          </div>
        </section>

        <section className="max-w-[1200px] mx-auto px-container-margin py-section-gap-sm md:py-section-gap-lg grid md:grid-cols-2 gap-12 items-start">
          <div className="bg-evergreen p-section-gap-sm text-pure-mist border-2 border-evergreen transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#ED961D]">
            <h2 className="font-headline-md text-headline-md text-harvest-orange mb-6">
              {impact.research.title}
            </h2>
            <div className="font-body-md text-body-md space-y-4 mb-8">
              <p>{impact.research.text}</p>
            </div>
            <ReportModal
              buttonLabel={impact.research.buttonLabel}
              title={impact.research.reportModalTitle}
              text={impact.research.reportModalText}
            />
          </div>
          <a
            href={impact.research.sroiHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-section-gap-sm bg-sandstone-beige/30 border-2 border-evergreen self-stretch flex flex-col justify-center transition-all duration-200 ease-out hover:-translate-y-1 hover:bg-sandstone-beige hover:shadow-[8px_8px_0_0_#334E1F]"
          >
            <h3 className="font-label-sm text-label-sm text-evergreen uppercase mb-4 tracking-widest flex items-center gap-2">
              {impact.research.sroiEyebrow}
              <span className="material-symbols-outlined text-[18px] text-harvest-orange transition-transform group-hover:translate-x-1">
                north_east
              </span>
            </h3>
            <p className="font-headline-md text-headline-md text-evergreen mb-4">
              {impact.research.sroiTitle}
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {impact.research.sroiText}
            </p>
            <div className="mt-8 pt-8 border-t border-evergreen/20">
              <p className="font-label-sm text-[12px] text-evergreen/60">
                {impact.research.sroiNote}
              </p>
            </div>
          </a>
        </section>
      </main>
      <Footer />
    </>
  );
}
