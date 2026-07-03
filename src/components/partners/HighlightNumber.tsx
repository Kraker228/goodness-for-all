import type { ReactNode } from "react";

/**
 * Wikkelt een getal (bv. het aantal maaltijden) zodat de achtergrond ervan
 * geanimeerd oranje kan worden. De trigger (hover op desktop, in beeld
 * komen op mobile) wordt door de aanroepende card bepaald via `active`.
 */
export default function HighlightNumber({
  active,
  children,
}: {
  active: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className={`px-1 transition-colors duration-700 ease-out ${
        active ? "bg-harvest-orange text-evergreen" : "bg-transparent"
      }`}
    >
      {children}
    </span>
  );
}
