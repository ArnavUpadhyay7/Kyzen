import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../state/auth/AuthContext";

function AuthSpinner() {
  return (
    <div data-theme="dark" className="flex min-h-screen items-center justify-center bg-dash-page">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-dash-border border-t-dash-accent" />
    </div>
  );
}

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <AuthSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function PublicRoute() {
  const { user, loading } = useAuth();
  if (loading) return <AuthSpinner />;
  if (user) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
