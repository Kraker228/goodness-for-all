import type { Metadata } from "next";
import { connection } from "next/server";
import { getSiteContent } from "@/lib/content";
import { isSignupOpen } from "@/lib/nlmtd/config";
import Header from "@/components/Header";
import CobrandBar from "@/components/nlmtd/CobrandBar";
import NlmtdFooter from "@/components/nlmtd/NlmtdFooter";
import Hero from "@/components/nlmtd/Hero";
import { HowItWorks, WhySection, sectionTitle } from "@/components/nlmtd/InfoSections";
import SubscriptionBuilder from "@/components/nlmtd/SubscriptionBuilder";
import { SignupClosed } from "@/components/nlmtd/SignupClosed";
import MealDetails from "@/components/nlmtd/MealDetails";
import Faq from "@/components/nlmtd/Faq";

// Abonnementspagina voor NLMTD, bereikbaar via het menu-item "NLMTD".
export const metadata: Metadata = {
  title: "Maaltijdabonnement voor NLMTD, door Goodness for All",
  description:
    "Gezonde maaltijden van Goodness for All voor de collega’s van NLMTD. Stel je eigen abonnement samen.",
};

export default async function NlmtdPage() {
  // Per verzoek renderen, zodat de aanmelddeadline op de server wordt gecontroleerd.
  await connection();
  const open = isSignupOpen();
  const { settings } = getSiteContent();

  return (
    <>
      <Header active="/NLMTD" settings={settings} />
      <CobrandBar />
      <main>
        <Hero />
        <WhySection />
        <HowItWorks />

        <section
          id="samenstellen"
          className="scroll-mt-[184px] md:scroll-mt-[124px] bg-surface py-section-gap-sm md:py-section-gap-lg"
        >
          <div className="max-w-[1200px] mx-auto px-container-margin">
            <h2 className={sectionTitle}>Stel je abonnement samen</h2>
            {open ? (
              <>
                <p className="mt-2 max-w-3xl font-body-lg text-body-lg text-on-surface-variant">
                  In het abonnement kost elke maaltijd <strong>€6 in plaats van €8</strong>. Dat is
                  hetzelfde als elke 4e maaltijd gratis, maar dan altijd, ook als je er steeds 3
                  neemt. De losse verkoop kan ook opraken, bij de abonnementen garanderen we dat er
                  steeds voldoende keuze is.
                </p>
                <SubscriptionBuilder />
              </>
            ) : (
              <SignupClosed />
            )}
          </div>
        </section>

        <MealDetails />
        <Faq />
      </main>
      <NlmtdFooter />
    </>
  );
}
