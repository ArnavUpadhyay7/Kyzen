import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/global/Sidebar";
import { XpRewardOverlay } from "../components/dashboard/XpRewardOverlay";
import { DashboardThemeProvider } from "../state/theme/ThemeContext";
import { DevModeProvider } from "../state/devmode/DevModeContext";
import { useDashboardStore } from "../state/dashboard/usedashboardstore";

function DashboardBootstrap() {
  const fetchDashboard = useDashboardStore((s) => s.fetchDashboard);

  useEffect(() => {
    void fetchDashboard();
  }, [fetchDashboard]);

  return null;
}

function ThemedShell() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-dash-page transition-colors duration-300">
      <DashboardBootstrap />
      <XpRewardOverlay />
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto bg-dash-page pt-14 transition-colors duration-300 md:pt-0">
        <Outlet />
      </main>
    </div>
  );
}

export default function DashboardLayout() {
  return (
    <DashboardThemeProvider>
      <DevModeProvider>
        <ThemedShell />
      </DevModeProvider>
    </DashboardThemeProvider>
  );
}
