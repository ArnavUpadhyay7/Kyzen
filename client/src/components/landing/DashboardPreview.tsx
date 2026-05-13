import { motion } from "framer-motion";
import { typography } from "./design-system";
import dashboardHero from "../../assets/dashboard_ice.png";

export default function DashboardCard() {
  return (
    /* Static — no float animation, no sheen sweep */
    <div className="relative w-full">

      {/* Multi-layer ambient bloom behind card */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: "-32px -24px -20px -24px",
          background: `
            radial-gradient(ellipse 85% 55% at 50% 22%,
              rgba(76,110,245,0.22) 0%,
              rgba(77,124,255,0.08) 50%,
              transparent 75%),
            radial-gradient(ellipse 55% 40% at 14% 50%,
              rgba(77,124,255,0.10) 0%, transparent 65%),
            radial-gradient(ellipse 55% 40% at 86% 50%,
              rgba(124,77,255,0.08) 0%, transparent 65%)
          `,
          filter: "blur(22px)",
          zIndex: -1,
        }}
      />

      {/* Card shell */}
      <div
        className="w-full overflow-hidden relative"
        style={{
          borderRadius: "14px",
          background:   "#070A14",
          boxShadow: `
            0 0 0 1px rgba(122,162,255,0.42),
            0 0 0 1px rgba(255,255,255,0.05),
            0 0 80px rgba(76,110,245,0.35),
            0 0 160px rgba(76,110,245,0.10),
            0 60px 180px rgba(0,0,0,0.95),
            inset 0 1px 0 rgba(255,255,255,0.09)
          `,
        }}
      >
        {/* Top-edge shimmer line — static */}
        <div
          className="absolute inset-x-0 top-0 pointer-events-none z-20"
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent 5%, rgba(122,162,255,0.22) 25%, rgba(180,220,255,0.90) 50%, rgba(122,162,255,0.22) 75%, transparent 95%)",
          }}
        />

        {/* Left rim */}
        <div className="absolute top-0 left-0 w-px pointer-events-none z-20" style={{
          height: "65%",
          background: "linear-gradient(to bottom, rgba(122,162,255,0.55) 0%, rgba(122,162,255,0.12) 60%, transparent 100%)",
        }} />

        {/* Right rim */}
        <div className="absolute top-0 right-0 w-px pointer-events-none z-20" style={{
          height: "65%",
          background: "linear-gradient(to bottom, rgba(124,77,255,0.45) 0%, rgba(124,77,255,0.10) 60%, transparent 100%)",
        }} />

        {/* Corner blooms */}
        <div className="absolute pointer-events-none z-10" style={{
          top: 0, left: 0, width: "220px", height: "120px",
          background: "radial-gradient(ellipse 100% 100% at 0% 0%, rgba(77,124,255,0.12) 0%, transparent 70%)",
        }} />
        <div className="absolute pointer-events-none z-10" style={{
          top: 0, right: 0, width: "220px", height: "120px",
          background: "radial-gradient(ellipse 100% 100% at 100% 0%, rgba(124,77,255,0.09) 0%, transparent 70%)",
        }} />

        {/* Chrome bar */}
        <div
          className="relative flex items-center gap-2 px-4 py-2.5"
          style={{ background: "rgba(4,6,18,0.99)", borderBottom: "1px solid rgba(77,124,255,0.10)" }}
        >
          <div className="flex gap-1.5 flex-shrink-0">
            {[
              { c: "#ff5f57", s: "rgba(255,95,87,0.35)"  },
              { c: "#febc2e", s: "rgba(254,188,46,0.35)" },
              { c: "#28c840", s: "rgba(40,200,64,0.35)"  },
            ].map(({ c, s }) => (
              <div key={c} className="w-2.5 h-2.5 rounded-full"
                style={{ background: c, opacity: 0.74, boxShadow: `0 0 5px ${s}` }} />
            ))}
          </div>

          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-md"
              style={{ background: "rgba(77,124,255,0.05)", border: "1px solid rgba(77,124,255,0.12)" }}>
              <svg width="8" height="9" viewBox="0 0 9 10" fill="none" className="opacity-30">
                <rect x="0.5" y="3.5" width="8" height="6" rx="1" stroke="rgba(122,162,255,0.8)" strokeWidth="1"/>
                <path d="M2.5 3.5V3a2 2 0 014 0v.5" stroke="rgba(122,162,255,0.8)" strokeWidth="1"/>
              </svg>
              <span className="text-[10px] tracking-[0.04em]"
                style={{ color: "rgba(122,162,255,0.35)", fontFamily: typography.mono }}>
                app.kyzen.dev/dashboard
              </span>
            </div>
          </div>

          <div className="flex gap-1.5 flex-shrink-0 opacity-0 pointer-events-none">
            <div className="w-2.5 h-2.5 rounded-full" />
            <div className="w-2.5 h-2.5 rounded-full" />
            <div className="w-2.5 h-2.5 rounded-full" />
          </div>
        </div>

        {/* Screenshot — static, no motion wrapper, no sheen */}
        <div className="relative">
          <img
            src={dashboardHero}
            alt="Kyzen dashboard"
            draggable={false}
            className="w-full block select-none"
            style={{
              maskImage: "linear-gradient(to bottom, black 60%, rgba(0,0,0,0.20) 84%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 60%, rgba(0,0,0,0.20) 84%, transparent 100%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}