// src/ai/flows/suggest-transaction-categories.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow that suggests transaction categories based on transaction descriptions.
 *
 * It exports:
 * - `suggestTransactionCategories`: An async function that takes a transaction description as input and returns a list of suggested categories.
 * - `SuggestTransactionCategoriesInput`: The input type for the suggestTransactionCategories function, which is a string representing the transaction description.
 * - `SuggestTransactionCategoriesOutput`: The output type for the suggestTransactionCategories function, which is an array of strings representing the suggested categories.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTransactionCategoriesInputSchema = z.string().describe('A prompt containing examples of uncategorized transaction descriptions.');
export type SuggestTransactionCategoriesInput = z.infer<typeof SuggestTransactionCategoriesInputSchema>;

const SuggestTransactionCategoriesOutputSchema = z.array(z.string()).describe('An array of 2-4 suggested transaction category names based on the examples.');
export type SuggestTransactionCategoriesOutput = z.infer<typeof SuggestTransactionCategoriesOutputSchema>;

export async function suggestTransactionCategories(input: SuggestTransactionCategoriesInput): Promise<SuggestTransactionCategoriesOutput> {
  return suggestTransactionCategoriesFlow(input);
}

const suggestTransactionCategoriesPrompt = ai.definePrompt({
  name: 'suggestTransactionCategoriesPrompt',
  input: {schema: SuggestTransactionCategoriesInputSchema},
  output: {schema: SuggestTransactionCategoriesOutputSchema},
  prompt: `You are an expert at financial taxonomy creation. Based on the following examples of transactions, suggest 2-4 new, concise category names.
  
Do not suggest categories that are too broad (like "Entertainment") if a more specific one (like "Streaming Services") is better.
Do not suggest categories that are too specific if a broader one is more applicable.

Return a JSON array of strings.

Transaction Examples:
"{{{$input}}}"`,
});

const suggestTransactionCategoriesFlow = ai.defineFlow(
  {
    name: 'suggestTransactionCategoriesFlow',
    inputSchema: SuggestTransactionCategoriesInputSchema,
    outputSchema: SuggestTransactionCategoriesOutputSchema,
  },
  async input => {
    const {output} = await suggestTransactionCategoriesPrompt(input);
    return output!;
  }
);
