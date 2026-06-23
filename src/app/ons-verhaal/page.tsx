import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import SubsidyFlowScroll from "@/components/ons-verhaal/SubsidyFlowScroll";

export const metadata: Metadata = {
  title: "Ons verhaal | Goodness for All",
};

export default function OnsVerhaalPage() {
  return (
    <>
      <Header active="/ons-verhaal" />

      <main className="max-w-[1200px] mx-auto px-container-margin">
        {/* Section 1: Rotterdam Challenge */}
        <section className="py-section-gap-lg flex flex-col md:flex-row items-center gap-section-gap-sm pt-section-gap-sm">
          <Reveal className="w-full md:w-1/2 overflow-hidden border-2 border-evergreen">
            <img
              className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
              alt="Een rauw maar humanistisch hoog-contrast straatfotografie beeld van een Rotterdamse woonwijk in de ochtendnevel."
              src="/images/ons-verhaal/hero.jpg"
            />
          </Reveal>
          <Reveal className="w-full md:w-1/2">
            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-evergreen mb-8">
              Rotterdam heeft een probleem. En dat lost zichzelf niet op.
            </h1>
            <p className="font-body-lg text-body-lg text-evergreen/90 mb-6">
              In onze stad groeit de kloof. Terwijl de ene wijk bloeit, hebben duizenden
              Rotterdammers dagelijks moeite om een gezonde maaltijd op tafel te krijgen.
              Voedselonzekerheid is niet alleen een gebrek aan calorieën; het is een gebrek aan
              waardigheid en kansen.
            </p>
            <p className="font-body-md text-body-md text-evergreen/80">
              Wij geloven dat toegang tot goed eten een basisrecht is. Armoede in Rotterdam is vaak
              onzichtbaar, maar de gevolgen zijn dat niet. Wij wachten niet op beleid, wij bouwen aan
              een directe oplossing die de stad verbindt.
            </p>
          </Reveal>
        </section>

      </main>

      {/* Section 2: Diagram / Subsidy Flow — pinned, scroll-scrubbed reveal.
       *  Full-width (outside the max-w container) so the panel can pin to the
       *  viewport; the component supplies its own inner max-width. See
       *  SubsidyFlowScroll for the scroll mechanics and reduced-motion fallback. */}
      <SubsidyFlowScroll />

      <main className="max-w-[1200px] mx-auto px-container-margin">
        {/* Section 3: Distribution / Neighborhood Centers */}
        <section className="py-section-gap-lg">
          <Reveal className="flex flex-col md:flex-row-reverse items-center gap-section-gap-sm">
            <div className="w-full md:w-1/2 overflow-hidden border-2 border-evergreen">
              <img
                className="w-full h-[500px] object-cover hover:grayscale transition-all duration-500"
                alt="Een warm en uitnodigend interieurbeeld van een levendig buurthuis in Rotterdam."
                src="/images/ons-verhaal/distribution.jpg"
              />
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-evergreen mb-8">
                Via buurthuizen die mensen al kennen.
              </h2>
              <p className="font-body-lg text-body-lg text-evergreen/90 mb-6">
                We gaan niet op zoek naar onze doelgroep; we zijn waar zij zijn. Onze maaltijden
                worden gedistribueerd via vertrouwde buurthuizen en lokale hubs.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 border-b border-evergreen pb-4">
                  <span className="material-symbols-outlined text-harvest-orange">location_on</span>
                  <span className="font-label-sm text-label-sm uppercase">Dichtbij huis</span>
                </li>
                <li className="flex items-center gap-4 border-b border-evergreen pb-4">
                  <span className="material-symbols-outlined text-harvest-orange">favorite</span>
                  <span className="font-label-sm text-label-sm uppercase">Zonder drempels</span>
                </li>
                <li className="flex items-center gap-4 border-b border-evergreen pb-4">
                  <span className="material-symbols-outlined text-harvest-orange">groups</span>
                  <span className="font-label-sm text-label-sm uppercase">Onderdeel van de wijk</span>
                </li>
              </ul>
            </div>
          </Reveal>
        </section>

        {/* Section 4: Product / B-Corp */}
        <section className="py-section-gap-lg grid grid-cols-1 md:grid-cols-2 gap-base border-2 border-evergreen">
          <div className="p-12 flex flex-col justify-center bg-pure-mist">
            <div className="mb-6">
              <span className="bg-asparagus text-evergreen font-label-sm text-[10px] px-3 py-1 uppercase tracking-tighter inline-block mb-4">
                B-Corp Gecertificeerd
              </span>
              <h2 className="font-headline-md text-headline-md text-evergreen uppercase">
                De maaltijd.
              </h2>
            </div>
            <p className="font-body-md text-body-md text-evergreen/90 mb-8">
              Gezond, vers en seizoensgebonden. Onze maaltijden worden bereid met passie en zorg voor
              de planeet. Wij geloven in &apos;business as a force for good&apos;. Elke maaltijd
              draagt bij aan een rechtvaardiger Rotterdam.
            </p>
            <div className="flex gap-4">
              <div className="p-4 bg-sandstone-beige border border-evergreen/20 flex-1">
                <p className="font-headline-md text-harvest-orange mb-1">100%</p>
                <p className="text-[10px] uppercase font-bold text-evergreen">Versgarantie</p>
              </div>
              <div className="p-4 bg-sandstone-beige border border-evergreen/20 flex-1">
                <p className="font-headline-md text-harvest-orange mb-1">CO2</p>
                <p className="text-[10px] uppercase font-bold text-evergreen">Neutraal</p>
              </div>
            </div>
          </div>
          <div className="relative h-[400px] md:h-full overflow-hidden border-l-2 border-evergreen">
            <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar h-full">
              {/* Slide 1 */}
              <div className="flex-none w-full h-full snap-start relative group">
                <img
                  alt="9 verschillende smaken"
                  className="w-full h-full object-cover"
                  src="/images/ons-verhaal/carousel-1.jpg"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-evergreen/80 p-4">
                  <p className="font-body-lg text-sandstone-beige text-center">
                    9 verschillende smaken
                  </p>
                </div>
              </div>
              {/* Slide 2 */}
              <div className="flex-none w-full h-full snap-start relative group">
                <img
                  alt="Boordevol groente, geen troep"
                  className="w-full h-full object-cover"
                  src="/images/ons-verhaal/carousel-2.jpg"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-evergreen/80 p-4">
                  <p className="font-body-lg text-sandstone-beige text-center">
                    Boordevol groente, geen troep
                  </p>
                </div>
              </div>
              {/* Slide 3 */}
              <div className="flex-none w-full h-full snap-start relative group">
                <img
                  alt="Past in (bijna) elk dieet en levensovertuiging"
                  className="w-full h-full object-cover"
                  src="/images/ons-verhaal/carousel-3.jpg"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-evergreen/80 p-4">
                  <p className="font-body-lg text-sandstone-beige text-center">
                    Past in (bijna) elk dieet en levensovertuiging
                  </p>
                </div>
              </div>
            </div>
            {/* Navigation Dots */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              <div className="w-2 h-2 rounded-full bg-harvest-orange" />
              <div className="w-2 h-2 rounded-full bg-sandstone-beige/50" />
              <div className="w-2 h-2 rounded-full bg-sandstone-beige/50" />
            </div>
          </div>
        </section>

        {/* Section 5: Team Grid */}
        <section className="py-section-gap-lg mb-section-gap-lg">
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-evergreen mb-12 text-center">
            Het Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Member 1 */}
            <div className="team-card group">
              <div className="border-2 border-evergreen overflow-hidden aspect-square relative">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt="Professionele headshot van Reinout de Kraker."
                  src="/images/ons-verhaal/team-1.jpg"
                />
                <div className="absolute inset-0 bg-evergreen/10 group-hover:bg-transparent transition-colors" />
              </div>
              <div className="mt-4">
                <h3 className="font-headline-md text-evergreen">Reinout de Kraker</h3>
                <p className="font-label-sm text-label-sm text-harvest-orange uppercase">
                  Oprichter &amp; Strategie
                </p>
              </div>
            </div>
            {/* Member 2 */}
            <div className="team-card group">
              <div className="border-2 border-evergreen overflow-hidden aspect-square relative">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt="Professionele headshot van Thomas Hilbrands."
                  src="/images/ons-verhaal/team-2.jpg"
                />
                <div className="absolute inset-0 bg-evergreen/10 group-hover:bg-transparent transition-colors" />
              </div>
              <div className="mt-4">
                <h3 className="font-headline-md text-evergreen">Thomas Hilbrands</h3>
                <p className="font-label-sm text-label-sm text-harvest-orange uppercase">
                  Operations &amp; Logistiek
                </p>
              </div>
            </div>
            {/* Member 3 */}
            <div className="team-card group">
              <div className="border-2 border-evergreen overflow-hidden aspect-square relative">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt="Professionele headshot van Laurens van Dalen."
                  src="/images/ons-verhaal/team-3.jpg"
                />
                <div className="absolute inset-0 bg-evergreen/10 group-hover:bg-transparent transition-colors" />
              </div>
              <div className="mt-4">
                <h3 className="font-headline-md text-evergreen">Laurens van Dalen</h3>
                <p className="font-label-sm text-label-sm text-harvest-orange uppercase">
                  Commercieel Directeur
                </p>
              </div>
            </div>
            {/* Member 4 */}
            <div className="team-card group">
              <div className="border-2 border-evergreen overflow-hidden aspect-square relative">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt="Professionele headshot van Jori Schara."
                  src="/images/ons-verhaal/team-4.jpg"
                />
                <div className="absolute inset-0 bg-evergreen/10 group-hover:bg-transparent transition-colors" />
              </div>
              <div className="mt-4">
                <h3 className="font-headline-md text-evergreen">Jori Schara</h3>
                <p className="font-label-sm text-label-sm text-harvest-orange uppercase">
                  Impact Manager
                </p>
              </div>
            </div>
            {/* Member 5 */}
            <div className="team-card group">
              <div className="border-2 border-evergreen overflow-hidden aspect-square relative">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt="Professionele headshot van Stef Gallé."
                  src="/images/ons-verhaal/team-5.jpg"
                />
                <div className="absolute inset-0 bg-evergreen/10 group-hover:bg-transparent transition-colors" />
              </div>
              <div className="mt-4">
                <h3 className="font-headline-md text-evergreen">Stef Gallé</h3>
                <p className="font-label-sm text-label-sm text-harvest-orange uppercase">
                  Community Lead
                </p>
              </div>
            </div>
            {/* Member 6 */}
            <div className="team-card group">
              <div className="border-2 border-evergreen overflow-hidden aspect-square relative">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt="Professionele headshot van Martijn Bekking."
                  src="/images/ons-verhaal/team-6.jpg"
                />
                <div className="absolute inset-0 bg-evergreen/10 group-hover:bg-transparent transition-colors" />
              </div>
              <div className="mt-4">
                <h3 className="font-headline-md text-evergreen">Martijn Bekking</h3>
                <p className="font-label-sm text-label-sm text-harvest-orange uppercase">
                  Financieel Adviseur
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
