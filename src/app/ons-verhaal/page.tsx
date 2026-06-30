import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import SubsidyFlowScroll from "@/components/ons-verhaal/SubsidyFlowScroll";
import { getSiteContent } from "@/lib/content";

const site = getSiteContent();

export const metadata: Metadata = {
  title: site.story.metaTitle,
};

export default function OnsVerhaalPage() {
  const { settings, story } = getSiteContent();

  return (
    <>
      <Header active="/ons-verhaal" settings={settings} />

      {/* 1. Video hero — full width, autoplay muted */}
      <section
        className="relative w-full overflow-hidden"
        style={{ height: "80vh", minHeight: "560px" }}
      >
        <iframe
          src="https://www.youtube.com/embed/m4rQD4u8Dc8?autoplay=1&mute=1&loop=1&playlist=m4rQD4u8Dc8&controls=0&rel=0&playsinline=1"
          title="Goodness for All"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute border-0"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "max(100%, 177.78vh)",
            height: "max(56.25vw, 100%)",
            pointerEvents: "none",
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />
        {/* Overlay text */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-8">
          <h1
            className="hero-title font-bold text-white text-[48px] md:text-[72px] leading-none mb-4"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.4)" }}
          >
            Wij hebben een probleem.
          </h1>
          <p
            className="hero-title font-bold text-white/90 text-[24px] md:text-[36px] leading-snug"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
          >
            En jij kan helpen het op te lossen.
          </p>
        </div>
      </section>

      {/* 2. Intro text */}
      <section className="py-section-gap-lg max-w-[1200px] mx-auto px-container-margin">
        <div className="max-w-2xl">
          <p className="font-body-lg text-body-lg text-evergreen/90 mb-6">
            Meer dan 450.000 huishoudens leven structureel in armoede. Bestaande voedselhulp creëert
            zijn eigen drempels: registraties, inkomensbewijzen, wachttijden. Veel mensen die hulp
            nodig hebben, vallen daardoor tussen wal en schip.
          </p>
          <p className="font-body-md text-body-md text-evergreen/80 mb-6">
            In november 2024 verkochten we in een pop-up store in Rotterdam CS bijna 1000 maaltijden
            voor €8 per stuk, waarmee we een belangrijk onderdeel van ons idee bewezen:
          </p>
          <p className="font-body-lg text-body-lg font-bold text-evergreen mb-6">
            Als de één €8 betaalt, kan je de ander voor €1 eten.
          </p>
          <p className="font-body-md text-body-md text-evergreen/80 mb-6">
            Inmiddels kunnen we voor minder dan €9, twee zeer goede maaltijden op de juiste plek
            krijgen, én weten beide mensen ons te vinden. En het belangrijkste: Iedereen vindt het
            lekker.
          </p>
          <p className="font-body-md text-body-md text-evergreen/80 mb-6">
            Lazy levert de maaltijden: super gezond, negen gewaardeerde smaken. Hotspot Hutspot
            regelt de distributie in Rotterdam. We verspreiden nu 2.000 maaltijden per maand, en
            mikken op 10x zo groot.
          </p>
          <p className="font-body-md text-body-md text-evergreen/80">
            Na Rotterdam en Den Haag volgt de rest van Nederland. Laten we zorgen dat iedereen
            gewoon goed te eten heeft. Doe je mee?
          </p>
        </div>
      </section>

      {/* 3. Subsidy scroll section */}
      <SubsidyFlowScroll content={story.subsidy} />

      <main className="max-w-[1200px] mx-auto px-container-margin">
        {/* Distribution section */}
        <section className="py-section-gap-lg">
          <Reveal className="flex flex-col md:flex-row-reverse items-center gap-section-gap-sm">
            <div className="w-full md:w-1/2 overflow-hidden border-2 border-evergreen">
              <img
                className="w-full h-[500px] object-cover hover:grayscale transition-all duration-500"
                alt={story.distribution.imageAlt}
                src={story.distribution.image}
              />
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="hero-title font-bold text-headline-lg-mobile md:text-headline-lg text-evergreen mb-8">
                {story.distribution.title}
              </h2>
              <p className="font-body-lg text-body-lg text-evergreen/90 mb-6">
                {story.distribution.text}
              </p>
              <ul className="space-y-4">
                {story.distribution.points.map((point) => (
                  <li
                    key={point.label}
                    className="flex items-center gap-4 border-b border-evergreen pb-4"
                  >
                    <span className="material-symbols-outlined text-harvest-orange">
                      {point.icon}
                    </span>
                    <span className="font-label-sm text-label-sm uppercase">{point.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </section>

        {/* 4. De maaltijd — single image, icon bullet points */}
        <section className="py-section-gap-lg grid grid-cols-1 md:grid-cols-2 gap-base">
          <div className="flex flex-col justify-center">
            <div className="mb-6">
              <span className="bg-asparagus text-evergreen font-label-sm text-[10px] px-3 py-1 uppercase tracking-tighter inline-block mb-4">
                {story.meal.eyebrow}
              </span>
              <h2 className="hero-title font-bold text-headline-md text-evergreen uppercase">
                {story.meal.title}
              </h2>
            </div>
            <p className="font-body-md text-body-md text-evergreen/90 mb-6">
              {story.meal.text}
            </p>
            <p className="font-label-sm text-label-sm text-evergreen uppercase tracking-widest mb-4">
              Waarom wij van Lazy houden:
            </p>
            <ul className="space-y-4">
              {story.meal.points.map((point) => (
                <li
                  key={point.label}
                  className="flex items-start gap-4 border-b border-evergreen pb-4"
                >
                  <span className="material-symbols-outlined text-harvest-orange mt-0.5 flex-shrink-0">
                    {point.icon}
                  </span>
                  <span className="font-body-md text-body-md text-evergreen/80">{point.label}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="overflow-hidden border-2 border-evergreen">
            <img
              src={story.meal.image}
              alt={story.meal.imageAlt}
              className="w-full h-[500px] object-cover hover:grayscale transition-all duration-500"
            />
          </div>
        </section>

        {/* 5. Team */}
        <section className="py-section-gap-lg mb-section-gap-lg">
          <h2 className="hero-title font-bold text-headline-lg-mobile md:text-headline-lg text-evergreen mb-12 text-center">
            {story.teamTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {story.team.map((member) => (
              <div key={member.name} className="team-card group">
                <div className="border-2 border-evergreen overflow-hidden aspect-square relative">
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    alt={member.alt}
                    src={member.image}
                  />
                  <div className="absolute inset-0 bg-evergreen/10 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="mt-4">
                  <h3 className="font-headline-md text-evergreen">{member.name}</h3>
                  <p className="font-label-sm text-label-sm text-harvest-orange uppercase">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}

            {/* 7th card — CTA to werken bij */}
            <div className="team-card group">
              <div className="border-2 border-evergreen overflow-hidden aspect-square relative">
                <img
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt="Kom jij ons team versterken"
                  src="/images/ons-verhaal/werken-bij-goodness.jpg"
                />
                <div className="absolute inset-0 bg-evergreen/10 group-hover:bg-transparent transition-colors" />
              </div>
              <div className="mt-4">
                <h3 className="font-headline-md text-evergreen">Kom jij ons team versterken</h3>
                <Link
                  href="/ik-wil-helpen"
                  className="font-label-sm text-label-sm text-harvest-orange uppercase hover:underline"
                >
                  kom in contact
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
