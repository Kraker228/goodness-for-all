"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

/**
 * Section 2 of /ons-verhaal — "De één betaalt voor de ander".
 *
 * A pinned, scroll-scrubbed reveal: a tall runway wrapper provides scroll
 * distance while the inner panel sticks to the viewport. As you scroll the
 * runway, scrollYProgress (0→1) drives each piece of the subsidy flow into
 * view in sequence — €8 corporate → arrow → €1 community + connector → the
 * closing solidarity line — and back out if you scroll up. The panel then
 * un-pins and the page continues.
 *
 * The structure is identical on server and client (no conditional rendering
 * of a separate tree) so hydration always matches — useReducedMotion() is
 * null on the server but a boolean on the client, so it must never decide
 * which markup to render, only how the pieces transform. Under reduced
 * motion every piece is simply shown statically (no scroll-driven movement),
 * mirroring the prefers-reduced-motion guards used elsewhere.
 */
export default function SubsidyFlowScroll() {
  const reduceMotion = useReducedMotion() ?? false;
  const runwayRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: runwayRef,
    // 0 when the runway's top hits the viewport top (panel pins);
    // 1 when the runway's bottom hits the viewport bottom (panel un-pins).
    offset: ["start start", "end end"],
  });

  return (
    // Runway: gives ~3 screens of scroll distance to scrub through.
    <section ref={runwayRef} className="relative h-[300vh]">
      {/* Sticky panel: stays put while the runway scrolls past. */}
      <div className="sticky top-0 h-screen flex items-center">
        <div className="w-full max-w-[1200px] mx-auto px-container-margin">
          <div className="bg-sandstone-beige p-12 border-2 border-evergreen">
            <h2 className="font-headline-md text-headline-md text-evergreen mb-12 text-center uppercase tracking-widest">
              De één betaalt voor de ander.
            </h2>

            <div className="flex flex-col md:flex-row justify-around items-center gap-12 relative">
              {/* Connector line draws in alongside the community card. */}
              <Connector progress={scrollYProgress} reduceMotion={reduceMotion} />

              <Piece
                progress={scrollYProgress}
                range={SEGMENTS.corporate}
                reduceMotion={reduceMotion}
              >
                <div className="z-10 bg-pure-mist border-2 border-evergreen p-8 text-center w-full md:w-64">
                  <span className="text-headline-lg font-headline-lg text-harvest-orange mb-2 block">
                    €8
                  </span>
                  <p className="font-label-sm text-label-sm text-evergreen uppercase font-bold">
                    Zakelijke Markt
                  </p>
                  <p className="text-xs text-evergreen/60 mt-2">Gezonde lunch op kantoor</p>
                </div>
              </Piece>

              <Piece
                progress={scrollYProgress}
                range={SEGMENTS.arrow}
                reduceMotion={reduceMotion}
              >
                <div className="z-10 bg-harvest-orange text-evergreen p-4 flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl">trending_flat</span>
                </div>
              </Piece>

              <Piece
                progress={scrollYProgress}
                range={SEGMENTS.community}
                reduceMotion={reduceMotion}
              >
                <div className="z-10 bg-evergreen border-2 border-evergreen p-8 text-center w-full md:w-64">
                  <span className="text-headline-lg font-headline-lg text-sandstone-beige mb-2 block">
                    €1
                  </span>
                  <p className="font-label-sm text-label-sm text-sandstone-beige uppercase font-bold">
                    In de Buurt
                  </p>
                  <p className="text-xs text-sandstone-beige/60 mt-2">Toegankelijk voor iedereen</p>
                </div>
              </Piece>
            </div>

            <Piece
              progress={scrollYProgress}
              range={SEGMENTS.closing}
              reduceMotion={reduceMotion}
              className="mt-12 text-center max-w-2xl mx-auto"
            >
              <p className="font-body-md text-body-md italic text-evergreen">
                Door een eerlijke prijs te vragen aan hen die het kunnen dragen, maken we gezonde
                voeding voor de hele stad toegankelijk. Geen liefdadigheid, maar solidariteit in
                actie.
              </p>
            </Piece>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Each piece reveals over its own [start, end] slice of scroll progress. */
const SEGMENTS = {
  corporate: [0.15, 0.35],
  arrow: [0.35, 0.5],
  community: [0.5, 0.7],
  closing: [0.7, 0.85],
} as const;

type PieceProps = {
  progress: MotionValue<number>;
  /** [start, end] slice of scroll progress over which this piece reveals. */
  range: readonly [number, number];
  reduceMotion: boolean;
  className?: string;
  children: React.ReactNode;
};

/**
 * Fades a single piece in across its scroll-progress slice. Normally the
 * piece also rises (translateY); under reduced motion we keep the
 * scroll-linked fade but drop the positional movement, so the reveal still
 * reads without the jumpy travel.
 */
function Piece({ progress, range, reduceMotion, className = "", children }: PieceProps) {
  const [start, end] = range;
  // Reveal across [start, end], then hold at full visibility through to the
  // end of the runway — once a piece has appeared it stays put, it never
  // fades back out as you keep scrolling.
  const opacity = useTransform(progress, [start, end, 1], [0, 1, 1]);
  const yTravel = useTransform(progress, [start, end, 1], [40, 0, 0]);
  const y = reduceMotion ? 0 : yTravel;

  return (
    <motion.div style={{ opacity, y }} className={className}>
      {children}
    </motion.div>
  );
}

/** Desktop-only dashed connector that grows left→right with the community card. */
function Connector({
  progress,
  reduceMotion,
}: {
  progress: MotionValue<number>;
  reduceMotion: boolean;
}) {
  const [start, end] = SEGMENTS.community;
  // Hold at full after drawing in, so the line stays as you keep scrolling.
  const scaleX = useTransform(progress, [start, end, 1], [0, 1, 1]);
  const opacity = useTransform(progress, [start, end, 1], [0, 1, 1]);

  const className =
    "hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 border-t-2 border-dashed border-evergreen z-0";

  // Normally the line draws in (scaleX); under reduced motion it fades in at
  // full width instead, keeping the scroll-linked reveal without the growth.
  if (reduceMotion) {
    return <motion.div style={{ opacity }} className={className} />;
  }

  return <motion.div style={{ scaleX, transformOrigin: "left" }} className={className} />;
}
