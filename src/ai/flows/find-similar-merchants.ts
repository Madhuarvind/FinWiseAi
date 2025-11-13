'use server';

/**
 * @fileOverview Simulates finding semantically similar merchants using dense retrieval.
 * This represents the output of a Siamese Network trained with Triplet Loss.
 *
 * - findSimilarMerchants - A function that returns a list of similar merchants.
 * - FindSimilarMerchantsInput - The input type for the function.
 * - FindSimilarMerchantsOutput - The output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const FindSimilarMerchantsInputSchema = z.object({
  merchantName: z.string().describe('The name of the merchant to find similarities for.'),
});
export type FindSimilarMerchantsInput = z.infer<typeof FindSimilarMerchantsInputSchema>;

const FindSimilarMerchantsOutputSchema = z.object({
  similarMerchants: z.array(z.string()).describe('An array of merchant names that are semantically similar to the input.'),
});
export type FindSimilarMerchantsOutput = z.infer<typeof FindSimilarMerchantsOutputSchema>;

export async function findSimilarMerchants(
  input: FindSimilarMerchantsInput
): Promise<FindSimilarMerchantsOutput> {
  return findSimilarMerchantsFlow(input);
}

const findSimilarMerchantsPrompt = ai.definePrompt({
  name: 'findSimilarMerchantsPrompt',
  input: { schema: FindSimilarMerchantsInputSchema },
  output: { schema: FindSimilarMerchantsOutputSchema },
  prompt: `You are a dense retrieval system (like one using a FAISS index) powered by a Siamese Network trained on merchant data.
  Your task is to find 3-4 semantically similar but varied merchant names for the given query. Include common misspellings or variations.
  
  Query: "{{merchantName}}"

  Example:
  - Query: "McDonald's"
  - Similar Merchants: ["MCDONALDS", "MacD", "mcdonalds 123"]
  
  Example:
  - Query: "AMAZON MKTPLACE"
  - Similar Merchants: ["AMZN Mktp US", "Amazon Web Services", "audible.com"]

  Your turn:
  `,
});

const findSimilarMerchantsFlow = ai.defineFlow(
  {
    name: 'findSimilarMerchantsFlow',
    inputSchema: FindSimilarMerchantsInputSchema,
    outputSchema: FindSimilarMerchantsOutputSchema,
  },
  async (input) => {
    const { output } = await findSimilarMerchantsPrompt(input);
    return output!;
  }
);
