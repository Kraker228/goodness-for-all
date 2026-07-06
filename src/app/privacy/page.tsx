import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteContent } from "@/lib/content";

const site = getSiteContent();

export const metadata: Metadata = {
  title: site.privacy.metaTitle,
  description: site.privacy.metaDescription,
};

export default function PrivacyPage() {
  const { settings, privacy } = getSiteContent();

  return (
    <>
      <Header active="/privacy" settings={settings} />
      <main className="max-w-[1200px] mx-auto px-container-margin py-section-gap-sm md:py-section-gap-lg">
        <div className="mb-section-gap-sm md:mb-section-gap-lg">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-base border-b-2 border-evergreen pb-base">
            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-evergreen">
              {privacy.title}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
              {privacy.intro}
            </p>
          </div>
        </div>

        <div className="max-w-3xl flex flex-col gap-section-gap-sm">
          {privacy.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="font-headline-md text-headline-md text-evergreen uppercase mb-base">
                {section.heading}
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
