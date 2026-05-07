import { createContext, useContext, useState, type ReactNode } from "react";

const STORAGE_KEY = "kyzen-dev-mode-unlocked";

interface DevModeContextValue {
  isUnlocked: boolean;
  unlock: () => void;
}

const DevModeContext = createContext<DevModeContextValue>({
  isUnlocked: false,
  unlock: () => {},
});

export function DevModeProvider({ children }: { children: ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(
    () => localStorage.getItem(STORAGE_KEY) === "true"
  );

  const unlock = () => {
    setIsUnlocked(true);
    localStorage.setItem(STORAGE_KEY, "true");
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