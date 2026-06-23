"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Render as this element (default div). */
  as?: ElementType;
  className?: string;
  /** Stagger delay in ms (used by ANBI card grid). */
  delay?: number;
  /** Vertical travel distance utility, e.g. "translate-y-10". */
  from?: string;
};

/**
 * Fade + translate-in on scroll, mirroring the IntersectionObserver pattern
 * used inline across the original Stitch pages (ons-verhaal, ik-wil-helpen, anbi).
 */
export default function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  from = "translate-y-10",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Read prefers-reduced-motion here (post-hydration), never during render,
    // so the first client render matches the server and we avoid a hydration
    // mismatch. Reduced-motion users skip the stagger delay — the content
    // still reveals on intersection, just instantly, mirroring the CSS guard
    // used for the partner marquee.
    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const effectiveDelay = reduceMotion ? 0 : delay;

    let timer: ReturnType<typeof setTimeout> | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Reveal once, then stop observing so the timer can't re-fire.
          observer.unobserve(el);
          if (effectiveDelay) {
            timer = setTimeout(() => setShown(true), effectiveDelay);
          } else {
            setShown(true);
          }
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [delay]);

  return (
    <Tag
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        shown ? "opacity-100 translate-y-0" : `opacity-0 ${from}`
      } ${className}`}
    >
      {children}
    </Tag>
  );
}
