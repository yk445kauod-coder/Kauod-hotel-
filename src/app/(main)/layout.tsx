
"use client";

import { LanguageModal } from "@/components/layout/language-modal";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import { BottomNavBar } from "@/components/layout/bottom-nav-bar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLanguageModalOpen, setLanguageModalOpen] = useState(false);
  const { user, isLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const langSelected = localStorage.getItem('language_selected');
    if (!langSelected) {
      setLanguageModalOpen(true);
    }
  }, []);
  
  useEffect(() => {
    if (!isLoading && !user.roomNumber) {
        router.push('/login');
    }
  }, [user, isLoading, router, pathname]);

  const handleLanguageChange = (isOpen: boolean) => {
    if (!isOpen) {
      localStorage.setItem('language_selected', 'true');
    }
    setLanguageModalOpen(isOpen);
  };
  
  if (isLoading || !user.roomNumber) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 pb-20">
        {children}
      </main>
      <BottomNavBar />
      <LanguageModal isOpen={isLanguageModalOpen} onOpenChange={handleLanguageChange} />
    </div>
  );
}
