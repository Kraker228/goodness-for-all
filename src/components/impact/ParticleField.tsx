"use client";

import { useEffect, useRef } from "react";

/**
 * Rustige WebGL-sfeer achter de impact-quote: zachte lichtdeeltjes die langzaam
 * opstijgen en wrappen, als stof in zonlicht — in de Goodness-merkkleuren.
 * Gebaseerd op het werkende Tellavia-patroon:
 * - three.js dynamisch geladen (geen statische bundle-last)
 * - additive blending zodat de deeltjes oplichten en duidelijk zichtbaar zijn
 * - mouse-parallax, pauzeert bij verborgen tab, geen WebGL bij reduced-motion
 */
export default function ParticleField({
  count = 320,
  size = 0.5,
  opacity = 0.8,
  className = "pointer-events-none absolute inset-0 z-0",
}: {
  count?: number;
  size?: number;
  opacity?: number;
  className?: string;
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Honour reduced-motion by rendering a STATIC field (still visible) rather
    // than hiding it entirely — users with reduce-motion still see the texture.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;
    let cleanup: (() => void) | null = null;

    const init = async () => {
      const THREE = await import("three");
      if (disposed || !mountRef.current) return;

      const width = mount.clientWidth || 1;
      const height = mount.clientHeight || 1;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
      camera.position.z = 14;

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setSize(width, height);
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      // Brand palette — evergreen, harvest-orange, asparagus.
      const PALETTE = [
        new THREE.Color(0x334e1f),
        new THREE.Color(0xed961d),
        new THREE.Color(0x7ca84c),
        new THREE.Color(0xed961d),
      ];

      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const speeds = new Float32Array(count);

      // Spread scaled to the visible area at this depth so particles fill the
      // whole section (not just the centre) — also on wide, short bands.
      const vFOV = (camera.fov * Math.PI) / 180;
      const visH = 2 * Math.tan(vFOV / 2) * camera.position.z;
      const visW = visH * camera.aspect;
      const spreadX = visW * 1.3;
      const spreadY = visH * 1.25;

      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * spreadX;
        positions[i * 3 + 1] = (Math.random() - 0.5) * spreadY;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        speeds[i] = 0.004 + Math.random() * 0.014;

        const col = PALETTE[i % PALETTE.length];
        colors[i * 3] = col.r;
        colors[i * 3 + 1] = col.g;
        colors[i * 3 + 2] = col.b;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      // Soft radial sprite so points read as gentle glowing dots.
      const c = document.createElement("canvas");
      c.width = c.height = 64;
      const g = c.getContext("2d")!;
      const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, "rgba(255,255,255,0.95)");
      grad.addColorStop(0.4, "rgba(255,255,255,0.5)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = grad;
      g.fillRect(0, 0, 64, 64);
      const sprite = new THREE.CanvasTexture(c);

      const material = new THREE.PointsMaterial({
        size,
        map: sprite,
        vertexColors: true,
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const points = new THREE.Points(geometry, material);
      scene.add(points);

      let targetX = 0;
      let targetY = 0;
      let curX = 0;
      let curY = 0;
      const onMove = (e: MouseEvent) => {
        targetX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetY = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("mousemove", onMove);

      let raf = 0;
      const pos = geometry.attributes.position as InstanceType<typeof THREE.BufferAttribute>;
      const animate = () => {
        // Read from the buffer and write back with a wrap — bounded, no runaway.
        for (let i = 0; i < count; i++) {
          let y = pos.getY(i) + speeds[i];
          if (y > spreadY / 2) y = -spreadY / 2;
          pos.setY(i, y);
        }
        pos.needsUpdate = true;

        curX += (targetX - curX) * 0.04;
        curY += (targetY - curY) * 0.04;
        points.rotation.y = curX * 0.18;
        points.rotation.x = -curY * 0.12;

        renderer.render(scene, camera);
        raf = requestAnimationFrame(animate);
      };
      const start = () => {
        if (!raf) raf = requestAnimationFrame(animate);
      };
      const stop = () => {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      };

      if (reduce) {
        // Static frame only — visible but not animated.
        renderer.render(scene, camera);
      } else {
        start();
      }

      const onVisibility = () => {
        if (reduce) return;
        return document.hidden ? stop() : start();
      };
      document.addEventListener("visibilitychange", onVisibility);

      const onResize = () => {
        if (!mountRef.current) return;
        const w = mountRef.current.clientWidth || 1;
        const h = mountRef.current.clientHeight || 1;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      cleanup = () => {
        stop();
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("resize", onResize);
        document.removeEventListener("visibilitychange", onVisibility);
        geometry.dispose();
        material.dispose();
        sprite.dispose();
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
  }, [count, size, opacity, className]);

  return <div ref={mountRef} aria-hidden className={className} />;
}
