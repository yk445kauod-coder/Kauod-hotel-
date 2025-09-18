
"use client";

import LoadingLink from "@/components/layout/loading-link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Languages, LogOut, User, Menu } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { useTranslation } from "@/hooks/use-translation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/context/user-context";

export function Header() {
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const { user, logout, setDataGateOpen } = useUser();
  
  const handleLogout = () => {
    logout();
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm no-print">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <LoadingLink href="/" className="flex items-center gap-3">
          <Image src="https://ik.imagekit.io/iz3ll61i9/IMG-20250718-WA0019.jpg" alt="Kaoud Hotel Logo" width={40} height={40} className="rounded-full" />
          <span className="text-lg font-bold font-headline text-primary">{t('hotel.name')}</span>
        </LoadingLink>

        <div className="flex items-center gap-1">
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

           {user?.roomNumber && (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <User className="h-5 w-5" />
                        <span className="sr-only">User Menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem disabled>
                       {t('data_gate.room')}: {user.roomNumber}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setDataGateOpen(true)}>
                        <User className="mr-2 h-4 w-4" />
                        <span>{t('data_gate.edit_data')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>{t('data_gate.logout')}</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
           )}
        </div>
      </div>
    </header>
  );
}
