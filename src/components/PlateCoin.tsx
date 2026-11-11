"use client";

import { useEffect, useRef, useState } from "react";

export type PlateCoinImage = {
  src: string;
  alt: string;
};

export type PlateCoinFace = "front" | "back";

type Props = {
  /** Borden in volgorde. De munt toont ze één voor één en begint daarna opnieuw. */
  images: PlateCoinImage[];
  /** Maximale diameter in px. Is de container smaller, dan krimpt de munt mee. */
  diameter?: number;
  /** Dikte van de rand als fractie van de diameter (0,06 tot 0,08 lijkt op een munt). */
  thickness?: number;
  /** Duur van een halve slag in ms. */
  halfTurnMs?: number;
  /** Rust op elk bord in ms, zodat het bord leesbaar is. */
  restMs?: number;
  /** Sterkte van de glans, 0 tot 1. */
  glare?: number;
  /** Sterkte van de wiebel en het zweven, 0 tot 1. */
  wobble?: number;
  /** Zet de munt vast op deze hoek in graden (alleen voor tunen). */
  freezeAngle?: number;
  /** Forceer de rustige variant (alleen voor testen); standaard volgt het prefers-reduced-motion. */
  reducedMotion?: boolean;
  /** Wordt aangeroepen zodra een ander vlak naar de kijker draait. */
  onFaceChange?: (face: PlateCoinFace, index: number) => void;
  /** Toegankelijke omschrijving van het geheel. */
  label?: string;
  className?: string;
};

// Rand in afgeleiden van Evergreen: afwisselend licht en donker voor een fijne
// ribbeling die zowel op een lichte als op een donkergroene achtergrond zichtbaar is.
const RIM = "var(--color-evergreen)";
const RIM_LIGHT = "color-mix(in srgb, var(--color-evergreen) 70%, var(--color-sandstone-beige))";
const RIM_DARK = "color-mix(in srgb, var(--color-evergreen) 55%, black)";

const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * Draaiende munt met op elk vlak een bord eten. Elke halve slag wisselt het
 * vlak dat van de kijker af staat naar het volgende bord, zodat je bord 1, 2,
 * 3 enzovoort ziet zonder de wissel te zien.
 *
 * Techniek: CSS 3D (rotateY met perspectief) aangestuurd vanuit
 * requestAnimationFrame. De rand bestaat uit gestapelde schijven. Er wordt per
 * frame niet opnieuw gerenderd; stijlen worden direct via refs gezet.
 */
