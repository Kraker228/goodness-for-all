"use client";

import { useState, useEffect, useRef, useCallback } from "react";

type Slide = {
  image: string | null;
  imageAlt: string | null;
  lead: string;
  body: string | null;
};

type Props = {
  slides: Slide[];
  interval?: number;
};

export default function HungerCarousel({ slides, interval = 5000 }: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setReduceMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  const advance = useCallback(
    (dir: 1 | -1) => {
      setActive((i) => (i + dir + slides.length) % slides.length);
    },
    [slides.length],
  );

  useEffect(() => {
    if (paused || reduceMotion) return;
    const timer = setInterval(() => advance(1), interval);
    return () => clearInterval(timer);
  }, [paused, reduceMotion, advance, interval]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) advance(delta > 0 ? 1 : -1);
    touchStartX.current = null;
  };

  return (
    <section
      className="bg-evergreen overflow-hidden relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/*
        Slide viewport — isolation:isolate creates an explicit stacking context
        that seals all slide z-indexes inside it. Overlay elements (dots, arrows)
        are siblings of this div at section level and will always paint on top.
      */}
      <div
        className="h-[400px] md:h-[480px] relative"
        style={{ isolation: "isolate" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            aria-hidden={i !== active}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              i === active
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            {slide.image ? (
              /* ── Photo slide: split layout ─────────────────────── */
              <div className="flex flex-col md:block h-full">
                {/* Photo: top 55% mobile, left 65% desktop */}
                <div className="h-[55%] md:absolute md:left-0 md:top-0 md:w-[65%] md:h-full">
                  <img
                    src={slide.image}
                    alt={slide.imageAlt ?? ""}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                {/* Text panel: overlaps photo bottom on mobile, left side on desktop */}
                <div className="flex-1 md:absolute md:right-0 md:top-0 md:w-[55%] md:h-full relative -mt-6 md:mt-0 z-10 flex md:flex-row">
                  {/* Desktop: transparent overlap strip (left ~15% of panel) */}
                  <div className="hidden md:block w-16 lg:w-24 bg-evergreen/70 flex-shrink-0" />

                  {/* Mobile: transparent strip at top that sits over photo */}
                  <div className="md:hidden absolute -top-6 left-0 right-0 h-6 bg-evergreen/70" />

                  {/* Main solid evergreen text area */}
                  <div className="bg-evergreen w-full md:flex-1 flex flex-col justify-center px-8 py-6 md:pl-6 md:pr-12 md:py-0">
                    <span className="hero-title text-white leading-none mb-3 text-[52px] md:text-[68px]">
                      {slide.lead}
                    </span>
                    {slide.body && (
                      <p className="font-body-lg text-body-lg text-white/90">
                        {slide.body}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* ── Solid Evergreen slide (card 4) ─────────────────── */
              <div className="h-full flex flex-col items-center justify-center px-8 md:px-20 text-center bg-evergreen">
                <span className="hero-title text-white leading-none mb-4 text-[44px] md:text-[64px]">
                  {slide.lead}
                </span>
                {slide.body && (
                  <p className="font-body-lg text-body-lg text-white/90 max-w-lg">
                    {slide.body}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/*
        Overlay layer — rendered AFTER the viewport div in the DOM and with
        explicit z-index, so it always paints above all slide content.
      */}

      {/* Subtle dark gradient so dots stay readable over any photo */}
      <div
        className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"
        style={{ zIndex: 10 }}
      />

      {/* Dot indicators */}
      <div
        className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-3"
        style={{ zIndex: 20 }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Ga naar kaart ${i + 1}`}
            className={`transition-all duration-300 [box-shadow:0_1px_4px_rgba(0,0,0,0.55)] ${
              i === active
                ? "w-5 h-2 bg-harvest-orange"
                : "w-2 h-2 bg-sandstone-beige hover:bg-sandstone-beige/80"
            }`}
          />
        ))}
      </div>

      {/* Prev arrow */}
      <button
        onClick={() => advance(-1)}
        aria-label="Vorige kaart"
        className="absolute left-2 md:left-5 top-1/2 -translate-y-1/2 text-sandstone-beige/70 hover:text-sandstone-beige text-3xl md:text-5xl leading-none transition-colors select-none"
        style={{ zIndex: 20 }}
      >
        ‹
      </button>

      {/* Next arrow */}
      <button
        onClick={() => advance(1)}
        aria-label="Volgende kaart"
        className="absolute right-2 md:right-5 top-1/2 -translate-y-1/2 text-sandstone-beige/70 hover:text-sandstone-beige text-3xl md:text-5xl leading-none transition-colors select-none"
        style={{ zIndex: 20 }}
      >
        ›
      </button>
    </section>
  );
}
