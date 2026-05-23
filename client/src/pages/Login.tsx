import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { authApi } from "../api/auth";
import { toast } from "../components/ui/Toast";
import { useAuth } from "../state/auth/AuthContext";
import { DashboardButton, DashboardInput } from "../components/dashboard/ui";
import { cn } from "../lib/utils";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.login({
        email: form.email.trim(),
        password: form.password,
      });
      setUser(res.data.user);
      toast("Welcome back! 👋", "success");
      navigate("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message ?? "Login failed. Please try again.";
        setError(message);
        toast(message, "error");
      } else {
        setError("Something went wrong. Please try again.");
        toast("Something went wrong. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-theme="dark" className="flex min-h-screen w-full bg-dash-page">
      <div className="relative m-4 hidden overflow-hidden rounded-2xl lg:flex lg:w-[45%]">
        <div className="absolute inset-0 bg-dash-page" />
        <div className="absolute top-0 left-0 h-[65%] w-full bg-[radial-gradient(ellipse_80%_70%_at_40%_10%,#7c3aed_0%,#4c1d95_40%,transparent_75%)]" />
        <div className="auth-noise-overlay absolute inset-0 opacity-30" />
        <div className="relative z-10 flex w-full flex-col justify-end p-10 pb-14">
          <div className="mb-8 flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-dash-primary/80">
              <div className="h-2 w-2 rounded-full bg-dash-primary/80" />
            </div>
            <span className="font-dash-sans text-sm font-medium tracking-wide text-dash-secondary">
              OnlyPipe
            </span>
          </div>
          <h1 className="mb-3 font-dash-sans text-4xl leading-tight font-semibold text-dash-primary">
            Welcome
            <br />
            Back
          </h1>
          <p className="mb-10 font-dash-sans text-sm leading-relaxed text-dash-muted">
            Sign in to continue where
            <br />
            you left off.
          </p>
          <div className="flex flex-col gap-3">
            {[
              { n: 1, label: "Sign up your account" },
              { n: 2, label: "Set up your workspace" },
              { n: 3, label: "Set up your profile" },
            ].map((step) => (
              <div
                key={step.n}
                className="flex items-center gap-3 rounded-xl bg-dash-muted-btn px-4 py-3 text-dash-muted"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-dash-muted-btn-hover text-xs font-semibold text-dash-muted">
                  {step.n}
                </span>
                <span className="font-dash-sans text-sm font-medium">{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h2 className="mb-1 text-center font-dash-sans text-2xl font-semibold text-dash-primary">
            Login to Account
          </h2>
          <p className="mb-7 text-center font-dash-sans text-sm text-dash-muted">
            Enter your credentials to access your account.
          </p>

          <div className="mb-6 flex gap-3">
            <DashboardButton variant="muted" className="flex-1 rounded-xl py-3 text-sm">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </DashboardButton>
            <DashboardButton variant="muted" className="flex-1 rounded-xl py-3 text-sm">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.14 3 .4 2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Github
            </DashboardButton>
          </div>

          <div className="mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-dash-border" />
            <span className="font-dash-sans text-xs text-dash-faint">Or</span>
            <div className="h-px flex-1 bg-dash-border" />
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label className="mb-1.5 block font-dash-sans text-xs text-dash-muted">Email</label>
              <DashboardInput
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="eg. johnfrans@gmail.com"
                className="rounded-xl px-4 py-3"
              />
            </div>

            <div className="mb-2">
              <div className="mb-1.5 flex items-center justify-between">
                <label className="font-dash-sans text-xs text-dash-muted">Password</label>
                <button
                  type="button"
                  className="font-dash-sans text-xs text-dash-faint transition-colors hover:text-dash-secondary"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <DashboardInput
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="rounded-xl px-4 py-3 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-dash-faint transition-colors hover:text-dash-muted"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <p className="mb-6 font-dash-sans text-xs text-dash-faint">Must be at least 8 characters.</p>

            {error && (
              <p className="mb-4 text-center font-dash-sans text-xs text-dash-danger">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full rounded-xl bg-dash-primary py-3.5 font-dash-sans text-sm font-semibold text-dash-page",
                "transition-colors hover:brightness-90 disabled:opacity-60",
              )}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="mt-5 text-center font-dash-sans text-sm text-dash-faint">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="cursor-pointer font-medium text-dash-primary transition-all hover:underline"
            >
              Create an account for free →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
