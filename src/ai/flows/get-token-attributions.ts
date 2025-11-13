'use server';

/**
 * @fileOverview Simulates token-level attributions for a transaction description.
 * It identifies and returns the key terms that influenced the classification.
 *
 * - getTokenAttributions - A function that returns influential words.
 * - GetTokenAttributionsInput - The input type for the function.
 * - GetTokenAttributionsOutput - The output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GetTokenAttributionsInputSchema = z.object({
  transactionDescription: z.string().describe('The transaction description.'),
  category: z.string().describe('The category it was classified into.'),
});
export type GetTokenAttributionsInput = z.infer<typeof GetTokenAttributionsInputSchema>;

const GetTokenAttributionsOutputSchema = z.object({
  influentialWords: z.array(z.string()).describe('An array of words from the description that were most influential for the classification.'),
});
export type GetTokenAttributionsOutput = z.infer<typeof GetTokenAttributionsOutputSchema>;

export async function getTokenAttributions(
  input: GetTokenAttributionsInput
): Promise<GetTokenAttributionsOutput> {
  return getTokenAttributionsFlow(input);
}

const getTokenAttributionsPrompt = ai.definePrompt({
  name: 'getTokenAttributionsPrompt',
  input: { schema: GetTokenAttributionsInputSchema },
  output: { schema: GetTokenAttributionsOutputSchema },
  prompt: `You are an XAI (Explainable AI) system that performs token-level attribution.
  Analyze the transaction description "{{transactionDescription}}" which was classified as "{{category}}".

  Identify and return a list of the most important words (tokens) in the description that led to this classification.
  Return only the most critical 1-3 words.

  Example:
  - Description: "AMAZON MKTPLACE PMTS"
  - Category: "Shopping"
  - Influential Words: ["amazon", "mktplace"]
  
  Example:
  - Description: "SHELL FUEL 1234"
  - Category: "Transport"
  - Influential Words: ["shell", "fuel"]

  Your turn:
  `,
});

const getTokenAttributionsFlow = ai.defineFlow(
  {
    name: 'getTokenAttributionsFlow',
    inputSchema: GetTokenAttributionsInputSchema,
    outputSchema: GetTokenAttributionsOutputSchema,
  },
  async (input) => {
    const { output } = await getTokenAttributionsPrompt(input);
    return output!;
  }
);
