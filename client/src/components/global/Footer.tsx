import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";

const STARS = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  top: `${(i * 41.3 + 17) % 100}%`,
  left: `${(i * 67.1 + 29) % 100}%`,
  size: (i * 9 + 5) % 11 > 8 ? 2 : 1,
  minOp: 0.04 + ((i * 7) % 5) * 0.01,
  maxOp: 0.18 + ((i * 11) % 6) * 0.025,
  dur: 3 + (i % 6) * 1.1,
  delay: (i * 1.6) % 9,
}));

const DIAMOND_POSITIONS = [
  "top-[18%] left-[8%]",
  "top-[30%] right-[7%]",
  "bottom-[28%] left-[12%]",
  "bottom-[20%] right-[14%]",
  "top-[55%] left-[5%]",
  "top-[12%] right-[22%]",
] as const;

function Diamond({ className }: { className: string }) {
  return (
    <motion.div
      className={`absolute pointer-events-none w-2 h-2 bg-landing-blue/35 rotate-45 ${className}`}
      animate={{ y: [0, -12, 0], opacity: [0.25, 0.65, 0.25] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

const Footer = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0.1, 0.5], [0.93, 1]);
  const opacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);

  return (
    <footer
      ref={sectionRef}
      className="relative flex flex-col items-center justify-center py-36 overflow-hidden bg-landing-surface"
    >
      <div className="absolute inset-0 pointer-events-none bg-landing-grid-accent opacity-[0.65]" />
      <div className="absolute inset-x-0 top-0 h-px pointer-events-none z-10 bg-landing-divider" />
      <div className="absolute inset-0 pointer-events-none bg-landing-ambient-footer" />
      <div className="absolute inset-0 pointer-events-none bg-landing-dot-grid" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {STARS.map((s) => (
          <motion.div
            key={s.id}
            className="absolute rounded-full bg-landing-white blur-[0.3px]"
            style={{ top: s.top, left: s.left, width: s.size, height: s.size }}
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

      {DIAMOND_POSITIONS.map((pos) => (
        <Diamond key={pos} className={pos} />
      ))}

      <motion.div
        style={{ scale, opacity }}
        className="relative z-10 max-w-3xl mx-auto px-6 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-7">
          <div className="h-px w-10 bg-landing-eyebrow-line-left" />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-landing-badge-blue-bg border border-landing-border">
            <span className="text-landing-blue-mid text-xs">✦</span>
            <span className="font-landing-body font-medium tracking-[0.14em] uppercase text-[10px] text-[rgba(110,168,255,0.80)]">
              Your Journey Begins
            </span>
          </div>
          <div className="h-px w-10 bg-landing-eyebrow-line-right" />
        </div>

        <h2 className="font-landing-display font-black uppercase leading-none mb-6 text-[clamp(3rem,9vw,7rem)] tracking-[-0.025em]">
          <span className="text-landing-white">Ready to</span>
          <br />
          <span className="text-gradient-landing-accent text-glow-landing-progress">Level Up?</span>
        </h2>

        <p className="leading-relaxed mb-10 font-landing-body text-[clamp(0.9rem,1.5vw,1.05rem)] text-landing-text-sub-alt max-w-[460px] mx-auto">
          Join thousands of developers who transformed their daily grind into a legendary quest.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
          <Link to="/signup" className="no-underline">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.975 }}
              className="btn-primary-shine btn-primary-glow relative overflow-hidden cursor-pointer font-landing-body font-semibold text-[15px] bg-landing-white text-landing-cta-ink border-0 rounded-full py-3.5 px-9 tracking-[0.01em]"
            >
              <motion.span
                className="absolute inset-0 pointer-events-none rounded-full bg-landing-btn-shimmer"
                animate={{ x: ["-130%", "160%"] }}
                transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 2.8, ease: "easeInOut" }}
              />
              Join Now →
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.975 }}
            className="cursor-pointer font-landing-body font-medium text-sm text-landing-text-faint tracking-[0.04em] bg-transparent border border-landing-text-08 rounded-full py-[13px] px-[26px] transition-all hover:text-[rgba(180,215,255,0.85)] hover:border-landing-border-accent hover:shadow-[0_0_20px_rgba(77,124,255,0.10)]"
          >
            Browse Guilds →
          </motion.button>
        </div>

        <p className="text-[11px] text-landing-text-faint font-landing-mono tracking-[0.10em]">
          Free to start · No credit card required · Season 01 live now
        </p>
      </motion.div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 mt-24 pt-7 flex flex-col md:flex-row justify-between items-center gap-5 border-t border-landing-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-landing-logo-mark shadow-[0_0_16px_rgba(77,124,255,0.40)] border border-landing-border text-[13px]">
            <span className="font-landing-display font-black text-landing-white">K</span>
          </div>
          <span className="font-landing-display font-black text-landing-white tracking-[0.10em] text-lg">
            KYZEN<span className="text-landing-blue-mid">.</span>
          </span>
        </div>

        <div className="flex gap-7">
          {["Privacy", "Terms", "Status", "GitHub"].map((l) => (
            <a
              key={l}
              href="#"
              className="text-[11px] text-landing-text-faint tracking-[0.08em] font-landing-body transition-colors hover:text-[rgba(180,210,255,0.65)]"
            >
              {l}
            </a>
          ))}
        </div>

        <div className="text-[11px] text-landing-text-faint font-landing-mono tracking-[0.05em]">
          © 2025 KYZEN SYSTEMS
        </div>
      </div>
    </footer>
  );
};

export default Footer;
