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
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.1,
      touchMultiplier: 2,
    });
    let rafId: number;
    function raf(time: number) { lenis.raf(time); rafId = requestAnimationFrame(raf); }
    rafId = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(rafId); lenis.destroy(); };
  }, []);
}

export default function Landing() {
  useLenis();

  // Pin zone: 280vh — shorter = scroll feels snappier, dashboard still gets its moment
  const pinRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });

  // Tight spring — responsive, not laggy
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 28, mass: 0.5 });

  // Hero text fades fast so dashboard dominates quickly
  const heroOpacity = useTransform(progress, [0, 0.12, 0.22], [1, 0.8, 0.05]);
  const heroY       = useTransform(progress, [0, 0.25], [0, -40]);
  const heroPtr     = useTransform(progress, (v) => v > 0.16 ? "none" : "auto");

  // Dashboard: z-[20], always opaque, continuous upward travel
  const dashY       = useTransform(progress, [0, 0.35, 0.78, 1.0], [90, 0, -260, -380]);
  const dashRotateX = useTransform(progress, [0, 0.38], [5, 0]);
  const dashScale   = useTransform(progress, [0, 0.35, 0.75], [0.92, 1.01, 1.02]);
  const dashOpacity = useTransform(progress, [0, 0.68, 0.85], [1, 1, 0]);
  const dashGlow    = useTransform(progress, [0, 0.35, 0.82], [0.45, 0.9, 0]);

  return (
    <div className="relative" style={{ backgroundColor: palette.canvas, clipPath: "inset(0)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,700;0,800;0,900;1,900&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: auto; }
        ::selection { background: rgba(139,92,246,0.3); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${palette.canvas}; }
        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.4); border-radius: 2px; }
      `}</style>

      <div className="fixed inset-x-0 top-0 z-[100]">
        <Navbar />
      </div>

      {/* PIN ZONE — 280vh */}
      <div ref={pinRef} className="relative" style={{ height: "280vh" }}>
        <div className="sticky top-0 h-screen overflow-hidden">

          {/* z-0: atmosphere */}
          <HeroScene />

          {/* z-10: hero text — fades under dashboard */}
          <motion.div
            className="absolute inset-x-0 top-0 z-[10] flex flex-col items-center text-center px-4 pt-[13vh]"
            style={{
              opacity: heroOpacity,
              y: heroY,
              pointerEvents: heroPtr as any,
              willChange: "transform, opacity",
            }}
          >
            <HeroContent />
          </motion.div>

          {/* z-20: dashboard — always above text, always opaque */}
          <motion.div
            className="absolute inset-x-0 bottom-[-4%] z-[20] flex justify-center items-end px-4 pointer-events-none"
            style={{
              perspective: "1200px",
              perspectiveOrigin: "50% 70%",
              y: dashY,
              opacity: dashOpacity,
              willChange: "transform, opacity",
            }}
          >
            <motion.div
              className="absolute left-[6%] right-[6%] bottom-[-16px] h-40 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 85% 100% at 50% 100%, rgba(109,40,217,0.7) 0%, transparent 68%)",
                filter: "blur(50px)",
                opacity: dashGlow,
              }}
            />
            <motion.div
              className="w-full max-w-[1040px]"
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

        </div>
      </div>

      {/* POST-PIN — features slides up naturally from document flow.
          marginTop: -120 means it's already overlapping the bottom of the
          sticky scene when the pin zone ends, so there is ZERO gap or jump. */}
      <div
        className="relative z-[30] rounded-t-[36px]"
        style={{
          backgroundColor: palette.canvas,
          marginTop: -120,
          boxShadow: `
            0 -1px 0 rgba(167,139,250,0.38),
            0 -2px 0 rgba(124,58,237,0.14),
            0 -40px 80px rgba(0,0,0,0.98)
          `,
        }}
      >
        {/* glow seam */}
        <div
          className="absolute inset-x-0 top-0 h-px rounded-t-[36px]"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(109,40,217,0.4) 20%, rgba(167,139,250,0.95) 50%, rgba(109,40,217,0.4) 80%, transparent 100%)",
          }}
        />
        {/* ambient bloom */}
        <div
          className="absolute inset-x-0 top-0 h-32 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 50% 100% at 50% 0%, rgba(109,40,217,0.13) 0%, transparent 100%)",
          }}
        />
        {/* handle */}
        <div className="flex justify-center pt-4 relative z-10">
          <div className="w-8 h-[3px] rounded-full bg-violet-500/35" />
        </div>

        <Features />
        <HowItWorks />
        <SocialProof />
        <Footer />
      </div>
    </div>
  );
}