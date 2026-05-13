import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Lenis from "lenis";

import { palette } from "../components/landing/design-system";
import Navbar from "../components/global/Navbar";
import HeroScene from "../components/landing/HeroScene";
import { HeroContent } from "../components/landing/Hero";
import DashboardCard from "../components/landing/DashboardPreview";
import { Spotlight } from "../components/ui/Spotlight";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import SocialProof from "../components/landing/SocialProof";
import Footer from "../components/global/Footer";

// ─── Lenis smooth scroll ──────────────────────────────────────────────────────
function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.35,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 2,
    });
    let rafId: number;
    const raf = (time: number) => { lenis.raf(time); rafId = requestAnimationFrame(raf); };
    rafId = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(rafId); lenis.destroy(); };
  }, []);
}

// ─── Landing ─────────────────────────────────────────────────────────────────
export default function Landing() {
  useLenis();

  const pinRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });

  const progress = useSpring(scrollYProgress, { stiffness: 50, damping: 24, mass: 0.68 });

  const heroOpacity = useTransform(progress, [0, 0.16, 0.28], [1, 1, 0]);
  const heroY = useTransform(progress, [0, 0.30], [0, -70]);

  const dashY = useTransform(progress, [0, 1], [42, -310]);
  const dashRotateX = useTransform(progress, [0, 0.48], [6, 0]);
  const dashScale = useTransform(progress, [0, 0.45, 0.80], [0.90, 1.02, 1.03]);

  return (
    <div style={{ backgroundColor: palette.canvas }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: auto; }
        ::selection { background: rgba(77,124,255,0.28); }

        ::-webkit-scrollbar       { width: 4px; }
        ::-webkit-scrollbar-track { background: ${palette.canvas}; }
        ::-webkit-scrollbar-thumb { background: rgba(77,124,255,0.38); border-radius: 2px; }

        @keyframes spotlight {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-spotlight {
          animation: spotlight 2s ease 0.5s 1 forwards;
        }
      `}</style>

      <Navbar />

      {/* ── PIN ZONE (350vh) ─────────────────────────────────────────────── */}
      <div ref={pinRef} className="relative" style={{ height: "350vh" }}>
        <div className="sticky top-0 h-screen overflow-hidden">

          {/* Background scene */}
          <HeroScene />

          {/* ── Multi-ray spotlight system ─────────────────────────────── */}
          {/* Ray 1 — primary, brightest */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-5"
            style={{ transform: "rotate(0deg)", transformOrigin: "top left" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Spotlight
              className="md:-top-120 md:-left-60 -top-180 -left-60 opacity-[0.82]"
              fill="white"
            />
          </motion.div>

          {/* Ray 2 — angled slightly up */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-[5]"
            style={{ transform: "rotate(-8deg)", transformOrigin: "top left" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.0, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Spotlight
              className="md:-top-120 md:-left-60 -top-180 -left-60 opacity-[0.48]"
              fill="white"
            />
          </motion.div>

          {/* Ray 3 — angled slightly down */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-[5]"
            style={{ transform: "rotate(10deg)", transformOrigin: "top left" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Spotlight
              className="md:-top-120 md:-left-60 -top-180 -left-60 opacity-[0.32]"
              fill="white"
            />
          </motion.div>

          {/* Subtle blue tint on leftmost ray */}
          <motion.div
            className="pointer-events-none absolute inset-0 z-[5]"
            style={{ transform: "rotate(-4deg)", transformOrigin: "top left" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.4, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Spotlight
              className="md:-top-120 md:-left-60 -top-180 -left-60 opacity-[0.22]"
              fill="rgb(77,124,255)"
            />
          </motion.div>

          {/* ── Dashboard ──────────────────────────────────────────────── */}
          <motion.div
            className="absolute inset-x-0 z-[15] flex justify-center items-end px-5 pointer-events-none
                       bottom-[22%] md:bottom-[-8%]"
            style={{
              perspective: "1200px",
              perspectiveOrigin: "50% 65%",
              y: dashY,
              willChange: "transform",
            }}
          >
            <motion.div
              className="w-full max-w-[1200px] pointer-events-none"
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

          {/* ── Hero text ──────────────────────────────────────────────── */}
          <motion.div
            className="absolute inset-x-0 top-0 z-[20] flex flex-col items-center text-center
                       px-5 pt-[13vh] pointer-events-auto"
            style={{ opacity: heroOpacity, y: heroY, willChange: "transform, opacity" }}
          >
            <HeroContent />
          </motion.div>

        </div>
      </div>

      {/* ── MAIN CONTENT (below fold) ────────────────────────────────────── */}
      <div
        className="relative z-[30]"
        style={{
          backgroundColor: palette.canvas,
          borderRadius: "32px 32px 0 0",
          boxShadow: "0 -1px 0 rgba(77,124,255,0.22), 0 -56px 90px rgba(0,0,0,0.90)",
        }}
      >
        {/* Section divider */}
        <div
          className="absolute inset-x-0 top-0 h-px pointer-events-none z-10"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(59,111,255,0.42) 15%, rgba(122,162,255,0.88) 50%, rgba(59,111,255,0.42) 85%, transparent 100%)",
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