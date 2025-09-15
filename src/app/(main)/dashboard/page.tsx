"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, UtensilsCrossed, ConciergeBell, Check, MapPin, Phone } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

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

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full">
        <Image
          src="https://ik.imagekit.io/iz3ll61i9/IMG-20250718-WA0013.jpg?updatedAt=1752865961674"
          alt="Hotel Room"
          fill
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white bg-black/40 p-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight text-gold">{t('hotel.name')}</h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-light-gold">{t('hotel.description')}</p>
          <Button asChild size="lg" className="mt-8 bg-gold text-dark-brown hover:bg-light-gold">
            <Link href="/service-request">{t('dashboard.book_now')}</Link>
          </Button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center font-headline text-primary mb-2">{t('dashboard.our_services')}</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">{t('dashboard.services_subtitle')}</p>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featureCards.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.href} className="text-center transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl border-primary/20">
                   <CardHeader className="items-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-gold">
                      <Icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="font-headline text-primary">{t(feature.titleKey)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{t(feature.descriptionKey)}</CardDescription>
                    <Button asChild variant="link" className="mt-4 text-primary">
                       <Link href={feature.href}>{t('dashboard.learn_more')}</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-card">
         <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center font-headline text-primary mb-12">{t('dashboard.hotel_features')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {hotelFeatures.map(featureKey => (
                <div key={featureKey} className="flex flex-col items-center text-center">
                   <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-700 mb-3">
                    <Check className="h-6 w-6"/>
                  </div>
                  <span className="font-medium text-muted-foreground">{t(featureKey)}</span>
                </div>
              ))}
            </div>
        </div>
      </section>
    </div>
  );
}
