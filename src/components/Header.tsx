"use client";

import { useState } from "react";
import Link from "next/link";
import { NAV_LINKS } from "./nav-links";

type HeaderProps = {
  /** Pathname of the active page so it can be highlighted (harvest-orange). */
  active?: string;
  /** "sticky" (default) or "fixed" (contact page uses fixed). */
  position?: "sticky" | "fixed";
};

export default function Header({ active, position = "sticky" }: HeaderProps) {
  const [open, setOpen] = useState(false);

  const positionClass =
    position === "fixed"
      ? "fixed top-0 inset-x-0"
      : "sticky top-0";

  return (
    <>
      <header
        className={`bg-surface border-b-2 border-evergreen w-full ${positionClass} z-[90]`}
      >
        <div className="flex justify-between items-center w-full px-container-margin py-base max-w-[1200px] mx-auto">
          <div className="flex items-center gap-4">
            <button
              aria-label="Open menu"
              className="material-symbols-outlined text-evergreen cursor-pointer active:scale-95 transition-transform"
              onClick={() => setOpen(true)}
            >
              menu
            </button>
            <Link href="/" aria-label="Goodness for All — home">
              <img
                src="/images/logo.png"
                alt="Goodness for All"
                width={545}
                height={168}
                className="h-8 w-auto"
              />
            </Link>
          </div>
          <nav className="hidden md:flex gap-base items-center">
            <Link
              className={`font-bold font-label-sm text-label-sm px-4 py-2 hover:bg-sandstone-beige transition-colors duration-200 ${
                active === "/" ? "text-harvest-orange" : "text-evergreen"
              }`}
              href="/"
            >
              Home
            </Link>
            {NAV_LINKS.filter((l) => l.href !== "/contact").map((l) => (
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
          <Link
            href="/contact"
            className="bg-evergreen text-sandstone-beige hover:bg-harvest-orange hover:text-evergreen px-6 py-2 font-cta text-cta uppercase tracking-widest cursor-pointer active:scale-95 transition-all inline-block"
          >
            Contact
          </Link>
        </div>
      </header>

      {/* NavigationDrawer (mobile) */}
      <div
        className={`fixed inset-y-0 left-0 z-[100] flex flex-col p-gutter bg-pure-mist border-r-2 border-evergreen h-full w-80 transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-8">
          <span className="text-headline-md font-headline-md text-evergreen">Menu</span>
          <button
            aria-label="Close menu"
            className="material-symbols-outlined cursor-pointer"
            onClick={() => setOpen(false)}
          >
            close
          </button>
        </div>
        <nav className="flex flex-col gap-2">
          {NAV_LINKS.map((l, i) => (
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

      {/* Backdrop */}
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
