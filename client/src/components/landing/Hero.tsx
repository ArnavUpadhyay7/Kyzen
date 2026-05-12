import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { typography } from "./design-system";
import { cn } from "../../lib/utils";
import { Spotlight } from "../ui/Spotlight";

const ease = [0.16, 1, 0.3, 1] as const;

export function HeroContent() {
  return (
    <>
      <style>{`
        @keyframes shimmer-sweep {
          0%   { background-position: 200% 0; }
          100% { background-position: -100% 0; }
        }
        .btn-shimmer::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 10px;
          background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%);
          background-size: 300% 100%;
          animation: shimmer-sweep 3.5s ease-in-out infinite 2s;
          pointer-events: none;
        }

        /*
          CRITICAL FIX: Define the @keyframes that Aceternity's animate-spotlight class needs.
          Tailwind's animate-spotlight is a *custom* animation — it must be registered in
          tailwind.config.js under theme.extend.keyframes.  If it's missing there, the class
          compiles to nothing and opacity-0 wins forever.
          Defining it here in a <style> block makes it work unconditionally.
          The animation goes opacity 0→1 and is kept at 1 via forwards fill-mode.
        */
        @keyframes spotlight {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-spotlight {
          animation: spotlight 2s ease 0.5s 1 forwards;
        }
      `}</style>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.72, delay: 0.10, ease }}
        className="font-black uppercase leading-[0.92] mb-6 select-none"
        style={{
          fontFamily: typography.display,
          fontSize: "clamp(3rem, 7.2vw, 6.5rem)",
          letterSpacing: "-0.03em",
          background: "linear-gradient(to bottom, #ffffff 0%, #f3f3f3 35%, #cfcfcf 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        <span className="block">Turn Grind</span>
        <span className="block">Into Progress</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.62, delay: 0.18, ease }}
        className="mb-9 leading-relaxed max-w-[420px] select-none"
        style={{
          fontFamily: typography.body,
          fontSize: "clamp(0.88rem, 1.3vw, 1rem)",
          color: "rgba(255,255,255,0.45)",
          fontWeight: 400,
        }}
      >
        The RPG layer for your developer life. Quests, XP, streaks —
        your progress, finally quantified.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.26, ease }}
        className="flex items-center gap-3 flex-wrap"
      >
        <Link to="/signup">
          <motion.button
            whileHover={{
              scale: 1.025,
              boxShadow: "0 0 28px rgba(255,255,255,0.22), 0 4px 16px rgba(0,0,0,0.5)",
            }}
            whileTap={{ scale: 0.975 }}
            className="btn-shimmer relative overflow-hidden flex items-center gap-2
             font-semibold cursor-pointer select-none
             rounded-[10px] px-6 py-[11px] text-[14px] tracking-[0.01em]"
            style={{
              fontFamily: typography.body,
              background: "#ffffff",
              color: "#000000",
              boxShadow: "0 0 18px rgba(255,255,255,0.12), 0 2px 10px rgba(0,0,0,0.4)",
              border: "1px solid rgba(255,255,255,0.9)",
            }}
          >
            Get Early Access
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="black" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        </Link>

        <motion.button
          whileHover={{
            color: "rgba(255,255,255,0.85)",
            borderColor: "rgba(255,255,255,0.30)",
          }}
          whileTap={{ scale: 0.975 }}
          className="flex items-center gap-2 cursor-pointer select-none
                     rounded-[10px] px-5 py-[11px] text-[13.5px] font-medium
                     transition-colors duration-150"
          style={{
            fontFamily: typography.body,
            color: "rgba(255,255,255,0.50)",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.14)",
            letterSpacing: "0.005em",
          }}
        >
          Book a Demo
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M6.5 5.5l4 2.5-4 2.5V5.5z" fill="currentColor" />
          </svg>
        </motion.button>
      </motion.div>
    </>
  );
}

export default function Hero() {
  return (
    <section className="relative w-full min-h-[100dvh] flex flex-col overflow-hidden">

      {/*
        ── LAYER 1 (z-0): Spotlight ─────────────────────────────────────────
        Placed FIRST in DOM so nothing painted later can obscure it without
        an explicit higher z-index.

        The Spotlight SVG's own class string is:
          "animate-spotlight pointer-events-none absolute z-[1] h-[169%] w-[138%] lg:w-[84%] opacity-0"
        cn() with tailwind-merge merges our className in — opacity-[0.9] wins over
        opacity-0 because tailwind-merge resolves the same utility group to the last one.
        The @keyframes defined above animates it from 0 → opacity-[0.9].

        NO blur-3xl — that was double-blurring an already feGaussianBlur-heavy SVG.
        Position: top-left origin, large enough that beam sweeps over the headline.
      */}
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-10 opacity-[0.9]"
        fill="white"
      />

      {/*
        ── LAYER 2 (z-0): Grid with radial edge fade ─────────────────────────
        Same 40px grid as before, but wrapped in a container that applies a
        radial mask — full opacity in the centre, fading to transparent at all
        four edges. This gives the "grid lines dissolve into darkness" effect
        used by Linear/Vercel without changing the grid colour or density.
      */}
      <div
        className="pointer-events-none absolute inset-0 select-none"
        style={{
          WebkitMaskImage: "radial-gradient(ellipse 85% 80% at 50% 40%, black 30%, transparent 100%)",
          maskImage:        "radial-gradient(ellipse 85% 80% at 50% 40%, black 30%, transparent 100%)",
        }}
      >
        <div
          className={cn(
            "absolute inset-0 [background-size:40px_40px]",
            "[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]",
          )}
        />
      </div>

      {/*
        ── LAYER 3 (z-10): Content ───────────────────────────────────────────
      */}
      <div
        className="relative z-10 flex flex-col pt-[18vh]
                   px-6 sm:px-12 lg:px-20 w-full max-w-7xl mx-auto"
      >
        <div className="max-w-2xl">
          <HeroContent />
        </div>
      </div>
    </section>
  );
}