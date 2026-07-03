"use client";

import { useEffect, useId, useRef, useState } from "react";

/**
 * Klein i-icoontje dat bij klik een comment-wolkje met toelichting toont.
 * Toggle bij klik, sluit bij een klik buiten de tooltip. Kleur volgt de
 * omringende tekst (text-current) zodat hij werkt op zowel lichte als
 * donkere kaarten.
 */
export default function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const tooltipId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  return (
    <span ref={wrapperRef} className="relative inline-flex align-middle">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Meer informatie"
        aria-expanded={open}
        aria-describedby={open ? tooltipId : undefined}
        className="material-symbols-outlined ml-1 align-middle text-[16px] leading-none text-current opacity-70 transition-opacity hover:opacity-100"
      >
        info
      </button>
      {open && (
        <span
          id={tooltipId}
          role="tooltip"
          className="absolute bottom-full left-1/2 z-30 mb-3 w-56 max-w-[80vw] -translate-x-1/2 border-2 border-harvest-orange bg-evergreen px-4 py-3 text-left font-label-sm text-label-sm normal-case tracking-normal text-sandstone-beige"
        >
          {text}
          <span className="absolute left-1/2 top-full -mt-[2px] h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-harvest-orange bg-evergreen" />
        </span>
      )}
    </span>
  );
}
