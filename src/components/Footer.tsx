import Link from "next/link";
import { getSiteContent } from "@/lib/content";

export default function Footer() {
  const { settings } = getSiteContent();

  return (
    <footer className="bg-evergreen border-t-2 border-evergreen w-full">
      <div className="w-full py-section-gap-sm px-container-margin flex flex-col md:flex-row justify-between items-center gap-base max-w-[1200px] mx-auto text-sandstone-beige">
        <Link href={settings.homeHref} aria-label={settings.homeAriaLabel}>
          <img
            src={settings.logo}
            alt={settings.logoAlt}
            width={545}
            height={168}
            className="h-10 w-auto"
          />
        </Link>
        <div className="flex gap-8 my-6 md:my-0">
          {settings.footerLinks.map((l) => (
            <Link
              key={l.label}
              className="font-label-sm text-label-sm text-sandstone-beige/80 hover:text-harvest-orange transition-colors"
              href={l.href}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="font-body-md text-body-md opacity-60">{settings.copyright}</div>
      </div>
    </footer>
  );
}
