import { createContext, ReactNode, useState, useEffect } from "react";

export interface NavigationContextInterface {
  currentPath: string;
  navigate: ((to: string) => void) | undefined;
}

const initialContextValue = {
  currentPath: "/",
  navigate: undefined,
} as const satisfies NavigationContextInterface;

const NavigationContext =
  createContext<NavigationContextInterface>(initialContextValue);

function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentPath, setCurrentPath] = useState<string>(
    window.location.pathname
  );

  useEffect(() => {
    const handler = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handler);

    return () => {
      window.removeEventListener("popstate", handler);
    };
  }, []);

  const navigate = (to: string) => {
    window.history.pushState({}, "", to);
    setCurrentPath(to);
  };

  const value = {
    currentPath,
    navigate,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export { NavigationProvider };
export default NavigationContext;
