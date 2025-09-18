
"use server";

import { chatbotAssistance } from '@/ai/flows/chatbot-assistance';
import { generateServiceRecommendations } from '@/ai/flows/personalized-service-recommendations';
import { revalidatePath } from 'next/cache';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, serverTimestamp } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyApgrwfyrVJYsihy9tUwPfazdNYZPqWbow",
    authDomain: "kaoud-hotel.firebaseapp.com",
    databaseURL: "https://kaoud-hotel-default-rtdb.firebaseio.com",
    projectId: "kaoud-hotel",
    storageBucket: "kaoud-hotel.appspot.com",
    messagingSenderId: "77309702077",
    appId: "1:77309702077:web:1eee14c06204def2eb6cd4"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const hotelInfoString = `
- Name: Kaoud Hotel (فندق قاعود)
- Stars: Three Stars (ثلاث نجوم)
- Address: 133 El Geish Road, Sporting, Alexandria, Egypt (133 طريق الجيش، سبورتنج، الإسكندرية، مصر)
- Booking Manager: Mr. Mohamed Magdy (أ/محمد مجدي)
- Booking Phone: 01226424581
- Other Phones: 035443800, 035434513, 035431008
- Internal Numbers: Reception: 200, Room Service: 444, Laundry: 888, Maintenance: 990, Security: 500, Housekeeping: 666
`;

export async function getHotelInfoAction() {
    try {
        return { success: true, data: hotelInfoString };
    } catch (error) {
        console.error("Error fetching hotel info:", error);
        return { success: false, error: "Failed to fetch hotel information." };
    }
}

export async function chatbotAction(history: any, query: string) {
    try {
        const res = await chatbotAssistance({ query });
        return { success: true, response: res.response };
    } catch (error) {
        console.error("Chatbot action error:", error);
        return { success: false, error: "Sorry, I couldn't process that. Please try again." };
    }
}

export async function submitServiceRequestAction(formData: FormData) {
    const rawFormData = {
        roomNumber: formData.get('roomNumber') as string,
        guestName: formData.get('guestName') as string,
        guestPhone: formData.get('guestPhone') as string,
        guestMessage: formData.get('guestMessage') as string,
        rating: formData.get('rating') ? parseInt(formData.get('rating') as string) : null,
        type: formData.get('type') as 'Food Order' | 'Service Request' | null,
        total: formData.get('total') ? parseFloat(formData.get('total') as string) : null,
    };
    
    const { roomNumber, guestName, guestPhone, guestMessage, rating, type, total } = rawFormData;

    if (!roomNumber || !guestMessage) {
        return { success: false, error: "Room number and message are required." };
    }

    try {
        const commentsRef = ref(db, `rooms/room_${roomNumber}/comments`);
        
        await push(commentsRef, { 
            text: guestMessage,
            timestamp: serverTimestamp(),
            rating: rating || null,
            type: type || 'Service Request',
            total: total || null,
            guestName: guestName,
            guestPhone: guestPhone
        });

        if (type !== 'Food Order') {
            try {
                const recommendations = await generateServiceRecommendations({
                    guestRequest: guestMessage,
                    hotelDetails: hotelInfoString,
                });
                return { success: true, recommendations: recommendations.recommendations };
            } catch (error) {
                console.error("Error generating recommendations:", error);
                return { success: true, recommendations: [] }; 
            }
        }

        return { success: true, recommendations: [] };

    } catch (error) {
        console.error("Firebase push error:", error);
        return { success: false, error: "Failed to submit request to the database." };
    }
}

    