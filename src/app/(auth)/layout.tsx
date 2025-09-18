"use client";

import { useUser } from "@/context/user-context";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    if (!isLoading && user.roomNumber && pathname === '/login') {
        router.push('/dashboard');
    }
  }, [user, isLoading, router, pathname]);
  
  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <>
      {children}
    </>
  );
}
