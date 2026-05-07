import { Outlet } from "react-router-dom";
import Sidebar from "../components/global/Sidebar";
import { DashboardThemeProvider, useTokens } from "../state/theme/ThemeContext";
import { DevModeProvider } from "../state/devmode/DevModeContext";

function ThemedShell() {
  const t = useTokens();
  return (
    <div
      className="flex h-screen w-full overflow-hidden transition-colors duration-300"
      style={{ background: t.page }}
    >
      <Sidebar />
      <main
        className="flex-1 overflow-y-auto flex flex-col min-w-0 md:pt-0 pt-14 transition-colors duration-300"
        style={{ background: t.page }}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default function DashboardLayout() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
      `}</style>
      <DashboardThemeProvider>
        <DevModeProvider>
          <ThemedShell />
        </DevModeProvider>
      </DashboardThemeProvider>
    </>
  );
}