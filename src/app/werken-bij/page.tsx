import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import DonationStrip from "@/components/DonationStrip";
import { getSiteContent } from "@/lib/content";

const site = getSiteContent();

export const metadata: Metadata = {
  title: site.help.metaTitle,
  description: site.help.metaDescription,
};

export default function WerkenBijPage() {
  const { settings, help } = getSiteContent();
  const { stagesCta, stages } = help;

  return (
    <>
      <Header active="/werken-bij" settings={settings} />

      <DonationStrip content={help.donationStrip} />

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

        {/* CTA-blok: springt naar de stages-sectie verderop */}
        <Reveal
          as="section"
          from="translate-y-8"
          className="py-section-gap-sm border-b border-evergreen/10"
        >
          <div className="flex flex-col items-start gap-gutter">
            <a
              href={stagesCta.buttonHref}
              className="inline-flex items-center gap-3 bg-harvest-orange text-evergreen font-cta text-2xl px-10 py-5 border-2 border-evergreen hover:bg-evergreen hover:text-sandstone-beige transition-all"
            >
              <span className="material-symbols-outlined text-3xl">school</span>
              {stagesCta.buttonLabel}
            </a>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
              {stagesCta.note}
            </p>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-evergreen">
            {help.jobs.map((job, index) => (
              <div
                key={job.title}
                className={`p-gutter flex flex-col ${
                  index < 2 ? "border-b md:border-b-0 md:border-r border-evergreen" : ""
                } ${index === 0 ? "bg-sandstone-beige" : index === 1 ? "bg-pure-mist" : "bg-asparagus/20"}`}
              >
                <span
                  className="material-symbols-outlined text-evergreen text-5xl mb-base"
                  style={{ fontVariationSettings: "'wght' 200" }}
                >
                  {job.icon}
                </span>
                <h3 className="font-headline-md text-headline-md text-evergreen mb-base">
                  {job.title}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-base">
                  {job.text}
                </p>
                <p className="font-body-md text-body-md text-harvest-orange mb-gutter flex-1">
                  {job.note}
                </p>
                <a
                  href={`mailto:${settings.email}`}
                  className="inline-block self-start bg-evergreen text-sandstone-beige font-cta text-cta px-gutter py-4 border-2 border-evergreen hover:bg-harvest-orange hover:text-evergreen transition-all"
                >
                  {help.emailButton}
                </a>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Stages: full-bleed band met een eigen achtergrondkleur */}
        <section
          id="stages"
          className="w-screen ml-[calc(50%-50vw)] bg-evergreen border-y-2 border-evergreen scroll-mt-24"
        >
        <div className="max-w-[1200px] mx-auto px-container-margin py-section-gap-lg">
          <Reveal from="translate-y-8">
            <div className="max-w-3xl mb-section-gap-sm">
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-sandstone-beige mb-gutter">
                {stages.title}
              </h2>
              <p className="font-body-lg text-body-lg text-sandstone-beige/90">
                {stages.intro}
              </p>
            </div>
          </Reveal>

          <Reveal from="translate-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-2 border-evergreen mb-gutter">
              {stages.columns.map((column, colIndex) => (
                <div
                  key={column.title}
                  className={`p-gutter md:p-8 ${
                    colIndex === 0
                      ? "bg-pure-mist border-b md:border-b-0 md:border-r border-evergreen"
                      : "bg-surface"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-gutter">
                    <span
                      className="material-symbols-outlined text-evergreen text-4xl"
                      style={{ fontVariationSettings: "'wght' 200" }}
                    >
                      {column.icon}
                    </span>
                    <h3 className="font-headline-md text-headline-md text-evergreen">
                      {column.title}
                    </h3>
                  </div>
                  <ul className="flex flex-col gap-base">
                    {column.items.map((item) => (
                      <li key={item.label} className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-harvest-orange shrink-0 mt-0.5">
                          {item.icon}
                        </span>
                        <p className="font-body-md text-body-md text-on-surface-variant">
                          <span className="font-bold text-evergreen">
                            {item.label}:
                          </span>{" "}
                          {item.text}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal from="translate-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-2 border-evergreen mb-section-gap-sm">
              <div className="p-gutter md:p-8 bg-asparagus/20 border-b md:border-b-0 md:border-r border-evergreen">
                <span className="material-symbols-outlined text-evergreen text-4xl mb-base">
                  {stages.level.icon}
                </span>
                <h3 className="font-headline-md text-headline-md text-evergreen mb-base">
                  {stages.level.title}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {stages.level.text}
                </p>
              </div>
              <div className="p-gutter md:p-8 bg-surface">
                <span className="material-symbols-outlined text-evergreen text-4xl mb-base">
                  {stages.compensation.icon}
                </span>
                <h3 className="font-headline-md text-headline-md text-evergreen mb-base">
                  {stages.compensation.title}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {stages.compensation.text}
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal from="translate-y-8">
            <div className="mb-section-gap-sm">
              <p className="font-label-sm text-label-sm text-sandstone-beige uppercase mb-base">
                {stages.partnersLabel}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 items-center gap-gutter bg-surface border-2 border-evergreen p-8">
                {stages.partners.map((partner) => (
                  <div
                    key={partner.alt}
                    className="flex items-center justify-center h-16"
                  >
                    {partner.image ? (
                      <img
                        src={partner.image}
                        alt={partner.alt}
                        className="max-h-16 w-auto max-w-full object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <span className="font-headline-md text-headline-md text-evergreen text-center">
                        {partner.text}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal from="translate-y-8">
            <div className="bg-surface border-2 border-evergreen p-8 md:p-10">
              <h3 className="font-headline-md text-headline-md text-evergreen mb-base">
                {stages.cta.title}
              </h3>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-gutter">
                {stages.cta.textBefore}
                <a
                  href={`mailto:${settings.email}`}
                  className="text-harvest-orange font-semibold underline hover:no-underline"
                >
                  {stages.cta.email}
                </a>
                {stages.cta.textAfter}
              </p>
              <a
                href={`mailto:${settings.email}`}
                className="inline-block self-start bg-evergreen text-sandstone-beige font-cta text-cta px-gutter py-4 border-2 border-evergreen hover:bg-harvest-orange hover:text-evergreen transition-all"
              >
                {stages.cta.buttonLabel}
              </a>
            </div>
          </Reveal>
        </div>
        </section>

        <Reveal as="section" from="translate-y-8" className="py-section-gap-lg">
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

        <Reveal as="section" from="translate-y-8" className="pb-section-gap-lg">
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
