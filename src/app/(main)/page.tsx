"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageCircle, UtensilsCrossed, ConciergeBell } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

const featureCards = [
  {
    href: "/chat",
    icon: MessageCircle,
    titleKey: "dashboard.chat_card_title",
    descriptionKey: "dashboard.chat_card_desc",
  },
  {
    href: "/menu",
    icon: UtensilsCrossed,
    titleKey: "dashboard.menu_card_title",
    descriptionKey: "dashboard.menu_card_desc",
  },
  {
    href: "/service-request",
    icon: ConciergeBell,
    titleKey: "dashboard.services_card_title",
    descriptionKey: "dashboard.services_card_desc",
  },
];

export default function DashboardPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <div className="py-4">
        <h1 className="text-3xl font-bold font-headline tracking-tight">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground">{t('dashboard.subtitle')}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {featureCards.map((feature) => (
          <Link href={feature.href} key={feature.href} passHref>
            <Card className="h-full transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="font-headline">{t(feature.titleKey)}</CardTitle>
                <CardDescription>{t(feature.descriptionKey)}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
