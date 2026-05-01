import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import dashboardImg from "../../assets/dashboard_hero.png";

function Star({ x, y, size = 2.5, delay = 0 }: { x: string; y: string; size?: number; delay?: number }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x, top: y,
        width: size, height: size,
        background: "rgba(180,155,255,0.7)",
        boxShadow: "0 0 5px 2px rgba(130,80,246,0.35)",
      }}
      animate={{ opacity: [0.3, 0.9, 0.3], scale: [1, 1.4, 1] }}
      transition={{ duration: 2.8 + delay * 0.7, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

function RadialGrid() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0, opacity: 0.07 }}
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1440 900"
    >
      <defs>
        <radialGradient id="rg" cx="50%" cy="42%" r="52%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="1" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </radialGradient>
      </defs>
      {[200, 320, 440, 560, 680, 800, 920].map((r, i) => (
        <ellipse key={i} cx="720" cy="380" rx={r * 1.75} ry={r * 0.95}
          fill="none" stroke="url(#rg)" strokeWidth="0.7" />
      ))}
      {[0, 30, 60, 90, 120, 150].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const len = 1000;
        return (
          <line key={i}
            x1={720} y1={380}
            x2={720 + Math.cos(rad) * len} y2={380 + Math.sin(rad) * len}
            stroke="url(#rg)" strokeWidth="0.5" />
        );
      })}
      {[0, 30, 60, 90, 120, 150].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const len = 1000;
        return (
          <line key={`b${i}`}
            x1={720} y1={380}
            x2={720 - Math.cos(rad) * len} y2={380 - Math.sin(rad) * len}
            stroke="url(#rg)" strokeWidth="0.5" />
        );
      })}
    </svg>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const gx = useSpring(mouseX, { stiffness: 22, damping: 22 });
  const gy = useSpring(mouseY, { stiffness: 22, damping: 22 });

  // Subtle tilt for dashboard image
  const tiltX = useTransform(gy, [-10, 10], [1.5, -1.5]);
  const tiltY = useTransform(gx, [-10, 10], [-2, 2]);

  const handleMouse = (e: React.MouseEvent) => {
    const r = sectionRef.current?.getBoundingClientRect();
    if (!r) return;
    mouseX.set((e.clientX - r.left - r.width / 2) * 0.014);
    mouseY.set((e.clientY - r.top - r.height / 2) * 0.009);
  };

  const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouse}
      className="relative w-full min-h-screen flex flex-col items-center overflow-hidden"
      style={{
        background: "#060412",
        fontFamily: "'Sora', -apple-system, sans-serif",
      }}
    >
      {/* ── LAYERED BACKGROUND  */}

      {/* Deep space top gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 140% 85% at 50% -8%, #1e0b4a 0%, #0e0528 30%, #060412 58%)",
        }}
      />

      {/* Mouse-tracked bloom */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 1100,
          height: 650,
          top: "0%",
          left: "50%",
          marginLeft: -550,
          background:
            "radial-gradient(ellipse at center, rgba(109,40,217,0.18) 0%, rgba(76,29,149,0.06) 48%, transparent 70%)",
          filter: "blur(55px)",
          x: gx,
          y: gy,
        }}
      />

      {/* Left aurora */}
      <div className="absolute pointer-events-none" style={{
        width: 560, height: 800, top: "-10%", left: "-10%",
        background: "radial-gradient(ellipse, rgba(79,22,220,0.14) 0%, transparent 65%)",
        filter: "blur(90px)",
      }} />

      {/* Right aurora */}
      <div className="absolute pointer-events-none" style={{
        width: 500, height: 650, top: "5%", right: "-8%",
        background: "radial-gradient(ellipse, rgba(109,40,217,0.12) 0%, transparent 65%)",
        filter: "blur(95px)",
      }} />

      {/* Bottom pool — connects dashboard to page */}
      <div className="absolute pointer-events-none" style={{
        width: 1100,
        height: 500,
        bottom: "-6%",
        left: "50%",
        marginLeft: -550,
        background:
          "radial-gradient(ellipse at 50% 100%, rgba(109,40,217,0.4) 0%, rgba(76,29,149,0.16) 45%, transparent 68%)",
        filter: "blur(50px)",
      }} />

      {/* Subtle side glow strips */}
      <div className="absolute pointer-events-none inset-y-0 left-0 w-px"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(124,58,237,0.2) 40%, transparent)" }} />
      <div className="absolute pointer-events-none inset-y-0 right-0 w-px"
        style={{ background: "linear-gradient(to bottom, transparent, rgba(124,58,237,0.2) 40%, transparent)" }} />

      {/* Radial grid pattern */}
      <RadialGrid />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(139,92,246,0.06) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse 80% 65% at 50% 35%, black 5%, transparent 82%)",
        }}
      />

      {/* Top hairline */}
      <div className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent 5%, rgba(139,92,246,0.5) 50%, transparent 95%)" }} />

      {/* Stars */}
      <Star x="7%" y="20%" size={2.5} delay={0} />
      <Star x="13%" y="58%" size={1.8} delay={1.1} />
      <Star x="5%" y="76%" size={2} delay={2} />
      <Star x="89%" y="24%" size={2.5} delay={0.5} />
      <Star x="94%" y="62%" size={1.8} delay={1.7} />
      <Star x="83%" y="80%" size={2} delay={0.2} />
      <Star x="21%" y="11%" size={1.6} delay={1.4} />
      <Star x="77%" y="9%" size={1.6} delay={2.2} />
      <Star x="38%" y="7%" size={1.4} delay={0.9} />
      <Star x="61%" y="6%" size={1.4} delay={1.8} />

      {/* ── CONTENT ──────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center w-full px-6 pt-20 md:pt-28 pb-0">

        {/* Headline */}
        <motion.h1
          {...fadeUp(0.12)}
          className="text-white mb-5"
          style={{
            fontFamily: "'Sora', sans-serif",
            fontSize: "clamp(2.6rem, 6vw, 4.8rem)",
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: "-0.04em",
            maxWidth: 720,
          }}
        >
          Earn your progress
          <br />
          <span
            style={{
              background:
                "linear-gradient(125deg, #ddd6fe 0%, #a78bfa 30%, #7c3aed 58%, #c084fc 85%, #e9d5ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Systematically
          </span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          {...fadeUp(0.22)}
          className="mb-10 leading-relaxed"
          style={{
            fontSize: "clamp(0.95rem, 1.8vw, 1.05rem)",
            color: "rgba(200,190,230,0.5)",
            fontWeight: 400,
            maxWidth: 420,
            letterSpacing: "0.01em",
          }}
        >
          A system for turning daily effort into visible, measurable progress — one level at a time.
        </motion.p>

        {/* CTAs */}
        <motion.div
          {...fadeUp(0.3)}
          className="flex flex-col sm:flex-row items-center gap-3 mb-4"
        >
          {/* Primary button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="relative px-8 py-3.5 rounded-xl font-bold text-white cursor-pointer overflow-hidden"
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: 14,
              letterSpacing: "-0.01em",
              background: "linear-gradient(145deg, #9333ea 0%, #7c3aed 45%, #5b21b6 100%)",
              border: "1px solid rgba(167,139,250,0.3)",
              boxShadow:
                "0 0 0 1px rgba(124,58,237,0.2), 0 8px 40px rgba(109,40,217,0.45), inset 0 1px 0 rgba(255,255,255,0.12)",
            }}
          >
            {/* Shimmer sweep */}
            <motion.span
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
              }}
              animate={{ x: ["-120%", "220%"] }}
              transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
            />
            Start Your Journey
          </motion.button>

          {/* Ghost button */}
          <motion.button
            whileHover={{ scale: 1.03, background: "rgba(255,255,255,0.05)" }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold cursor-pointer"
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: 14,
              letterSpacing: "-0.01em",
              color: "rgba(220,210,250,0.7)",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            {/* Play icon */}
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: "rgba(139,92,246,0.18)",
                border: "1px solid rgba(139,92,246,0.25)",
              }}
            >
              <span style={{
                width: 0, height: 0, marginLeft: 2,
                borderTop: "4px solid transparent",
                borderBottom: "4px solid transparent",
                borderLeft: "7px solid rgba(167,139,250,0.8)",
                display: "inline-block",
              }} />
            </span>
            View Demo
          </motion.button>
        </motion.div>

        {/* Social proof */}
        <motion.div
          {...fadeUp(0.38)}
          className="flex items-center gap-3 mb-12"
        >
          {/* Avatar stack */}
          <div className="flex -space-x-2">
            {["#8b5cf6", "#6d28d9", "#a78bfa", "#7c3aed"].map((c, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                style={{
                  background: `linear-gradient(135deg, ${c}, ${c}99)`,
                  border: "1.5px solid rgba(6,4,18,0.9)",
                  zIndex: 4 - i,
                }}
              >
                {["A", "J", "S", "K"][i]}
              </div>
            ))}
          </div>
          <span className="text-[11px]" style={{ color: "rgba(180,170,220,0.45)" }}>
            Joined by{" "}
            <span style={{ color: "rgba(200,180,250,0.7)", fontWeight: 600 }}>2,400+</span> builders this month
          </span>
        </motion.div>

        {/* To do's Tilt the frame and slide it under text area */}
        
        {/* DASHBOARD FRAME */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl mx-auto"
          style={{ perspective: "1200px", zIndex: 10 }}
        >
          {/* Glow halo around the frame */}
          <div
            className="absolute pointer-events-none"
            style={{
              inset: "-20px -40px",
              borderRadius: "2rem",
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(109,40,217,0.35) 0%, rgba(76,29,149,0.12) 50%, transparent 72%)",
              filter: "blur(36px)",
              zIndex: -1,
            }}
          />

          {/* Outer glow ring */}
          <div
            className="absolute pointer-events-none rounded-3xl"
            style={{
              inset: 0,
              boxShadow: "0 0 0 1px rgba(139,92,246,0.18), 0 0 80px rgba(109,40,217,0.2)",
              zIndex: 3,
              borderRadius: "1.5rem",
            }}
          />

          {/* Tilt container */}
          <motion.div
            style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }}
            className="relative overflow-hidden rounded-3xl"
          >
            {/* Glass frame */}
            <div
              className="relative overflow-hidden rounded-3xl"
              style={{
                background: "rgba(8, 4, 20, 0.75)",
                border: "1px solid rgba(255,255,255,0.07)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                boxShadow:
                  "0 0 0 1px rgba(139,92,246,0.08), 0 50px 120px rgba(0,0,0,0.8), 0 16px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
            >
              {/* Browser chrome */}
              <div
                className="flex items-center gap-2 px-5 py-3 border-b"
                style={{
                  background: "rgba(4,2,14,0.95)",
                  borderColor: "rgba(255,255,255,0.05)",
                }}
              >
                {/* Traffic lights */}
                <div className="flex items-center gap-1.5">
                  {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
                    <div key={c} className="w-2.5 h-2.5 rounded-full"
                      style={{ background: c, opacity: 0.75 }} />
                  ))}
                </div>

                {/* URL bar */}
                <div className="flex-1 flex justify-center">
                  <div
                    className="flex items-center gap-2 px-4 py-1.5 rounded-md"
                    style={{
                      background: "rgba(255,255,255,0.025)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      fontSize: 11,
                      color: "#4b5563",
                      fontFamily: "'JetBrains Mono', monospace",
                      minWidth: 210,
                    }}
                  >
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: "#22c55e" }}
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                    />
                    kyzen.app/dashboard
                  </div>
                </div>

                {/* Right side space */}
                <div className="w-14" />
              </div>
              

              {/* Dashboard image */}
              <div className="relative w-full" style={{ lineHeight: 0 }}>
                <img
                  src={dashboardImg}
                  alt="Kyzen Dashboard"
                  className="w-full block"
                  style={{ maxHeight: "65vh", objectFit: "cover", objectPosition: "top" }}
                />

                {/* Seamless bottom fade — page bleeds through */}
                <div
                  className="absolute inset-x-0 bottom-0"
                  style={{
                    height: "55%",
                    background:
                      "linear-gradient(to top, #060412 0%, rgba(6,4,18,0.92) 25%, rgba(6,4,18,0.5) 55%, transparent 100%)",
                    pointerEvents: "none",
                  }}
                />

                {/* Side inner shadows for depth */}
                <div className="absolute inset-y-0 left-0 w-12 pointer-events-none"
                  style={{ background: "linear-gradient(to right, rgba(6,4,18,0.4), transparent)" }} />
                <div className="absolute inset-y-0 right-0 w-12 pointer-events-none"
                  style={{ background: "linear-gradient(to left, rgba(6,4,18,0.4), transparent)" }} />
              </div>


            </div>
          </motion.div>

        </motion.div>

      </div>

<style>{`
@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
`}</style>
    </section>
  );
}