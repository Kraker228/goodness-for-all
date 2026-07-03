import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Counter from "@/components/home/Counter";
import HungerCarousel from "@/components/home/HungerCarousel";
import PartnerStrip from "@/components/home/PartnerStrip";
import { getSiteContent } from "@/lib/content";

const site = getSiteContent();

export const metadata: Metadata = {
  title: site.home.metaTitle,
  description: site.home.metaDescription,
};

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

      <section className="py-section-gap-lg max-w-[1200px] mx-auto px-container-margin">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter items-stretch">
          {home.cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="h-full bg-white border-2 border-evergreen p-8 flex flex-col justify-between hover:bg-sandstone-beige transition-colors duration-300"
            >
              <div>
                <h3 className="hero-title font-bold text-headline-md mb-4 uppercase tracking-tight">
                  {card.title}
                </h3>
                <p className="font-body-md text-lg md:text-body-md text-evergreen/80">
                  {card.text}
                  <span className="underline text-harvest-orange">
                    {card.accent}
                  </span>
                </p>
              </div>
            </Link>
          ))}

          <div className="h-full bg-white border-2 border-evergreen p-8 flex flex-col justify-between hover:bg-sandstone-beige transition-colors duration-300">
            <div>
              <h3 className="hero-title font-bold text-headline-md mb-4 uppercase tracking-tight">
                {home.joinCard.title}
              </h3>
              <p className="font-body-md text-lg md:text-body-md text-evergreen/80">
                {home.joinCard.links.map((link) => (
                  <Link
                    key={link.href}
                    className="block"
                    href={link.href}
                  >
                    {link.prefix}
                    <span className="underline text-harvest-orange">
                      {link.accent}
                    </span>
                  </Link>
                ))}
              </p>
            </div>
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

      <section className="bg-[#2D4A3E] py-section-gap-lg overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-container-margin">
          <div className="sk-ww-linkedin-profile-post w-full" data-embed-id="25694442" />
          <Script
            src="https://widgets.sociablekit.com/linkedin-profile-posts/widget.js"
            strategy="afterInteractive"
          />
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
