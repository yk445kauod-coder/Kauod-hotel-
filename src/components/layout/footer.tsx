import { getHotelInfoAction } from "@/actions";
import { parseHotelInfo } from "@/lib/utils";
import { Copyright, Gem, MapPin, Phone } from "lucide-react";

export async function Footer() {
    const hotelInfoResult = await getHotelInfoAction();
    const hotelInfo = hotelInfoResult.success ? parseHotelInfo(hotelInfoResult.data) : {};

    const hotelName = hotelInfo.hotelname || 'Kaoud Hotel';
    const starRating = hotelInfo.starrating || '5 stars';
    const address = hotelInfo.address || '123 Luxury Lane, Cairo, Egypt';
    const contact = hotelInfo.contact || 'reservations@kaoudhotel.com';

    return (
        <footer className="mt-auto border-t bg-card/50 text-card-foreground no-print">
            <div className="container mx-auto grid grid-cols-1 gap-8 px-4 py-8 md:grid-cols-2 lg:grid-cols-4">
                <div>
                    <h3 className="font-headline text-lg font-semibold">{hotelName}</h3>
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <Gem className="h-4 w-4 text-accent" />
                        <span>{starRating}</span>
                    </div>
                </div>
                <div>
                    <h3 className="font-headline text-lg font-semibold">Location</h3>
                    <div className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 shrink-0 mt-1 text-accent" />
                        <span>{address}</span>
                    </div>
                </div>
                <div>
                    <h3 className="font-headline text-lg font-semibold">Contact Us</h3>
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4 text-accent" />
                        <a href={`mailto:${contact}`} className="hover:text-foreground">{contact}</a>
                    </div>
                </div>
            </div>
            <div className="border-t">
                <div className="container mx-auto flex items-center justify-center px-4 py-4 text-sm text-muted-foreground">
                    <Copyright className="me-2 h-4 w-4" />
                    <span>{new Date().getFullYear()} {hotelName}. All rights reserved.</span>
                </div>
            </div>
        </footer>
    );
}
