/**
 * Gedeelde class-strings voor de NLMTD-pagina, afgeleid van de knoppen en
 * velden elders op de site (Header, ContactForm, voor-buurthuizen).
 */

/** Zichtbare focusring op lichte achtergrond. */
export const focusRing =
  "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-evergreen";

/** Zichtbare focusring op donkergroene achtergrond. */
export const focusRingOnDark =
  "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-harvest-orange";

/** Oranje hoofdknop, zoals "Bestellen" op /voor-buurthuizen. */
export const primaryButton =
  "inline-flex items-center justify-center gap-2 bg-harvest-orange text-evergreen px-8 py-4 font-cta text-cta uppercase tracking-widest hover:brightness-110 motion-safe:active:scale-95 motion-safe:transition-all cursor-pointer";

/** Label boven een invoerveld, zoals in ContactForm. */
export const fieldLabel = "block font-label-sm text-label-sm text-evergreen uppercase mb-2";

/** Invoerveld, zoals in ContactForm. */
export const inputField =
  "w-full bg-pure-mist border-2 border-evergreen focus:outline-none focus:border-harvest-orange focus-visible:ring-2 focus-visible:ring-harvest-orange text-body-md font-body-md p-base placeholder-evergreen/40 min-h-12";

/** Foutmelding onder een veld. */
export const fieldError = "mt-1 font-body-md text-label-sm font-bold text-error";

/** Tekstlink in lopende tekst. */
export const textLink =
  "text-evergreen font-bold underline underline-offset-4 hover:text-harvest-orange " + focusRing;
