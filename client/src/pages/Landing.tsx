import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Lenis from "lenis";

import Navbar from "../components/global/Navbar";
import HeroScene from "../components/landing/HeroScene";
import { HeroContent } from "../components/landing/Hero";
import DashboardCard from "../components/landing/DashboardPreview";
import { Spotlight } from "../components/ui/Spotlight";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import SocialProof from "../components/landing/SocialProof";
import Footer from "../components/global/Footer";

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
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
}

export default function Landing() {
  useLenis();

  const pinRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: pinRef,
    offset: ["start start", "end end"],
  });

  const progress = useSpring(scrollYProgress, { stiffness: 50, damping: 24, mass: 0.68 });

  const heroOpacity = useTransform(progress, [0, 0.16, 0.28], [1, 1, 0]);
  const heroY = useTransform(progress, [0, 0.3], [0, -70]);

  const dashY = useTransform(progress, [0, 1], [42, -310]);
  const dashRotateX = useTransform(progress, [0, 0.48], [6, 0]);
  const dashScale = useTransform(progress, [0, 0.45, 0.8], [0.9, 1.02, 1.03]);

  return (
    <div className="bg-landing-canvas">
      <Navbar />

      <div ref={pinRef} className="relative h-[350vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <HeroScene />

          <motion.div
            className="pointer-events-none absolute inset-0 z-[5] origin-top-left rotate-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Spotlight
              className="md:-top-120 md:-left-60 -top-180 -left-60 opacity-[0.82]"
              fill="white"
            />
          </motion.div>

          <motion.div
            className="pointer-events-none absolute inset-0 z-[5] origin-top-left -rotate-[8deg]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <Spotlight
              className="md:-top-120 md:-left-60 -top-180 -left-60 opacity-[0.48]"
              fill="white"
            />
          </motion.div>

          <motion.div
            className="pointer-events-none absolute inset-0 z-[5] origin-top-left rotate-[10deg]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Spotlight
              className="md:-top-120 md:-left-60 -top-180 -left-60 opacity-[0.32]"
              fill="white"
            />
          </motion.div>

          <motion.div
            className="pointer-events-none absolute inset-0 z-[5] origin-top-left -rotate-[4deg]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.4, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Spotlight
              className="md:-top-120 md:-left-60 -top-180 -left-60 opacity-[0.22]"
              fill="rgb(77,124,255)"
            />
          </motion.div>

          <motion.div
            className="absolute inset-x-0 z-[15] flex justify-center items-end px-5 pointer-events-none bottom-[22%] md:bottom-[-8%] [perspective:1200px] [perspective-origin:50%_65%] will-change-transform"
            style={{ y: dashY }}
          >
            <motion.div
              className="w-full max-w-[1200px] pointer-events-none [transform-style:preserve-3d] will-change-transform"
              style={{ rotateX: dashRotateX, scale: dashScale }}
            >
              <DashboardCard />
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute inset-x-0 top-0 z-[20] flex flex-col items-center text-center px-5 pt-[13vh] pointer-events-auto will-change-[transform,opacity]"
            style={{ opacity: heroOpacity, y: heroY }}
          >
            <HeroContent />
          </motion.div>
        </div>
      </div>

      <div className="relative z-[30] bg-landing-canvas rounded-t-[32px] shadow-landing-main-panel">
        <div className="absolute inset-x-0 top-0 h-px pointer-events-none z-10 bg-landing-divider-main" />

        <Features />
        <HowItWorks />
        <SocialProof />
        <Footer />
      </div>
    </div>
  );
}
