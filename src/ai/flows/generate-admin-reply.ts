
'use server';
/**
 * @fileOverview An AI agent to generate helpful replies for hotel admin.
 *
 * - generateAdminReply - A function that suggests a reply to a guest's message.
 * - GenerateAdminReplyInput - The input type for the generateAdminReply function.
 * - GenerateAdminReplyOutput - The return type for the generateAdminReply function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAdminReplyInputSchema = z.object({
  guestMessage: z.string().describe("The guest's original message or request."),
});
export type GenerateAdminReplyInput = z.infer<typeof GenerateAdminReplyInputSchema>;

const GenerateAdminReplyOutputSchema = z.object({
  suggestedReply: z.string().describe('A polite and helpful suggested reply to the guest.'),
});
export type GenerateAdminReplyOutput = z.infer<typeof GenerateAdminReplyOutputSchema>;

export async function generateAdminReply(input: GenerateAdminReplyInput): Promise<GenerateAdminReplyOutput> {
  return generateAdminReplyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAdminReplyPrompt',
  input: {schema: GenerateAdminReplyInputSchema},
  output: {schema: GenerateAdminReplyOutputSchema},
  prompt: `You are an expert hotel manager at Kaoud Hotel. Your task is to draft a polite, professional, and helpful reply to a guest's message.

The reply should be in Arabic. Acknowledge the guest's message and provide a helpful response. If it's a complaint, be empathetic. If it's a request, confirm it's being handled.

Guest's Message:
"{{{guestMessage}}}"

Draft a suggested reply.`,
});

const generateAdminReplyFlow = ai.defineFlow(
  {
    name: 'generateAdminReplyFlow',
    inputSchema: GenerateAdminReplyInputSchema,
    outputSchema: GenerateAdminReplyOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
