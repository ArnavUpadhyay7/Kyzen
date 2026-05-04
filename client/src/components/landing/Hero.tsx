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
  const glowX = useTransform(gx, [-15, 15], [-40, 40]);
  const glowY = useTransform(gy, [-15, 15], [-30, 30]);

  const handleMouse = (e: React.MouseEvent) => {
    const r = sectionRef.current?.getBoundingClientRect();
    if (!r) return;
    mouseX.set((e.clientX - r.left - r.width / 2) * 0.015);
    mouseY.set((e.clientY - r.top - r.height / 2) * 0.01);
  };

  return (
    <>
      <style>{`
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
        .badge-dot { animation: dot-pulse 2s ease-in-out infinite; }
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
        /* Noise grain */
        .hero-grain {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 200px;
        }
        /* Sweeping ray left */
        @keyframes ray-left-pulse {
          0%, 100% { opacity: 0.55; transform: rotate(-38deg) scaleX(1); }
          50%       { opacity: 0.75; transform: rotate(-36deg) scaleX(1.04); }
        }
        /* Sweeping ray right */
        @keyframes ray-right-pulse {
          0%, 100% { opacity: 0.50; transform: rotate(38deg) scaleX(1); }
          50%       { opacity: 0.70; transform: rotate(40deg) scaleX(1.04); }
        }
        @keyframes center-orb-breathe {
          0%, 100% { opacity: 0.70; transform: translateX(-50%) scale(1); }
          50%       { opacity: 1;    transform: translateX(-50%) scale(1.06); }
        }
        @keyframes cyan-spark-left {
          0%, 100% { opacity: 0.55; transform: scale(1) translateY(0); }
          50%       { opacity: 0.80; transform: scale(1.08) translateY(-10px); }
        }
        @keyframes cyan-spark-right {
          0%, 100% { opacity: 0.45; transform: scale(1) translateY(0); }
          50%       { opacity: 0.70; transform: scale(1.06) translateY(-8px); }
        }
      `}</style>

      <section
        ref={sectionRef}
        onMouseMove={handleMouse}
        className="relative w-full flex flex-col items-center overflow-hidden"
        style={{
          fontFamily: typography.body,
          minHeight: "100vh",
          backgroundColor: palette.canvas,
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        {/* ── BACKGROUND ATMOSPHERE ── */}

        {/* Base depth gradient — darkest at edges */}
        <div className="absolute inset-0 pointer-events-none z-0"
          style={{ background: `radial-gradient(ellipse 120% 80% at 50% 0%, #130a2e 0%, ${palette.canvas} 55%)` }} />

        {/* Grain */}
        <div className="hero-grain absolute inset-0 pointer-events-none z-0" />

        {/* ── WIDE SWEEP RAYS (the signature look from the screenshot) ── */}
        {/* Left ray — wide diagonal purple beam sweeping from bottom-left */}
        <div
          className="absolute pointer-events-none z-0"
          style={{
            width: "140%",
            height: "75%",
            bottom: "-5%",
            left: "-45%",
            background: "linear-gradient(to top right, transparent 30%, rgba(88,28,220,0.22) 55%, rgba(124,58,237,0.30) 65%, rgba(109,40,217,0.18) 72%, transparent 85%)",
            transformOrigin: "bottom left",
            animation: "ray-left-pulse 9s ease-in-out infinite",
            filter: "blur(8px)",
          }}
        />
        {/* Left ray — inner bright core */}
        <div
          className="absolute pointer-events-none z-0"
          style={{
            width: "80%",
            height: "65%",
            bottom: "-5%",
            left: "-20%",
            background: "linear-gradient(to top right, transparent 40%, rgba(124,58,237,0.18) 60%, rgba(139,92,246,0.22) 68%, transparent 80%)",
            transformOrigin: "bottom left",
            animation: "ray-left-pulse 9s ease-in-out infinite 0.5s",
            filter: "blur(4px)",
          }}
        />

        {/* Right ray — mirror */}
        <div
          className="absolute pointer-events-none z-0"
          style={{
            width: "140%",
            height: "75%",
            bottom: "-5%",
            right: "-45%",
            background: "linear-gradient(to top left, transparent 30%, rgba(88,28,220,0.20) 55%, rgba(124,58,237,0.28) 65%, rgba(109,40,217,0.16) 72%, transparent 85%)",
            transformOrigin: "bottom right",
            animation: "ray-right-pulse 9s ease-in-out infinite 0.8s",
            filter: "blur(8px)",
          }}
        />
        {/* Right ray inner core */}
        <div
          className="absolute pointer-events-none z-0"
          style={{
            width: "80%",
            height: "65%",
            bottom: "-5%",
            right: "-20%",
            background: "linear-gradient(to top left, transparent 40%, rgba(124,58,237,0.16) 60%, rgba(139,92,246,0.20) 68%, transparent 80%)",
            transformOrigin: "bottom right",
            animation: "ray-right-pulse 9s ease-in-out infinite 1.2s",
            filter: "blur(4px)",
          }}
        />

        {/* Center top orb — the bright crown above the text */}
        <div className="absolute pointer-events-none z-0"
          style={{
            width: 800, height: 500,
            top: "-12%", left: "50%",
            background: "radial-gradient(ellipse, rgba(109,40,217,0.38) 0%, rgba(88,28,220,0.18) 38%, transparent 62%)",
            filter: "blur(45px)",
            animation: "center-orb-breathe 10s ease-in-out infinite",
          }} />

        {/* Cyan accent — left edge bright pop (matches screenshot teal tint left side) */}
        <div className="absolute pointer-events-none z-0"
          style={{
            width: 500, height: 600,
            top: "5%", left: "-8%",
            background: "radial-gradient(ellipse, rgba(34,211,238,0.11) 0%, rgba(6,182,212,0.05) 45%, transparent 68%)",
            filter: "blur(60px)",
            animation: "cyan-spark-left 14s ease-in-out infinite 1s",
          }} />

        {/* Cyan accent — right edge */}
        <div className="absolute pointer-events-none z-0"
          style={{
            width: 420, height: 500,
            top: "8%", right: "-6%",
            background: "radial-gradient(ellipse, rgba(34,211,238,0.08) 0%, transparent 65%)",
            filter: "blur(55px)",
            animation: "cyan-spark-right 17s ease-in-out infinite 2s",
          }} />

        {/* Horizon bloom — glows under the dashboard image */}
        <div className="absolute pointer-events-none z-0"
          style={{
            width: 1200, height: 400,
            bottom: "0%", left: "50%", transform: "translateX(-50%)",
            background: "radial-gradient(ellipse, rgba(109,40,217,0.28) 0%, rgba(88,28,220,0.12) 40%, transparent 62%)",
            filter: "blur(70px)",
          }} />

        {/* Mouse-follow glow */}
        <motion.div className="absolute pointer-events-none z-0"
          style={{
            width: 480, height: 480,
            top: "8%", left: "50%", marginLeft: -240,
            x: glowX, y: glowY,
            background: "radial-gradient(circle, rgba(124,58,237,0.09) 0%, transparent 65%)",
            filter: "blur(50px)",
          }} />

        {/* Subtle star dots */}
        {[
          { top: "12%", left: "8%" },  { top: "22%", left: "18%" },
          { top: "9%",  left: "55%" }, { top: "15%", right: "12%" },
          { top: "28%", right: "22%" },{ top: "6%",  right: "40%" },
          { top: "35%", left: "4%" },  { top: "18%", left: "32%" },
        ].map((pos, i) => (
          <motion.div key={i} className="absolute pointer-events-none z-0 rounded-full"
            style={{ width: 2, height: 2, background: "rgba(167,139,250,0.4)", ...pos }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 3 + i * 0.7, repeat: Infinity, delay: i * 0.4 }} />
        ))}

        {/* Floating diamonds */}
        <Diamond style={{ top: "15%", left: "6%" }} />
        <Diamond style={{ top: "28%", left: "12%" }} />
        <Diamond style={{ top: "18%", right: "8%" }} />
        <Diamond style={{ top: "36%", right: "4%" }} />
        <Diamond style={{ top: "11%", left: "40%" }} />
        <Diamond style={{ top: "9%",  right: "38%" }} />

        {/* ── TEXT CONTENT ── */}
        <div className="relative z-10 flex flex-col items-center text-center pt-32 px-4 w-full max-w-4xl mx-auto">

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
              <span style={{ color: "#a78bfa", fontWeight: 600 }}>100+</span> users already signed up
            </span>
          </motion.div>
        </div>

        {/* ── DASHBOARD IMAGE ── */}
        <motion.div
          initial={{ opacity: 0, y: 70, rotateX: "8deg" }}
          animate={{ opacity: 1, y: 0, rotateX: "3deg" }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6"
          style={{ perspective: "1400px", marginTop: "-30px" }}
        >
          <motion.div style={{ x: imgX, y: imgY, rotateY: "-1deg", transformStyle: "preserve-3d" }}>

            {/* Bloom behind image */}
            <div className="absolute -inset-x-4 -bottom-16 h-48 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 85% 70% at 50% 100%, rgba(109,40,217,0.42) 0%, transparent 70%)",
                filter: "blur(40px)",
              }} />

            {/* Card */}
            <div className="img-frame relative rounded-2xl overflow-hidden">
              {/* Browser chrome */}
              <div className="relative flex items-center gap-2 px-4 py-3"
                style={{
                  background: "rgba(6,3,18,0.98)",
                  borderBottom: "1px solid rgba(139,92,246,0.15)",
                }}>
                <div className="absolute inset-x-0 top-0 h-px"
                  style={{ background: "linear-gradient(90deg, transparent 5%, rgba(139,92,246,0.55) 50%, transparent 95%)" }} />
                {["#ff5f57","#febc2e","#28c840"].map(c => (
                  <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c, opacity: 0.75 }} />
                ))}
                <div className="flex-1 flex justify-center">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
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

              {/* Screenshot */}
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

        {/* Bottom dissolve */}
        <div className="absolute bottom-0 left-0 right-0 h-56 pointer-events-none z-20"
          style={{ background: `linear-gradient(to bottom, transparent 0%, ${palette.canvas} 100%)` }} />
      </section>
    </>
  );
}