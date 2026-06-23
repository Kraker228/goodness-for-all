import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PartnerForm from "@/components/forms/PartnerForm";
import PartnerHero from "@/components/partners/PartnerHero";

export const metadata: Metadata = {
  title: "Partners | Goodness for All",
};

export default function PartnersPage() {
  return (
    <>
      <Header active="/partners" />
      <main>
        {/* Hero Split Layout */}
        <PartnerHero />

        {/* Comparison Cards */}
        <section className="py-section-gap-lg px-container-margin max-w-[1200px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-headline-lg text-headline-lg text-evergreen">
              Kies uw impact niveau
            </h2>
            <p className="text-body-lg text-body-lg mt-4">Transparante bijdragen, meetbaar resultaat.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Supporter */}
            <div className="bg-sandstone-beige p-8 border-2 border-evergreen flex flex-col h-full transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_var(--color-evergreen)]">
              <span className="font-label-sm text-label-sm text-evergreen uppercase tracking-widest mb-4">
                Impact Supporter
              </span>
              <div className="text-headline-lg text-headline-lg text-evergreen mb-6">
                €500 <span className="text-body-md">/ jaar</span>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex items-start gap-2 text-body-md">
                  <span className="material-symbols-outlined text-evergreen">check_box</span>
                  100 gezonde maaltijden voor Rotterdamse gezinnen.
                </li>
                <li className="flex items-start gap-2 text-body-md">
                  <span className="material-symbols-outlined text-evergreen">check_box</span>
                  Jaarlijks digitaal impact certificaat.
                </li>
                <li className="flex items-start gap-2 text-body-md">
                  <span className="material-symbols-outlined text-evergreen">check_box</span>
                  Logo vermelding op onze website.
                </li>
              </ul>
              <button className="w-full bg-evergreen text-sandstone-beige py-4 font-cta text-cta hover:bg-primary transition-colors">
                Start als Supporter
              </button>
            </div>

            {/* Builder */}
            <div className="bg-pure-mist p-8 border-2 border-harvest-orange flex flex-col h-full relative transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_var(--color-harvest-orange)]">
              <div className="absolute top-0 right-0 bg-harvest-orange text-evergreen px-4 py-1 font-label-sm text-label-sm">
                POPULAIR
              </div>
              <span className="font-label-sm text-label-sm text-evergreen uppercase tracking-widest mb-4">
                Impact Builder
              </span>
              <div className="text-headline-lg text-headline-lg text-evergreen mb-6">
                €1.250 <span className="text-body-md">/ jaar</span>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex items-start gap-2 text-body-md">
                  <span className="material-symbols-outlined text-evergreen">check_box</span>
                  300 gezonde maaltijden.
                </li>
                <li className="flex items-start gap-2 text-body-md">
                  <span className="material-symbols-outlined text-evergreen">check_box</span>
                  Volledig CSRD-klaar impact rapportage.
                </li>
                <li className="flex items-start gap-2 text-body-md">
                  <span className="material-symbols-outlined text-evergreen">check_box</span>
                  Goodness vrieskast voor op kantoor (optioneel).
                </li>
              </ul>
              <button className="w-full bg-harvest-orange text-evergreen py-4 font-cta text-cta active:scale-95 transition-transform">
                Word Impact Builder
              </button>
            </div>

            {/* Leader */}
            <div className="bg-evergreen p-8 border-2 border-evergreen flex flex-col h-full transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0_0_var(--color-harvest-orange)]">
              <span className="font-label-sm text-label-sm text-sandstone-beige uppercase tracking-widest mb-4">
                Impact Leader
              </span>
              <div className="text-headline-lg text-headline-lg text-harvest-orange mb-6">
                €2.500 <span className="text-body-md text-sandstone-beige">/ jaar</span>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex items-start gap-2 text-body-md text-sandstone-beige">
                  <span className="material-symbols-outlined text-harvest-orange">check_box</span>
                  750 gezonde maaltijden.
                </li>
                <li className="flex items-start gap-2 text-body-md text-sandstone-beige">
                  <span className="material-symbols-outlined text-harvest-orange">check_box</span>
                  Gepersonaliseerd CSRD/ESG rapport per kwartaal.
                </li>
                <li className="flex items-start gap-2 text-body-md text-sandstone-beige">
                  <span className="material-symbols-outlined text-harvest-orange">check_box</span>
                  Impact video voor uw bedrijfscommunicatie.
                </li>
              </ul>
              <button className="w-full bg-sandstone-beige text-evergreen py-4 font-cta text-cta hover:bg-white transition-colors">
                Leid de Impact
              </button>
            </div>
          </div>
        </section>

        {/* Freezer Showcase Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 bg-sandstone-beige items-center">
          <div className="h-[400px] md:h-[600px] relative overflow-hidden">
            <img
              className="w-full h-full object-cover"
              alt="Een moderne, strakke Goodness for All vrieskast in een licht, eigentijds Rotterdams kantoor, gevuld met kleurrijke gezonde maaltijden."
              src="/images/partners/freezer.jpg"
            />
          </div>
          <div className="p-container-margin md:p-section-gap-sm">
            <h3 className="font-headline-lg text-headline-lg text-evergreen mb-6">
              Directe impact in uw kantoor.
            </h3>
            <p className="text-body-lg text-body-lg mb-8 max-w-md">
              Met de GfA vrieskast op locatie biedt u niet alleen gezonde opties aan uw medewerkers,
              maar toont u elke dag uw betrokkenheid bij de stad.
            </p>
            <div className="border-l-4 border-harvest-orange pl-6 py-2">
              <p className="italic text-body-md font-bold text-evergreen">
                &quot;De vrieskast is een dagelijkse reminder aan onze missie om Rotterdam sterker te
                maken.&quot;
              </p>
              <p className="text-label-sm mt-2 text-on-surface-variant">
                — HR Directeur, Rotterdamse Partner
              </p>
            </div>
          </div>
        </section>

        {/* Partner Grid */}
        <section className="py-section-gap-lg px-container-margin max-w-[1200px] mx-auto text-center">
          <h2 className="font-headline-md text-headline-md text-evergreen mb-12">Zij gingen je voor</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {[
              { file: "havenbedrijf", alt: "Havenbedrijf Rotterdam" },
              { file: "erasmus-mc", alt: "Erasmus MC" },
              { file: "coolblue", alt: "Coolblue" },
              { file: "unilever", alt: "Unilever" },
              { file: "port-base", alt: "Port Base" },
            ].map((partner) => (
              <div
                key={partner.file}
                className="flex items-center justify-center p-2 border border-evergreen/10"
              >
                <img
                  src={`/images/partners/logos/${partner.file}.png`}
                  alt={partner.alt}
                  className="max-h-40 w-auto max-w-full object-contain opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-section-gap-lg bg-evergreen px-container-margin">
          <div className="max-w-[800px] mx-auto bg-pure-mist p-8 md:p-12 border-2 border-harvest-orange">
            <div className="mb-10">
              <h2 className="font-headline-lg text-headline-lg text-evergreen mb-2">Impact maken?</h2>
              <p className="text-body-md text-evergreen">
                Vul het formulier in en we nemen binnen 24 uur contact op.
              </p>
            </div>
            <PartnerForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
