import { Outlet } from "react-router-dom";
import Sidebar from "../components/global/Sidebar";

export default function DashboardLayout() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
      `}</style>

      <div
        className="flex h-screen w-full overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #06031a 0%, #080520 50%, #050215 100%)",
        }}
      >
        {/* Ambient background layers */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div
            className="absolute"
            style={{
              top: "20%",
              left: "25%",
              width: 600,
              height: 400,
              background: "radial-gradient(ellipse, rgba(109,40,217,0.07) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: "10%",
              right: "15%",
              width: 400,
              height: 300,
              background: "radial-gradient(ellipse, rgba(139,92,246,0.05) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
          />
        </div>

        <Sidebar />

        {/* Main content — takes remaining width on desktop, full width on mobile */}
        <main className="flex-1 overflow-y-auto relative z-10 flex flex-col min-w-0 md:pt-0 pt-16">
          <Outlet />
        </main>
      </div>
    </>
  );
} 