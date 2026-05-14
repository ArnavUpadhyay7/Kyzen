import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { typography } from "../landing/design-system";
import { Link } from "react-router-dom";

// ── Design tokens — blue system matching all sections ─────────────────────────
const T = {
  bg:        "#07090D",
  blue:      "#4D7CFF",
  blueMid:   "#6EA8FF",
  blueLight: "#93C5FD",
  blueDeep:  "#3B5BDB",
  border:    "rgba(77,124,255,0.16)",
  borderAcc: "rgba(110,168,255,0.32)",
  text:      "rgba(245,247,255,0.88)",
  textSub:   "rgba(180,200,240,0.58)",
  textMute:  "rgba(130,155,210,0.38)",
};

// Stable star data — outside component, no re-generation on render
const STARS = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  top:  `${(i * 41.3 + 17) % 100}%`,
  left: `${(i * 67.1 + 29) % 100}%`,
  size: (i * 9 + 5) % 11 > 8 ? 2 : 1,
  minOp: 0.04 + ((i * 7) % 5) * 0.01,
  maxOp: 0.18 + ((i * 11) % 6) * 0.025,
  dur: 3 + (i % 6) * 1.1,
  delay: (i * 1.6) % 9,
}));

// Floating accent diamond — now blue-tinted
function Diamond({ style }: { style: React.CSSProperties }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        width: 8, height: 8,
        background: "rgba(77,124,255,0.35)",
        rotate: 45,
        ...style,
      }}
      animate={{ y: [0, -12, 0], opacity: [0.25, 0.65, 0.25] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

const Footer = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const scale   = useTransform(scrollYProgress, [0.1, 0.5], [0.93, 1]);
  const opacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);

  return (
    <footer
      ref={sectionRef}
      className="relative flex flex-col items-center justify-center py-36 overflow-hidden"
      style={{ background: T.bg }}
    >
      {/* Grid — same as every other section */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(rgba(77,124,255,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(77,124,255,0.04) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        opacity: 0.65,
      }} />

      {/* Top divider line — blue, matching Landing.tsx SectionDivider */}
      <div className="absolute inset-x-0 top-0 h-px pointer-events-none z-10" style={{
        background: "linear-gradient(90deg, transparent 0%, rgba(77,124,255,0.20) 15%, rgba(110,168,255,0.55) 50%, rgba(77,124,255,0.20) 85%, transparent 100%)",
      }} />

      {/* Ambient center glow — blue, not purple */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse 85% 60% at 50% 55%, rgba(77,124,255,0.08) 0%, rgba(50,90,200,0.03) 45%, transparent 70%),
          radial-gradient(ellipse 40% 30% at 15% 20%, rgba(77,124,255,0.04) 0%, transparent 60%),
          radial-gradient(ellipse 35% 28% at 85% 15%, rgba(77,124,255,0.035) 0%, transparent 60%)
        `,
      }} />

      {/* Dot grid — blue tint */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "radial-gradient(circle, rgba(77,124,255,0.06) 1px, transparent 1px)",
        backgroundSize: "44px 44px",
        maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 10%, transparent 85%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 10%, transparent 85%)",
      }} />

      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {STARS.map((s) => (
          <motion.div key={s.id} className="absolute rounded-full"
            style={{
              top: s.top, left: s.left,
              width: s.size, height: s.size,
              background: "#ffffff",
              filter: "blur(0.3px)",
            }}
            animate={{ opacity: [s.minOp, s.maxOp, s.minOp] }}
            transition={{ duration: s.dur, repeat: Infinity, repeatType: "mirror", delay: s.delay, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Floating diamonds — blue */}
      <Diamond style={{ top: "18%", left: "8%"   }} />
      <Diamond style={{ top: "30%", right: "7%"  }} />
      <Diamond style={{ bottom: "28%", left: "12%" }} />
      <Diamond style={{ bottom: "20%", right: "14%" }} />
      <Diamond style={{ top: "55%", left: "5%"   }} />
      <Diamond style={{ top: "12%", right: "22%" }} />

      {/* ── CTA block ── */}
      <motion.div style={{ scale, opacity }}
        className="relative z-10 max-w-3xl mx-auto px-6 text-center">

        {/* Badge — blue, matching Features/HowItWorks eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-7">
          <div className="h-px w-10" style={{ background: "linear-gradient(90deg, transparent, rgba(77,124,255,0.45))" }} />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full"
            style={{
              background: "rgba(77,124,255,0.10)",
              border: `1px solid ${T.border}`,
            }}>
            <span style={{ color: T.blueMid, fontSize: 12 }}>✦</span>
            <span className="font-medium tracking-widest uppercase"
              style={{ fontSize: 10, color: "rgba(110,168,255,0.80)", letterSpacing: "0.14em", fontFamily: typography.body }}>
              Your Journey Begins
            </span>
          </div>
          <div className="h-px w-10" style={{ background: "linear-gradient(90deg, rgba(77,124,255,0.45), transparent)" }} />
        </div>

        {/* Headline — Barlow Condensed, blue accent matching PROGRESS + Gamified */}
        <h2 className="font-black uppercase leading-none mb-6"
          style={{
            fontFamily: typography.display,
            fontSize: "clamp(3rem, 9vw, 7rem)",
            letterSpacing: "-0.025em",
          }}>
          <span style={{ color: "#ffffff" }}>Ready to</span>
          <br />
          <span style={{
            background: "linear-gradient(135deg, #B7CCFF 0%, #6EA8FF 35%, #4D7CFF 65%, #7AA2FF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            // Bloom glow — matches hero PROGRESS word
            filter: "drop-shadow(0 0 28px rgba(77,124,255,0.35)) drop-shadow(0 0 60px rgba(77,124,255,0.15))",
          }}>
            Level Up?
          </span>
        </h2>

        <p className="leading-relaxed mb-10"
          style={{
            fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)",
            color: T.textSub,
            maxWidth: 460,
            margin: "0 auto 2.5rem",
            fontFamily: typography.body,
          }}>
          Join thousands of developers who transformed their daily grind into a legendary quest.
        </p>

        {/* CTAs — primary uses hero EarlyAccessButton language */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">

          {/* Primary — white pill with blue bloom, matches hero "Get Early Access" */}
          <Link to="/signup" style={{ textDecoration: "none" }}>
            <motion.button
              whileHover={{
                scale: 1.03,
                boxShadow: "0 0 40px rgba(110,168,255,0.48), 0 0 80px rgba(77,124,255,0.22), 0 6px 24px rgba(0,0,0,0.5)",
              }}
              whileTap={{ scale: 0.975 }}
              className="relative overflow-hidden cursor-pointer font-semibold"
              style={{
                fontFamily: typography.body,
                fontSize: 15,
                background: "#ffffff",
                color: "#0A0D12",
                border: "none",
                borderRadius: "999px",
                padding: "14px 36px",
                letterSpacing: "0.01em",
                boxShadow: "0 0 28px rgba(110,168,255,0.32), 0 0 55px rgba(77,124,255,0.14), 0 4px 18px rgba(0,0,0,0.4)",
                cursor: "pointer",
              }}>
              {/* Shimmer sweep — same as hero button */}
              <motion.span
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(110deg, transparent 28%, rgba(255,255,255,0.55) 50%, transparent 72%)",
                  borderRadius: "999px",
                }}
                animate={{ x: ["-130%", "160%"] }}
                transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 2.8, ease: "easeInOut" }}
              />
              Join Now →
            </motion.button>
          </Link>

          {/* Secondary — ghost, matches hero "Book a Demo" */}
          <motion.button
            whileHover={{
              color: "rgba(180,215,255,0.85)",
              borderColor: "rgba(110,168,255,0.35)",
              boxShadow: "0 0 20px rgba(77,124,255,0.10)",
            }}
            className="cursor-pointer font-medium transition-all"
            style={{
              fontFamily: typography.body,
              fontSize: 14,
              color: T.textMute,
              letterSpacing: "0.04em",
              background: "transparent",
              border: `1px solid rgba(255,255,255,0.10)`,
              borderRadius: "999px",
              padding: "13px 26px",
              transition: "all 0.2s",
            }}>
            Browse Guilds →
          </motion.button>
        </div>

        {/* Fine print */}
        <p style={{
          fontSize: 11,
          color: T.textMute,
          fontFamily: typography.mono,
          letterSpacing: "0.10em",
        }}>
          Free to start · No credit card required · Season 01 live now
        </p>
      </motion.div>

      {/* ── Bottom bar ── */}
      <div
        className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 mt-24 pt-7 flex flex-col md:flex-row justify-between items-center gap-5"
        style={{ borderTop: `1px solid ${T.border}` }}>

        {/* Logo — blue accent */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${T.blueDeep}, ${T.blue})`,
              boxShadow: `0 0 16px rgba(77,124,255,0.40)`,
              border: `1px solid ${T.border}`,
              fontSize: 13,
            }}>
            <span className="font-black text-white" style={{ fontFamily: typography.display }}>K</span>
          </div>
          <span className="font-black text-white tracking-widest text-lg"
            style={{ fontFamily: typography.display, letterSpacing: "0.10em" }}>
            KYZEN<span style={{ color: T.blueMid }}>.</span>
          </span>
        </div>

        {/* Nav links */}
        <div className="flex gap-7">
          {["Privacy", "Terms", "Status", "GitHub"].map((l) => (
            <a key={l} href="#"
              className="transition-colors"
              style={{ fontSize: 11, color: T.textMute, letterSpacing: "0.08em", fontFamily: typography.body }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "rgba(180,210,255,0.65)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = T.textMute)}>
              {l}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div style={{ fontSize: 11, color: T.textMute, fontFamily: typography.mono, letterSpacing: "0.05em" }}>
          © 2025 KYZEN SYSTEMS
        </div>
      </div>
    </footer>
  );
};

export default Footer;