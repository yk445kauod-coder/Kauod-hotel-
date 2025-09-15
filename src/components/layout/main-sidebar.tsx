"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageCircle,
  UtensilsCrossed,
  ConciergeBell,
  Shield,
  Hotel,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "../ui/button";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "nav.dashboard" },
  { href: "/chat", icon: MessageCircle, label: "nav.chat" },
  { href: "/menu", icon: UtensilsCrossed, label: "nav.menu" },
  { href: "/service-request", icon: ConciergeBell, label: "nav.services" },
  { href: "/admin", icon: Shield, label: "nav.admin" },
];

export function MainSidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold font-headline">
          <Hotel className="h-6 w-6 text-primary" />
          <span className="">Kaoud Hotel</span>
        </Link>
      </div>
      <nav className="flex flex-col gap-2 p-2 lg:p-4">
        {navItems.map((item) => (
          <Link href={item.href} key={item.href}>
            <Button
              variant={pathname === item.href ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <item.icon className="me-2 h-4 w-4" />
              {t(item.label)}
            </Button>
          </Link>
        ))}
      </nav>
    </div>
  );
}
