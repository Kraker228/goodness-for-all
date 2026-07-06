"use client";

import { useState } from "react";
import Link from "next/link";
import DeelMissieButton from "@/components/DeelMissieButton";
import type { SiteSettings } from "@/lib/content";

type HeaderProps = {
  active?: string;
  position?: "sticky" | "fixed";
  settings: SiteSettings;
};

export default function Header({ active, position = "sticky", settings }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const navLinks = settings.nav;

  const positionClass =
    position === "fixed"
      ? "fixed top-0 inset-x-0"
      : "sticky top-0";

  return (
    <>
      <header
        className={`bg-surface border-b-2 border-evergreen w-full ${positionClass} z-[90]`}
      >
        <div className="w-full px-container-margin py-base max-w-[1200px] mx-auto">
          {/* Bovenste rij: hamburger links, logo gecentreerd */}
          <div className="relative flex items-center justify-center min-h-[3rem]">
            <button
              aria-label={settings.openMenuLabel}
              className="material-symbols-outlined text-evergreen cursor-pointer active:scale-95 transition-transform text-3xl md:text-2xl absolute left-0 top-1/2 -translate-y-1/2"
              onClick={() => setOpen(true)}
            >
              menu
            </button>
            <Link
              href={settings.homeHref}
              aria-label={settings.homeAriaLabel}
            >
              <img
                src={settings.logo}
                alt={settings.logoAlt}
                width={545}
                height={168}
                className="h-12 w-auto md:h-11"
              />
            </Link>
          </div>

          {/* Desktop: navigatie links, knoppen rechts, op een tweede rij */}
          <div className="hidden md:flex flex-wrap gap-y-2 items-center justify-between mt-base">
            <nav className="flex gap-base items-center">
              {navLinks.filter((l) => l.href !== "/" && l.href !== "/contact").map((l) => (
                <Link
                  key={l.href}
                  className={`font-label-sm text-label-sm px-4 py-2 hover:bg-sandstone-beige transition-colors duration-200 ${
                    active === l.href ? "text-harvest-orange font-bold" : "text-evergreen"
                  }`}
                  href={l.href}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="inline-grid grid-cols-2 gap-3">
              <DeelMissieButton />
              <Link
                href={settings.contactButtonHref}
                className="flex w-full items-center justify-center bg-evergreen text-sandstone-beige hover:bg-harvest-orange hover:text-evergreen px-6 py-2 font-cta text-cta uppercase tracking-widest cursor-pointer active:scale-95 transition-all whitespace-nowrap"
              >
                {settings.contactButton}
              </Link>
            </div>
          </div>

          {/* Mobiel en tablet: knoppen op een eigen rij, even breed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:hidden mt-3">
            <DeelMissieButton />
            <Link
              href={settings.contactButtonHref}
              className="flex w-full items-center justify-center bg-evergreen text-sandstone-beige hover:bg-harvest-orange hover:text-evergreen px-6 py-2 font-cta text-cta uppercase tracking-widest cursor-pointer active:scale-95 transition-all whitespace-nowrap"
            >
              {settings.contactButton}
            </Link>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-y-0 left-0 z-[100] flex flex-col p-gutter bg-pure-mist border-r-2 border-evergreen h-full w-80 transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <span className="text-headline-md font-headline-md text-evergreen">
            {settings.menuLabel}
          </span>
          <button
            aria-label={settings.closeMenuLabel}
            className="material-symbols-outlined cursor-pointer"
            onClick={() => setOpen(false)}
          >
            close
          </button>
        </div>
        <nav className="flex flex-col gap-2">
          {navLinks.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-4 p-4 transition-all duration-300 ${
                i === 0 && active !== l.href
                  ? "bg-harvest-orange text-evergreen font-bold"
                  : active === l.href
                    ? "bg-harvest-orange text-evergreen font-bold"
                    : "text-evergreen hover:bg-asparagus hover:text-white"
              }`}
            >
              <span className="material-symbols-outlined">{l.icon}</span> {l.label}
            </Link>
          ))}
        </nav>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[95] bg-black/30"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}
    </>
  );
}