export default function PlateCoin({
  images,
  diameter = 320,
  thickness = 0.07,
  halfTurnMs = 1200,
  restMs = 1500,
  glare = 0.6,
  wobble = 1,
  freezeAngle,
  reducedMotion,
  onFaceChange,
  label = "Draaiend bord met steeds een andere maaltijd",
  className = "",
}: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const coinRef = useRef<HTMLDivElement | null>(null);
  const shadowRef = useRef<HTMLDivElement | null>(null);
  const frontImgRef = useRef<HTMLImageElement | null>(null);
  const backImgRef = useRef<HTMLImageElement | null>(null);
  const frontShadeRef = useRef<HTMLDivElement | null>(null);
  const backShadeRef = useRef<HTMLDivElement | null>(null);
  const frontGlareRef = useRef<HTMLDivElement | null>(null);
  const backGlareRef = useRef<HTMLDivElement | null>(null);

  const [size, setSize] = useState(diameter);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const [fadeIndex, setFadeIndex] = useState(0);

  const calm = reducedMotion ?? prefersReduced;
  const n = images.length;
  const t = Math.max(2, Math.round(size * thickness));

  // Callback in een ref, zodat de animatielus niet opnieuw start bij elke render.
  const onFaceChangeRef = useRef(onFaceChange);
  useEffect(() => {
    onFaceChangeRef.current = onFaceChange;
  }, [onFaceChange]);

  // Diameter volgt de beschikbare breedte, met `diameter` als maximum.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const update = () => setSize(Math.max(80, Math.min(diameter, Math.floor(el.clientWidth))));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [diameter]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Alle borden vooraf laden en decoderen, zodat een wissel nooit hapert.
  useEffect(() => {
    images.forEach(({ src }) => {
      const img = new Image();
      img.src = src;
      img.decode?.().catch(() => {});
    });
  }, [images]);

  // Pauzeren buiten beeld of in een verborgen tab.
  const runningRef = useRef(true);
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    let inView = true;
    const sync = () => {
      runningRef.current = inView && document.visibilityState === "visible";
    };
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      sync();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    sync();
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  // Rustige variant: crossfade tussen de borden, geen rotatie.
  useEffect(() => {
    if (!calm || n === 0) return;
    let index = 0;
    onFaceChangeRef.current?.("front", 0);
    const id = window.setInterval(() => {
      if (!runningRef.current) return;
      index = (index + 1) % n;
      setFadeIndex(index);
      onFaceChangeRef.current?.(index % 2 === 0 ? "front" : "back", index);
    }, halfTurnMs + restMs);
    return () => window.clearInterval(id);
  }, [calm, n, halfTurnMs, restMs]);

  // Draaiende munt.
  useEffect(() => {
    if (calm || n === 0) return;
    let raf = 0;
    let last = 0;
    let elapsed = 0;
    let wobbleTime = 0;
    let frontIdx = -1;
    let backIdx = -1;
    let face: PlateCoinFace | null = null;
    const period = restMs + halfTurnMs;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = last ? Math.min(100, now - last) : 0;
      last = now;
      if (!runningRef.current) return;
      elapsed += dt;
      wobbleTime += dt;

      // Hoek: rust op kπ, daarna een halve slag met ease-in-out.
      let k: number;
      let theta: number;
      if (freezeAngle !== undefined) {
        theta = (freezeAngle * Math.PI) / 180;
        k = Math.floor(theta / Math.PI + 1e-9);
      } else {
        k = Math.floor(elapsed / period);
        const local = elapsed - k * period;
        const p = local < restMs ? 0 : easeInOut((local - restMs) / halfTurnMs);
        theta = (k + p) * Math.PI;
      }
      const cos = Math.cos(theta);
      const sin = Math.sin(theta);

      // Afbeeldingen: het vlak dat helemaal van de kijker af staat krijgt het volgende bord.
      const even = k % 2 === 0;
      const nextFront = (even ? k : k + 1) % n;
      const nextBack = (even ? k + 1 : k) % n;
      if (nextFront !== frontIdx && frontImgRef.current) {
        frontIdx = nextFront;
        frontImgRef.current.src = images[frontIdx].src;
      }
      if (nextBack !== backIdx && backImgRef.current) {
        backIdx = nextBack;
        backImgRef.current.src = images[backIdx].src;
      }

      // Welk vlak is zichtbaar? Melden zodra dat wisselt (bij de rand).
      const visible: PlateCoinFace = cos >= 0 ? "front" : "back";
      if (visible !== face) {
        face = visible;
        onFaceChangeRef.current?.(visible, visible === "front" ? frontIdx : backIdx);
      }

      // Kleine wiebel en zweven.
      const w = clamp(wobble, 0, 1);
      const tilt = w * 5 * Math.sin((wobbleTime / 3100) * Math.PI * 2);
      const bob = w * size * 0.025 * Math.sin((wobbleTime / 2300) * Math.PI * 2);
      if (coinRef.current) {
        coinRef.current.style.transform = `translateY(${bob.toFixed(2)}px) rotateX(${tilt.toFixed(2)}deg) rotateY(${theta.toFixed(4)}rad)`;
      }

      // Helderheid: donkerder naarmate een vlak wegdraait, licht van links.
      const shade = (c: number, s: number) =>
        clamp(0.62 * Math.pow(1 - Math.max(0, c), 1.1) + 0.12 * s, 0, 0.75).toFixed(3);
      if (frontShadeRef.current) frontShadeRef.current.style.opacity = shade(cos, sin);
      if (backShadeRef.current) backShadeRef.current.style.opacity = shade(-cos, -sin);

      // Glans die over het oppervlak schuift.
      const g = clamp(glare, 0, 1);
      const glarePos = (s: number) => `${(50 - s * 80).toFixed(1)}% 50%`;
      const glareOpacity = (g * (0.25 + 0.75 * Math.abs(sin))).toFixed(3);
      if (frontGlareRef.current) {
        frontGlareRef.current.style.backgroundPosition = glarePos(sin);
        frontGlareRef.current.style.opacity = glareOpacity;
      }
      if (backGlareRef.current) {
        backGlareRef.current.style.backgroundPosition = glarePos(-sin);
        backGlareRef.current.style.opacity = glareOpacity;
      }

      // Schaduw schaalt mee met de zichtbare breedte: |cos| x d + |sin| x dikte.
      if (shadowRef.current) {
        const width = Math.abs(cos) * size + Math.abs(sin) * t;
        const scale = clamp(width / size, 0.08, 1);
        const lift = 1 - bob / (size * 0.05);
        shadowRef.current.style.transform = `translateX(-50%) scaleX(${scale.toFixed(3)})`;
        shadowRef.current.style.opacity = clamp(0.45 * lift, 0.2, 0.6).toFixed(3);
      }
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [calm, n, images, halfTurnMs, restMs, glare, wobble, size, t, freezeAngle]);

  const layers = Math.max(8, Math.round(t));
  const faceBase = "absolute inset-0 rounded-full overflow-hidden [backface-visibility:hidden]";
  const glareStyle = {
    backgroundImage:
      "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.55) 48%, rgba(255,255,255,0.15) 56%, transparent 70%)",
    backgroundSize: "260% 100%",
    backgroundPosition: "50% 50%",
    mixBlendMode: "screen" as const,
    opacity: 0,
  };

  return (
    <div
      ref={wrapperRef}
      role="img"
      aria-label={label}
      className={`relative w-full mx-auto ${className}`}
      style={{ maxWidth: diameter, aspectRatio: "1 / 1.16" }}
    >
      {/* Schaduw onder de munt */}
      <div
        ref={shadowRef}
        aria-hidden="true"
        className="absolute left-1/2 rounded-full"
        style={{
          bottom: 0,
          width: size * 0.82,
          height: size * 0.09,
          transform: "translateX(-50%)",
          background: "radial-gradient(closest-side, rgba(0,0,0,0.55), rgba(0,0,0,0))",
          opacity: 0.45,
        }}
      />

      {calm ? (
        <div className="absolute top-0 left-1/2 -translate-x-1/2" style={{ width: size, height: size }}>
          {images.map((img, i) => (
            // eslint-disable-next-line @next/next/no-img-element -- vooraf geschaalde webp; next/image voegt hier niets toe
            <img
              key={img.src}
              src={img.src}
              alt=""
              width={size}
              height={size}
              className="absolute inset-0 w-full h-full rounded-full transition-opacity duration-700"
              style={{ opacity: i === fadeIndex ? 1 : 0 }}
            />
          ))}
        </div>
      ) : (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2"
          style={{ width: size, height: size, perspective: size * 3.2 }}
        >
          <div
            ref={coinRef}
            className="relative w-full h-full [transform-style:preserve-3d] will-change-transform"
          >
            {/* Rand: gestapelde schijven met een fijne ribbeling */}
            {Array.from({ length: layers }, (_, i) => {
              const z = -t / 2 + (t * (i + 0.5)) / layers;
              return (
                <div
                  key={i}
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full"
                  style={{
                    transform: `translateZ(${z.toFixed(2)}px)`,
                    background: i % 2 === 0 ? RIM_LIGHT : RIM_DARK,
                  }}
                />
              );
            })}

            {/* Rand van opzij: een massieve strook met ribbeling, loodrecht op de
                vlakken. Zichtbaar zodra de munt op zijn kant staat. */}
            <div
              aria-hidden="true"
              className="absolute top-0 left-1/2 h-full"
              style={{
                width: t,
                marginLeft: -t / 2,
                transform: "rotateY(90deg)",
                borderRadius: t / 2,
                background: `repeating-linear-gradient(to bottom, ${RIM_LIGHT} 0 1px, ${RIM_DARK} 1px 3px)`,
              }}
            />

            {/* Voorkant */}
            <div className={faceBase} style={{ transform: `translateZ(${t / 2}px)`, background: RIM }}>
              {/* eslint-disable-next-line @next/next/no-img-element -- src wisselt per frame via de ref */}
              <img
                ref={frontImgRef}
                src={images[0]?.src}
                alt=""
                width={size}
                height={size}
                draggable={false}
                className="w-full h-full select-none"
              />
              <div ref={frontShadeRef} aria-hidden="true" className="absolute inset-0 bg-black" style={{ opacity: 0 }} />
              <div ref={frontGlareRef} aria-hidden="true" className="absolute inset-0" style={glareStyle} />
            </div>

            {/* Achterkant: rotateY(180deg) zodat het bord niet gespiegeld staat */}
            <div
              className={faceBase}
              style={{ transform: `rotateY(180deg) translateZ(${t / 2}px)`, background: RIM }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- src wisselt per frame via de ref */}
              <img
                ref={backImgRef}
                src={images[1 % Math.max(1, n)]?.src}
                alt=""
                width={size}
                height={size}
                draggable={false}
                className="w-full h-full select-none"
              />
              <div ref={backShadeRef} aria-hidden="true" className="absolute inset-0 bg-black" style={{ opacity: 0 }} />
              <div ref={backGlareRef} aria-hidden="true" className="absolute inset-0" style={glareStyle} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
