import Image from "next/image";

export const NLMTD_ALT = "NLMTD, create the future";

/**
 * Smalle balk direct onder de siteheader: hier staat het groene NLMTD-logo,
 * zodat meteen zichtbaar is dat deze pagina een samenwerking is.
 */
export default function CobrandBar() {
  return (
    <div className="bg-surface border-b-2 border-evergreen">
      <div className="max-w-[1200px] mx-auto px-container-margin py-2 flex items-center justify-center md:justify-start gap-3">
        <span className="font-label-sm text-label-sm uppercase tracking-widest text-evergreen/80">
          Een samenwerking met
        </span>
        <Image
          src="/nlmtd/Logo_groen___tekst.png"
          alt={NLMTD_ALT}
          width={2000}
          height={1999}
          sizes="64px"
          preload
          className="h-12 md:h-14 w-auto"
        />
      </div>
    </div>
  );
}
