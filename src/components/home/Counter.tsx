"use client";

import { useEffect, useRef, useState } from "react";
import { fireConfetti } from "@/components/Confetti";

type CounterProps = {
  end: number;
  duration?: number;
  className?: string;
  suffix?: string;
  /**
   * Optional milestone between 0 and `end`: the counter slows down for the
   * last few numbers before it, fires confetti on the milestone and then
   * continues to `end` at normal speed.
   */
  milestone?: number;
  /** How many numbers before the milestone are shown one by one. */
  slowSteps?: number;
  /** Delay per number during the slow-down. */
  slowStepMs?: number;
  /** How long the counter rests on the milestone before continuing. */
  milestoneHoldMs?: number;
};

/** Count-up animation that fires once when scrolled into view. */
export default function Counter({
  end,
  duration = 2000,
  className = "",
  suffix = "+",
  milestone,
  slowSteps = 3,
  slowStepMs = 700,
  milestoneHoldMs = 1200,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [value, setValue] = useState(0);
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const staged =
      milestone !== undefined && milestone > slowSteps && milestone <= end;
    let frame = 0;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const later = (fn: () => void, ms: number) => {
      timeouts.push(setTimeout(fn, ms));
    };

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

      // Same speed (numbers per ms) before and after the milestone.
      const slowFrom = milestone - slowSteps - 1;
      const rate = slowFrom / duration;
      const restDuration = Math.max(1000, (end - milestone) / rate);

      animate(0, slowFrom, duration, () => {
        // Slow down: show the last numbers before the milestone one by one.
        for (let i = 1; i <= slowSteps; i++) {
          later(() => setValue(slowFrom + i), i * slowStepMs);
        }
        later(() => {
          setValue(milestone);
          setCelebrating(true);
          fireConfetti();
          later(() => {
            setCelebrating(false);
            if (end > milestone) animate(milestone, end, restDuration);
          }, milestoneHoldMs);
        }, (slowSteps + 1) * slowStepMs);
      });
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      timeouts.forEach(clearTimeout);
    };
  }, [end, duration, milestone, slowSteps, slowStepMs, milestoneHoldMs]);

  return (
    <span ref={ref} className={className}>
      <span
        className={`inline-block transition-transform duration-500 ease-out ${celebrating ? "scale-[1.15]" : ""}`}
      >
        {value.toLocaleString("nl-NL")}
        {suffix}
      </span>
    </span>
  );
}
