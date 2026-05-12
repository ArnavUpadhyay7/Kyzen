import { motion } from "framer-motion";

/*
  Global keyframe for Aceternity's Spotlight component.
  Defined here (in the top-level scene) so it's injected before any Spotlight
  renders — covers both the Hero standalone route and Landing's sticky zone.
*/
const SpotlightKeyframes = () => (
  <style>{`
    @keyframes spotlight {
      0%   { opacity: 0; }
      100% { opacity: 1; }
    }
    .animate-spotlight {
      animation: spotlight 2s ease 0.5s 1 forwards;
    }
  `}</style>
);

// ─── Subtle star field ───────────────────────────────────────────────────────
const Starfield = ({ count = 40 }: { count?: number }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full bg-white"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          width: Math.random() > 0.92 ? 2 : 1,
          height: Math.random() > 0.92 ? 2 : 1,
          opacity: Math.random() * 0.10 + 0.02,
        }}
        animate={{ opacity: [null as any, 0.02, 0.12] }}
        transition={{
          duration: 3 + Math.random() * 5,
          repeat: Infinity,
          repeatType: "reverse",
          delay: Math.random() * 8,
        }}
      />
    ))}
  </div>
);

// ────────────────────────────────────────────────────────────────────────────

export default function HeroScene() {
  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden"
      style={{ background: "#080808" }}
    >
      {/* Inject spotlight keyframes globally */}
      <SpotlightKeyframes />

      {/*
        Grid with radial edge-fade mask.
        Same 72px grid and #171717 line colour as before — only the mask is new.
        The mask fades the grid lines to transparent at all four edges so they
        "dissolve into the dark" rather than hard-stopping at the viewport edge.
        Centre of the ellipse is pushed up (at 50% 35%) so the top area —
        where the spotlight lands — has maximum grid visibility.
      */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          WebkitMaskImage: "radial-gradient(ellipse 90% 75% at 50% 35%, black 25%, rgba(0,0,0,0.6) 55%, transparent 100%)",
          maskImage:        "radial-gradient(ellipse 90% 75% at 50% 35%, black 25%, rgba(0,0,0,0.6) 55%, transparent 100%)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
            `,
            backgroundSize: "72px 72px",
          }}
        />
      </div>

      {/* Top-left light rays — unchanged */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: 0,
          left: 0,
          width: "75%",
          height: "65%",
          background:
            "conic-gradient(from 0deg at 0% 0%, rgba(255,255,255,0.09) 0deg, rgba(255,255,255,0.03) 28deg, transparent 42deg)",
          filter: "blur(18px)",
        }}
      />

      <Starfield count={40} />

      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: "50%",
          background:
            "linear-gradient(to top, #080808 0%, rgba(8,8,8,0.92) 20%, rgba(8,8,8,0.4) 55%, transparent 100%)",
          zIndex: 4,
        }}
      />
    </div>
  );
}