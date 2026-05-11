import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { typography } from "./design-system";

const ease = [0.16, 1, 0.3, 1] as const;

// HeroContent is used by Landing.tsx inside the sticky scene.
// It is purely presentational — no fixed/absolute/sticky positioning.
// All layout decisions (padding, alignment, width) are handled by the parent.
export function HeroContent() {
  return (
    <>
      <style>{`
        @keyframes shimmer-sweep {
          0%   { background-position: 200% 0; }
          100% { background-position: -100% 0; }
        }
        .btn-shimmer::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 10px;
          background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%);
          background-size: 300% 100%;
          animation: shimmer-sweep 3.5s ease-in-out infinite 2s;
          pointer-events: none;
        }
      `}</style>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.72, delay: 0.10, ease }}
        className="font-black uppercase leading-[0.90] mb-6 select-none"
        style={{
          fontFamily: typography.display,
          fontSize: "clamp(3rem, 7.2vw, 6.5rem)",
          letterSpacing: "-0.03em",
        }}
      >
        <span className="block text-white">Turn Grind</span>
        <span
          className="block"
          style={{
            background: "linear-gradient(130deg, #7c3aed 0%, #a78bfa 55%, #c4b5fd 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Into Progress
        </span>
      </motion.h1>

      {/* Subtext — short, one breath */}
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.62, delay: 0.18, ease }}
        className="mb-9 leading-relaxed max-w-[400px]"
        style={{
          fontFamily: typography.body,
          fontSize: "clamp(0.88rem, 1.3vw, 1rem)",
          color: "rgba(176,160,220,0.52)",
          fontWeight: 400,
        }}
      >
        The RPG layer for your developer life. Quests, XP, streaks —
        your progress, finally quantified.
      </motion.p>

      {/* CTAs — left-aligned row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.26, ease }}
        className="flex items-center gap-3 flex-wrap"
      >
        {/* Primary */}
        <Link to="/signup">
          <motion.button
            whileHover={{
              scale: 1.025,
              boxShadow: "0 0 32px rgba(109,40,217,0.52), 0 4px 16px rgba(0,0,0,0.4)",
            }}
            whileTap={{ scale: 0.975 }}
            className="btn-shimmer relative overflow-hidden flex items-center gap-2
             text-white font-semibold cursor-pointer select-none
             rounded-[10px] px-6 py-[11px] text-[14px] tracking-[0.01em]"
            style={{
              fontFamily: typography.body,
              background: "linear-gradient(135deg, rgba(109,40,217,0.85) 0%, rgba(124,58,237,0.85) 60%, rgba(139,92,246,0.85) 100%)",
              boxShadow: "0 0 22px rgba(109,40,217,0.38), 0 2px 10px rgba(0,0,0,0.32)",
              border: "1px solid rgba(139,92,246,0.22)",
            }}
          >
            Get Early Access
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        </Link>

        {/* Secondary — ghost */}
        <motion.button
          whileHover={{
            color: "rgba(200,185,255,0.75)",
            borderColor: "rgba(139,92,246,0.22)",
          }}
          whileTap={{ scale: 0.975 }}
          className="flex items-center gap-2 cursor-pointer select-none
                     rounded-[10px] px-5 py-[11px] text-[13.5px] font-medium
                     transition-colors duration-150"
          style={{
            fontFamily: typography.body,
            color: "rgba(170,155,215,0.42)",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.07)",
            letterSpacing: "0.005em",
          }}
        >
          Watch demo
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M6.5 5.5l4 2.5-4 2.5V5.5z" fill="currentColor" />
          </svg>
        </motion.button>
      </motion.div>
    </>
  );
}

// Standalone route fallback — not used by Landing but kept for routing safety
export default function Hero() {
  return (
    <section className="relative w-full min-h-[100dvh] flex flex-col overflow-hidden">
      <div
        className="relative z-10 flex flex-col pt-[18vh]
                   px-6 sm:px-12 lg:px-20 w-full max-w-7xl mx-auto"
      >
        <div className="max-w-2xl">
          <HeroContent />
        </div>
      </div>
    </section>
  );
}