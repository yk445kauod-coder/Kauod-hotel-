"use client";

import LoadingLink from "@/components/layout/loading-link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, UtensilsCrossed, ConciergeBell, Check } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { useUser } from "@/context/user-context";

const featureCards = [
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
  {
    href: "/chat",
    icon: MessageCircle,
    titleKey: "dashboard.chat_card_title",
    descriptionKey: "dashboard.chat_card_desc",
  },
];

const hotelFeatures = [
    "features.room_service",
    "features.free_wifi",
    "features.daily_cleaning",
    "features.cafe",
    "features.restaurant"
];

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useUser();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-64 w-full">
        <Image
          src="https://ik.imagekit.io/iz3ll61i9/IMG-20250718-WA0013.jpg?updatedAt=1752865961674"
          alt="Hotel Room"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white bg-black/50 p-4">
          <h1 className="text-4xl font-bold font-headline tracking-tight text-gold text-shadow-md">
            {user.name ? t('dashboard.welcome_user', { name: user.name }) : t('dashboard.title')}
          </h1>
          <p className="mt-2 max-w-xl text-lg text-white/90 text-shadow">{t('hotel.description')}</p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-center font-headline text-primary mb-8">{t('dashboard.our_services')}</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featureCards.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.href} className="text-center transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg bg-card border-primary/10">
                   <CardHeader className="items-center pt-6">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Icon className="h-7 w-7" />
                    </div>
                    <CardTitle className="font-headline text-primary text-xl">{t(feature.titleKey)}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 pb-6">
                    <CardDescription className="mb-4 h-10">{t(feature.descriptionKey)}</CardDescription>
                    <Button asChild variant="link" className="text-primary font-bold">
                       <LoadingLink href={feature.href}>{t('dashboard.learn_more')}</LoadingLink>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12 bg-muted/50">
         <div className="container mx-auto">
            <h2 className="text-2xl font-bold text-center font-headline text-primary mb-8">{t('dashboard.hotel_features')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {hotelFeatures.map(featureKey => (
                <div key={featureKey} className="flex flex-col items-center text-center">
                   <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary mb-2">
                    <Check className="h-6 w-6"/>
                  </div>
                  <span className="font-medium text-sm text-muted-foreground">{t(featureKey)}</span>
                </div>
              ))}
            </div>
        </div>
      </section>
    </div>
  );
}
