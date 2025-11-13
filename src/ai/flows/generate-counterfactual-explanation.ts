'use server';

/**
 * @fileOverview Generates a counterfactual explanation for a transaction classification.
 * It explains what would need to change for the transaction to be classified differently.
 *
 * - generateCounterfactualExplanation - A function that generates the counterfactual.
 * - GenerateCounterfactualExplanationInput - The input type for the function.
 * - GenerateCounterfactualExplanationOutput - The output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateCounterfactualExplanationInputSchema = z.object({
  transactionDescription: z.string().describe('The original transaction description.'),
  originalCategory: z.string().describe('The category it was originally classified into.'),
  targetCategory: z.string().describe('A plausible alternative category.'),
});
export type GenerateCounterfactualExplanationInput = z.infer<typeof GenerateCounterfactualExplanationInputSchema>;

const GenerateCounterfactualExplanationOutputSchema = z.object({
  counterfactualExplanation: z.string().describe('A short explanation of what would need to change in the description for it to be classified as the target category.'),
});
export type GenerateCounterfactualExplanationOutput = z.infer<typeof GenerateCounterfactualExplanationOutputSchema>;

export async function generateCounterfactualExplanation(
  input: GenerateCounterfactualExplanationInput
): Promise<GenerateCounterfactualExplanationOutput> {
  return generateCounterfactualExplanationFlow(input);
}

const generateCounterfactualPrompt = ai.definePrompt({
  name: 'generateCounterfactualPrompt',
  input: { schema: GenerateCounterfactualExplanationInputSchema },
  output: { schema: GenerateCounterfactualExplanationOutputSchema },
  prompt: `You are an XAI (Explainable AI) expert.
  A financial transaction with the description "{{transactionDescription}}" was classified as "{{originalCategory}}".
  
  Generate a simple, one-sentence counterfactual explanation answering: "What would need to change for it to be classified as '{{targetCategory}}' instead?"

  Example:
  - Original: "STARBUCKS COFFEE", classified as "Food & Drink". Target: "Shopping".
  - Counterfactual: "If the description had included terms like 'gift card' or 'merchandise', it might have been classified as Shopping."

  Your turn:
  `,
});

const generateCounterfactualExplanationFlow = ai.defineFlow(
  {
    name: 'generateCounterfactualExplanationFlow',
    inputSchema: GenerateCounterfactualExplanationInputSchema,
    outputSchema: GenerateCounterfactualExplanationOutputSchema,
  },
  async (input) => {
    const { output } = await generateCounterfactualPrompt(input);
    return output!;
  }
);
