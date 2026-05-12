import { typography } from "./design-system";
import dashboardHero from "../../assets/dashboard_hero.png";

export default function DashboardCard() {
  return (
    <div
      className="w-full overflow-hidden relative rounded-[14px]"
      style={{
        background: "#080808",
        boxShadow: `
          0 0 0 1px rgba(255,255,255,0.12),
          0 0 80px rgba(255,255,255,0.04),
          0 48px 120px rgba(0,0,0,0.85),
          inset 0 1px 0 rgba(255,255,255,0.07)
        `,
      }}
    >
      {/* Top edge light line — white shimmer instead of purple */}
      <div
        className="absolute inset-x-0 top-0 h-px pointer-events-none z-10"
        style={{
          background: "linear-gradient(90deg, transparent 8%, rgba(255,255,255,0.18) 35%, rgba(255,255,255,0.70) 50%, rgba(255,255,255,0.18) 65%, transparent 92%)",
        }}
      />

      {/* Chrome bar */}
      <div
        className="relative flex items-center gap-2 px-4 py-2.5"
        style={{
          background: "rgba(6,6,6,0.98)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        {/* Traffic lights */}
        <div className="flex gap-1.5 flex-shrink-0">
          {[
            { c: "#ff5f57", s: "rgba(255,95,87,0.35)" },
            { c: "#febc2e", s: "rgba(254,188,46,0.35)" },
            { c: "#28c840", s: "rgba(40,200,64,0.35)" },
          ].map(({ c, s }) => (
            <div
              key={c}
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: c, opacity: 0.72, boxShadow: `0 0 5px ${s}` }}
            />
          ))}
        </div>

        {/* URL bar */}
        <div className="flex-1 flex justify-center">
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-md"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <svg width="8" height="9" viewBox="0 0 9 10" fill="none" className="opacity-30">
              <rect x="0.5" y="3.5" width="8" height="6" rx="1" stroke="white" strokeWidth="1"/>
              <path d="M2.5 3.5V3a2 2 0 014 0v.5" stroke="white" strokeWidth="1"/>
            </svg>
            <span
              className="text-[10px] tracking-[0.04em]"
              style={{ color: "rgba(255,255,255,0.28)", fontFamily: typography.mono }}
            >
              app.kyzen.dev/dashboard
            </span>
          </div>
        </div>

        {/* Balance spacer */}
        <div className="flex gap-1.5 flex-shrink-0 opacity-0 pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/10" />
        </div>
      </div>

      {/* Dashboard screenshot */}
      <img
        src={dashboardHero}
        alt="Kyzen dashboard"
        draggable={false}
        className="w-full block select-none"
        style={{
          maskImage: "linear-gradient(to bottom, black 68%, rgba(0,0,0,0.28) 88%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 68%, rgba(0,0,0,0.28) 88%, transparent 100%)",
        }}
      />
    </div>
  );
}