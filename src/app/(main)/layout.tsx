
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/context/user-context";
import { BottomNavBar } from "@/components/layout/bottom-nav-bar";
import { Header } from "@/components/layout/header";
import { DataGate } from "@/components/layout/data-gate";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isLoading, isDataGateOpen, setDataGateOpen } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    if (!isLoading && !user.roomNumber) {
        router.push('/login');
    }
  }, [user, isLoading, router, pathname]);
  
  if (isLoading || !user.roomNumber) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 pb-20">
        {children}
      </main>
      <BottomNavBar />
      <DataGate isOpen={isDataGateOpen} onOpenChange={setDataGateOpen} />
    </div>
  );
}
