import { useState, useEffect } from "react";
import api from "../lib/axios";
import type { AuthUser } from "../api/auth";

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  useEffect(() => {
    api
      .get<{ user: AuthUser }>("/api/auth/me")
      .then((res) => setState({ user: res.data.user, loading: false }))
      .catch(() => setState({ user: null, loading: false }));
  }, []);

  return state;
}