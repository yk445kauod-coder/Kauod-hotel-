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
  const { user } = useUser();
  const pathname = usePathname();

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
  
  const showDataGate = !user.roomNumber && (pathname === '/service-request' || pathname === '/menu');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <LanguageModal isOpen={isLanguageModalOpen} onOpenChange={handleLanguageChange} />
      <DataGate />
    </div>
  );
}
