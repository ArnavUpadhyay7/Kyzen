import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Lenis from "lenis";

import { palette } from "../components/landing/design-system";

import Navbar        from "../components/global/Navbar";
import Footer        from "../components/global/Footer";
import HeroScene     from "../components/landing/HeroScene";
import { HeroContent } from "../components/landing/Hero";
import DashboardCard from "../components/landing/DashboardPreview";
import Features      from "../components/landing/Features";
import HowItWorks    from "../components/landing/HowItWorks";
import SocialProof   from "../components/landing/SocialProof";
import { Spotlight } from "../components/ui/Spotlight";

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
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(rafId); lenis.destroy(); };
  }, []);
}

// ─── Section divider ─────────────────────────────────────────────────────────
function SectionDivider() {
  return (
    <div
      className="absolute inset-x-0 top-0 h-px pointer-events-none z-10"
      style={{
        background:
          "linear-gradient(90deg, transparent 0%, rgba(109,40,217,0.45) 15%, rgba(167,139,250,0.85) 50%, rgba(109,40,217,0.45) 85%, transparent 100%)",
      }}
    />
  );
}

// ─── Landing page ─────────────────────────────────────────────────────────────
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

  const heroOpacity = useTransform(progress, [0, 0.16, 0.28], [1, 1, 0]);
  const heroY       = useTransform(progress, [0, 0.30], [0, -70]);

  const dashY       = useTransform(progress, [0, 1], [42, -310]);
  const dashRotateX = useTransform(progress, [0, 0.48], [7, 0]);
  const dashScale   = useTransform(progress, [0, 0.45, 0.80], [0.88, 1.02, 1.03]);
  const dashGlow    = useTransform(progress, [0, 0.45, 0.90], [0.38, 0.82, 0]);

  const featuresY       = useTransform(progress, [0.48, 0.82], ["105vh", "0vh"]);
  const featuresOpacity = useTransform(progress, [0.48, 0.64], [0, 1]);

  return (
    <div style={{ backgroundColor: palette.canvas }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,700;0,800;0,900;1,900&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: auto; }
        ::selection { background: rgba(139,92,246,0.28); }

        ::-webkit-scrollbar       { width: 4px; }
        ::-webkit-scrollbar-track { background: ${palette.canvas}; }
        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.38); border-radius: 2px; }

        /*
          SPOTLIGHT FIX — define the keyframe the Aceternity component expects.
          animate-spotlight is a custom Tailwind animation that must be declared
          in tailwind.config.js. If it's missing from that config, the class
          compiles to nothing and opacity-0 wins permanently.
          Defining it here in a global <style> guarantees it works regardless.
          animation-fill-mode: forwards keeps it visible after the animation ends.
        */
        @keyframes spotlight {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-spotlight {
          animation: spotlight 2s ease 0.5s 1 forwards;
        }
      `}</style>

      <Navbar />

      {/* ── PIN ZONE (350vh) ───────────────────────────────────────────────── */}
      <div ref={pinRef} className="relative" style={{ height: "350vh" }}>
        <div className="sticky top-0 h-screen overflow-hidden">

          {/* Background scene */}
          <HeroScene />

          {/*
            SPOTLIGHT — added here in Landing.tsx's sticky scene.
            Previously it only existed in the standalone Hero.tsx default export
            which is never rendered when using Landing.tsx as the main route.
            This is why it was never visible.

            Placed FIRST after HeroScene so it renders above the background
            but below all content layers (which are z-[15], z-[20], z-[25]).

            opacity-[0.9] overrides the base opacity-0 via tailwind-merge in cn().
            NO blur-3xl — that double-blurs the already feGaussianBlur-heavy SVG.
          */}
          <Spotlight
            className="-top-[20%] -left-[10%] opacity-[0.9]"
            fill="white"
          />

          {/* Dashboard */}
          <motion.div
            className="absolute inset-x-0 z-[15] flex justify-center items-end px-5 pointer-events-none
                       bottom-[22%] md:bottom-[-8%]"
            style={{
              perspective: "1100px",
              perspectiveOrigin: "50% 65%",
              y: dashY,
              willChange: "transform",
            }}
          >
            {/* Purple glow beneath card */}
            <motion.div
              className="absolute left-[8%] right-[8%] bottom-[-24px] h-[180px] pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(109,40,217,0.60) 0%, transparent 68%)",
                filter: "blur(52px)",
                opacity: dashGlow,
              }}
            />
            <motion.div
              className="w-full max-w-[1220px] pointer-events-none"
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
            className="absolute inset-x-0 top-0 z-[20] flex flex-col items-center text-center px-5 pt-[13vh] pointer-events-auto"
            style={{ opacity: heroOpacity, y: heroY, willChange: "transform, opacity" }}
          >
            <HeroContent />
          </motion.div>

          {/* Features peek panel */}
          <motion.div
            className="absolute inset-x-0 bottom-0 z-[25] pointer-events-none"
            style={{ y: featuresY, opacity: featuresOpacity, willChange: "transform, opacity" }}
          >
            <div
              className="relative w-full"
              style={{
                background: palette.canvas,
                borderRadius: "32px 32px 0 0",
                boxShadow:
                  "0 -1px 0 rgba(167,139,250,0.38), 0 -72px 120px rgba(0,0,0,0.95)",
                height: 0,
                overflow: "visible",
              }}
            >
              <div
                className="absolute inset-x-0 top-0 h-px z-10 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(109,40,217,0.48) 15%, rgba(167,139,250,0.95) 50%, rgba(109,40,217,0.48) 85%, transparent 100%)",
                  borderRadius: "32px 32px 0 0",
                }}
              />
              <div
                className="absolute inset-x-0 top-0 h-36 pointer-events-none z-10"
                style={{
                  background:
                    "radial-gradient(ellipse 58% 100% at 50% 0%, rgba(124,58,237,0.14) 0%, transparent 100%)",
                }}
              />
              <div className="flex justify-center pt-4 relative z-10">
                <div
                  className="w-9 h-1 rounded-full"
                  style={{ background: "rgba(139,92,246,0.34)" }}
                />
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
      <div
        className="relative z-[30]"
        style={{
          backgroundColor: palette.canvas,
          borderRadius: "32px 32px 0 0",
          marginTop: 0,
          boxShadow:
            "0 -1px 0 rgba(167,139,250,0.28), 0 -56px 90px rgba(0,0,0,0.90)",
        }}
      >
        <SectionDivider />
        <Features    />
        <HowItWorks  />
        <SocialProof />
        <Footer      />
      </div>
    </div>
  );
}