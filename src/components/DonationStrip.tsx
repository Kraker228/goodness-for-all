import Link from "next/link";
import Reveal from "@/components/Reveal";
import type { SiteContent } from "@/lib/content";

type DonationStripContent = SiteContent["help"]["donationStrip"];

/**
 * Groene donatiebalk met de "Doneer direct"-knop. Wordt gedeeld door de
 * "Doe mee"-pagina (bovenaan) en de contactpagina (onder het formulier), zodat
 * beide identiek blijven.
 */
export default function DonationStrip({ content }: { content: DonationStripContent }) {
  return (
    <Reveal
      as="section"
      from="translate-y-8"
      className="w-full bg-asparagus/20 border-b-2 border-evergreen"
    >
      <div className="max-w-[1200px] mx-auto px-container-margin py-gutter">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter items-center">
          <div className="flex flex-col gap-2 md:pr-gutter md:border-r md:border-evergreen/20">
            <p className="font-body-md text-body-md text-evergreen">
              {content.donateText}
            </p>
            <a
              href={content.donateHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block self-start bg-harvest-orange text-evergreen font-cta text-cta px-gutter py-4 border-2 border-evergreen hover:bg-evergreen hover:text-sandstone-beige transition-all"
            >
              {content.donateButton}
            </a>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-body-md text-body-md text-evergreen">
              {content.contactText}
            </p>
            <Link
              href="/contact"
              className="inline-block self-start bg-transparent text-evergreen font-cta text-cta px-gutter py-4 border-2 border-evergreen hover:bg-evergreen hover:text-sandstone-beige transition-all"
            >
              {content.contactButton}
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
