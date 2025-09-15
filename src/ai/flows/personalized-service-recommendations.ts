// src/ai/flows/personalized-service-recommendations.ts
'use server';

/**
 * @fileOverview Provides personalized service recommendations based on guest requests and hotel offerings.
 *
 * - generateServiceRecommendations - A function that generates personalized service recommendations.
 * - ServiceRecommendationInput - The input type for the generateServiceRecommendations function.
 * - ServiceRecommendationOutput - The return type for the generateServiceRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ServiceRecommendationInputSchema = z.object({
  guestRequest: z.string().describe('The guest\'s service request or query.'),
  hotelDetails: z.string().describe('Details about the hotel, its services, and amenities.'),
});

export type ServiceRecommendationInput = z.infer<typeof ServiceRecommendationInputSchema>;

const ServiceRecommendationOutputSchema = z.object({
  recommendations: z.array(z.string()).describe('An array of personalized service recommendations.'),
});

export type ServiceRecommendationOutput = z.infer<typeof ServiceRecommendationOutputSchema>;

export async function generateServiceRecommendations(input: ServiceRecommendationInput): Promise<ServiceRecommendationOutput> {
  return serviceRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'serviceRecommendationPrompt',
  input: {schema: ServiceRecommendationInputSchema},
  output: {schema: ServiceRecommendationOutputSchema},
  prompt: `You are a hotel concierge AI assistant. A guest has made a request, and you need to provide personalized service recommendations based on their request and the available hotel services.

Guest Request: {{{guestRequest}}}

Hotel Details: {{{hotelDetails}}}

Provide a list of service recommendations that would be most helpful to the guest. List at least 3 recommendations.

{{#each recommendations}} - {{{this}}}\n {{/each}}`,
});

const serviceRecommendationFlow = ai.defineFlow(
  {
    name: 'serviceRecommendationFlow',
    inputSchema: ServiceRecommendationInputSchema,
    outputSchema: ServiceRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
