"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Tailwind's mobiele bereik is alles onder de `md`-breakpoint (768px). We
// gebruiken dezelfde grens, zodat deze correctie strikt op mobiel geldt.
const MOBILE_QUERY = "(max-width: 767.98px)";

/**
 * Zorgt dat pagina's op mobiel altijd bovenaan laden. In Next.js 16 overschrijft
 * de router `scroll-behavior: smooth` niet langer tijdens navigatie, waardoor de
 * sprong naar de top mee-animeert en soms halverwege blijft hangen. Op mobiel
 * viel de bovenkant van de inhoud daardoor onder de vaste header. We zetten de
 * browser-scrollrestauratie uit en springen direct (zonder animatie) naar de
 * top. Ankernavigatie (bijv. #partner-formulier) laten we ongemoeid.
 *
 * Desktop wordt niet geraakt: de mediaquery sluit alles vanaf de md-breakpoint
 * uit, dus daar gebeurt niets.
 */
export default function MobileScrollReset() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia(MOBILE_QUERY).matches) return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    if (window.location.hash) return;

    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
}
