import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactForm from "@/components/forms/ContactForm";
import { getSiteContent } from "@/lib/content";

const site = getSiteContent();

export const metadata: Metadata = {
  title: site.contact.metaTitle,
  description: site.contact.metaDescription,
};

export default function ContactPage() {
  const { settings, contact, forms } = getSiteContent();

  return (
    <>
      <Header active="/contact" position="fixed" settings={settings} />

      <main className="pt-40 pb-section-gap-lg">
        <section className="max-w-[1200px] mx-auto px-container-margin py-section-gap-sm border-b-2 border-evergreen">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-base">
            <h1 className="title-baloo text-evergreen max-w-2xl">
              {contact.title}
            </h1>
            <p className="font-body-lg text-body-lg text-evergreen/80 max-w-md pb-1">
              {contact.text}
            </p>
          </div>
        </section>

        <section className="max-w-[1200px] mx-auto px-container-margin mt-gutter grid grid-cols-1 md:grid-cols-12 gap-section-gap-sm">
          <div className="md:col-span-7 bg-pure-mist border-2 border-evergreen p-section-gap-sm">
            <ContactForm content={forms.contact} />
          </div>

          <div className="md:col-span-5 flex flex-col gap-gutter">
            <div className="bg-sandstone-beige p-section-gap-sm border-2 border-evergreen">
              <h3 className="font-label-sm text-label-sm text-evergreen uppercase border-b border-evergreen pb-2 mb-4">
                {contact.detailsTitle}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-base">
                  <span className="material-symbols-outlined text-evergreen">mail</span>
                  <a
                    className="font-body-lg text-body-lg font-bold text-evergreen underline decoration-harvest-orange hover:text-harvest-orange transition-colors"
                    href={`mailto:${settings.email}`}
                  >
                    {settings.email}
                  </a>
                </div>
                <div className="flex items-start gap-base">
                  <span className="material-symbols-outlined text-evergreen">location_on</span>
                  <p className="font-body-lg text-body-lg text-evergreen">
                    {settings.city}, {settings.country}
                  </p>
                </div>
                <div className="flex items-start gap-base">
                  <span className="material-symbols-outlined text-evergreen">share</span>
                  <a
                    className="font-body-lg text-body-lg text-evergreen flex items-center gap-2 group"
                    href={contact.linkedinHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="font-bold underline decoration-evergreen group-hover:text-harvest-orange group-hover:decoration-harvest-orange transition-all">
                      {contact.linkedinLabel}
                    </span>
                    <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden border-2 border-evergreen h-full min-h-[300px]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${contact.mapImage})` }}
              />
              <div className="absolute bottom-4 left-4 bg-evergreen text-sandstone-beige px-4 py-2 font-label-sm text-label-sm uppercase">
                {contact.mapLabel}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
