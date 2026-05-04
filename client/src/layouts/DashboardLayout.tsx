import { Outlet } from "react-router-dom";
import Sidebar from "../components/global/Sidebar";

export default function DashboardLayout() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
      `}</style>

      <div
        className="flex h-screen w-full overflow-hidden"
        style={{ background: "#0B0B0F" }}
      >
        <Sidebar />
        <main className="flex-1 overflow-y-auto flex flex-col min-w-0 md:pt-0 pt-14">
          <Outlet />
        </main>
      </div>
    </>
  );
}