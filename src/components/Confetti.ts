/** Fires a one-off full-screen confetti burst on a temporary canvas. */
export function fireConfetti(durationMs = 6000) {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.style.cssText =
    "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  const resize = () => {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener("resize", resize);

  // Saturated colours that stand out on both the green and the beige sections.
  const colors = ["#ed961d", "#334e1f", "#e8453c", "#f7c32e", "#ffffff", "#2f9e8f"];
  const w = window.innerWidth;
  const h = window.innerHeight;
  const count = Math.min(450, Math.round(w / 3));

  // Two cannons in the bottom corners plus a gentle shower from the top.
  const particles = Array.from({ length: count }, (_, i) => {
    const kind = i % 3;
    let x: number, y: number, vx: number, vy: number;
    if (kind === 2) {
      x = Math.random() * w;
      y = -20 - Math.random() * h * 0.5;
      vx = (Math.random() - 0.5) * 2;
      vy = 2 + Math.random() * 3;
    } else {
      const fromLeft = kind === 0;
      x = fromLeft ? 0 : w;
      y = h;
      const angle = -(Math.PI / 4 + Math.random() * (Math.PI / 6));
      const speed = (16 + Math.random() * 12) * Math.min(1.2, Math.max(0.7, h / 800));
      vx = Math.cos(angle) * speed * (fromLeft ? 1 : -1);
      vy = Math.sin(angle) * speed;
    }
    return {
      x,
      y,
      vx,
      vy,
      size: 12 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.3,
      tilt: Math.random() * Math.PI * 2,
      circle: Math.random() < 0.3,
    };
  });

  let start: number | null = null;
  const step = (ts: number) => {
    if (start === null) start = ts;
    const elapsed = ts - start;
    const fade = Math.max(0, Math.min(1, (durationMs - elapsed) / 1000));

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.globalAlpha = fade;
    for (const p of particles) {
      p.vy += 0.22;
      p.vx *= 0.985;
      p.vy *= 0.985;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.spin;
      p.tilt += 0.1;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      if (p.circle) {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2.5, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(-p.size / 2, (-p.size / 4) * Math.cos(p.tilt), p.size, (p.size / 2) * Math.cos(p.tilt));
      }
      ctx.restore();
    }

    if (elapsed < durationMs) {
      window.requestAnimationFrame(step);
    } else {
      window.removeEventListener("resize", resize);
      canvas.remove();
    }
  };
  window.requestAnimationFrame(step);
}
