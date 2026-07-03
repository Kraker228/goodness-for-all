"use client";

import { useState } from "react";

/**
 * Lightweight YouTube-facade: toont eerst alleen de thumbnail met een
 * eigen play-knop, en laadt de (nocookie) iframe pas na een klik. Zo
 * blijft de pagina snel en start de video nooit vanzelf.
 */
export default function YouTubeFacade({
  videoId,
  title,
  playLabel,
}: {
  videoId: string;
  title: string;
  playLabel: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
        title={title}
        className="absolute inset-0 h-full w-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={playLabel}
      className="group absolute inset-0 block h-full w-full cursor-pointer"
    >
      <img
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        className="h-full w-full object-cover"
        loading="lazy"
      />
      <span className="absolute inset-0 bg-evergreen/25 transition-colors group-hover:bg-evergreen/10" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white bg-harvest-orange shadow-[4px_4px_0_0_rgba(0,0,0,0.25)] transition-transform group-hover:scale-105 md:h-20 md:w-20">
          <span
            className="material-symbols-outlined text-4xl text-white md:text-5xl"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            play_arrow
          </span>
        </span>
      </span>
    </button>
  );
}
