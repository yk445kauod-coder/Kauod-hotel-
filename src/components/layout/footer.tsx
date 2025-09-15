import { useTranslation } from "@/hooks/use-translation";
import { Copyright, Gem, MapPin, Phone, Mail, User, Clock } from "lucide-react";
import Link from 'next/link';

export function Footer() {
    const { t } = useTranslation();

    const hotelConfig = {
      name: t('hotel.name'),
      stars: t('hotel.stars'),
      address: t('hotel.address'),
      contact: {
        bookingManager: t('hotel.bookingManager'),
        bookingPhone: "01226424581",
        additionalPhones: ["035443800", "035434513", "035431008"]
      },
       internalNumbers: {
        reception: "200", roomService: "444", laundry: "888", 
        maintenance: "990", security: "500", housekeeping: "666"
      },
    };

    return (
        <footer className="mt-auto bg-card text-card-foreground no-print border-t border-primary/20">
            <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-12 md:grid-cols-2 lg:grid-cols-4">
                <div>
                    <h3 className="font-headline text-lg font-semibold text-primary">{hotelConfig.name}</h3>
                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                        <Gem className="h-4 w-4 text-accent" />
                        <span>{hotelConfig.stars}</span>
                    </div>
                     <div className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 shrink-0 mt-1 text-accent" />
                        <span>{hotelConfig.address}</span>
                    </div>
                </div>
                <div>
                    <h3 className="font-headline text-lg font-semibold text-primary">{t('footer.booking')}</h3>
                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4 text-accent" />
                        <span>{hotelConfig.contact.bookingManager}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4 text-accent" />
                        <a href={`tel:${hotelConfig.contact.bookingPhone}`} className="hover:text-primary">{hotelConfig.contact.bookingPhone}</a>
                    </div>
                </div>
                <div>
                    <h3 className="font-headline text-lg font-semibold text-primary">{t('footer.contact_details')}</h3>
                    <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
                       {hotelConfig.contact.additionalPhones.map(phone => (
                         <div key={phone} className="flex items-center gap-2">
                           <Phone className="h-4 w-4 text-accent" />
                           <a href={`tel:${phone}`} className="hover:text-primary">{phone}</a>
                         </div>
                       ))}
                    </div>
                </div>
                 <div>
                    <h3 className="font-headline text-lg font-semibold text-primary">{t('footer.internal_numbers')}</h3>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                        <span>{t('hotel.internal.reception')}: {hotelConfig.internalNumbers.reception}</span>
                        <span>{t('hotel.internal.roomService')}: {hotelConfig.internalNumbers.roomService}</span>
                        <span>{t('hotel.internal.laundry')}: {hotelConfig.internalNumbers.laundry}</span>
                        <span>{t('hotel.internal.maintenance')}: {hotelConfig.internalNumbers.maintenance}</span>
                        <span>{t('hotel.internal.security')}: {hotelConfig.internalNumbers.security}</span>
                        <span>{t('hotel.internal.housekeeping')}: {hotelConfig.internalNumbers.housekeeping}</span>
                    </div>
                </div>
            </div>
            <div className="border-t border-primary/20">
                <div className="container mx-auto flex items-center justify-center px-4 py-4 text-sm text-muted-foreground">
                    <Copyright className="me-2 h-4 w-4" />
                    <span>{new Date().getFullYear()} {hotelConfig.name}. {t('footer.rights')}</span>
                </div>
            </div>
        </footer>
    );
}
