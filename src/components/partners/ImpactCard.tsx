"use client";

import { useEffect, useRef, useState } from "react";
import HighlightNumber from "./HighlightNumber";
import InfoTooltip from "./InfoTooltip";

export type Feature =
  | { type: "text"; text: string }
  | { type: "meals"; count: string }
  | { type: "freezer" };

export type Plan = {
  name: string;
  price: string;
  period: string;
  featured: boolean;
  featuredLabel: string;
  dark: boolean;
  features: Feature[];
  buttonLabel: string;
  buttonHref: string;
};

const MOBILE_QUERY = "(max-width: 767px)";

export default function ImpactCard({
  plan,
  mealsTooltip,
  freezerTooltip,
}: {
  plan: Plan;
  mealsTooltip: string;
  freezerTooltip: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isMobile]);

  const highlightActive = isMobile ? inView : hovered;

  const textColor = plan.dark ? "text-sandstone-beige" : "";
  const iconColor = plan.dark ? "text-harvest-orange" : "text-evergreen";

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative flex h-full flex-col border-2 p-8 transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 ${
        plan.dark
          ? "border-evergreen bg-evergreen hover:shadow-[8px_8px_0_0_var(--color-harvest-orange)]"
          : plan.featured
            ? "border-harvest-orange bg-pure-mist hover:shadow-[8px_8px_0_0_var(--color-harvest-orange)]"
            : "border-evergreen bg-sandstone-beige hover:shadow-[8px_8px_0_0_var(--color-evergreen)]"
      }`}
    >
      {plan.featured && (
        <div className="absolute right-0 top-0 bg-harvest-orange px-4 py-1 font-label-sm text-label-sm text-evergreen">
          {plan.featuredLabel}
        </div>
      )}
      <span
        className={`mb-4 font-label-sm text-label-sm uppercase tracking-widest ${
          plan.dark ? "text-sandstone-beige" : "text-evergreen"
        }`}
      >
        {plan.name}
      </span>
      <div
        className={`mb-6 text-headline-lg text-headline-lg ${
          plan.dark ? "text-harvest-orange" : "text-evergreen"
        }`}
      >
        {plan.price} <span className={`text-body-md ${plan.dark ? "text-sandstone-beige" : ""}`}>{plan.period}</span>
      </div>
      <ul className="mb-10 flex-grow space-y-4">
        {plan.features.map((feature, i) => {
          if (feature.type === "meals") {
            return (
              <li key={i} className={`flex items-start gap-2 text-body-md font-bold ${textColor}`}>
                <span className={`material-symbols-outlined ${iconColor}`}>check_box</span>
                <span>
                  Elk jaar <HighlightNumber active={highlightActive}>{feature.count}</HighlightNumber>{" "}
                  maaltijden namens jouw bedrijf gedistribueerd.
                  <InfoTooltip text={mealsTooltip} />
                </span>
              </li>
            );
          }
          if (feature.type === "freezer") {
            return (
              <li key={i} className={`flex items-start gap-2 text-body-md ${textColor}`}>
                <span className={`material-symbols-outlined ${iconColor}`}>check_box</span>
                <span>
                  Vriezer op jullie werkplek als activatie van het partnership.
                  <InfoTooltip text={freezerTooltip} />
                </span>
              </li>
            );
          }
          return (
            <li key={i} className={`flex items-start gap-2 text-body-md ${textColor}`}>
              <span className={`material-symbols-outlined ${iconColor}`}>check_box</span>
              {feature.text}
            </li>
          );
        })}
      </ul>
      <a
        href={plan.buttonHref}
        className={`block w-full py-4 text-center font-cta text-cta transition-colors ${
          plan.dark
            ? "bg-sandstone-beige text-evergreen hover:bg-white"
            : plan.featured
              ? "bg-harvest-orange text-evergreen transition-transform active:scale-95"
              : "bg-evergreen text-sandstone-beige hover:bg-primary"
        }`}
      >
        {plan.buttonLabel}
      </a>
    </div>
  );
}
