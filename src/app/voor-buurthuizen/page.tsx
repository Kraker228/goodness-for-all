import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderFlow from "@/components/forms/OrderFlow";
import { getSiteContent } from "@/lib/content";

const site = getSiteContent();

export const metadata: Metadata = {
  title: site.neighborhoods.metaTitle,
  description: site.neighborhoods.metaDescription,
};

export default function VoorBuurthuizenPage() {
  const { settings, neighborhoods, forms } = getSiteContent();

  return (
    <>
      <Header active="/voor-buurthuizen" settings={settings} />

      <main className="flex-grow">
        <section className="max-w-[1200px] mx-auto px-container-margin py-section-gap-sm md:py-section-gap-lg">
          <div className="flex flex-col md:flex-row gap-section-gap-sm items-start">
            <div className="w-full md:w-1/2">
              <h1 className="title-baloo text-evergreen mb-base">
                {neighborhoods.title}
              </h1>
              <p className="text-body-lg font-body-lg text-on-surface-variant max-w-xl">
                {neighborhoods.textForm}
              </p>

              {/* Uitlegblok: hoe werkt het */}
              <div className="mt-gutter max-w-xl border-l-4 border-harvest-orange bg-sandstone-beige/50 p-gutter">
                <p className="text-body-md font-body-md text-on-surface-variant">
                  {neighborhoods.explanation}
                </p>
              </div>

              {/* Toegangsblok + contactknop */}
              <div className="mt-gutter max-w-xl">
                <p className="text-body-md font-body-md text-on-surface-variant">
                  {neighborhoods.accessText}
                </p>

                {/* Desktop: oranje contactknop (ongewijzigd) */}
                <Link
                  href={neighborhoods.contactHref}
                  className="mt-base hidden md:inline-block bg-harvest-orange text-evergreen px-8 py-4 font-cta text-cta uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all"
                >
                  {neighborhoods.contactLabel}
                </Link>

                {/* Mobiel: contact wordt een subtiele tekstlink en de prominente
                    knop stuurt mensen naar het bestelformulier (scrollt de
                    datumbalk naar boven zodat het formulier zichtbaar is). */}
                <div className="md:hidden mt-base flex flex-col items-start gap-base">
                  <Link
                    href={neighborhoods.contactHref}
                    className="text-body-md font-body-md text-evergreen underline underline-offset-4"
                  >
                    {neighborhoods.contactLabel}
                  </Link>
                  <a
                    href="#bestellen"
                    className="inline-block bg-harvest-orange text-evergreen px-8 py-4 font-cta text-cta uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all"
                  >
                    Bestellen
                  </a>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <div id="bestellen" className="scroll-mt-[168px] bg-evergreen p-gutter mb-gutter">
                <p className="title-baloo text-white">
                  {neighborhoods.deliveryTitle}{" "}
                  <span className="text-harvest-orange">{neighborhoods.deliveryDate}</span>
                </p>
                <p className="text-body-md font-body-md text-white/90 mt-base">
                  {neighborhoods.deliveryLarge}
                  <br />
                  {neighborhoods.deliverySmall}
                </p>
              </div>
              <OrderFlow content={forms.order} />
            </div>
          </div>
        </section>

        <section className="w-full bg-evergreen py-section-gap-lg">
          <div className="max-w-[1200px] mx-auto px-container-margin">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              <div className="aspect-square bg-sandstone-beige overflow-hidden">
                <img
                  className="w-full h-full object-cover hover:grayscale transition-all duration-500"
                  alt={neighborhoods.visualAlt}
                  src={neighborhoods.visualImage}
                />
              </div>
              <div className="aspect-square bg-harvest-orange flex flex-col items-center justify-center text-center p-gutter">
                <h2 className="title-baloo text-white">
                  {neighborhoods.visualTitle}
                </h2>
                <p className="text-evergreen font-bold mt-base">
                  {neighborhoods.visualText}
                </p>
              </div>
              <div className="aspect-square border-2 border-sandstone-beige flex flex-col items-center justify-center text-center p-gutter">
                <span className="material-symbols-outlined text-harvest-orange text-6xl mb-base">
                  {neighborhoods.visualIcon}
                </span>
                <h2 className="title-baloo text-sandstone-beige">
                  {neighborhoods.visualIconTitle}
                </h2>
                <p className="text-sandstone-beige/80 font-body-md text-body-md mt-base">
                  {neighborhoods.visualIconText}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
