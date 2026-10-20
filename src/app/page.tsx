import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Counter from "@/components/home/Counter";
import HungerCarousel from "@/components/home/HungerCarousel";
import PartnerStrip from "@/components/home/PartnerStrip";
import YouTubeFacade from "@/components/partners/YouTubeFacade";
import { getSiteContent } from "@/lib/content";

const site = getSiteContent();

export const metadata: Metadata = {
  title: site.home.metaTitle,
  description: site.home.metaDescription,
};

/** Haalt het video-ID uit een YouTube-link (watch, youtu.be, shorts, embed). */
function youTubeId(url: string): string | null {
  const match = url
    .trim()
    .match(/(?:youtu\.be\/|[?&]v=|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/);
  return match ? match[1] : null;
}

export default function HomePage() {
  const { settings, home } = getSiteContent();

  return (
    <>
      <Header active="/" settings={settings} />

      <section className="relative w-full h-[80vh] min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${home.hero.image})` }}
            role="img"
            aria-label={home.hero.imageAlt}
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        <div className="relative z-10 w-full max-w-[1200px] mx-auto px-container-margin">
          <div className="max-w-2xl bg-white/90 p-10 md:p-16 border-l-8 border-harvest-orange">
            <h1 className="hero-title text-[64px] md:text-[84px] text-evergreen mb-6 leading-none">
              {home.hero.title}
            </h1>
            <p className="font-body-lg text-body-lg md:text-2xl text-evergreen mb-10 opacity-90">
              {home.hero.text}
            </p>
            <Link
              href={home.hero.buttonHref}
              className="inline-block bg-harvest-orange text-evergreen px-10 py-5 font-cta text-cta uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all"
            >
              {home.hero.buttonLabel}
            </Link>
          </div>
        </div>
      </section>

      <div className="h-3 bg-sandstone-beige w-full" />

      <HungerCarousel slides={home.hungerCarousel.slides} />

      <section className="bg-pure-mist py-section-gap-lg overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-container-margin">
          <div className="max-w-3xl mb-section-gap-sm">
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-evergreen mb-base">
              {home.goodNews.title}
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              {home.goodNews.text}{" "}
              <a
                href={home.goodNews.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-harvest-orange font-semibold underline hover:no-underline"
              >
                {home.goodNews.linkLabel}
              </a>
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter">
            {home.goodNews.videos.map((video) => {
              const id = video.youtubeUrl ? youTubeId(video.youtubeUrl) : null;
              const label = `${video.number}/${home.goodNews.videos.length}`;
              const title = id && video.title ? video.title : `Bericht ${label}`;
              return (
                // Subgrid: video, titel en datum delen per rij dezelfde
                // tracks, zodat bijschriften uitgelijnd blijven, ook als een
                // titel over meerdere regels loopt.
                <figure
                  key={video.number}
                  className="grid grid-rows-subgrid row-span-3 gap-y-0"
                >
                  {/* Video's zijn staand opgenomen in 1536x1920, dus 4:5. */}
                  <div className="relative aspect-[4/5] border-2 border-evergreen overflow-hidden bg-evergreen">
                    {id ? (
                      <YouTubeFacade
                        videoId={id}
                        title={title}
                        playLabel={`${home.goodNews.playLabel} ${label}`}
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="absolute top-2 left-2 md:left-3 whitespace-nowrap font-label-sm text-[10px] md:text-label-sm uppercase tracking-widest text-sandstone-beige/70">
                          Good News for All
                        </span>
                        <span className="font-headline-lg text-6xl leading-none text-harvest-orange">
                          {video.number}
                        </span>
                        <span className="font-label-sm text-label-sm text-sandstone-beige mt-1">
                          / {home.goodNews.videos.length}
                        </span>
                        <span className="absolute bottom-0 right-0 w-10 h-10 bg-harvest-orange/20 rotate-45 translate-x-5 translate-y-5" />
                      </div>
                    )}
                  </div>
                  <figcaption className="grid grid-rows-subgrid row-span-2 gap-y-0 font-body-md text-body-md">
                    <span className="mt-base font-bold leading-snug text-evergreen">
                      {title}
                    </span>
                    <span className="mt-1 text-on-surface-variant">
                      {id
                        ? video.date
                        : `${home.goodNews.videoPlaceholderLabel} ${video.date}`}
                    </span>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-evergreen py-section-gap-lg text-sandstone-beige">
        <div className="max-w-[1200px] mx-auto px-container-margin text-center">
          <div className="mb-4">
            <Counter
              end={home.counter.value}
              className="text-[80px] md:text-[120px] hero-title font-bold leading-none text-white block"
            />
            <span className="text-2xl md:text-4xl hero-title font-bold text-white/90 uppercase tracking-widest block -mt-1">
              {home.counter.label}
            </span>
          </div>
          <div className="h-1 w-24 bg-harvest-orange mx-auto mb-8" />
          <p className="font-body-lg text-body-lg opacity-80 max-w-xl mx-auto">
            {home.counter.text}
          </p>
        </div>
      </section>

      <section className="bg-sandstone-beige py-section-gap-lg overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-container-margin relative">
          <span className="material-symbols-outlined absolute -top-10 -left-4 text-[120px] text-evergreen/10 select-none">
            format_quote
          </span>
          <div className="relative z-10 max-w-4xl">
            <blockquote className="text-2xl md:text-[32px] font-body-lg leading-relaxed text-evergreen mb-10 italic">
              &quot;{home.quote.text}&quot;
            </blockquote>
            <div className="flex items-center gap-4">
              <div className="w-12 h-[2px] bg-evergreen" />
              <div>
                <p className="font-label-sm text-label-sm uppercase tracking-widest font-bold">
                  {home.quote.name}
                </p>
                <p className="font-label-sm text-label-sm uppercase opacity-70">
                  {home.quote.role}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 border-y-2 border-evergreen overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-container-margin mb-8">
          <h4 className="font-label-sm text-label-sm uppercase tracking-widest text-center text-evergreen opacity-50">
            {home.partnerStripTitle}
          </h4>
        </div>
        <PartnerStrip />
      </section>

      <Footer />
    </>
  );
}
