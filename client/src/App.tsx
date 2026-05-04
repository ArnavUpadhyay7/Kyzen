import './App.css'
import { Routes, Route } from "react-router-dom";
import Landing from './pages/Landing'
import Signup from './pages/Signup';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import Profile from './pages/dashboard/Profile';
import { Toaster } from "./components/ui/Toast";

function App() {
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="quests" element={<DashboardHome />} />
          <Route path="journal" element={<DashboardHome />} />
          <Route path="leaderboard" element={<DashboardHome />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<DashboardHome />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App