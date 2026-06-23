import Link from "next/link";
import { FOOTER_LINKS } from "./nav-links";

export default function Footer() {
  return (
    <footer className="bg-evergreen border-t-2 border-evergreen w-full">
      <div className="w-full py-section-gap-sm px-container-margin flex flex-col md:flex-row justify-between items-center gap-base max-w-[1200px] mx-auto text-sandstone-beige">
        <img
          src="/images/logo.png"
          alt="Goodness for All"
          width={545}
          height={168}
          className="h-10 w-auto"
        />
        <div className="flex gap-8 my-6 md:my-0">
          {FOOTER_LINKS.map((l) => (
            <Link
              key={l.label}
              className="font-label-sm text-label-sm text-sandstone-beige/80 hover:text-harvest-orange transition-colors"
              href={l.href}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="font-body-md text-body-md opacity-60">© 2026 Goodness for All</div>
      </div>
    </footer>
  );
}
