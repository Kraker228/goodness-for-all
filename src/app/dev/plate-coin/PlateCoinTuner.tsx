"use client";

import { useState } from "react";
import PlateCoin, { type PlateCoinFace } from "@/components/PlateCoin";
import { COIN_IMAGES } from "@/lib/nlmtd/meals";

type Settings = {
  diameter: number;
  thickness: number;
  halfTurnMs: number;
  restMs: number;
  glare: number;
  wobble: number;
};

const DEFAULTS: Settings = {
  diameter: 340,
  thickness: 0.07,
  halfTurnMs: 1200,
  restMs: 1500,
  glare: 0.6,
  wobble: 1,
};

const SLIDERS: { key: keyof Settings; label: string; min: number; max: number; step: number; unit?: string }[] = [
  { key: "diameter", label: "Diameter", min: 120, max: 520, step: 10, unit: "px" },
  { key: "thickness", label: "Dikte (fractie van diameter)", min: 0.02, max: 0.14, step: 0.005 },
  { key: "halfTurnMs", label: "Halve slag", min: 400, max: 3000, step: 50, unit: "ms" },
  { key: "restMs", label: "Rust per bord", min: 0, max: 4000, step: 100, unit: "ms" },
  { key: "glare", label: "Glans", min: 0, max: 1, step: 0.05 },
  { key: "wobble", label: "Wiebel en zweven", min: 0, max: 1, step: 0.05 },
];

export default function PlateCoinTuner() {
  const [s, setS] = useState<Settings>(DEFAULTS);
  const [calm, setCalm] = useState(false);
  const [freeze, setFreeze] = useState(false);
  const [angle, setAngle] = useState(60);
  const [face, setFace] = useState<PlateCoinFace>("front");
  const [index, setIndex] = useState(0);

  const propsText = `<PlateCoin diameter={${s.diameter}} thickness={${s.thickness}} halfTurnMs={${s.halfTurnMs}} restMs={${s.restMs}} glare={${s.glare}} wobble={${s.wobble}} />`;

  return (
    <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px] items-start">
      <div>
        <PlateCoin
          images={COIN_IMAGES}
          {...s}
          reducedMotion={calm || undefined}
          freezeAngle={freeze ? angle : undefined}
          onFaceChange={(f, i) => {
            setFace(f);
            setIndex(i);
          }}
        />
        <p className="mt-4 flex justify-center gap-8" aria-live="polite">
          <span className={`hero-title font-bold text-[34px] text-white transition-opacity duration-300 ${face === "front" ? "opacity-100" : "opacity-40"}`}>
            Voor jou
          </span>
          <span className={`hero-title font-bold text-[34px] text-harvest-orange transition-opacity duration-300 ${face === "back" ? "opacity-100" : "opacity-40"}`}>
            voor een ander
          </span>
        </p>
        <p className="mt-2 text-center font-body-md text-label-sm opacity-70">
          Zichtbaar: {face === "front" ? "voorkant" : "achterkant"}, bord {index + 1} van {COIN_IMAGES.length} ({COIN_IMAGES[index]?.alt})
        </p>
      </div>

      <form className="bg-sandstone-beige text-evergreen border-2 border-evergreen p-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
        {SLIDERS.map(({ key, label, min, max, step, unit }) => (
          <div key={key}>
            <label htmlFor={`slider-${key}`} className="flex justify-between font-label-sm text-label-sm uppercase">
              <span>{label}</span>
              <span className="tabular-nums">
                {s[key]}
                {unit ?? ""}
              </span>
            </label>
            <input
              id={`slider-${key}`}
              type="range"
              min={min}
              max={max}
              step={step}
              value={s[key]}
              onChange={(e) => setS((prev) => ({ ...prev, [key]: Number(e.target.value) }))}
              className="w-full accent-evergreen"
            />
          </div>
        ))}
        <label className="flex items-center gap-3 font-body-md text-body-md">
          <input type="checkbox" checked={freeze} onChange={(e) => setFreeze(e.target.checked)} className="h-5 w-5 accent-evergreen" />
          Vastzetten op hoek
        </label>
        {freeze && (
          <div>
            <label htmlFor="slider-angle" className="flex justify-between font-label-sm text-label-sm uppercase">
              <span>Hoek</span>
              <span className="tabular-nums">{angle}°</span>
            </label>
            <input
              id="slider-angle"
              type="range"
              min={0}
              max={360}
              step={1}
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full accent-evergreen"
            />
          </div>
        )}
        <label className="flex items-center gap-3 font-body-md text-body-md">
          <input type="checkbox" checked={calm} onChange={(e) => setCalm(e.target.checked)} className="h-5 w-5 accent-evergreen" />
          Toon de variant voor prefers-reduced-motion (crossfade)
        </label>
        <button
          type="button"
          onClick={() => setS(DEFAULTS)}
          className="bg-harvest-orange text-evergreen px-6 py-3 font-cta text-cta uppercase tracking-widest"
        >
          Standaardwaarden
        </button>
        <pre className="bg-surface border-2 border-evergreen p-3 text-[12px] whitespace-pre-wrap break-all">{propsText}</pre>
      </form>
    </div>
  );
}
