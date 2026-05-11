import { motion } from "framer-motion";

// ─── Subtle star field ───────────────────────────────────────────────────────
const Starfield = ({ count = 40 }: { count?: number }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full bg-white"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          width: Math.random() > 0.92 ? 2 : 1,
          height: Math.random() > 0.92 ? 2 : 1,
          opacity: Math.random() * 0.18 + 0.04,
        }}
        animate={{ opacity: [null as any, 0.03, 0.22] }}
        transition={{
          duration: 3 + Math.random() * 5,
          repeat: Infinity,
          repeatType: "reverse",
          delay: Math.random() * 8,
        }}
      />
    ))}
  </div>
);

// ────────────────────────────────────────────────────────────────────────────

export default function HeroScene() {
  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden"
      style={{ background: "#07041a" }}
    >
      {/* ── 1. Grid lines — the "professional" layer ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139,92,246,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,0.07) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
          // Fade the grid toward the edges so it doesn't look boxy
          maskImage: "radial-gradient(ellipse 90% 80% at 50% 40%, black 0%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 80% at 50% 40%, black 0%, transparent 80%)",
        }}
      />

      {/* ── 2. Center spotlight — mimics the Vantrix "beam" ── */}
      {/* Primary glow — wide, diffuse */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "900px",
          height: "600px",
          background:
            "radial-gradient(ellipse 60% 55% at 50% 0%, rgba(109,40,217,0.28) 0%, rgba(88,28,220,0.10) 40%, transparent 70%)",
          filter: "blur(1px)",
        }}
      />
      {/* Tighter inner highlight — the bright center of the beam */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-5%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "480px",
          height: "380px",
          background:
            "radial-gradient(ellipse 50% 50% at 50% 0%, rgba(139,92,246,0.22) 0%, rgba(109,40,217,0.06) 55%, transparent 75%)",
        }}
      />

      {/* ── 3. Ambient base haze ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 100% 55% at 50% 65%, rgba(55,14,150,0.10) 0%, transparent 65%)",
        }}
      />

      {/* ── 4. Starfield (very subtle) ── */}
      <Starfield count={45} />

      {/* ── 5. Bottom fade — hero melts into content below ── */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: "52%",
          background:
            "linear-gradient(to top, #07041a 0%, rgba(7,4,26,0.92) 20%, rgba(7,4,26,0.4) 55%, transparent 100%)",
          zIndex: 4,
        }}
      />

      {/* ── 6. Side vignettes — keeps grid from looking harsh at edges ── */}
      <div
        className="absolute inset-y-0 left-0 pointer-events-none"
        style={{
          width: "16%",
          background: "linear-gradient(to right, rgba(7,4,26,0.7) 0%, transparent 100%)",
          zIndex: 4,
        }}
      />
      <div
        className="absolute inset-y-0 right-0 pointer-events-none"
        style={{
          width: "16%",
          background: "linear-gradient(to left, rgba(7,4,26,0.7) 0%, transparent 100%)",
          zIndex: 4,
        }}
      />

      {/* ── 7. Top scrim — headline readability ── */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{
          height: "30%",
          background: "linear-gradient(to bottom, rgba(7,4,26,0.25) 0%, transparent 100%)",
          zIndex: 4,
        }}
      />
    </div>
  );
}