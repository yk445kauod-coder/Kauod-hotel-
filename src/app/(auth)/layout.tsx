"use client";

import { LanguageModal } from "@/components/layout/language-modal";
import { useUser } from "@/context/user-context";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthLayout({
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
    if (!isLoading && user.roomNumber && pathname === '/login') {
        router.push('/dashboard');
    }
  }, [user, isLoading, router, pathname]);

  const handleLanguageChange = (isOpen: boolean) => {
    if (!isOpen) {
      localStorage.setItem('language_selected', 'true');
    }
    setLanguageModalOpen(isOpen);
  };
  
  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <>
      {children}
      <LanguageModal isOpen={isLanguageModalOpen} onOpenChange={handleLanguageChange} />
    </>
  );
}
