"use server";

import { chatbotAssistance } from '@/ai/flows/chatbot-assistance';
import { generateServiceRecommendations } from '@/ai/flows/personalized-service-recommendations';
import { revalidatePath } from 'next/cache';

// In-memory store for demonstration purposes
let serviceRequests: Array<{ id: number; room: string; name: string; phone: string; message: string; status: 'Pending' | 'Replied'; reply?: string }> = [
    { id: 1, room: '101', name: 'John Doe', phone: '123-456-7890', message: 'I need more pillows.', status: 'Pending' },
    { id: 2, room: '205', name: 'Jane Smith', phone: '098-765-4321', message: 'The AC is not working.', status: 'Replied', reply: 'An engineer is on their way to your room.' },
];
let nextId = 3;


export async function getHotelInfoAction() {
    try {
        const hotelInfoToolResponse = `Hotel Name: Kaoud Hotel, Star Rating: 5 stars, Address: 123 Luxury Lane, Cairo, Egypt, Contact: reservations@kaoudhotel.com`;
        return { success: true, data: hotelInfoToolResponse };
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
        room: formData.get('roomNumber') as string,
        name: formData.get('name') as string,
        phone: formData.get('phone') as string,
        message: formData.get('message') as string,
    };

    // Simulate saving to database
    const newRequest = { id: nextId++, ...rawFormData, status: 'Pending' as const };
    serviceRequests.push(newRequest);
    revalidatePath('/admin');
    
    try {
        const hotelDetails = (await getHotelInfoAction()).data || '';
        const recommendations = await generateServiceRecommendations({
            guestRequest: rawFormData.message,
            hotelDetails: hotelDetails,
        });
        return { success: true, recommendations: recommendations.recommendations };
    } catch (error) {
        console.error("Error generating recommendations:", error);
        // Even if recommendations fail, the request was submitted, so we still return success.
        return { success: true, recommendations: [] };
    }
}

export async function getServiceRequestsAction() {
    // Simulate fetching from a database
    return serviceRequests.sort((a, b) => b.id - a.id);
}


export async function submitReplyAction(requestId: number, reply: string) {
    const request = serviceRequests.find(r => r.id === requestId);
    if (request) {
        request.status = 'Replied';
        request.reply = reply;
        revalidatePath('/admin');
        return { success: true, message: "Reply sent successfully." };
    }
    return { success: false, error: "Request not found." };
}
