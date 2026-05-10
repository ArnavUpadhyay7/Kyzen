import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Lenis from "lenis";
import Navbar from "../components/global/Navbar";
import Footer from "../components/global/Footer";
import HowItWorks from "../components/landing/HowItWorks";
import Features from "../components/landing/Features";
import SocialProof from "../components/landing/SocialProof";
import { palette } from "../components/landing/design-system";
import HeroScene from "../components/landing/HeroScene";
import { HeroContent } from "../components/landing/Hero";
import DashboardCard from "../components/landing/DashboardPreview";

function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 2,
    });
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(rafId); lenis.destroy(); };
  }, []);
}

export default function Landing() {
  useLenis();

  const pinRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });

  const progress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 24,
    mass: 0.68,
  });

  // ── Hero text ──────────────────────────────────────────────────────────────
  const heroOpacity = useTransform(progress, [0, 0.16, 0.27], [1, 1, 0]);
  const heroY       = useTransform(progress, [0, 0.30], [0, -72]);

  // ── Dashboard ──────────────────────────────────────────────────────────────
  const dashY       = useTransform(progress, [0, 1], [40, -320]);
  const dashRotateX = useTransform(progress, [0, 0.50], [7, 0]);
  const dashScale   = useTransform(progress, [0, 0.45, 0.80], [0.88, 1.02, 1.03]);
  const dashOpacity = 1;
  const dashGlow    = useTransform(progress, [0, 0.45, 0.90], [0.4, 0.85, 0]);

  // ── Features peek panel (visual only — pointer-events-none) ────────────────
  // This is just a decorative animated peek. The real scrollable content
  // lives BELOW the pin zone in normal document flow.
  const featuresY       = useTransform(progress, [0.48, 0.82], ["105vh", "0vh"]);
  const featuresOpacity = useTransform(progress, [0.48, 0.65], [0, 1]);

  return (
    <div style={{ backgroundColor: palette.canvas }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,700;0,800;0,900;1,900&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: auto; }
        ::selection { background: rgba(139,92,246,0.3); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${palette.canvas}; }
        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.4); border-radius: 2px; }
      `}</style>

      <Navbar />

      {/* ── PIN ZONE ── */}
      <div ref={pinRef} className="relative" style={{ height: "350vh" }}>
        <div className="sticky top-0 h-screen overflow-hidden">

          <HeroScene />

          {/* Dashboard */}
          <motion.div
            className="absolute inset-x-0 z-[15] flex justify-center items-end px-5 pointer-events-none bottom-[8%] md:bottom-[-8%]"
            style={{
              perspective: "1100px",
              perspectiveOrigin: "50% 65%",
              y: dashY,
              opacity: dashOpacity,
              willChange: "transform, opacity",
            }}
          >
            <motion.div
              className="absolute left-[8%] right-[8%] bottom-[-24px] h-[200px] pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(109,40,217,0.65) 0%, transparent 68%)",
                filter: "blur(56px)",
                opacity: dashGlow,
              }}
            />
            <motion.div
              className="w-full max-w-[1250px] pointer-events-none"
              style={{
                rotateX: dashRotateX,
                scale: dashScale,
                transformStyle: "preserve-3d",
                willChange: "transform",
              }}
            >
              <DashboardCard />
            </motion.div>
          </motion.div>

          {/* Hero text */}
          <motion.div
            className="absolute inset-x-0 top-0 z-[20] flex flex-col items-center text-center px-4 pt-[13vh] pointer-events-auto"
            style={{ opacity: heroOpacity, y: heroY, willChange: "transform, opacity" }}
          >
            <HeroContent />
          </motion.div>

          {/* Features panel — VISUAL PEEK ONLY, pointer-events-none.
              Real scrollable content is rendered in normal flow below the pin zone.
              This div just shows the animated arrival; it never receives clicks. */}
          <motion.div
            className="absolute inset-x-0 bottom-0 z-[25] pointer-events-none"
            style={{
              y: featuresY,
              opacity: featuresOpacity,
              willChange: "transform, opacity",
            }}
          >
            <div
              className="relative w-full"
              style={{
                background: palette.canvas,
                borderRadius: "36px 36px 0 0",
                boxShadow: "0 -1px 0 rgba(167,139,250,0.42), 0 -80px 130px rgba(0,0,0,0.96)",
                /* No height — purely transform-animated, real content is below pin zone */
                height: 0,
                overflow: "visible",
              }}
            >
              {/* Top edge glow */}
              <div
                className="absolute inset-x-0 top-0 h-px z-10 pointer-events-none"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(109,40,217,0.5) 15%, rgba(167,139,250,1) 50%, rgba(109,40,217,0.5) 85%, transparent 100%)",
                  borderRadius: "36px 36px 0 0",
                }}
              />
              {/* Bloom */}
              <div
                className="absolute inset-x-0 top-0 h-40 pointer-events-none z-10"
                style={{
                  background: "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(124,58,237,0.18) 0%, transparent 100%)",
                }}
              />
              {/* Handle */}
              <div className="flex justify-center pt-4 relative z-10">
                <div className="w-9 h-1 rounded-full" style={{ background: "rgba(139,92,246,0.38)" }} />
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── REAL CONTENT — normal document flow, fully scrollable ──────────────
          Rendered once here, outside the sticky zone.
          The animated panel above is purely visual (no content, no duplicate render).
          marginTop: -100vh pulls this up to sit flush with the bottom of the viewport
          when the pin zone ends, creating a seamless visual join.
      ──────────────────────────────────────────────────────────────────────── */}
      <div
        className="relative z-[30]"
        style={{
          backgroundColor: palette.canvas,
          borderRadius: "36px 36px 0 0",
          marginTop: 0,
          boxShadow: "0 -1px 0 rgba(167,139,250,0.32), 0 -60px 100px rgba(0,0,0,0.92)",
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-px pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(109,40,217,0.5) 15%, rgba(167,139,250,1) 50%, rgba(109,40,217,0.5) 85%, transparent 100%)",
          }}
        />
        <Features />
        <HowItWorks />
        <SocialProof />
        <Footer />
      </div>
    </div>
  );
}