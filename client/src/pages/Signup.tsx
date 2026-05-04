import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { authApi } from "../api/auth";
import { toast } from "../components/ui/Toast";

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!form.username || !form.email || !form.password) {
      setError("All fields are required.");
      return;
    }
    if (form.username.trim().length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      await authApi.signup({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      toast("Account created! Welcome aboard 🎉", "success");
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message ?? "Sign up failed. Please try again.";
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
    <div className="min-h-screen w-full flex bg-black">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden rounded-2xl m-4">
        <div className="absolute inset-0 bg-black" />
        <div
          className="absolute top-0 left-0 w-full h-[65%]"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 40% 10%, #7c3aed 0%, #4c1d95 40%, transparent 75%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />
        <div className="relative z-10 flex flex-col justify-end p-10 pb-14 w-full">
          <div className="mb-8 flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border-2 border-white/80 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white/80" />
            </div>
            <span className="text-white/80 text-sm font-medium tracking-wide">OnlyPipe</span>
          </div>
          <h1 className="text-white text-4xl font-semibold leading-tight mb-3">
            Get Started<br />with Us
          </h1>
          <p className="text-white/50 text-sm leading-relaxed mb-10">
            Complete these easy steps to register<br />your account.
          </p>
          <div className="flex flex-col gap-3">
            {[
              { n: 1, label: "Sign up your account", active: true },
              { n: 2, label: "Set up your workspace", active: false },
              { n: 3, label: "Set up your profile", active: false },
            ].map((step) => (
              <div
                key={step.n}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${
                  step.active ? "bg-white text-black" : "bg-white/10 text-white/60"
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full text-xs font-semibold flex items-center justify-center shrink-0 ${
                    step.active ? "bg-black text-white" : "bg-white/20 text-white/60"
                  }`}
                >
                  {step.n}
                </span>
                <span className="text-sm font-medium">{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h2 className="text-white text-2xl font-semibold text-center mb-1">Sign Up Account</h2>
          <p className="text-white/40 text-sm text-center mb-7">
            Enter your personal data to create your account.
          </p>

          <div className="flex gap-3 mb-6">
            <button className="flex-1 flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#222] border border-white/10 text-white text-sm font-medium rounded-xl py-3 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-[#1a1a1a] hover:bg-[#222] border border-white/10 text-white text-sm font-medium rounded-xl py-3 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.14 3 .4 2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Github
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-xs">Or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label className="block text-white/60 text-xs mb-1.5">Username</label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="eg. john99"
                className="w-full bg-[#1a1a1a] border border-white/10 text-white text-sm rounded-xl px-4 py-3 placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-white/60 text-xs mb-1.5">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="eg. johnfrans@gmail.com"
              className="w-full bg-[#1a1a1a] border border-white/10 text-white text-sm rounded-xl px-4 py-3 placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <div className="mb-2">
            <label className="block text-white/60 text-xs mb-1.5">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full bg-[#1a1a1a] border border-white/10 text-white text-sm rounded-xl px-4 py-3 pr-11 placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <p className="text-white/30 text-xs mb-6">Must be at least 8 characters.</p>

          {error && <p className="text-red-400 text-xs mb-4 text-center">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-white hover:bg-white/90 text-black text-sm font-semibold rounded-xl py-3.5 transition-colors disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          <p className="text-white/30 text-sm text-center mt-5">
            Already have an account?{" "}
            <Link to="/login" className="text-white font-medium hover:underline transition-all cursor-pointer">
              Log in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}