import './App.css'
import { Routes, Route } from "react-router-dom";
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import Profile from './pages/dashboard/Profile';
import { Toaster } from "./components/ui/Toast";
import { ProtectedRoute, PublicRoute } from "./components/auth/ProtectedRoute";
import Settings from './pages/dashboard/Settings';
import DevDashboard from './pages/dashboard/DevDashboard';
import Workspace from './pages/dashboard/Workspace';

function App() {
  return (
    <div>
      <Toaster />
      <Routes>
        {/* Public landing — always accessible */}
        <Route path="/" element={<Landing />} />

        {/* Auth pages — redirect to dashboard if already logged in */}
        <Route element={<PublicRoute />}>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login"  element={<Login />} />
        </Route>

        {/* Dashboard — redirect to login if not authenticated */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index                element={<DashboardHome />} />
            <Route path="quests"        element={<DashboardHome />} />
            <Route path="workspace"       element={<Workspace />} />
            <Route path="leaderboard"   element={<DashboardHome />} />
            <Route path="profile"       element={<Profile />} />
            <Route path="settings"      element={<Settings />} />
            <Route path="dev"           element={<DevDashboard />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;