import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import dashboardHero from "../../assets/dashboard_hero.png";
import { palette, gradients, shadows, typography } from "../../design-system";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
});

function Diamond({ style }: { style: React.CSSProperties }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ width: 7, height: 7, background: "rgba(139,92,246,0.45)", rotate: 45, ...style }}
      animate={{ y: [0, -10, 0], opacity: [0.3, 0.7, 0.3] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const gx = useSpring(mouseX, { stiffness: 14, damping: 24 });
  const gy = useSpring(mouseY, { stiffness: 14, damping: 24 });
  const imgX = useTransform(gx, [-15, 15], [-8, 8]);
  const imgY = useTransform(gy, [-15, 15], [-4, 4]);

  const handleMouse = (e: React.MouseEvent) => {
    const r = sectionRef.current?.getBoundingClientRect();
    if (!r) return;
    mouseX.set((e.clientX - r.left - r.width / 2) * 0.015);
    mouseY.set((e.clientY - r.top - r.height / 2) * 0.01);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        .shimmer-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.13) 50%, transparent 65%);
          background-size: 300% 100%;
          animation: btn-shimmer 2.8s ease-in-out infinite 1.8s;
          border-radius: inherit;
        }
        @keyframes btn-shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -100% 0; }
        }

        .badge-dot {
          animation: dot-pulse 2s ease-in-out infinite;
        }
        @keyframes dot-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.8); }
        }

        .img-frame {
          box-shadow:
            0 0 0 1px rgba(139,92,246,0.28),
            0 0 80px rgba(109,40,217,0.22),
            0 60px 120px rgba(0,0,0,0.75),
            0 30px 60px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(255,255,255,0.06);
        }

        .hero-noise-layer {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 200px;
        }
      `}</style>

      <section
        ref={sectionRef}
        onMouseMove={handleMouse}
        className="relative w-full flex flex-col items-center overflow-hidden"
        style={{ fontFamily: typography.body, minHeight: "100vh" }}
      >
        {/* Grain texture overlay */}
        <div className="hero-noise-layer absolute inset-0 pointer-events-none z-0" />

        {/* Ambient lights */}
        {/* Primary center orb */}
        <div className="absolute pointer-events-none" style={{
          width: 1000, height: 700,
          top: "-15%", left: "50%", transform: "translateX(-50%)",
          background: "radial-gradient(ellipse, rgba(109,40,217,0.24) 0%, rgba(88,28,220,0.10) 35%, transparent 65%)",
          filter: "blur(50px)",
        }} />
        {/* Left soft accent */}
        <div className="absolute pointer-events-none" style={{
          width: 500, height: 500, top: "5%", left: "-10%",
          background: "radial-gradient(circle, rgba(232,121,249,0.07) 0%, transparent 70%)",
          filter: "blur(70px)",
        }} />
        {/* Right soft accent */}
        <div className="absolute pointer-events-none" style={{
          width: 450, height: 450, top: "8%", right: "-8%",
          background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
          filter: "blur(70px)",
        }} />
        {/* Horizon glow behind dashboard */}
        <div className="absolute pointer-events-none" style={{
          width: 1200, height: 600,
          bottom: "5%", left: "50%", transform: "translateX(-50%)",
          background: "radial-gradient(ellipse, rgba(88,28,220,0.18) 0%, transparent 60%)",
          filter: "blur(80px)",
        }} />

        {/* Floating diamonds */}
        <Diamond style={{ top: "15%", left: "6%" }} />
        <Diamond style={{ top: "28%", left: "12%" }} />
        <Diamond style={{ top: "18%", right: "8%" }} />
        <Diamond style={{ top: "36%", right: "4%" }} />
        <Diamond style={{ top: "11%", left: "40%" }} />
        <Diamond style={{ top: "9%",  right: "38%" }} />

        {/* ── TEXT CONTENT ── */}
        <div className="relative z-10 flex flex-col items-center text-center pt-32 px-4 w-full max-w-4xl mx-auto">

          {/* Badge */}
          <motion.div {...fadeUp(0.05)} className="relative inline-flex items-center mb-8">
            <div className="flex items-center gap-2.5 px-4 py-2 rounded-full"
              style={{
                background: "rgba(109,40,217,0.14)",
                border: "1px solid rgba(139,92,246,0.32)",
                backdropFilter: "blur(14px)",
              }}>
              <span className="badge-dot w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#a78bfa" }} />
              <span style={{ fontSize: 12, color: "rgba(196,181,253,0.82)", letterSpacing: "0.03em" }}>
                Now in public beta —&nbsp;
                <span style={{ color: "#c084fc", fontWeight: 600 }}>join free today</span>
              </span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ opacity: 0.45 }}>
                <path d="M2 5h6M5 2l3 3-3 3" stroke="#c084fc" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            {...fadeUp(0.12)}
            className="font-black uppercase leading-none mb-5"
            style={{ fontFamily: typography.display, letterSpacing: "-0.025em" }}
          >
            <span className="block text-white" style={{ fontSize: "clamp(3.6rem,8vw,6.8rem)" }}>
              Turn Grind
            </span>
            <span
              className="block"
              style={{
                fontSize: "clamp(3.6rem,8vw,6.8rem)",
                background: gradients.purpleText,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Into Progress
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            {...fadeUp(0.20)}
            className="mb-10 leading-relaxed"
            style={{
              fontSize: "clamp(0.95rem,1.5vw,1.05rem)",
              color: "rgba(190,175,230,0.52)",
              maxWidth: 480,
            }}
          >
            Complete quests, earn XP, build streaks. Kyzen is the RPG layer
            on top of your real developer life — your progress, finally quantified.
          </motion.p>

          {/* CTAs */}
          <motion.div {...fadeUp(0.28)} className="flex flex-col sm:flex-row items-center gap-3 mb-14">
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: "0 0 52px rgba(124,58,237,0.65), 0 4px 20px rgba(0,0,0,0.4)" }}
                whileTap={{ scale: 0.97 }}
                className="shimmer-btn relative overflow-hidden flex items-center gap-2 px-8 py-4 rounded-xl text-white font-semibold cursor-pointer"
                style={{
                  fontFamily: typography.body,
                  fontSize: 15,
                  background: gradients.buttonFill,
                  boxShadow: shadows.button,
                  border: "1px solid rgba(167,139,250,0.22)",
                  letterSpacing: "0.02em",
                }}
              >
                Start Your Journey
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.button>
            </Link>

            <motion.button
              whileHover={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(139,92,246,0.35)" }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-3 px-7 py-4 rounded-xl font-medium cursor-pointer transition-all duration-200"
              style={{
                fontFamily: typography.body,
                fontSize: 15,
                color: "rgba(210,198,255,0.68)",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
                letterSpacing: "0.02em",
              }}
            >
              <span className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(139,92,246,0.18)", border: "1px solid rgba(139,92,246,0.32)" }}>
                <span style={{
                  width: 0, height: 0, marginLeft: 3,
                  borderTop: "4px solid transparent",
                  borderBottom: "4px solid transparent",
                  borderLeft: "7px solid rgba(167,139,250,0.88)",
                  display: "inline-block",
                }} />
              </span>
              Watch demo
            </motion.button>
          </motion.div>

          {/* Social proof */}
          <motion.div {...fadeUp(0.34)} className="flex items-center gap-3 mb-20">
            <div className="flex">
              {[11, 32, 53, 14, 22].map((n, i) => (
                <img key={i} src={`https://i.pravatar.cc/40?img=${n}`} alt=""
                  className="w-8 h-8 rounded-full object-cover"
                  style={{ border: `2px solid ${palette.canvas}`, marginLeft: i === 0 ? 0 : -10, position: "relative", zIndex: 5 - i }} />
              ))}
            </div>
            <span style={{ fontSize: 12.5, color: "rgba(190,175,230,0.42)" }}>
              <span style={{ color: "#a78bfa", fontWeight: 600 }}>12,847+</span> players leveling up today
            </span>
          </motion.div>
        </div>

        {/* ── DASHBOARD IMAGE ── */}
        <motion.div
          initial={{ opacity: 0, y: 70, rotateX: "8deg" }}
          animate={{ opacity: 1, y: 0, rotateX: "3deg" }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6"
          style={{
            perspective: "1400px",
            marginTop: "-30px",  // slight overlap so image peeks under text area
          }}
        >
          <motion.div style={{ x: imgX, y: imgY, rotateY: "-1deg", transformStyle: "preserve-3d" }}>

            {/* Bloom behind the image */}
            <div className="absolute -inset-x-4 -bottom-16 h-48 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 85% 70% at 50% 100%, rgba(109,40,217,0.4) 0%, transparent 70%)",
                filter: "blur(40px)",
              }} />

            {/* Card wrapper */}
            <div className="img-frame relative rounded-2xl overflow-hidden">

              {/* Browser chrome */}
              <div className="relative flex items-center gap-2 px-4 py-3"
                style={{
                  background: "rgba(6,3,18,0.98)",
                  borderBottom: "1px solid rgba(139,92,246,0.15)",
                }}>
                {/* Top shimmer */}
                <div className="absolute inset-x-0 top-0 h-px"
                  style={{ background: "linear-gradient(90deg, transparent 5%, rgba(139,92,246,0.55) 50%, transparent 95%)" }} />
                {["#ff5f57","#febc2e","#28c840"].map(c => (
                  <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.75 }} />
                ))}
                <div className="flex-1 flex justify-center">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                    {/* Lock icon */}
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" style={{ opacity: 0.4 }}>
                      <rect x="1" y="4" width="7" height="5" rx="1" stroke="#a78bfa" strokeWidth="1"/>
                      <path d="M2.5 4V3a2 2 0 114 0v1" stroke="#a78bfa" strokeWidth="1"/>
                    </svg>
                    <span style={{ fontSize: 10, color: "rgba(167,139,250,0.4)", fontFamily: typography.mono, letterSpacing: "0.04em" }}>
                      app.kyzen.dev/dashboard
                    </span>
                  </div>
                </div>
              </div>

              {/* Dashboard screenshot */}
              <img
                src={dashboardHero}
                alt="Kyzen dashboard"
                draggable={false}
                className="w-full block select-none"
                style={{
                  display: "block",
                  maskImage: "linear-gradient(to bottom, black 65%, rgba(0,0,0,0.3) 85%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 65%, rgba(0,0,0,0.3) 85%, transparent 100%)",
                }}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom dissolve into next section */}
        <div className="absolute bottom-0 left-0 right-0 h-56 pointer-events-none z-20"
          style={{ background: `linear-gradient(to bottom, transparent 0%, ${palette.canvas} 100%)` }} />
      </section>
    </>
  );
}