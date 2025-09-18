
"use client";

import LoadingLink from "@/components/layout/loading-link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageCircle,
  UtensilsCrossed,
  ConciergeBell,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/use-translation";
import { useLanguage } from "@/hooks/use-language";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "nav.dashboard" },
  { href: "/menu", icon: UtensilsCrossed, label: "nav.menu" },
  { href: "/service-request", icon: ConciergeBell, label: "nav.services" },
  { href: "/chat", icon: MessageCircle, label: "nav.chat" },
  { href: "/about", icon: Info, label: "nav.about" },
];

export function BottomNavBar() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { language } = useLanguage();

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border shadow-t-lg">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <LoadingLink
              key={item.href}
              href={item.href}
              className={cn(
                "inline-flex flex-col items-center justify-center px-5 hover:bg-muted group transition-colors duration-200",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">
                {t(item.label)}
              </span>
            </LoadingLink>
          );
        })}
      </div>
    </div>
  );
}
