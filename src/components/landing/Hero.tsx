import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/* ── Floating diamond shapes ── */
function Diamond({ style }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        width: 10,
        height: 10,
        background: "rgba(139,92,246,0.5)",
        rotate: 45,
        ...style,
      }}
      animate={{ y: [0, -14, 0], opacity: [0.4, 0.85, 0.4] }}
      transition={{ duration: 3.5 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

const DIAMONDS = [
  { top: "28%", left: "42%", width: 8,  height: 8  },
  { top: "55%", left: "38%", width: 12, height: 12 },
  { top: "70%", left: "52%", width: 7,  height: 7  },
  { top: "40%", left: "62%", width: 10, height: 10 },
  { top: "62%", left: "70%", width: 8,  height: 8  },
  { top: "32%", left: "74%", width: 6,  height: 6  },
];

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
});

/* ── Stat card ── */
function StatCard({ children, style, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`absolute rounded-2xl flex flex-col items-center justify-center gap-1 ${className}`}
      style={{
        background: "rgba(15,8,40,0.88)",
        border: "1px solid rgba(139,92,246,0.28)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(139,92,246,0.1)",
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
}

export default function Hero() {
  const sectionRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const gx = useSpring(mouseX, { stiffness: 20, damping: 22 });
  const gy = useSpring(mouseY, { stiffness: 20, damping: 22 });
  const tiltX = useTransform(gy, [-10, 10], [2, -2]);
  const tiltY = useTransform(gx, [-10, 10], [-3, 3]);

  const handleMouse = (e) => {
    const r = sectionRef.current?.getBoundingClientRect();
    if (!r) return;
    mouseX.set((e.clientX - r.left - r.width / 2) * 0.012);
    mouseY.set((e.clientY - r.top - r.height / 2) * 0.008);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;700;800;900&family=DM+Sans:wght@300;400;500&display=swap');
        .hero-root { font-family: 'DM Sans', sans-serif; }
        .hero-headline { font-family: 'Barlow', sans-serif; }
      `}</style>

      <section
        ref={sectionRef}
        onMouseMove={handleMouse}
        className="hero-root relative w-full min-h-screen flex items-center overflow-hidden"
        style={{ background: "#080610" }}
      >
        {/* ── Background layers ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 100% 80% at 60% 40%, rgba(88,28,220,0.18) 0%, rgba(55,14,150,0.08) 45%, transparent 70%)",
          }}
        />
        {/* left dark vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 55% 80% at 0% 50%, rgba(0,0,0,0.6) 0%, transparent 60%)",
          }}
        />
        {/* bottom glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: 0, left: "30%", right: 0, height: "50%",
            background: "radial-gradient(ellipse 80% 60% at 60% 100%, rgba(88,28,220,0.22) 0%, transparent 65%)",
            filter: "blur(30px)",
          }}
        />

        {/* Mouse bloom */}
        <motion.div
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 800, height: 500,
            top: "10%", left: "30%",
            background: "radial-gradient(ellipse at center, rgba(109,40,217,0.12) 0%, transparent 70%)",
            filter: "blur(50px)",
            x: gx, y: gy,
          }}
        />

        {/* Floating diamonds */}
        {DIAMONDS.map((d, i) => (
          <Diamond key={i} style={d} />
        ))}

        {/* ── MAIN LAYOUT: left content + right card ── */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-14 flex flex-col lg:flex-row items-center gap-12 lg:gap-0 py-20">

          {/* ── LEFT COLUMN ── */}
          <div className="flex-1 flex flex-col items-start max-w-xl">

            {/* Badge */}
            <motion.div
              {...fadeUp(0.08)}
              className="flex items-center gap-2 mb-7 px-4 py-2 rounded-full"
              style={{
                background: "rgba(109,40,217,0.12)",
                border: "1px solid rgba(139,92,246,0.28)",
              }}
            >
              <span style={{ color: "#a78bfa", fontSize: 13 }}>✦</span>
              <span
                className="font-medium tracking-widest uppercase"
                style={{ fontSize: 11, color: "rgba(167,139,250,0.85)", letterSpacing: "0.14em" }}
              >
                Life RPG for Developers &amp; Ambitious People
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              {...fadeUp(0.16)}
              className="hero-headline mb-6"
              style={{ lineHeight: 0.92, letterSpacing: "-0.01em" }}
            >
              <span
                className="block text-white font-black uppercase"
                style={{ fontSize: "clamp(3.6rem,8vw,6.4rem)", fontFamily: "'Barlow', sans-serif" }}
              >
                Earn Your
              </span>
              <span
                className="block font-black uppercase"
                style={{
                  fontSize: "clamp(3.6rem,8vw,6.4rem)",
                  fontFamily: "'Barlow', sans-serif",
                  background: "linear-gradient(135deg,#7c3aed 0%,#9333ea 40%,#a855f7 70%,#c084fc 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Progress
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              {...fadeUp(0.24)}
              className="mb-9 leading-relaxed"
              style={{
                fontSize: "clamp(0.95rem,1.5vw,1.05rem)",
                color: "rgba(190,180,220,0.65)",
                maxWidth: 430,
              }}
            >
              Complete quests, gain XP, build streaks, and level up skills.
              Turn your daily actions into epic progress.
            </motion.p>

            {/* CTAs */}
            <motion.div
              {...fadeUp(0.32)}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-10"
            >
              {/* Primary */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="relative flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-semibold overflow-hidden cursor-pointer"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 15,
                  background: "linear-gradient(135deg,#7c3aed 0%,#9333ea 60%,#a855f7 100%)",
                  boxShadow: "0 0 32px rgba(124,58,237,0.55), 0 4px 16px rgba(0,0,0,0.4)",
                  border: "1px solid rgba(167,139,250,0.2)",
                }}
              >
                <motion.span
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(110deg,transparent 30%,rgba(255,255,255,0.1) 50%,transparent 70%)",
                  }}
                  animate={{ x: ["-120%", "220%"] }}
                  transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
                />
                Start Your Journey
                <span className="text-lg">→</span>
              </motion.button>

              {/* Ghost */}
              <motion.button
                whileHover={{ background: "rgba(255,255,255,0.06)" }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 px-6 py-3.5 rounded-xl font-medium cursor-pointer transition-colors"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 15,
                  color: "rgba(210,198,255,0.75)",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background: "rgba(139,92,246,0.15)",
                    border: "1px solid rgba(139,92,246,0.3)",
                  }}
                >
                  <span
                    style={{
                      width: 0, height: 0, marginLeft: 2,
                      borderTop: "4px solid transparent",
                      borderBottom: "4px solid transparent",
                      borderLeft: "7px solid rgba(167,139,250,0.85)",
                      display: "inline-block",
                    }}
                  />
                </span>
                See How It Works
              </motion.button>
            </motion.div>

            {/* Social proof */}
            <motion.div {...fadeUp(0.4)} className="flex items-center gap-3">
              <div className="flex">
                {[
                  "https://i.pravatar.cc/40?img=11",
                  "https://i.pravatar.cc/40?img=32",
                  "https://i.pravatar.cc/40?img=53",
                  "https://i.pravatar.cc/40?img=14",
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover"
                    style={{
                      border: "2px solid #080610",
                      marginLeft: i === 0 ? 0 : -10,
                      zIndex: 4 - i,
                      position: "relative",
                    }}
                  />
                ))}
              </div>
              <span style={{ fontSize: 13, color: "rgba(170,158,215,0.55)" }}>
                Join{" "}
                <span className="font-semibold" style={{ color: "#a78bfa" }}>
                  12,847+
                </span>{" "}
                players leveling up their lives every day.
              </span>
            </motion.div>
          </div>

          {/* ── RIGHT COLUMN: Character Card ── */}
          <div className="flex-1 flex justify-center lg:justify-end items-center relative" style={{ minHeight: 560 }}>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ perspective: "1200px" }}
            >
              <motion.div style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }}>
                {/* Main card */}
                <div
                  className="relative overflow-hidden"
                  style={{
                    width: "clamp(300px,36vw,420px)",
                    height: "clamp(420px,50vw,580px)",
                    borderRadius: 24,
                    background: "linear-gradient(160deg,rgba(88,28,220,0.28) 0%,rgba(15,8,40,0.95) 50%)",
                    border: "1px solid rgba(139,92,246,0.4)",
                    boxShadow: "0 0 0 1px rgba(139,92,246,0.12), 0 40px 100px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.07), 0 0 80px rgba(109,40,217,0.25)",
                  }}
                >
                  {/* Top meta row */}
                  <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-20">
                    <div>
                      <div className="text-[10px] font-medium tracking-widest uppercase mb-1" style={{ color: "rgba(167,139,250,0.55)" }}>
                        LEVEL
                      </div>
                      <div
                        className="font-black"
                        style={{ fontSize: 52, lineHeight: 1, color: "white", fontFamily: "'Barlow',sans-serif" }}
                      >
                        03
                      </div>
                      <div
                        className="mt-1 px-3 py-0.5 rounded-full text-center font-semibold"
                        style={{
                          fontSize: 10,
                          background: "rgba(109,40,217,0.55)",
                          color: "#e9d5ff",
                          border: "1px solid rgba(139,92,246,0.4)",
                          letterSpacing: "0.08em",
                          width: "fit-content",
                        }}
                      >
                        RISING
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-medium tracking-widest uppercase mb-1" style={{ color: "rgba(167,139,250,0.55)" }}>
                        CLASS
                      </div>
                      <div className="text-white font-semibold" style={{ fontSize: 15, fontFamily: "'DM Sans',sans-serif" }}>
                        Developer
                      </div>
                      <div
                        className="mt-2 w-9 h-9 rounded-xl flex items-center justify-center ml-auto"
                        style={{
                          background: "rgba(109,40,217,0.35)",
                          border: "1px solid rgba(139,92,246,0.35)",
                          fontSize: 13,
                          color: "rgba(196,181,253,0.85)",
                          fontFamily: "monospace",
                        }}
                      >
                        {"</>"}
                      </div>
                    </div>
                  </div>

                  {/* Character silhouette area */}
                  <div
                    className="absolute inset-0 z-10"
                    style={{
                      background:
                        "radial-gradient(ellipse 90% 70% at 50% 55%, rgba(88,28,220,0.35) 0%, transparent 65%)",
                    }}
                  />

                  {/* Character placeholder — gradient silhouette */}
                  <div
                    className="absolute z-10"
                    style={{
                      bottom: "14%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "72%",
                      height: "65%",
                      background:
                        "radial-gradient(ellipse 60% 80% at 50% 30%, rgba(139,92,246,0.15) 0%, transparent 60%), linear-gradient(180deg,rgba(109,40,217,0.08) 0%,transparent 80%)",
                      borderRadius: "50% 50% 0 0",
                    }}
                  />

                  {/* XP Bar */}
                  <div className="absolute bottom-5 left-5 right-5 z-20">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[11px] font-semibold tracking-wider" style={{ color: "rgba(167,139,250,0.7)" }}>
                        XP
                      </span>
                      <span className="text-[11px]" style={{ color: "rgba(167,139,250,0.5)" }}>
                        1,250 / 2,000
                      </span>
                    </div>
                    <div
                      className="w-full rounded-full overflow-hidden"
                      style={{ height: 7, background: "rgba(109,40,217,0.2)", border: "1px solid rgba(139,92,246,0.15)" }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: "62.5%" }}
                        transition={{ duration: 1.4, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                          background: "linear-gradient(90deg,#6d28d9,#a855f7)",
                          boxShadow: "0 0 10px rgba(139,92,246,0.7)",
                        }}
                      />
                    </div>
                  </div>

                  {/* Card glow border top */}
                  <div
                    className="absolute inset-x-0 top-0 h-px pointer-events-none z-20"
                    style={{
                      background:
                        "linear-gradient(90deg,transparent 10%,rgba(167,139,250,0.6) 50%,transparent 90%)",
                    }}
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* ── XP Stat Card ── */}
            <StatCard
              style={{
                left: "-8%",
                top: "28%",
                width: 96,
                height: 88,
                padding: "12px 8px",
              }}
            >
              <span className="font-bold text-[11px] tracking-widest uppercase" style={{ color: "rgba(167,139,250,0.65)" }}>
                XP
              </span>
              <span
                className="font-black"
                style={{ fontSize: 20, color: "#c084fc", fontFamily: "'Barlow',sans-serif", lineHeight: 1 }}
              >
                +250
              </span>
            </StatCard>

            {/* ── Streak Card ── */}
            <StatCard
              style={{
                right: "-10%",
                top: "22%",
                width: 96,
                height: 96,
                padding: "12px 8px",
              }}
            >
              <span className="font-bold text-[10px] tracking-widest uppercase" style={{ color: "rgba(167,139,250,0.55)" }}>
                STREAK
              </span>
              <span className="text-lg">🔥</span>
              <span
                className="font-black"
                style={{ fontSize: 26, color: "white", fontFamily: "'Barlow',sans-serif", lineHeight: 1 }}
              >
                14
              </span>
            </StatCard>

            {/* ── Skill Card ── */}
            <StatCard
              style={{
                right: "-12%",
                bottom: "22%",
                width: 130,
                height: 72,
                padding: "10px 14px",
                flexDirection: "row",
                gap: 10,
                justifyContent: "space-between",
              }}
            >
              <div className="flex flex-col">
                <span className="text-[9px] font-semibold tracking-widest uppercase mb-0.5" style={{ color: "rgba(167,139,250,0.5)" }}>
                  SKILL
                </span>
                <span className="font-bold text-white" style={{ fontSize: 15, fontFamily: "'Barlow',sans-serif" }}>
                  Logic
                </span>
                <span style={{ fontSize: 11, color: "rgba(167,139,250,0.55)" }}>Lv. 4</span>
              </div>
              <div className="flex flex-col gap-1">
                <span style={{ color: "rgba(167,139,250,0.6)", fontSize: 14 }}>↑</span>
                <span style={{ color: "rgba(167,139,250,0.6)", fontSize: 14 }}>↑</span>
              </div>
            </StatCard>

            {/* Peek cards behind — level 04 and 05 */}
            <div
              className="absolute pointer-events-none"
              style={{
                right: "-18%",
                top: "5%",
                width: "clamp(220px,26vw,290px)",
                height: "clamp(300px,36vw,400px)",
                borderRadius: 20,
                background: "rgba(12,6,32,0.7)",
                border: "1px solid rgba(139,92,246,0.18)",
                zIndex: -1,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-end",
                padding: 16,
              }}
            >
              <span className="font-black text-3xl" style={{ color: "rgba(255,255,255,0.12)", fontFamily: "'Barlow',sans-serif" }}>04</span>
            </div>
            <div
              className="absolute pointer-events-none"
              style={{
                right: "-28%",
                top: "12%",
                width: "clamp(200px,24vw,260px)",
                height: "clamp(280px,34vw,370px)",
                borderRadius: 20,
                background: "rgba(10,5,26,0.55)",
                border: "1px solid rgba(139,92,246,0.1)",
                zIndex: -2,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-end",
                padding: 16,
              }}
            >
              <span className="font-black text-3xl" style={{ color: "rgba(255,255,255,0.07)", fontFamily: "'Barlow',sans-serif" }}>05</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}