import { motion } from "framer-motion";

// Stars: sparse, weighted toward right half and upper area to match reference
const STARS = Array.from({ length: 38 }, (_, i) => ({
  id: i,
  // Bias stars toward right side and upper regions like the reference
  top:  `${(i * 53.3 + 7) % 82}%`,
  left: `${30 + (i * 47.1 + 19) % 68}%`,
  size: (i * 9 + 5) % 11 > 8 ? 2 : 1,
  minOp: 0.06 + ((i * 7) % 4) * 0.015,
  maxOp: 0.20 + ((i * 11) % 5) * 0.03,
  dur: 3.5 + (i % 5) * 1.3,
  delay: (i * 1.9) % 9,
}));

function Starfield() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 2 }}>
      {STARS.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            background: "#ffffff",
            filter: "blur(0.3px)",
          }}
          animate={{ opacity: [s.minOp, s.maxOp, s.minOp] }}
          transition={{
            duration: s.dur,
            repeat: Infinity,
            repeatType: "mirror",
            delay: s.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export default function HeroScene() {
  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden"
      style={{ background: "#07090D" }}
    >
      <style>{`
        @keyframes spotlight-breathe {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.88; }
        }
        @keyframes grid-breathe {
          0%, 100% { opacity: 0.18; }
          50%       { opacity: 0.24; }
        }
        @keyframes spotlight { 0% { opacity: 0; } 100% { opacity: 1; } }
        .animate-spotlight { animation: spotlight 2s ease 0.5s 1 forwards; }
      `}</style>

      {/* ── GRID ────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(#141823 1px, transparent 1px),
            linear-gradient(90deg, #141823 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          animation: "grid-breathe 14s ease-in-out infinite",
          zIndex: 1,
        }}
      />

      {/* ── SPOTLIGHT: pinned exactly at top-left corner ─────────────
          In the reference the beam originates from the absolute top-left
          corner (0,0) and fans out diagonally toward center-right.
          Three layers build the cone:
          1. Outer wide fan — large, very soft blue
          2. Mid cone — medium, brighter
          3. Hot core — small, near-white blue at origin
      ──────────────────────────────────────────────────────────────── */}

      {/* Layer 1: Outer wide fan */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: 0,
          left: 0,
          width: "72vw",
          height: "85vh",
          background: `radial-gradient(ellipse at 0% 0%,
            rgba(50, 90, 255, 0.45) 0%,
            rgba(40, 80, 230, 0.20) 30%,
            rgba(30, 60, 200, 0.06) 58%,
            transparent 75%
          )`,
          filter: "blur(80px)",
          transformOrigin: "0% 0%",
          animation: "spotlight-breathe 9s ease-in-out infinite",
          zIndex: 3,
        }}
      />

      {/* Layer 2: Mid cone — brighter, tighter */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: 0,
          left: 0,
          width: "48vw",
          height: "65vh",
          background: `radial-gradient(ellipse at 0% 0%,
            rgba(80, 120, 255, 0.55) 0%,
            rgba(60, 100, 255, 0.22) 28%,
            rgba(40, 80, 230, 0.07) 55%,
            transparent 72%
          )`,
          filter: "blur(55px)",
          animation: "spotlight-breathe 9s ease-in-out infinite 1s",
          zIndex: 4,
        }}
      />

      {/* Layer 3: Hot core — near-white blue at the origin point */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-40px",
          left: "-40px",
          width: "320px",
          height: "320px",
          background: `radial-gradient(ellipse at 20% 20%,
            rgba(160, 190, 255, 0.60) 0%,
            rgba(100, 150, 255, 0.28) 30%,
            rgba(70, 110, 255, 0.08) 58%,
            transparent 75%
          )`,
          filter: "blur(38px)",
          animation: "spotlight-breathe 9s ease-in-out infinite 0.5s",
          zIndex: 5,
        }}
      />

      {/* ── STARS ───────────────────────────────────────────────────── */}
      <Starfield />

      {/* ── BOTTOM VIGNETTE ─────────────────────────────────────────── */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: "50%",
          background:
            "linear-gradient(to top, #07090D 0%, rgba(7,9,13,0.94) 18%, transparent 100%)",
          zIndex: 6,
        }}
      />
    </div>
  );
}