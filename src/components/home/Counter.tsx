"use client";

import { useEffect, useRef, useState } from "react";
import { fireConfetti } from "@/components/Confetti";

type CounterProps = {
  end: number;
  duration?: number;
  className?: string;
  suffix?: string;
  /** Optional intermediate value: count to it, hold, then continue to `end` with confetti. */
  pauseAt?: number;
  pauseMs?: number;
  finalDuration?: number;
};

/** Count-up animation that fires once when scrolled into view. */
export default function Counter({
  end,
  duration = 2000,
  className = "",
  suffix = "+",
  pauseAt,
  pauseMs = 2000,
  finalDuration = 1500,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const staged = pauseAt !== undefined && pauseAt > 0 && pauseAt < end;
    let frame = 0;
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const animate = (from: number, to: number, ms: number, done?: () => void) => {
      let start: number | null = null;
      const step = (ts: number) => {
        if (start === null) start = ts;
        const progress = Math.min((ts - start) / ms, 1);
        setValue(Math.floor(from + progress * (to - from)));
        if (progress < 1) frame = window.requestAnimationFrame(step);
        else done?.();
      };
      frame = window.requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      observer.unobserve(el);
      if (!staged) {
        animate(0, end, duration);
        return;
      }
      animate(0, pauseAt, duration, () => {
        timeout = setTimeout(
          () => animate(pauseAt, end, finalDuration, () => fireConfetti()),
          pauseMs,
        );
      });
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      if (timeout) clearTimeout(timeout);
    };
  }, [end, duration, pauseAt, pauseMs, finalDuration]);

  return (
    <span ref={ref} className={className}>
      {value.toLocaleString("nl-NL")}
      {suffix}
    </span>
  );
}
