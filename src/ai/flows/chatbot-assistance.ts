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
  prompt: `You are a helpful and friendly chatbot assistant for the Kaoud Hotel in Alexandria, Egypt.

Hotel Information:
- Name: Kaoud Hotel (فندق قاعود)
- Stars: Three Stars (ثلاث نجوم)
- Address: 133 El Geish Road, Sporting, Alexandria, Egypt (133 طريق الجيش، سبورتنج، الإسكندرية، مصر)
- Booking Manager: Mr. Mohamed Magdy (أ/محمد مجدي)
- Booking Phone: 01226424581
- Other Phones: 035443800, 035434513, 035431008
- Internal Numbers: Reception: 200, Room Service: 444, Laundry: 888, Maintenance: 990, Security: 500, Housekeeping: 666

Your primary goal is to answer guest questions based on the provided information. Be concise, polite, and helpful. If a guest asks a question you cannot answer with the information above, politely say that you don't have the information and recommend they call reception at extension 200.

Answer in the same language as the user's query.

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
