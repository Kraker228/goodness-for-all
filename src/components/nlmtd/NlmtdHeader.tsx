import Image from "next/image";
import Link from "next/link";
import type { SiteSettings } from "@/lib/content";
import { focusRing } from "./styles";

export const NLMTD_ALT = "NLMTD, create the future";

/**
 * Eenvoudige co-branded header: Goodness for All-logo, een ×, en het
 * NLMTD-logo. Zonder menu, zodat de pagina losstaat van de sitenavigatie.
 */
export default function NlmtdHeader({ settings }: { settings: SiteSettings }) {
  return (
    <header className="bg-surface border-b-2 border-evergreen w-full">
      <div className="max-w-[1200px] mx-auto px-container-margin py-3 flex items-center gap-4 md:gap-6">
        <Link href={settings.homeHref} aria-label={settings.homeAriaLabel} className={focusRing}>
          <Image
            src={settings.logo}
            alt={settings.logoAlt}
            width={545}
            height={168}
            preload
            className="h-10 md:h-12 w-auto"
          />
        </Link>
        <span aria-hidden="true" className="hero-title text-3xl text-evergreen/60">
          ×
        </span>
        <Image
          src="/nlmtd/Logo_groen___tekst.png"
          alt={NLMTD_ALT}
          width={2000}
          height={1999}
          sizes="80px"
          className="h-16 md:h-20 w-auto"
        />
      </div>
    </header>
  );
}
