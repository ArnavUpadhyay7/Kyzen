import { useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import Lenis from "lenis";
import Navbar from "../components/global/Navbar";
import Footer from "../components/global/Footer";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";

import { palette } from "../design-system";
import BuildCharacter from "../components/landing/BuildCharacter";
import SocialProof from "../components/landing/SocialProof";

function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(rafId); lenis.destroy(); };
  }, []);
}

const SectionTransition = ({ flip = false }: { flip?: boolean }) => (
  <div
    className="relative h-32 pointer-events-none -my-1 z-10"
    style={{
      background: flip
        ? "linear-gradient(to top, rgba(109,40,217,0.04) 0%, transparent 100%)"
        : "linear-gradient(to bottom, rgba(109,40,217,0.04) 0%, transparent 100%)",
    }}
  />
);

export default function Landing() {
  useLenis();

  const { scrollY } = useScroll();
  const heroScale = useTransform(scrollY, [0, window.innerHeight * 0.6], [1, 0.92]);
  const heroBrightness = useTransform(scrollY, [0, window.innerHeight * 0.5], [1, 0.35]);

  return (
    <div className="overflow-x-hidden" style={{ backgroundColor: palette.canvas }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: auto; }
        body { font-family: 'DM Sans', sans-serif; }
        h1, h2, h3, h4 { font-family: 'Barlow', sans-serif !important; }
        ::selection { background: rgba(139,92,246,0.3); }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: ${palette.canvas}; }
        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.4); border-radius: 2px; }
      `}</style>

      {/* ── NAVBAR — fixed, always on top ── */}
      <div className="fixed inset-x-0 top-0 z-100">
        <Navbar />
      </div>

      {/*
        ── HERO LAYER — truly fixed, never moves ──────────────────────────────
        Hero is position:fixed so it is completely frozen in the viewport.
        It scales down and dims as the content panel scrolls over it,
        giving a cinematic "scene receding behind new content" feel.
      */}
      <motion.div
        className="fixed inset-0 z-10"
        style={{
          scale: heroScale,
          filter: useTransform(heroBrightness, (v) => `brightness(${v})`),
          transformOrigin: "center center",
          willChange: "transform, filter",
        }}
      >
        <Hero />
      </motion.div>

      {/*
        ── SCROLL SPACER ─────────────────────────────────────────────────────
        This invisible div is 100vh tall and sits in normal document flow.
        It creates the scroll distance the user needs to travel before the
        panel starts appearing — so the page "waits" on the Hero for one
        full viewport height before anything else comes up.
      */}
      <div style={{ height: "100vh" }} aria-hidden />

      {/*
        ── CONTENT PANEL — slides up over the frozen Hero ────────────────────
        z-[30] puts it above the Hero (z-10). As the user scrolls past the
        spacer, this panel naturally rises into view from below the fold.
        The rounded top corners + glowing edge + deep shadow make it feel
        like a physical card lifting off the scene beneath.
      */}
      <div
        className="relative"
        style={{
          zIndex: 30,
          backgroundColor: palette.canvas,
          borderRadius: "32px 32px 0 0",
          boxShadow: `
            0 -1px 0 rgba(167,139,250,0.35),
            0 -2px 0 rgba(124,58,237,0.15),
            0 -60px 120px rgba(0,0,0,0.9),
            0 -30px 60px rgba(0,0,0,0.7)
          `,
          // Overflow hidden so border-radius clips children at the top
          overflow: "hidden",
        }}
      >
        {/* ── PANEL TOP EDGE — the glowing lip that appears first ── */}
        {/* Bright gradient line across the very top */}
        <div
          className="absolute inset-x-0 top-0 h-px pointer-events-none z-10"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(109,40,217,0.4) 15%, rgba(167,139,250,0.9) 40%, rgba(196,181,253,1) 50%, rgba(167,139,250,0.9) 60%, rgba(109,40,217,0.4) 85%, transparent 100%)",
          }}
        />
        {/* Inner bloom below the lip — purple aura bleeding downward */}
        <div
          className="absolute inset-x-0 top-0 pointer-events-none z-10"
          style={{
            height: 200,
            background: "radial-gradient(ellipse 70% 100% at 50% 0%, rgba(124,58,237,0.18) 0%, rgba(109,40,217,0.08) 40%, transparent 100%)",
          }}
        />
        {/* Subtle handle pill — visual affordance that there's content below */}
        <div className="flex justify-center pt-4 pb-0 relative z-10">
          <div
            className="w-10 h-1 rounded-full"
            style={{ background: "rgba(139,92,246,0.4)" }}
          />
        </div>

        {/* All sections live inside the panel */}
        <Features />
        <SectionTransition flip />
        <HowItWorks />
        <SectionTransition />
        <BuildCharacter />
        <SectionTransition flip />
        <SocialProof />
        <Footer />
      </div>
    </div>
  );
}