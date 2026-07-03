"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type DownloadCardProps = {
  icon: string;
  title: string;
  children: ReactNode;
  /** Label for the download/action button. Omit for cards without a button. */
  downloadLabel?: string;
  /** Optional CMS-managed href for downloads or related actions. */
  downloadHref?: string;
  /**
   * Material symbol shown on the button. Defaults to "download".
   * Pass an empty string to render the button without an icon.
   */
  buttonIcon?: string;
  /** Stagger delay (ms) before the reveal fires once in view. */
  delay?: number;
  /** Alternating tile background tone. */
  tone: "sandstone" | "mist";
};

const TONE = {
  sandstone: "bg-sandstone-beige hover:bg-pure-mist",
  mist: "bg-pure-mist hover:bg-sandstone-beige",
} as const;

export default function DownloadCard({
  icon,
  title,
  children,
  downloadLabel,
  downloadHref,
  buttonIcon = "download",
  delay = 0,
  tone,
}: DownloadCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);
  const [btnIcon, setBtnIcon] = useState("download");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const t = setTimeout(() => setShown(true), delay);
          observer.unobserve(el);
          return () => clearTimeout(t);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  function handleDownload() {
    // TODO: wire real PDF href
    setBtnIcon("hourglass_empty");
    setTimeout(() => {
      setBtnIcon("check_circle");
      setSuccess(true);
      setTimeout(() => {
        setBtnIcon("download");
        setSuccess(false);
      }, 2000);
    }, 800);
  }

  return (
    <div
      ref={ref}
      className={`${TONE[tone]} p-6 flex flex-col justify-between h-full group transition-colors duration-300 border border-transparent hover:border-evergreen`}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0px)" : "translateY(20px)",
        transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
      }}
    >
      <div>
        <span className="material-symbols-outlined text-harvest-orange mb-4 block text-3xl">
          {icon}
        </span>
        <h3 className="font-headline-md text-headline-md text-evergreen mb-4">{title}</h3>
        <div className="font-body-md text-body-md text-on-surface-variant mb-6">{children}</div>
      </div>
      {downloadLabel && downloadHref ? (
        <a
          href={downloadHref}
          className="w-full bg-evergreen hover:bg-harvest-orange hover:text-evergreen text-sandstone-beige font-cta text-cta py-4 uppercase tracking-widest transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
        >
          {buttonIcon && (
            <span className="material-symbols-outlined text-sm">{buttonIcon}</span>
          )}
          {downloadLabel}
        </a>
      ) : downloadLabel ? (
        <button
          onClick={handleDownload}
          className={`w-full text-sandstone-beige font-cta text-cta py-4 uppercase tracking-widest transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 ${
            success
              ? "bg-asparagus"
              : "bg-evergreen hover:bg-harvest-orange hover:text-evergreen"
          }`}
        >
          <span className="material-symbols-outlined text-sm">{btnIcon}</span>
          {downloadLabel}
        </button>
      ) : null}
    </div>
  );
}
