import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DownloadCard from "@/components/anbi/DownloadCard";
import { getSiteContent } from "@/lib/content";

const site = getSiteContent();

export const metadata: Metadata = {
  title: site.anbi.metaTitle,
};

export default function AnbiPage() {
  const { settings, anbi } = getSiteContent();

  return (
    <>
      <Header active="/anbi" settings={settings} />
      <main className="max-w-[1200px] mx-auto px-container-margin py-section-gap-sm md:py-section-gap-lg">
        <div className="mb-section-gap-sm md:mb-section-gap-lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-base border-b-2 border-evergreen pb-base">
            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-evergreen">
              {anbi.title}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              {anbi.text}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {anbi.cards.map((card, index) => (
            <DownloadCard
              key={card.title}
              icon={card.icon}
              title={card.title}
              tone={card.tone as "sandstone" | "mist"}
              delay={index * 100}
              downloadLabel={card.downloadLabel || undefined}
              downloadHref={card.downloadHref || undefined}
              buttonIcon={(card as { buttonIcon?: string }).buttonIcon}
            >
              {card.lines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </DownloadCard>
          ))}
        </div>

        <div className="mt-section-gap-lg border-t-2 border-evergreen pt-base flex flex-col md:flex-row items-center gap-gutter">
          <div className="flex-1">
            <h4 className="font-headline-md text-headline-md text-evergreen uppercase">
              {anbi.ctaTitle}
            </h4>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
              {anbi.ctaText}
            </p>
          </div>
          <div className="flex gap-base">
            <Link
              href={anbi.contactHref}
              className="bg-evergreen text-sandstone-beige font-cta text-cta py-4 px-8 uppercase tracking-widest hover:bg-asparagus transition-all duration-300 active:scale-95"
            >
              {anbi.contactButton}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
