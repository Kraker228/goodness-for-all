"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import type { SiteContent } from "@/lib/content";

type SubsidyFlowContent = SiteContent["story"]["subsidy"];

// Tailwind's mobiele bereik: alles onder de `md`-breakpoint (768px).
const MOBILE_QUERY = "(max-width: 767.98px)";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isMobile;
}

export default function SubsidyFlowScroll({ content }: { content: SubsidyFlowContent }) {
  const reduceMotion = useReducedMotion() ?? false;
  const isMobile = useIsMobile();
  const segments = isMobile ? MOBILE_SEGMENTS : SEGMENTS;
  const runwayRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ["start start", "end end"],
  });

  return (
    <section ref={runwayRef} className="relative h-[155vh] md:h-[200vh]">
      <div className="sticky top-0 h-screen flex items-center">
        <div className="w-full max-w-[1200px] mx-auto px-container-margin">
          <div className="bg-sandstone-beige p-12 border-2 border-evergreen">
            <h2 className="hero-title font-bold text-headline-md text-evergreen mb-12 text-center uppercase tracking-widest">
              {content.title}
            </h2>

            <div className="flex flex-col md:flex-row justify-around items-start gap-6 relative">
              <Connector
                progress={scrollYProgress}
                range={segments.community}
                reduceMotion={reduceMotion}
              />

              {/* Corporate card — €8 */}
              <Piece
                progress={scrollYProgress}
                range={segments.corporate}
                reduceMotion={reduceMotion}
              >
                <div className="z-10 text-center w-full md:w-96">
                  <div className="relative overflow-hidden border-2 border-evergreen h-64 md:h-80">
                    <img
                      src={content.corporateImage}
                      alt="€8 maaltijd op kantoor"
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
                </div>
              </Piece>

              <Piece
                progress={scrollYProgress}
                range={segments.arrow}
                reduceMotion={reduceMotion}
                className="self-center"
              >
                <div className="z-10 bg-harvest-orange text-evergreen p-4 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl">{content.arrowIcon}</span>
                </div>
              </Piece>

              {/* Community card — €1 */}
              <Piece
                progress={scrollYProgress}
                range={segments.community}
                reduceMotion={reduceMotion}
              >
                <div className="z-10 text-center w-full md:w-96">
                  <div className="relative overflow-hidden border-2 border-evergreen h-64 md:h-80">
                    <img
                      src={content.communityImage}
                      alt="€1 maaltijd in de buurt"
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
                </div>
              </Piece>
            </div>

            <Piece
              progress={scrollYProgress}
              range={segments.closing}
              reduceMotion={reduceMotion}
              className="mt-12 text-center max-w-2xl mx-auto"
            >
              <p className="font-body-md text-body-md italic text-evergreen">
                {content.closingText}
              </p>
            </Piece>
          </div>
        </div>
      </div>
    </section>
  );
}

// Segments tuned to reveal very early — everything visible in the first half of scroll
const SEGMENTS = {
  corporate: [0.02, 0.12],
  arrow:     [0.12, 0.2],
  community: [0.2,  0.35],
  closing:   [0.35, 0.5],
} as const;

// Mobiele varianten (alleen onder de md-breakpoint). De sectie is daar korter
// (h-[155vh], dus 55vh sticky-scroll i.p.v. 100vh), zodat de lege aanloop vóór
// het eerste plaatje en de uitloop ná het laatste korter zijn. Elk plaatje
// houdt exact dezelfde scrollafstand (corporate 10vh, arrow 8vh, community en
// closing elk 15vh), waardoor de onderlinge timing en overgangssnelheid tussen
// de plaatjes identiek blijven aan desktop.
const MOBILE_SEGMENTS = {
  corporate: [0.0182, 0.2],
  arrow:     [0.2,    0.3455],
  community: [0.3455, 0.6182],
  closing:   [0.6182, 0.8909],
} as const;

type PieceProps = {
  progress: MotionValue<number>;
  range: readonly [number, number];
  reduceMotion: boolean;
  className?: string;
  children: React.ReactNode;
};

function Piece({ progress, range, reduceMotion, className = "", children }: PieceProps) {
  const [start, end] = range;
  const opacity = useTransform(progress, [start, end, 1], [0, 1, 1]);
  const yTravel = useTransform(progress, [start, end, 1], [40, 0, 0]);
  const y = reduceMotion ? 0 : yTravel;

  return (
    <motion.div style={{ opacity, y }} className={className}>
      {children}
    </motion.div>
  );
}

function Connector({
  progress,
  range,
  reduceMotion,
}: {
  progress: MotionValue<number>;
  range: readonly [number, number];
  reduceMotion: boolean;
}) {
  const [start, end] = range;
  const scaleX = useTransform(progress, [start, end, 1], [0, 1, 1]);
  const opacity = useTransform(progress, [start, end, 1], [0, 1, 1]);

  const className =
    "hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 border-t-2 border-dashed border-evergreen z-0";

  if (reduceMotion) {
    return <motion.div style={{ opacity }} className={className} />;
  }

  return <motion.div style={{ scaleX, transformOrigin: "left" }} className={className} />;
}
