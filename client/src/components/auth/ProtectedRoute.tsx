import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

// Spinner shown while session is being verified
function AuthSpinner() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#0c0c0f" }}
    >
      <div
        className="w-6 h-6 rounded-full border-2 border-white/10 border-t-[#6366f1] animate-spin"
      />
    </div>
  );
}

/**
 * Wrap dashboard routes — redirects to /login if no valid session.
 */
export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <AuthSpinner />;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}

/**
 * Wrap auth pages (/login, /signup) — redirects to /dashboard if already logged in.
 */
export function PublicRoute() {
  const { user, loading } = useAuth();

  if (loading) return <AuthSpinner />;
  if (user) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}