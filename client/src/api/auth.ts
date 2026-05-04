import api from "../lib/axios";

// ── Types ─────────────────────────────────────────────────────

export interface SignupData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  provider: string;
  xp: number;
  level: number;
  streak: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: AuthUser;
}

export const authApi = {
  signup: (data: SignupData) =>
    api.post<AuthResponse>("/api/auth/signup", data),

  login: (data: LoginData) =>
    api.post<AuthResponse>("/api/auth/login", data),

  logout: () =>
    api.post<{ message: string }>("/api/auth/logout"),

  signout: () =>
    api.delete<{ message: string }>("/api/auth/signout"),
};