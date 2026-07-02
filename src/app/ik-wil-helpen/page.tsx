import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { getSiteContent } from "@/lib/content";

const site = getSiteContent();

export const metadata: Metadata = {
  title: site.help.metaTitle,
};

export default function IkWilHelpenPage() {
  const { settings, help } = getSiteContent();

  return (
    <>
      <Header active="/ik-wil-helpen" settings={settings} />
      <main className="max-w-[1200px] mx-auto px-container-margin min-h-screen">
        <Reveal
          as="section"
          from="translate-y-8"
          className="py-section-gap-sm md:py-section-gap-lg border-b border-evergreen/10"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
            <div className="md:col-span-7">
              <span className="inline-block bg-asparagus text-evergreen font-label-sm text-label-sm px-4 py-1 mb-base">
                {help.eyebrow}
              </span>
              <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-evergreen mb-gutter">
                {help.title}
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                {help.text}
              </p>
            </div>
            <div className="md:col-span-5 relative aspect-square">
              <div className="absolute inset-0 border-2 border-evergreen translate-x-4 translate-y-4 -z-10"></div>
              <img
                className="w-full h-full object-cover border-2 border-evergreen"
                alt={help.imageAlt}
                src={help.image}
              />
            </div>
          </div>
        </Reveal>

        <Reveal
          as="section"
          from="translate-y-8"
          className="bg-asparagus/20 border-y-2 border-evergreen py-gutter"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter items-center">
            <div className="flex flex-col gap-2 md:pr-gutter md:border-r md:border-evergreen/20">
              <p className="font-body-md text-body-md text-evergreen">
                {help.donationStrip.donateText}
              </p>
              <a
                href={help.donationStrip.donateHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block self-start bg-harvest-orange text-evergreen font-cta text-cta px-gutter py-4 border-2 border-evergreen hover:bg-evergreen hover:text-sandstone-beige transition-all"
              >
                {help.donationStrip.donateButton}
              </a>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-body-md text-body-md text-evergreen">
                {help.donationStrip.contactText}
              </p>
              <Link
                href="/contact"
                className="inline-block self-start bg-transparent text-evergreen font-cta text-cta px-gutter py-4 border-2 border-evergreen hover:bg-evergreen hover:text-sandstone-beige transition-all"
              >
                {help.donationStrip.contactButton}
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal as="section" from="translate-y-8" className="py-section-gap-lg">
          <div className="flex justify-between items-end mb-section-gap-sm">
            <div>
              <h2 className="font-headline-md text-headline-md text-evergreen">
                {help.vacanciesTitle}
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                {help.vacanciesText}
              </p>
            </div>
            <div className="hidden md:block">
              <a
                href={help.openApplicationHref}
                className="inline-block bg-harvest-orange text-evergreen font-cta text-cta px-gutter py-4 border-2 border-evergreen hover:bg-evergreen hover:text-sandstone-beige transition-all"
              >
                {help.openApplicationLabel}
              </a>
            </div>
          </div>
          <div className="bg-pure-mist border-2 border-evergreen p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
            <span
              className="material-symbols-outlined text-evergreen text-5xl mb-base"
              style={{ fontVariationSettings: "'wght' 200" }}
            >
              {help.emptyIcon}
            </span>
            <p className="font-headline-md text-headline-md text-evergreen mb-gutter max-w-md">
              {help.emptyTitle}
            </p>
            <p className="font-body-md text-body-md text-on-surface-variant mb-section-gap-sm">
              {help.emptyText}
            </p>
            <div className="w-full h-px bg-evergreen/20 mb-section-gap-sm max-w-sm"></div>
            <a
              href={`mailto:${settings.email}`}
              className="inline-block bg-evergreen text-sandstone-beige font-cta text-cta px-gutter py-4 border-2 border-evergreen hover:bg-harvest-orange hover:text-evergreen transition-all"
            >
              {help.emailButton}
            </a>
          </div>
        </Reveal>

        <Reveal as="section" from="translate-y-8" className="pb-section-gap-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-evergreen">
            {help.culture.map((item, index) => (
              <div
                key={item.title}
                className={`p-gutter ${
                  index < 2 ? "border-b md:border-b-0 md:border-r border-evergreen" : ""
                } ${index === 0 ? "bg-sandstone-beige" : index === 1 ? "bg-pure-mist" : "bg-asparagus/20"}`}
              >
                <span className="material-symbols-outlined text-evergreen mb-base">
                  {item.icon}
                </span>
                <h3 className="font-headline-md text-headline-md text-evergreen mb-base">
                  {item.title}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal as="section" from="translate-y-8" className="py-section-gap-lg">
          <div className="bg-evergreen p-10 md:p-20 text-sandstone-beige relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-6xl font-headline-lg opacity-20 absolute -top-10 -left-6">
                &ldquo;
              </span>
              <p className="font-headline-md text-headline-md md:text-4xl italic mb-gutter leading-tight">
                {help.quote.text}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-harvest-orange border border-sandstone-beige"></div>
                <div>
                  <p className="font-label-sm text-label-sm text-harvest-orange">
                    {help.quote.name}
                  </p>
                  <p className="font-body-md text-body-md opacity-80">{help.quote.role}</p>
                </div>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-harvest-orange/10 transform rotate-45 translate-x-10 translate-y-10"></div>
          </div>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
