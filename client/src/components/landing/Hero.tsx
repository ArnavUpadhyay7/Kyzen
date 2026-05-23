import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ease = [0.16, 1, 0.3, 1] as const;

export function HeroContent() {
  return (
    <>
      <motion.h1
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.72, delay: 0.1, ease }}
        className="font-landing-display font-black uppercase select-none text-center mb-7 text-[clamp(3.6rem,9vw,7.4rem)] leading-[0.9] tracking-[-0.02em]"
      >
        <span className="block text-gradient-landing-heading-white">Turn Grind</span>
        <span className="block">
          <span className="text-gradient-landing-heading-grey">Into </span>
          <span className="progress-word-bloom text-gradient-landing-progress">Progress</span>
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.62, delay: 0.2, ease }}
        className="select-none font-landing-body text-[clamp(0.88rem,1.35vw,1.02rem)] text-landing-text-62 font-normal leading-[1.65] max-w-[440px] mb-9 text-center"
      >
        The RPG layer for your developer life. Quests, XP, streaks —
        <br />
        your progress, finally quantified.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.58, delay: 0.3, ease }}
        className="flex items-center justify-center gap-3.5 flex-wrap"
      >
        <Link to="/signup" className="no-underline">
          <motion.button
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.975 }}
            className="btn-primary-shine btn-primary-glow relative overflow-hidden bg-landing-white text-landing-cta-ink border-0 rounded-full h-[50px] px-7 font-semibold text-[15px] cursor-pointer flex items-center gap-2 whitespace-nowrap"
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

        <motion.button
          whileHover={{ scale: 0.975 }}
          whileTap={{ scale: 0.975 }}
          className="bg-landing-ghost-btn-bg text-landing-secondary border border-landing-ghost-border rounded-full h-[50px] px-[26px] font-medium text-[15px] cursor-pointer flex items-center gap-2 whitespace-nowrap transition-[border-color,color,box-shadow] duration-200 hover:border-[rgba(125,185,255,0.35)] hover:text-landing-white hover:shadow-[0_0_22px_rgba(125,185,255,0.10)]"
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

export default function Hero() {
  return (
    <section className="relative w-full min-h-dvh flex flex-col overflow-hidden bg-landing-surface">
      <div className="absolute inset-0 bg-landing-hero-grid opacity-20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0.82, 1] }}
        transition={{
          duration: 2.2,
          delay: 0.2,
          ease: [0.22, 1, 0.36, 1],
          times: [0, 0.6, 0.8, 1],
          repeat: Infinity,
        }}
        className="absolute top-0 left-0 w-[72vw] h-[85vh] bg-landing-spotlight-outer blur-[80px] pointer-events-none z-[1]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.92, 0.72, 0.92] }}
        transition={{
          duration: 2.6,
          delay: 0.5,
          ease: [0.22, 1, 0.36, 1],
          times: [0, 0.55, 0.78, 1],
          repeat: Infinity,
        }}
        className="absolute top-0 left-0 w-[48vw] h-[65vh] bg-landing-spotlight-mid blur-[55px] pointer-events-none z-[2]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.88, 0.68, 0.88] }}
        transition={{
          duration: 3,
          delay: 0.9,
          ease: [0.22, 1, 0.36, 1],
          times: [0, 0.5, 0.75, 1],
          repeat: Infinity,
        }}
        className="absolute -top-10 -left-10 w-80 h-80 bg-landing-spotlight-core blur-[38px] pointer-events-none z-[3]"
      />

      <div className="relative z-10 flex flex-col items-center pt-[18vh] px-6 w-full">
        <HeroContent />
      </div>
    </section>
  );
}
