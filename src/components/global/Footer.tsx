import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const Footer = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0.1, 0.5], [0.93, 1]);
  const opacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);

  const GlowOrb = ({ className }: { className: string }) => (
    <div className={`absolute rounded-full blur-[120px] pointer-events-none select-none ${className}`} />
  );

  const Starfield = ({ count = 60 }: { count?: number }) => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: Math.random() > 0.9 ? 2 : 1,
            height: Math.random() > 0.9 ? 2 : 1,
            opacity: Math.random() * 0.3 + 0.05,
          }}
          animate={{ opacity: [null as any, 0.04, 0.4] }}
          transition={{
            duration: 2 + Math.random() * 5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: Math.random() * 6,
          }}
        />
      ))}
    </div>
  );

  /* Floating diamond */
  const Diamond = ({ style }: { style: React.CSSProperties }) => (
    <motion.div
      className="absolute pointer-events-none"
      style={{ width: 9, height: 9, background: "rgba(139,92,246,0.4)", rotate: 45, ...style }}
      animate={{ y: [0, -12, 0], opacity: [0.3, 0.75, 0.3] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
    />
  );

  return (
    <footer
      ref={sectionRef}
      className="relative flex flex-col items-center justify-center py-36 overflow-hidden"
      style={{ background: "#07041a" }}
    >
      {/* Shared page background layers */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 110% 70% at 50% 60%, rgba(88,28,220,0.18) 0%, rgba(55,14,150,0.07) 45%, transparent 70%)",
        }}
      />
      {/* Top glow line — matches Hero */}
      <div className="absolute inset-x-0 top-0 pointer-events-none" style={{ zIndex: 2 }}>
        <div
          className="w-full"
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent 5%, rgba(255,255,255,0.06) 20%, rgba(210,190,255,0.4) 50%, rgba(255,255,255,0.06) 80%, transparent 95%)",
          }}
        />
      </div>

      <GlowOrb className="w-[800px] h-[500px] bg-purple-900/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <GlowOrb className="w-[400px] h-[300px] bg-violet-900/15 bottom-0 left-0" />
      <GlowOrb className="w-[350px] h-[280px] bg-indigo-900/12 top-0 right-0" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(139,92,246,0.055) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 10%, transparent 85%)",
        }}
      />

      <Starfield count={65} />

      {/* Floating diamonds */}
      <Diamond style={{ top: "18%", left: "8%", width: 8, height: 8 }} />
      <Diamond style={{ top: "30%", right: "7%", width: 10, height: 10 }} />
      <Diamond style={{ bottom: "28%", left: "12%", width: 7, height: 7 }} />
      <Diamond style={{ bottom: "20%", right: "14%", width: 9, height: 9 }} />
      <Diamond style={{ top: "55%", left: "5%", width: 6, height: 6 }} />
      <Diamond style={{ top: "12%", right: "22%", width: 7, height: 7 }} />

      {/* ── CTA block ── */}
      <motion.div
        style={{ scale, opacity }}
        className="relative z-10 max-w-3xl mx-auto px-6 text-center"
      >
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-7"
          style={{
            background: "rgba(109,40,217,0.12)",
            border: "1px solid rgba(139,92,246,0.28)",
          }}
        >
          <span style={{ color: "#a78bfa", fontSize: 12 }}>✦</span>
          <span
            className="font-medium tracking-widest uppercase"
            style={{
              fontSize: 10,
              color: "rgba(167,139,250,0.85)",
              letterSpacing: "0.14em",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Your Journey Begins
          </span>
        </div>

        {/* Headline */}
        <h2
          className="font-black uppercase leading-none mb-6"
          style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: "clamp(3rem,9vw,7rem)",
            letterSpacing: "-0.02em",
          }}
        >
          <span className="text-white">Ready to</span>
          <br />
          <span
            style={{
              background:
                "linear-gradient(135deg,#7c3aed 0%,#9333ea 35%,#a855f7 65%,#c084fc 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Level Up?
          </span>
        </h2>

        <p
          className="mb-10 leading-relaxed"
          style={{
            fontSize: "clamp(0.9rem,1.5vw,1.05rem)",
            color: "rgba(190,175,230,0.42)",
            maxWidth: 460,
            margin: "0 auto 2.5rem",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Join thousands of developers who transformed their daily grind into a legendary quest.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 60px rgba(139,92,246,0.55)" }}
            whileTap={{ scale: 0.97 }}
            className="relative px-10 py-4 rounded-xl font-black text-white uppercase overflow-hidden cursor-pointer"
            style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: "clamp(0.7rem,1.2vw,0.8rem)",
              letterSpacing: "0.1em",
              background: "linear-gradient(135deg,#7c3aed 0%,#9333ea 55%,#a855f7 100%)",
              border: "1px solid rgba(167,139,250,0.2)",
              boxShadow: "0 0 44px rgba(124,58,237,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            {/* Shimmer */}
            <motion.span
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
              }}
              animate={{ x: ["-120%", "220%"] }}
              transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
            />
            Create Your Character
          </motion.button>

          <motion.button
            whileHover={{ color: "rgba(210,198,255,0.7)" }}
            className="cursor-pointer transition-colors font-medium"
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(0.75rem,1.1vw,0.82rem)",
              color: "rgba(167,139,250,0.4)",
              letterSpacing: "0.04em",
            }}
          >
            Browse Guilds →
          </motion.button>
        </div>

        <p
          className="font-mono"
          style={{
            fontSize: 11,
            color: "rgba(167,139,250,0.25)",
            letterSpacing: "0.1em",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Free to start · No credit card required · Season 01 live now
        </p>
      </motion.div>

      {/* ── Bottom bar ── */}
      <div
        className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 mt-24 pt-7 flex flex-col md:flex-row justify-between items-center gap-5"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg,#7c3aed,#a855f7)",
              boxShadow: "0 0 16px rgba(139,92,246,0.45)",
              fontSize: 13,
            }}
          >
            <span className="font-black text-white" style={{ fontFamily: "'Barlow', sans-serif" }}>K</span>
          </div>
          <span
            className="font-black text-white tracking-widest text-lg"
            style={{ fontFamily: "'Barlow', sans-serif", letterSpacing: "0.1em" }}
          >
            KYZEN<span style={{ color: "#9333ea" }}>.</span>
          </span>
        </div>

        {/* Nav links */}
        <div className="flex gap-7">
          {["Privacy", "Terms", "Status", "GitHub"].map((l) => (
            <a
              key={l}
              href="#"
              className="transition-colors"
              style={{
                fontSize: 11,
                color: "rgba(167,139,250,0.25)",
                letterSpacing: "0.08em",
                fontFamily: "'DM Sans', sans-serif",
              }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "rgba(196,181,253,0.6)")}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(167,139,250,0.25)")}
            >
              {l}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div
          style={{
            fontSize: 11,
            color: "rgba(167,139,250,0.2)",
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "0.05em",
          }}
        >
          © 2024 KYZEN SYSTEMS
        </div>
      </div>
    </footer>
  );
};

export default Footer;