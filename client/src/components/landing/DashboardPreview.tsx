import dashboardHero from "../../assets/dashboard_ice.png";

export default function DashboardCard() {
  return (
    <div className="relative w-full">
      <div className="absolute -inset-x-6 -top-8 -bottom-5 pointer-events-none bg-landing-dash-bloom blur-[22px] -z-10" />

      <div className="w-full overflow-hidden relative rounded-[14px] bg-landing-surface-raised shadow-landing-dash">
        <div className="absolute inset-x-0 top-0 h-px pointer-events-none z-20 bg-landing-edge-dash" />

        <div className="absolute top-0 left-0 w-px h-[65%] pointer-events-none z-20 bg-landing-rim-left" />
        <div className="absolute top-0 right-0 w-px h-[65%] pointer-events-none z-20 bg-landing-rim-right" />

        <div className="absolute top-0 left-0 w-[220px] h-[120px] pointer-events-none z-10 bg-landing-dash-corner-blue" />
        <div className="absolute top-0 right-0 w-[220px] h-[120px] pointer-events-none z-10 bg-landing-dash-corner-purple" />

        <div className="relative flex items-center gap-2 px-4 py-2.5 bg-landing-chrome border-b border-landing-border-soft">
          <div className="flex gap-1.5 shrink-0">
            <div className="w-2.5 h-2.5 rounded-full opacity-[0.74] bg-[#ff5f57] shadow-[0_0_5px_rgba(255,95,87,0.35)]" />
            <div className="w-2.5 h-2.5 rounded-full opacity-[0.74] bg-[#febc2e] shadow-[0_0_5px_rgba(254,188,46,0.35)]" />
            <div className="w-2.5 h-2.5 rounded-full opacity-[0.74] bg-[#28c840] shadow-[0_0_5px_rgba(40,200,64,0.35)]" />
          </div>

          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-landing-badge-blue-bg border border-landing-border-blue">
              <svg width="8" height="9" viewBox="0 0 9 10" fill="none" className="opacity-30">
                <rect
                  x="0.5"
                  y="3.5"
                  width="8"
                  height="6"
                  rx="1"
                  stroke="rgba(122,162,255,0.8)"
                  strokeWidth="1"
                />
                <path
                  d="M2.5 3.5V3a2 2 0 014 0v.5"
                  stroke="rgba(122,162,255,0.8)"
                  strokeWidth="1"
                />
              </svg>
              <span className="text-[10px] tracking-[0.04em] text-[rgba(122,162,255,0.35)] font-landing-mono">
                app.kyzen.dev/dashboard
              </span>
            </div>
          </div>

          <div className="flex gap-1.5 shrink-0 opacity-0 pointer-events-none">
            <div className="w-2.5 h-2.5 rounded-full" />
            <div className="w-2.5 h-2.5 rounded-full" />
            <div className="w-2.5 h-2.5 rounded-full" />
          </div>
        </div>

        <div className="relative">
          <img
            src={dashboardHero}
            alt="Kyzen dashboard"
            draggable={false}
            className="w-full block select-none mask-landing-dashboard"
          />
        </div>
      </div>
    </div>
  );
}
