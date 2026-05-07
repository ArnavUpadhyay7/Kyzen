import { createContext, useContext, type ReactNode } from "react";
import { useAuth } from "../auth/AuthContext";
import api from "../../lib/axios";

interface DevModeContextValue {
  isUnlocked: boolean;
  unlock: () => Promise<void>;
}

const DevModeContext = createContext<DevModeContextValue>({
  isUnlocked: false,
  unlock: async () => {},
});

export function DevModeProvider({ children }: { children: ReactNode }) {
  const { user, setUser } = useAuth();

  const isUnlocked = user?.devMode ?? false;

  const unlock = async () => {
    try {
      await api.patch("/user/preferences", { devMode: true });
      if (user) setUser({ ...user, devMode: true });
    } catch (err) {
      console.error("[DevMode] Failed to unlock:", err);
    }
  };

  return (
    <DevModeContext.Provider value={{ isUnlocked, unlock }}>
      {children}
    </DevModeContext.Provider>
  );
}

export function useDevMode() {
  return useContext(DevModeContext);
}