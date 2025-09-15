
"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LanguageModal } from "@/components/layout/language-modal";
import { DataGate } from "@/components/layout/data-gate";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/user-context";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLanguageModalOpen, setLanguageModalOpen] = useState(false);
  const { user, isDataGateOpen, setDataGateOpen } = useUser();
  const pathname = usePathname();

  useEffect(() => {
    const langSelected = localStorage.getItem('language_selected');
    if (!langSelected) {
      setLanguageModalOpen(true);
    }
  }, []);

  useEffect(() => {
    if (isDataGateOpen) return; // Don't check for protected routes if the gate is already open

    const protectedRoutes = ['/service-request', '/menu'];
    if (!user.roomNumber && protectedRoutes.includes(pathname)) {
        setDataGateOpen(true);
    }
  }, [pathname, user.roomNumber, setDataGateOpen, isDataGateOpen]);

  const handleLanguageChange = (isOpen: boolean) => {
    if (!isOpen) {
      localStorage.setItem('language_selected', 'true');
    }
    setLanguageModalOpen(isOpen);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <LanguageModal isOpen={isLanguageModalOpen} onOpenChange={handleLanguageChange} />
      <DataGate isOpen={isDataGateOpen} onOpenChange={setDataGateOpen} />
    </div>
  );
}
