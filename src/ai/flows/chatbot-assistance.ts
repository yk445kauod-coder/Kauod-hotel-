// This file is machine-generated - edit with caution!
'use server';
/**
 * @fileOverview A chatbot assistance AI agent for answering guest questions about the hotel.
 *
 * - chatbotAssistance - A function that handles the chatbot assistance process.
 * - ChatbotAssistanceInput - The input type for the chatbotAssistance function.
 * - ChatbotAssistanceOutput - The return type for the chatbotAssistance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatbotAssistanceInputSchema = z.object({
  query: z.string().describe('The guest\'s question or query.'),
});
export type ChatbotAssistanceInput = z.infer<typeof ChatbotAssistanceInputSchema>;

const ChatbotAssistanceOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s response to the guest.'),
});
export type ChatbotAssistanceOutput = z.infer<typeof ChatbotAssistanceOutputSchema>;

export async function chatbotAssistance(input: ChatbotAssistanceInput): Promise<ChatbotAssistanceOutput> {
  return chatbotAssistanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotAssistancePrompt',
  input: {schema: ChatbotAssistanceInputSchema},
  output: {schema: ChatbotAssistanceOutputSchema},
  prompt: `You are a chatbot assistant for the Kaoud Hotel. 
  
  This is the hotel information: Hotel Name: Kaoud Hotel, Star Rating: 5 stars, Address: 123 Luxury Lane, Cairo, Egypt, Contact: reservations@kaoudhotel.com.
  
  Use this information to answer guest questions accurately and concisely.
  
  User Query: {{{query}}}`,
});

const chatbotAssistanceFlow = ai.defineFlow(
  {
    name: 'chatbotAssistanceFlow',
    inputSchema: ChatbotAssistanceInputSchema,
    outputSchema: ChatbotAssistanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
