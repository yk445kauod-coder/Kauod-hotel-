// src/components/layout/language-modal-manager.tsx
"use client";

import { LanguageModal } from "@/components/layout/language-modal";
import { useEffect, useState } from "react";

export function LanguageModalManager() {
  const [isLanguageModalOpen, setLanguageModalOpen] = useState(false);

  useEffect(() => {
    const langSelected = localStorage.getItem('language_selected');
    if (!langSelected) {
      setLanguageModalOpen(true);
    }
  }, []);

  const handleLanguageChange = (isOpen: boolean) => {
    if (!isOpen) {
      localStorage.setItem('language_selected', 'true');
    }
    setLanguageModalOpen(isOpen);
  };
  
  return <LanguageModal isOpen={isLanguageModalOpen} onOpenChange={handleLanguageChange} />;
}
