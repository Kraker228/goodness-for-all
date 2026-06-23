/** Partner logo definitions. Drop a matching PNG into
 *  public/images/partners/ (use the `file` name below) and it appears
 *  automatically — no code change needed. `alt` is the partner name. */
const PARTNERS = [
  { file: "gemeente-rotterdam", alt: "Gemeente Rotterdam" },
  { file: "provincie-zuid-holland", alt: "Provincie Zuid-Holland" },
  { file: "rabobank", alt: "Rabobank" },
  { file: "fmo", alt: "FMO" },
  { file: "abb", alt: "ABB" },
  { file: "savills", alt: "Savills" },
  { file: "azbel", alt: "Azbel" },
  { file: "ns-stations", alt: "NS Stations" },
  { file: "lazy", alt: "Lazy" },
  { file: "sol", alt: "SOL" },
  { file: "incluzio", alt: "Incluzio" },
];

// Slower scroll the more logos there are, so speed stays comfortable.
const SECONDS_PER_LOGO = 3.5;

/**
 * Infinite, seamless left-to-right logo carousel.
 *
 * The track renders the logo list twice. A pure-CSS animation slides the
 * track from -50% back to 0%, so the moment the first copy scrolls off the
 * loop restarts on the visually identical second copy — no jump. Hover
 * pauses it; reduced-motion users get a static row (see globals.css).
 */
export default function PartnerStrip() {
  const duration = `${PARTNERS.length * SECONDS_PER_LOGO}s`;

  return (
    <div
      className="partner-scroll no-scrollbar overflow-hidden"
      // Decorative; screen readers get the individual logo alts below.
      aria-label="Onze partners"
    >
      <div
        className="partner-marquee items-center"
        style={{ "--partner-marquee-duration": duration } as Record<string, string>}
      >
        {[...PARTNERS, ...PARTNERS].map((partner, i) => (
          <div
            key={`${partner.file}-${i}`}
            className="flex-shrink-0 px-12 flex items-center justify-center"
            // The second copy is purely visual padding for the loop.
            aria-hidden={i >= PARTNERS.length}
          >
            <img
              src={`/images/partners/logos/${partner.file}.png`}
              alt={partner.alt}
              className="h-16 md:h-20 w-auto max-w-[280px] object-contain opacity-80 transition hover:opacity-100 select-none"
              draggable={false}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
