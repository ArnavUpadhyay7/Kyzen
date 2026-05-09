import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { typography } from "./design-system";

const ease = [0.16, 1, 0.3, 1] as const;

export function HeroContent() {
  return (
    <>
      <style>{`
        @keyframes hero-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -100% 0; }
        }
        .cta-shimmer::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 13px;
          background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%);
          background-size: 300% 100%;
          animation: hero-shimmer 3s ease-in-out infinite 1.6s;
          pointer-events: none;
        }
        @keyframes badge-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.75); }
        }
      `}</style>

      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.05, ease }}
        className="mb-7 flex items-center gap-2 px-4 py-1.5 rounded-full select-none cursor-default backdrop-blur-md"
        style={{
          background: "rgba(109,40,217,0.12)",
          border: "1px solid rgba(139,92,246,0.2)",
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{
            background: "#a78bfa",
            boxShadow: "0 0 6px rgba(167,139,250,0.7)",
            animation: "badge-pulse 2.2s ease-in-out infinite",
          }}
        />
        <span
          className="text-[12.5px] font-medium tracking-wide"
          style={{ fontFamily: typography.body, color: "rgba(196,181,253,0.82)" }}
        >
          Now in early access — join 400+ developers
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.76, delay: 0.1, ease }}
        className="font-black uppercase leading-[0.92] mb-6 select-none"
        style={{ fontFamily: typography.display, letterSpacing: "-0.028em" }}
      >
        <span
          className="block text-white"
          style={{ fontSize: "clamp(3.4rem, 7.8vw, 6.6rem)" }}
        >
          Turn Grind
        </span>
        <span
          className="block"
          style={{
            fontSize: "clamp(3.4rem, 7.8vw, 6.6rem)",
            background: "linear-gradient(135deg, #7c3aed 0%, #8b5cf6 35%, #a78bfa 65%, #c4b5fd 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 28px rgba(139,92,246,0.2))",
          }}
        >
          Into Progress
        </span>
      </motion.h1>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.68, delay: 0.18, ease }}
        className="mb-10 leading-relaxed text-[rgba(196,181,253,0.52)] font-light tracking-[0.005em] max-w-[460px]"
        style={{
          fontFamily: typography.body,
          fontSize: "clamp(0.9rem, 1.4vw, 1.02rem)",
        }}
      >
        Complete quests, earn XP, build streaks. Kyzen is the RPG layer
        on top of your real developer life — your progress, finally quantified.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.25, ease }}
        className="flex flex-col sm:flex-row items-center gap-3"
      >
        {/* Primary CTA */}
        <Link to="/signup">
          <motion.button
            whileHover={{
              scale: 1.03,
              boxShadow: "0 0 44px rgba(109,40,217,0.62), 0 6px 24px rgba(0,0,0,0.45)",
            }}
            whileTap={{ scale: 0.975 }}
            className="cta-shimmer relative overflow-hidden flex items-center gap-2 text-white font-semibold cursor-pointer select-none rounded-[13px] px-7 py-3.5 text-[15px] tracking-[0.01em]"
            style={{
              fontFamily: typography.body,
              background: "linear-gradient(135deg, #6d28d9 0%, #7c3aed 50%, #9333ea 100%)",
              boxShadow: "0 0 28px rgba(109,40,217,0.42), 0 4px 18px rgba(0,0,0,0.38)",
              border: "1px solid rgba(167,139,250,0.2)",
            }}
          >
            Start Your Journey
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.button>
        </Link>

        {/* Secondary CTA */}
        <motion.button
          whileHover={{
            background: "rgba(255,255,255,0.055)",
            borderColor: "rgba(139,92,246,0.3)",
          }}
          whileTap={{ scale: 0.975 }}
          className="flex items-center gap-3 cursor-pointer select-none rounded-[13px] px-6 py-3.5 text-[14.5px] font-medium tracking-[0.01em] backdrop-blur-sm"
          style={{
            fontFamily: typography.body,
            color: "rgba(196,181,253,0.62)",
            background: "rgba(255,255,255,0.028)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <span
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: "rgba(109,40,217,0.2)",
              border: "1px solid rgba(139,92,246,0.28)",
            }}
          >
            <svg width="9" height="10" viewBox="0 0 10 12" fill="none">
              <path d="M2 1.5l7 4.5-7 4.5V1.5z" fill="rgba(167,139,250,0.9)"/>
            </svg>
          </span>
          Watch demo
        </motion.button>
      </motion.div>
    </>
  );
}

export default function Hero() {
  return (
    <section className="relative w-full flex flex-col items-center overflow-hidden min-h-screen">
      <div className="relative z-10 flex flex-col items-center text-center pt-[14vh] px-4 w-full max-w-4xl mx-auto">
        <HeroContent />
      </div>
    </section>
  );
}