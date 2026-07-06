"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { SiteContent } from "@/lib/content";

type SubsidyFlowContent = SiteContent["story"]["subsidy"];

/**
 * "De een betaalt voor de ander": het kader met de twee prijskaarten en de pijl
 * ertussen. De onderdelen verschijnen met een korte, gelijkmatige fade + omhoog
 * beweging zodra het kader in beeld komt (whileInView, eenmalig). Dit werkt
 * identiek op mobiel en desktop, zonder scroll-hijacking of sticky-overlap.
 */
export default function SubsidyFlowScroll({ content }: { content: SubsidyFlowContent }) {
  const reduceMotion = useReducedMotion() ?? false;

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduceMotion ? 0 : 0.15 },
    },
  };

  const item: Variants = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section className="py-section-gap-sm md:py-section-gap-lg">
      <div className="w-full max-w-[1200px] mx-auto px-container-margin">
        <motion.div
          className="bg-sandstone-beige p-6 md:p-12 border-2 border-evergreen"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
        >
          <motion.h2
            variants={item}
            className="hero-title font-bold text-headline-md text-evergreen mb-8 md:mb-12 text-center uppercase tracking-widest"
          >
            {content.title}
          </motion.h2>

          <div className="flex flex-col md:flex-row justify-around items-center md:items-start gap-6">
            {/* Corporate kaart: 8 euro */}
            <motion.div variants={item} className="text-center w-full md:w-96">
              <div className="relative overflow-hidden border-2 border-evergreen h-64 md:h-80">
                <img
                  src={content.corporateImage}
                  alt="8 euro maaltijd op kantoor"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/25" />
                <span className="absolute inset-0 flex items-center justify-center hero-title font-bold text-white text-[72px] leading-none">
                  {content.corporateAmount}
                </span>
              </div>
              <p className="font-body-md text-body-md text-evergreen/80 mt-4 text-sm text-left">
                {content.corporateCaption}
              </p>
            </motion.div>

            {/* Pijl: horizontaal op desktop, naar beneden op mobiel */}
            <motion.div variants={item} className="self-center">
              <div className="bg-harvest-orange text-evergreen p-4 flex items-center justify-center rotate-90 md:rotate-0">
                <span className="material-symbols-outlined text-4xl">{content.arrowIcon}</span>
              </div>
            </motion.div>

            {/* Community kaart: 1 euro */}
            <motion.div variants={item} className="text-center w-full md:w-96">
              <div className="relative overflow-hidden border-2 border-evergreen h-64 md:h-80">
                <img
                  src={content.communityImage}
                  alt="1 euro maaltijd in de buurt"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/25" />
                <span className="absolute inset-0 flex items-center justify-center hero-title font-bold text-white text-[72px] leading-none">
                  {content.communityAmount}
                </span>
              </div>
              <p className="font-body-md text-body-md text-evergreen/80 mt-4 text-sm text-left">
                {content.communityCaption}
              </p>
            </motion.div>
          </div>

          <motion.p
            variants={item}
            className="mt-8 md:mt-12 text-center max-w-2xl mx-auto font-body-md text-body-md italic text-evergreen"
          >
            {content.closingText}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
