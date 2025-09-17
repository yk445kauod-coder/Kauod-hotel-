
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { useLanguage } from '@/hooks/use-language';

export default function AboutPage() {
  const { t } = useTranslation();
  const { language } = useLanguage();

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary">{t('about.title')}</CardTitle>
          <CardDescription>{t('hotel.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-accent mb-2">{t('dashboard.hotel_features')}</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>{t('features.room_service')}</li>
                    <li>{t('features.free_wifi')}</li>
                    <li>{t('features.daily_cleaning')}</li>
                    <li>{t('features.cafe')}</li>
                    <li>{t('features.restaurant')}</li>
                </ul>
            </div>
          
            <div>
                 <h3 className="text-xl font-semibold text-accent mb-2">{t('footer.contact_details')}</h3>
                 <p className="text-muted-foreground">
                    {t('footer.booking')}: {t('hotel.booking_manager')} - 01226424581
                 </p>
                  <p className="text-muted-foreground">
                    {t('footer.other_phones')}: 035443800, 035434513, 035431008
                 </p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
