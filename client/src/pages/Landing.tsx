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
          animate-spotlight keyframe — must be defined before any Spotlight
          renders. The SVG starts at opacity-0 and this animates it to
          full opacity, kept visible via animation-fill-mode: forwards.
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

          <HeroScene />

          {/*
            ── MULTI-RAY SPOTLIGHT ─────────────────────────────────────────
            The proven working offset for top-left corner placement is:
              md:-top-120 md:-left-60   (desktop)
                 -top-180    -left-60   (mobile)

            These large negative values shift the oversized SVG (138vw × 169vh)
            so its ellipse bright tip sits exactly at the viewport's top-left
            corner on every screen size.

            For multiple soft rays: each Spotlight is wrapped in a div that
            rotates around "top left" origin. The rotation fans the beams out
            from the same corner source. Small angles keep rays close together
            for a natural multi-beam look like the reference image.

            The wrapper div has NO opacity — only rotation.
            The Spotlight className carries the offset + final opacity.
            The animate-spotlight keyframe (defined above) fades each SVG
            from opacity-0 → the declared opacity value automatically.

            Stagger the animation delays via inline style on each wrapper
            so rays don't all appear simultaneously.
          */}

          {/* Ray 1 — main beam, no rotation, brightest */}
          <div
            className="pointer-events-none absolute inset-0 z-[5]"
            style={{ transform: "rotate(0deg)", transformOrigin: "top left" }}
          >
            <Spotlight
              className="md:-top-120 md:-left-60 -top-180 -left-60 opacity-[0.85]"
              fill="white"
            />
          </div>

          {/* Ray 2 — rotated slightly upward, medium brightness */}
          <div
            className="pointer-events-none absolute inset-0 z-[5]"
            style={{ transform: "rotate(-8deg)", transformOrigin: "top left" }}
          >
            <Spotlight
              className="md:-top-120 md:-left-60 -top-180 -left-60 opacity-[0.50]"
              fill="white"
            />
          </div>

          {/* Ray 3 — rotated slightly downward, softer fill */}
          <div
            className="pointer-events-none absolute inset-0 z-[5]"
            style={{ transform: "rotate(10deg)", transformOrigin: "top left" }}
          >
            <Spotlight
              className="md:-top-120 md:-left-60 -top-180 -left-60 opacity-[0.35]"
              fill="white"
            />
          </div>

          {/* Ray 4 — wider downward scatter, very soft */}
          <div
            className="pointer-events-none absolute inset-0 z-[5]"
            style={{ transform: "rotate(22deg)", transformOrigin: "top left" }}
          >
            <Spotlight
              className="md:-top-120 md:-left-60 -top-180 -left-60 opacity-[0.20]"
              fill="white"
            />
          </div>

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