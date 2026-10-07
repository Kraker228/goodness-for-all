import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import YouTubeFacade from "@/components/partners/YouTubeFacade";
import { getSiteContent } from "@/lib/content";

const site = getSiteContent();

export const metadata: Metadata = {
  title: site.actie.metaTitle,
  description: site.actie.metaDescription,
};

/** Haalt het video-ID uit een YouTube-link (watch, youtu.be, shorts, embed). */
function youTubeId(url: string): string | null {
  const match = url
    .trim()
    .match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/);
  return match ? match[1] : null;
}

/** Zet [tekst](url) in CMS-teksten om naar links. */
function withLinks(text: string): ReactNode[] {
  return text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!match) return part;
    const [, label, href] = match;
    const className =
      "text-harvest-orange font-semibold underline hover:no-underline";
    return href.startsWith("/") ? (
      <Link key={i} href={href} className={className}>
        {label}
      </Link>
    ) : (
      <a
        key={i}
        href={href}
        className={className}
        {...(href.startsWith("http")
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {label}
      </a>
    );
  });
}

export default function ActiePage() {
  const { settings, actie } = getSiteContent();
  const total = actie.videos.length;

  return (
    <>
      <Header active="/actie" settings={settings} />

      <main className="max-w-[1200px] mx-auto px-container-margin min-h-screen">
        {/* Intro + zo doe je mee */}
        <Reveal
          as="section"
          from="translate-y-8"
          className="py-section-gap-sm md:py-section-gap-lg border-b border-evergreen/10"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            <div className="md:col-span-6">
              <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-evergreen mb-base">
                {actie.title}
              </h1>
              <p className="font-headline-md text-headline-md text-harvest-orange mb-gutter">
                {actie.tagline}
              </p>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                {actie.intro}
              </p>
              <div className="mt-gutter flex flex-col sm:flex-row gap-base">
                <a
                  href={actie.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-evergreen text-sandstone-beige font-cta text-cta uppercase tracking-widest px-6 py-4 border-2 border-evergreen hover:bg-harvest-orange hover:text-evergreen transition-all"
                >
                  <span className="material-symbols-outlined">person</span>
                  {actie.linkedinLabel}
                </a>
                <a
                  href="#voorwaarden"
                  className="inline-flex items-center justify-center gap-3 bg-surface text-evergreen font-cta text-cta uppercase tracking-widest px-6 py-4 border-2 border-evergreen hover:bg-sandstone-beige transition-all"
                >
                  <span className="material-symbols-outlined">gavel</span>
                  {actie.termsLinkLabel}
                </a>
              </div>
            </div>

            <div className="md:col-span-6">
              <div className="bg-sandstone-beige border-2 border-evergreen p-gutter md:p-8 shadow-[8px_8px_0_0_#334e1f]">
                <h2 className="font-headline-md text-headline-md text-evergreen mb-gutter">
                  {actie.stepsTitle}
                </h2>
                <ol className="flex flex-col gap-gutter">
                  {actie.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-harvest-orange border-2 border-evergreen font-headline-md text-evergreen">
                        {i + 1}
                      </span>
                      <p className="font-body-md text-body-md text-on-surface-variant pt-1">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
                <p className="font-body-md text-body-md text-evergreen mt-gutter border-t border-evergreen/20 pt-base">
                  {actie.lateNote}{" "}
                  <a
                    href="#voorwaarden"
                    className="text-harvest-orange font-semibold underline hover:no-underline"
                  >
                    {actie.termsLinkLabel}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* De acht berichten */}
        <Reveal as="section" from="translate-y-8" className="py-section-gap-lg">
          <div className="max-w-3xl mb-section-gap-sm">
            <h2 className="font-headline-md text-headline-md text-evergreen">
              {actie.videosTitle}
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-2">
              {actie.videosText}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {actie.videos.map((video) => {
              const id = video.youtubeUrl ? youTubeId(video.youtubeUrl) : null;
              const label = `${video.number}/${total}`;
              return (
                <figure key={video.number} className="flex flex-col">
                  <div className="relative aspect-video border-2 border-evergreen overflow-hidden bg-evergreen">
                    {id ? (
                      <YouTubeFacade
                        videoId={id}
                        title={`${actie.title} ${label}`}
                        playLabel={`${actie.playLabel} ${label}`}
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="absolute top-2 left-3 font-label-sm text-label-sm uppercase tracking-widest text-sandstone-beige/70">
                          Good News for All
                        </span>
                        <span className="font-headline-lg text-6xl leading-none text-harvest-orange">
                          {video.number}
                        </span>
                        <span className="font-label-sm text-label-sm text-sandstone-beige mt-1">
                          / {total}
                        </span>
                        <span className="absolute bottom-0 right-0 w-10 h-10 bg-harvest-orange/20 rotate-45 translate-x-5 translate-y-5" />
                      </div>
                    )}
                  </div>
                  <figcaption className="mt-base font-body-md text-body-md text-evergreen">
                    <span className="font-bold">Bericht {label}</span>
                    <span className="block text-on-surface-variant">
                      {id ? video.date : `${actie.videoPlaceholderLabel} ${video.date}`}
                    </span>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </Reveal>

        {/* Actievoorwaarden */}
        <div id="voorwaarden" className="scroll-mt-24" aria-hidden />
        <Reveal
          as="section"
          from="translate-y-8"
          className="pb-section-gap-lg border-t-2 border-evergreen pt-section-gap-sm md:pt-section-gap-lg"
        >
          <div className="max-w-3xl mb-section-gap-sm">
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-evergreen mb-gutter">
              {actie.termsTitle}
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              {actie.termsIntro}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-evergreen mb-section-gap-sm">
            <div className="p-gutter md:p-8 bg-sandstone-beige border-b md:border-b-0 md:border-r border-evergreen">
              <span className="material-symbols-outlined text-evergreen text-4xl mb-base">
                redeem
              </span>
              <h3 className="font-headline-md text-headline-md text-evergreen mb-base">
                {actie.prizeTitle}
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {actie.prizeText}
              </p>
            </div>
            <div className="p-gutter md:p-8 bg-pure-mist border-b md:border-b-0 md:border-r border-evergreen">
              <span className="material-symbols-outlined text-evergreen text-4xl mb-base">
                event
              </span>
              <h3 className="font-headline-md text-headline-md text-evergreen mb-base">
                {actie.datesTitle}
              </h3>
              <ul className="flex flex-col gap-2">
                {actie.dates.map((item) => (
                  <li
                    key={item.date}
                    className="font-body-md text-body-md text-on-surface-variant"
                  >
                    <span className="font-bold text-evergreen">{item.date}:</span>{" "}
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-gutter md:p-8 bg-asparagus/20">
              <span className="material-symbols-outlined text-evergreen text-4xl mb-base">
                location_on
              </span>
              <h3 className="font-headline-md text-headline-md text-evergreen mb-base">
                {actie.locationsTitle}
              </h3>
              {actie.locations.length > 0 && (
                <ul className="flex flex-col gap-1 mb-base">
                  {(actie.locations as string[]).map((location) => (
                    <li
                      key={location}
                      className="font-body-md text-body-md text-on-surface-variant"
                    >
                      {location}
                    </li>
                  ))}
                </ul>
              )}
              <p className="font-body-md text-body-md text-on-surface-variant">
                {actie.locationsText}
              </p>
            </div>
          </div>

          <h3 className="font-headline-md text-headline-md text-evergreen mb-gutter">
            {actie.faqTitle}
          </h3>
          <dl className="max-w-3xl flex flex-col gap-gutter">
            {actie.faq.map((item) => (
              <div key={item.question}>
                <dt className="font-body-md text-body-md font-bold text-evergreen">
                  {item.question}
                </dt>
                <dd className="font-body-md text-body-md text-on-surface-variant">
                  {withLinks(item.answer)}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
