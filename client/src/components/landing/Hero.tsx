import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { typography } from "./design-system";

const ease = [0.16, 1, 0.3, 1] as const;

// ─── KEYFRAMES ────────────────────────────────────────────────────────────────
const HeroKeyframes = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

    /* PROGRESS word glow — text-shadow works on solid-color text,
       but we need drop-shadow for gradient text */
    @keyframes progress-bloom {
      0%, 100% {
        filter:
          drop-shadow(0 0 20px rgba(91,127,255,0.45))
          drop-shadow(0 0 55px rgba(91,127,255,0.18));
      }
      50% {
        filter:
          drop-shadow(0 0 32px rgba(91,127,255,0.65))
          drop-shadow(0 0 80px rgba(91,127,255,0.28));
      }
    }
    .progress-word {
      display: inline-block;
      animation: progress-bloom 4s ease-in-out infinite;
    }

    /* CTA bloom orb — breathes beneath the button */
    @keyframes bloom-breathe {
      0%, 100% { opacity: 0.55; transform: scale(1);    }
      50%       { opacity: 0.82; transform: scale(1.10); }
    }
    .cta-bloom-anim { animation: bloom-breathe 3.6s ease-in-out infinite; }

    /* Spark chase around button border */
    @keyframes spark-loop {
      0%   { stroke-dashoffset: 1000; opacity: 1; }
      80%  { opacity: 1; }
      100% { stroke-dashoffset: 0;    opacity: 0; }
    }
    .spark-path {
      stroke-dasharray: 120 880;
      stroke-dashoffset: 1000;
      animation: spark-loop 2.8s cubic-bezier(0.4,0,0.6,1) infinite;
    }
    .spark-path-b {
      stroke-dasharray: 80 920;
      stroke-dashoffset: 1000;
      animation: spark-loop 2.8s cubic-bezier(0.4,0,0.6,1) infinite 1.4s;
    }

    @keyframes spotlight { 0% { opacity: 0; } 100% { opacity: 1; } }
    .animate-spotlight { animation: spotlight 2s ease 0.5s 1 forwards; }
  `}</style>
);


// ─── HERO CONTENT (used in Landing sticky pin zone) ───────────────────────────
export function HeroContent() {
  return (
    <>
      <HeroKeyframes />

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.72, delay: 0.10, ease }}
        className="font-black uppercase select-none"
        style={{
          fontFamily: typography.display,
          fontSize: "clamp(3.6rem, 9vw, 7.4rem)",
          lineHeight: 0.90,
          letterSpacing: "-0.02em",
          marginBottom: "28px",
          textAlign: "center",
        }}
      >
        <span
          className="block"
          style={{
            background: "linear-gradient(180deg, #F5F7FF 0%, #C8CFEE 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Turn Grind
        </span>
        <span className="block">
          <span
            style={{
              background: "linear-gradient(180deg, #E0E8FF 0%, #A8B8EE 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Into{" "}
          </span>
          <span
            className="progress-word"
            style={{
              background: "linear-gradient(135deg, #B7CCFF 0%, #7AA2FF 45%, #5B7FFF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Progress
          </span>
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.62, delay: 0.20, ease }}
        className="select-none"
        style={{
          fontFamily: typography.body,
          fontSize: "clamp(0.88rem, 1.35vw, 1.02rem)",
          color: "rgba(255,255,255,0.62)",
          fontWeight: 400,
          lineHeight: 1.65,
          maxWidth: "440px",
          marginBottom: "36px",
          textAlign: "center",
        }}
      >
        The RPG layer for your developer life. Quests, XP, streaks —
        <br />
        your progress, finally quantified.
      </motion.p>

      {/* ── CTA ROW ───────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.58, delay: 0.30, ease }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "14px",
          flexWrap: "wrap",
        }}
      >
        {/* ── PRIMARY CTA ─────────────────────────────────────────
            Reference shows: white pill button, visible blue-violet
            bloom radiating beneath/around it — not just a shadow.
            The bloom is the defining feature: a colored aura.
        ────────────────────────────────────────────────────────── */}
        <Link to="/signup" style={{ textDecoration: "none" }}>
          <motion.button
            whileHover={{
              scale: 1.025,
              boxShadow: `
                0 0 0 1px rgba(125,185,255,0.22),
                0 8px 40px rgba(110,168,255,0.62),
                0 0 65px rgba(110,168,255,0.38),
                0 0 110px rgba(110,168,255,0.18)
              `,
            }}
            whileTap={{ scale: 0.975 }}
            className="btn-primary-shine btn-primary-glow"
            style={{
              position: "relative",
              overflow: "hidden",
              background: "#FFFFFF",
              color: "#0A0D12",
              border: "none",
              // Pill shape — matches reference exactly
              borderRadius: "999px",
              height: "50px",
              padding: "0 28px",
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: "15px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              whiteSpace: "nowrap",
            }}
          >
            Get Early Access
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        </Link>

        {/* ── SECONDARY CTA ───────────────────────────────────────
            Transparent, thin border, pill shape, subtle
        ────────────────────────────────────────────────────────── */}
        <motion.button
          whileHover={{
            borderColor: "rgba(125,185,255,0.35)",
            color: "#FFFFFF",
            boxShadow: "0 0 22px rgba(125,185,255,0.10)",
          }}
          whileTap={{ scale: 0.975 }}
          style={{
            background: "rgba(255,255,255,0.04)",
            color: "#D0D6E2",
            border: "1px solid rgba(255,255,255,0.13)",
            borderRadius: "999px",
            height: "50px",
            padding: "0 26px",
            fontFamily: "'Inter', sans-serif",
            fontWeight: 500,
            fontSize: "15px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            whiteSpace: "nowrap",
            transition: "border-color 0.2s, color 0.2s, box-shadow 0.2s",
          }}
        >
          Book a Demo
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M6.5 5.5l4 2.5-4 2.5V5.5z" fill="currentColor" />
          </svg>
        </motion.button>
      </motion.div>
    </>
  );
}

// ─── STANDALONE HERO ROUTE ────────────────────────────────────────────────────
export default function Hero() {
  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#07090D",
      }}
    >
      <HeroKeyframes />

      {/* Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(#141823 1px, transparent 1px),
            linear-gradient(90deg, #141823 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          opacity: 0.2,
          pointerEvents: "none",
        }}
      />

      {/* Spotlight — all layers start at opacity 0, fade in staggered */}
      {/* Outer fan */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.82, 1] }}
        transition={{
          duration: 2.2, delay: 0.2,
          ease: [0.22, 1, 0.36, 1],
          times: [0, 0.6, 0.8, 1],
          repeat: Infinity,
        }}
        style={{
          position: "absolute", top: 0, left: 0,
          width: "72vw", height: "85vh",
          background: `radial-gradient(ellipse at 0% 0%,
            rgba(50,90,255,0.45) 0%, rgba(40,80,230,0.20) 30%,
            rgba(30,60,200,0.06) 58%, transparent 75%)`,
          filter: "blur(80px)",
          pointerEvents: "none", zIndex: 1,
        }}
      />
      {/* Mid cone */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.92, 0.72, 0.92] }}
        transition={{
          duration: 2.6, delay: 0.5,
          ease: [0.22, 1, 0.36, 1],
          times: [0, 0.55, 0.78, 1],
          repeat: Infinity,
        }}
        style={{
          position: "absolute", top: 0, left: 0,
          width: "48vw", height: "65vh",
          background: `radial-gradient(ellipse at 0% 0%,
            rgba(80,120,255,0.55) 0%, rgba(60,100,255,0.22) 28%,
            rgba(40,80,230,0.07) 55%, transparent 72%)`,
          filter: "blur(55px)",
          pointerEvents: "none", zIndex: 2,
        }}
      />
      {/* Hot core */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.88, 0.68, 0.88] }}
        transition={{
          duration: 3.0, delay: 0.9,
          ease: [0.22, 1, 0.36, 1],
          times: [0, 0.5, 0.75, 1],
          repeat: Infinity,
        }}
        style={{
          position: "absolute", top: "-40px", left: "-40px",
          width: "320px", height: "320px",
          background: `radial-gradient(ellipse at 20% 20%,
            rgba(160,190,255,0.60) 0%, rgba(100,150,255,0.28) 30%,
            rgba(70,110,255,0.08) 58%, transparent 75%)`,
          filter: "blur(38px)",
          pointerEvents: "none", zIndex: 3,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: "18vh",
          paddingLeft: "24px",
          paddingRight: "24px",
          width: "100%",
        }}
      >
        <HeroContent />
      </div>
    </section>
  );
}