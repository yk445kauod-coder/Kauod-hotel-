"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageCircle,
  UtensilsCrossed,
  ConciergeBell,
  Shield,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { Button } from "../ui/button";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "nav.dashboard" },
  { href: "/menu", icon: UtensilsCrossed, label: "nav.menu" },
  { href: "/service-request", icon: ConciergeBell, label: "nav.services" },
  { href: "/chat", icon: MessageCircle, label: "nav.chat" },
  { href: "/about", icon: Info, label: "nav.about" },
];

export function MainSidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-20 items-center border-b px-4 lg:px-6">
        <Link href="/" className="flex items-center gap-3 font-semibold font-headline">
          <Image src="https://ik.imagekit.io/iz3ll61i9/IMG-20250718-WA0019.jpg" alt="Kaoud Hotel Logo" width={40} height={40} className="rounded-full" />
          <span className="text-lg">{t('hotel.name')}</span>
        </Link>
      </div>
      <nav className="flex flex-col gap-2 p-4">
        {navItems.map((item) => (
           <Link href={item.href} key={item.href} passHref>
            <Button
              variant={pathname.startsWith(item.href) ? "secondary" : "ghost"}
              className="w-full justify-start text-base py-6"
              asChild={pathname.startsWith(item.href)}
            >
              <a>
                <item.icon className="me-3 h-5 w-5" />
                {t(item.label)}
              </a>
            </Button>
          </Link>
        ))}
      </nav>
    </div>
  );
}
