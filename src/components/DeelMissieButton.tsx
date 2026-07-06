"use client";

import { useEffect, useRef, useState } from "react";

const SHARE_TITLE = "Goodness for All";
const SHARE_TEXT = "Goed eten voor iedereen bereikbaar maken. Steun je onze missie?";

const DEFAULT_LABEL = "Deel onze missie";
const COPIED_LABEL = "Link gekopieerd";

/**
 * Deelknop die als secundaire variant naast de contactknop staat. Op mobiel
 * roept hij het native deelmenu op via de Web Share API. Op desktop, waar die
 * API vaak ontbreekt, valt hij terug op het kopiëren van de link naar het
 * klembord. Window en navigator worden pas bij de klik benaderd, dus de knop is
 * veilig voor server-side rendering.
 */
export default function DeelMissieButton() {
  const [label, setLabel] = useState(DEFAULT_LABEL);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const showCopied = () => {
    setLabel(COPIED_LABEL);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setLabel(DEFAULT_LABEL), 2000);
  };

  const handleClick = async () => {
    const url = window.location.href;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: SHARE_TITLE, text: SHARE_TEXT, url });
      } catch (err) {
        // De browser gooit een AbortError als de gebruiker het deelvenster
        // wegklikt. Dat is geen fout: gewoon negeren, geen melding tonen.
        if (err instanceof Error && err.name === "AbortError") return;
      }
      return;
    }

    // Fallback voor browsers zonder Web Share API (veel desktopbrowsers):
    // kopieer de link en toon kort een bevestiging.
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        showCopied();
      } catch {
        // Kopiëren mislukt (bijv. geen permissie): stil negeren.
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex w-full items-center justify-center border-2 border-evergreen text-evergreen hover:bg-evergreen hover:text-sandstone-beige px-6 py-[6px] font-cta text-cta uppercase tracking-widest cursor-pointer active:scale-95 transition-all whitespace-nowrap"
    >
      {label}
    </button>
  );
}
