import type { Metadata } from "next";
import PlateCoinTuner from "./PlateCoinTuner";

// Tijdelijke testpagina om <PlateCoin /> te tunen. Niet indexeren; verwijderen
// zodra de instellingen vastliggen.
export const metadata: Metadata = {
  title: "PlateCoin testpagina",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function PlateCoinTestPage() {
  return (
    <main className="min-h-screen bg-evergreen text-sandstone-beige">
      <div className="max-w-[1200px] mx-auto px-container-margin py-section-gap-sm">
        <h1 className="hero-title font-bold text-headline-lg-mobile md:text-headline-lg">
          PlateCoin testpagina
        </h1>
        <p className="mt-2 font-body-md text-body-md opacity-80">
          Tijdelijke pagina om de draaiende munt te tunen. Niet geïndexeerd.
        </p>
        <PlateCoinTuner />
      </div>
    </main>
  );
}
