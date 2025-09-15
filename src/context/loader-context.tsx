// src/context/loader-context.tsx
"use client";

import { usePathname } from "next/navigation";
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";

interface LoaderContextType {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const LoaderProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Hide the loader whenever the pathname changes.
    setIsLoading(false);
  }, [pathname]);

  return (
    <LoaderContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => {
  const context = useContext(LoaderContext);
  if (!context) {
    throw new Error("useLoader must be used within a LoaderProvider");
  }
  return context;
};
