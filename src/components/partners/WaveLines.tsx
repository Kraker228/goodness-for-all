"use client";

import { useEffect, useRef } from "react";

/**
 * Subtiele WebGL-achtergrond: een set dunne horizontale lijnen die traag golven,
 * als rustige bewegende stroming achter de tekst. In de Goodness-merkkleuren,
 * laag in opaciteit zodat de tekst leesbaar blijft. Vult de volledige hoogte
 * van het blok.
 *
 * Volgt hetzelfde patroon als ParticleField:
 * - three.js dynamisch geladen (geen statische bundle-last)
 * - pauzeert bij verborgen tab
 * - respecteert prefers-reduced-motion (statisch frame)
 * - volledige cleanup van geometrie, materiaal en renderer
 */
export default function WaveLines({
  lineCount = 24,
  className = "pointer-events-none absolute inset-0 z-0",
}: {
  lineCount?: number;
  className?: string;
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mount = mountRef.current;
    if (!mount) return;

    const reduce =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

    let disposed = false;
    let cleanup: (() => void) | null = null;

    const init = async () => {
      const THREE = await import("three");
      if (disposed || !mountRef.current) return;

      const scene = new THREE.Scene();
      // Orthografische camera: lijnen liggen vlak in het beeldvlak, geen perspectief.
      // Beeldvlak loopt van -1..1 in x én y, ongeacht de aspect — lijnen vullen
      // zo altijd de volledige hoogte van het blok.
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
      camera.position.z = 1;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);
      // Canvas vult het mount-element volledig.
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      renderer.domElement.style.display = "block";

      // Merkkleuren — evergreen en asparagus, op een zandkleurige ondergrond.
      const PALETTE = [
        new THREE.Color(0x334e1f),
        new THREE.Color(0x7ca84c),
      ];

      const SEGMENTS = 140; // resolutie per lijn over de breedte
      const lines: {
        geom: InstanceType<typeof THREE.BufferGeometry>;
        mat: InstanceType<typeof THREE.LineBasicMaterial>;
        positions: Float32Array;
        amplitude: number;
        wavelength: number;
        speed: number;
        phase: number;
        baseY: number;
      }[] = [];

      // Lijnen iets breder dan het beeld zodat de uiteinden buiten beeld vallen.
      const xMin = -1.15;
      const xMax = 1.15;

      for (let l = 0; l < lineCount; l++) {
        const positions = new Float32Array((SEGMENTS + 1) * 3);
        const baseY = -1 + ((l + 0.5) / lineCount) * 2; // gelijkmatig over volledige hoogte

        for (let s = 0; s <= SEGMENTS; s++) {
          const t = s / SEGMENTS;
          positions[s * 3] = xMin + (xMax - xMin) * t;
          positions[s * 3 + 1] = baseY;
          positions[s * 3 + 2] = 0;
        }

        const geom = new THREE.BufferGeometry();
        geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));

        const col = PALETTE[l % PALETTE.length];
        const mat = new THREE.LineBasicMaterial({
          color: col,
          transparent: true,
          // Dun (1px lijn) maar duidelijk zichtbaar tegen de zandkleurige ondergrond,
          // net als de zichtbare deeltjes-animatie op /impact.
          opacity: 0.28 + 0.12 * (l % 2),
        });

        const line = new THREE.Line(geom, mat);
        scene.add(line);

        lines.push({
          geom,
          mat,
          positions,
          // Duidelijk waarneembare, maar nog steeds rustige golfbeweging.
          amplitude: 0.045 + Math.random() * 0.04,
          wavelength: 1.4 + Math.random() * 1.6,
          speed: 0.5 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
          baseY,
        });
      }

      let raf = 0;
      let elapsed = 0;
      let last = 0;

      const drawFrame = (time: number) => {
        for (const ln of lines) {
          const { positions, amplitude, wavelength, speed, phase, baseY } = ln;
          for (let s = 0; s <= SEGMENTS; s++) {
            const x = positions[s * 3];
            // Reizende sinusgolf langs de lijn; tweede component voor zachte variatie.
            const y =
              baseY +
              amplitude *
                (Math.sin(x / wavelength + time * speed + phase) +
                  0.4 * Math.sin(x / (wavelength * 0.5) - time * speed * 0.7));
            positions[s * 3 + 1] = y;
          }
          const attr = ln.geom.attributes.position as InstanceType<
            typeof THREE.BufferAttribute
          >;
          attr.needsUpdate = true;
        }
        renderer.render(scene, camera);
      };

      const animate = (now: number) => {
        if (!last) last = now;
        const dt = Math.min((now - last) / 1000, 0.05); // klem tegen sprongen
        last = now;
        elapsed += dt;
        drawFrame(elapsed);
        raf = requestAnimationFrame(animate);
      };

      const start = () => {
        if (!raf) {
          last = 0;
          raf = requestAnimationFrame(animate);
        }
      };
      const stop = () => {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      };

      // Houd de drawing-buffer gelijk aan de werkelijke elementafmeting.
      // ResizeObserver vangt ook het geval op waarin het blok pas ná init
      // zijn volledige (gestrekte) hoogte krijgt.
      const applySize = () => {
        if (!mountRef.current) return;
        const w = Math.max(1, Math.round(mountRef.current.clientWidth));
        const h = Math.max(1, Math.round(mountRef.current.clientHeight));
        renderer.setSize(w, h, false);
      };
      applySize();

      const ro = new ResizeObserver(() => applySize());
      ro.observe(mount);

      if (reduce) {
        drawFrame(0); // statisch frame
      } else {
        start();
      }

      const onVisibility = () => {
        if (reduce) return;
        return document.hidden ? stop() : start();
      };
      document.addEventListener("visibilitychange", onVisibility);

      cleanup = () => {
        stop();
        ro.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        for (const ln of lines) {
          ln.geom.dispose();
          ln.mat.dispose();
        }
        renderer.dispose();
        if (renderer.domElement.parentNode === mount) {
          mount.removeChild(renderer.domElement);
        }
      };
    };

    void init();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [lineCount, className]);

  return <div ref={mountRef} aria-hidden className={className} />;
}
