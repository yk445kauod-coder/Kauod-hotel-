"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Languages, Menu } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useTranslation } from "@/hooks/use-translation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MainSidebar } from "./main-sidebar";

export function Header() {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();

  const navItems = [
    { href: "/dashboard", label: "nav.dashboard" },
    { href: "/menu", label: "nav.menu" },
    { href: "/service-request", label: "nav.services" },
    { href: "/chat", label: "nav.chat" },
    { href: "/admin", label: "nav.admin" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur-sm">
      <div className="container mx-auto flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="https://ik.imagekit.io/iz3ll61i9/IMG-20250718-WA0019.jpg" alt="Kaoud Hotel Logo" width={50} height={50} className="rounded-full" />
          <span className="text-xl font-bold font-headline text-primary">{t('hotel.name')}</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link href={item.href} key={item.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              {t(item.label)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Languages className="h-5 w-5" />
                <span className="sr-only">Change language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage('ar')} disabled={language === 'ar'}>
                {t('language.arabic')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('en')} disabled={language === 'en'}>
                {t('language.english')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">{t('nav.toggle')}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <SheetDescription className="sr-only">Hotel navigation menu</SheetDescription>
                <MainSidebar />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
