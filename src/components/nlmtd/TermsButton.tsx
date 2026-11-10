"use client";

import { useState, type ReactNode } from "react";
import Dialog from "./Dialog";
import { focusRing, focusRingOnDark } from "./styles";

/** Gemarkeerd open punt in de voorwaarden. Blijft zichtbaar tot het is ingevuld. */
function Todo({ children }: { children: ReactNode }) {
  return (
    <div className="my-3 border-l-4 border-harvest-orange bg-pure-mist px-4 py-3">{children}</div>
  );
}

function H({ children }: { children: ReactNode }) {
  return <h3 className="font-headline-md text-body-lg font-bold mt-5 mb-1">{children}</h3>;
}

export function TermsContent() {
  return (
    <div className="space-y-2 [&_p]:max-w-none">
      <Todo>
        <strong>Concept.</strong> Deze voorwaarden zijn een eerste versie en moeten nog juridisch
        worden gecontroleerd voordat de pagina live gaat.
      </Todo>
      <H>1. Wie zijn wij</H>
      <p>
        Stichting Goodness for All (KvK 73004521, Van der Duijn van Maasdamweg 480, Rotterdam),
        hierna “wij”. Dit aanbod is een experiment voor medewerkers van NLMTD. De maaltijden worden
        gemaakt door LAZY.
      </p>
      <H>2. Prijs</H>
      <p>
        Een maaltijd kost normaal €8, inclusief 9% btw. In dit aanbod betaal je €6 per maaltijd,
        inclusief btw. Dat is 25% korting, gelijk aan elke 4e maaltijd gratis, ook als je steeds
        minder dan 4 maaltijden tegelijk neemt.
      </p>
      <H>3. Je eerste bestelling</H>
      <p>
        Je betaalt je eerste bestelling bij aanmelding via iDEAL. Aanmelden kan tot en met 15
        december 2026. Wij leveren je eerste bestelling gegarandeerd op maandag 11 januari 2027 bij
        NLMTD. Je kunt hem de hele week ophalen, op werkdagen.
      </p>
      <H>4. Abonnement</H>
      <p>
        Je kiest hoeveel maaltijden je per levering wilt (2 tot 12) en hoe vaak per maand (1, 2, 3
        of 4 keer). Bij voldoende animo zetten wij het abonnement door vanaf 1 februari 2027 en laten
        wij dat vóór die datum per e-mail weten. Is er onvoldoende animo, dan blijft het bij je
        eerste levering. Je betaalt dan niets meer en er zijn geen verplichtingen over en weer.
      </p>
      <H>5. Automatische incasso</H>
      <p>
        Met je akkoord geef je ons een machtiging voor SEPA-incasso, via onze betaalprovider Mollie.
        Als het abonnement doorgaat, schrijven wij elke 1e van de maand het bedrag af van je
        abonnement: aantal maaltijden per levering × leveringen per maand × €6. Je kunt een
        afschrijving binnen 8 weken laten terugboeken via je bank.
      </p>
      <H>6. Ophalen</H>
      <p>
        Je haalt je maaltijden op bij NLMTD, 5 dagen per week. Je pakt je maaltijden uit de vriezer
        en vinkt ze af op de lijst. Elke week ligt er een andere smaak gegarandeerd. Welke andere
        smaken beschikbaar zijn, kan wisselen.
      </p>
      <Todo>Nog te bepalen: wat gebeurt er met maaltijden die je niet ophaalt?</Todo>
      <H>7. Opzeggen</H>
      <p>
        Je kunt altijd opzeggen, met een opzegtermijn van 2 weken, door een e-mail te sturen naar
        info@goodnessforall.nl. Leveringen en incasso’s die binnen de opzegtermijn vallen, horen nog
        bij je abonnement.
      </p>
      <H>8. Facturen</H>
      <p>Een factuur per maand is op aanvraag beschikbaar via info@goodnessforall.nl.</p>
      <H>9. Bewaren en allergieën</H>
      <p>
        De maaltijden zijn diepvriesproducten. Bewaar ze bij -18 °C of kouder en vries ze na
        ontdooien niet opnieuw in. Per smaak tonen wij de ingrediënten en allergenen op basis van de
        informatie van LAZY. Controleer altijd het etiket op de verpakking. Geef allergieën door in
        het formulier. Wij kunnen geen garantie geven over kruisbesmetting.
      </p>
      <H>10. Herroeping</H>
      <Todo>
        Nog juridisch te bepalen: hoe gaan we om met het herroepingsrecht, ook gezien de aard van
        diepvriesproducten?
      </Todo>
      <H>11. Privacy</H>
      <p>
        Wij gebruiken je naam, e-mailadres, telefoonnummer, allergieën en voorkeuren alleen om dit
        experiment uit te voeren en te evalueren. Betaalgegevens worden verwerkt door Mollie. Je
        gegevens worden bewaard in een beveiligde administratie van de stichting. Je kunt altijd
        vragen om je gegevens in te zien of te verwijderen via info@goodnessforall.nl.
      </p>
      <H>12. Toepasselijk recht</H>
      <p>
        Op deze voorwaarden is Nederlands recht van toepassing. Heb je een klacht? Mail ons, dan
        zoeken we samen een oplossing.
      </p>
    </div>
  );
}

type Props = {
  children: ReactNode;
  /** Op donkere achtergrond (footer) een oranje focusring. */
  onDark?: boolean;
  className?: string;
};

/** Tekstknop die de algemene voorwaarden in een dialoog opent. */
export default function TermsButton({ children, onDark = false, className = "" }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className={`underline underline-offset-4 font-bold cursor-pointer hover:text-harvest-orange ${
          onDark ? focusRingOnDark : focusRing
        } ${className}`}
      >
        {children}
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} title="Algemene voorwaarden">
        <TermsContent />
      </Dialog>
    </>
  );
}
