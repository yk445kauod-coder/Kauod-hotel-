// src/components/layout/page-loader.tsx
"use client";

import { useLoader } from "@/context/loader-context";
import { Loader2 } from "lucide-react";

export function PageLoader() {
  const { isLoading } = useLoader();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-[200]">
      <Loader2 className="h-12 w-12 text-primary animate-spin" />
    </div>
  );
}
