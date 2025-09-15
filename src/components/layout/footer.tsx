"use client";

import { useTranslation } from "@/hooks/use-translation";
import { Copyright, MapPin, Phone, User } from "lucide-react";

export function Footer() {
    const { t } = useTranslation();

    const hotelInfo = {
      name: t('hotel.name'),
      address: t('hotel.location'),
      bookingManager: t('hotel.booking_manager'),
      bookingPhone: "01226424581",
      otherPhones: ["035443800", "035434513", "035431008"],
      internalNumbers: {
        reception: "200",
        roomService: "444",
        laundry: "888",
        maintenance: "990",
        security: "500",
        housekeeping: "666"
      }
    };
    
    const internalNumberTranslations = {
        reception: t('hotel.internal.reception'),
        room_service: t('hotel.internal.room_service'),
        laundry: t('hotel.internal.laundry'),
        maintenance: t('hotel.internal.maintenance'),
        security: t('hotel.internal.security'),
        housekeeping: t('hotel.internal.housekeeping'),
    };

    return (
        <footer className="mt-auto bg-card text-card-foreground no-print border-t border-primary/20">
            <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-12 md:grid-cols-2 lg:grid-cols-4">
                <div>
                    <h3 className="font-headline text-lg font-semibold text-primary">{hotelInfo.name}</h3>
                     <div className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 shrink-0 mt-1 text-accent" />
                        <span>{hotelInfo.address}</span>
                    </div>
                </div>
                <div>
                    <h3 className="font-headline text-lg font-semibold text-primary">{t('footer.booking')}</h3>
                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4 text-accent" />
                        <span>{hotelInfo.bookingManager}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4 text-accent" />
                        <a href={`tel:${hotelInfo.bookingPhone}`} className="hover:text-primary">{hotelInfo.bookingPhone}</a>
                    </div>
                </div>
                <div>
                    <h3 className="font-headline text-lg font-semibold text-primary">{t('footer.contact_details')}</h3>
                    <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground">
                       {hotelInfo.otherPhones.map(phone => (
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
                        <span>{internalNumberTranslations.reception}: {hotelInfo.internalNumbers.reception}</span>
                        <span>{internalNumberTranslations.room_service}: {hotelInfo.internalNumbers.roomService}</span>
                        <span>{internalNumberTranslations.laundry}: {hotelInfo.internalNumbers.laundry}</span>
                        <span>{internalNumberTranslations.maintenance}: {hotelInfo.internalNumbers.maintenance}</span>
                        <span>{internalNumberTranslations.security}: {hotelInfo.internalNumbers.security}</span>
                        <span>{internalNumberTranslations.housekeeping}: {hotelInfo.internalNumbers.housekeeping}</span>
                    </div>
                </div>
            </div>
            <div className="border-t border-primary/20">
                <div className="container mx-auto flex items-center justify-center px-4 py-4 text-sm text-muted-foreground">
                    <Copyright className="me-2 h-4 w-4" />
                    <span>{new Date().getFullYear()} {hotelInfo.name}. {t('footer.rights')}</span>
                </div>
            </div>
        </footer>
    );
}
