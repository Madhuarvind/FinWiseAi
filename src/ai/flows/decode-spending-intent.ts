'use server';

/**
 * @fileOverview Decodes the likely user intent behind a financial transaction using contextual clues.
 *
 * - decodeSpendingIntent - A function that generates a human-friendly explanation of the spending intent.
 * - DecodeSpendingIntentInput - The input type for the function.
 * - DecodeSpendingIntentOutput - The output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const DecodeSpendingIntentInputSchema = z.object({
  description: z.string().describe('The transaction description.'),
  timeOfDay: z.enum(['Morning', 'Afternoon', 'Evening', 'Night']).describe('The time of day the transaction occurred.'),
  dayOfWeek: z.string().describe('The day of the week the transaction occurred (e.g., "Monday").'),
  category: z.string().describe('The assigned category of the transaction.'),
});
export type DecodeSpendingIntentInput = z.infer<typeof DecodeSpendingIntentInputSchema>;

const DecodeSpendingIntentOutputSchema = z.object({
  intent: z.string().describe('A short, human-friendly sentence describing the likely intent behind the purchase, including an emotional temperature score (0.0 to 1.0).'),
});
export type DecodeSpendingIntentOutput = z.infer<typeof DecodeSpendingIntentOutputSchema>;

export async function decodeSpendingIntent(
  input: DecodeSpendingIntentInput
): Promise<DecodeSpendingIntentOutput> {
  return decodeSpendingIntentFlow(input);
}

const decodeSpendingIntentPrompt = ai.definePrompt({
  name: 'decodeSpendingIntentPrompt',
  input: { schema: DecodeSpendingIntentInputSchema },
  output: { schema: DecodeSpendingIntentOutputSchema },
  prompt: `You are an expert at inferring consumer spending intent. Based on the transaction details, generate a short, insightful sentence about the likely motivation for this purchase and include an "emotional temperature" score (0.0 = purely rational, 1.0 = highly impulsive).

Consider the context:
- A {{timeOfDay}} purchase on a {{dayOfWeek}} at "{{description}}" in the "{{category}}" category.

Example Intents:
- "This looks like a routine morning coffee purchase. Emotional Temperature: 0.2"
- "This appears to be a recurring monthly subscription. Emotional Temperature: 0.1"
- "This seems to be a weekend dining-out expense with friends. Emotional Temperature: 0.6"
- "This late-night purchase resembles an impulsive online shopping spree. Emotional Temperature: 0.9"

Your turn. Generate the intent statement:
`,
});

const decodeSpendingIntentFlow = ai.defineFlow(
  {
    name: 'decodeSpendingIntentFlow',
    inputSchema: DecodeSpendingIntentInputSchema,
    outputSchema: DecodeSpendingIntentOutputSchema,
  },
  async (input) => {
    const { output } = await decodeSpendingIntentPrompt(input);
    return output!;
  }
);
