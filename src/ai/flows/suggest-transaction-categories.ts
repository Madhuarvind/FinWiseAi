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

const SuggestTransactionCategoriesInputSchema = z.string().describe('The transaction description to suggest categories for.');
export type SuggestTransactionCategoriesInput = z.infer<typeof SuggestTransactionCategoriesInputSchema>;

const SuggestTransactionCategoriesOutputSchema = z.array(z.string()).describe('An array of suggested transaction categories.');
export type SuggestTransactionCategoriesOutput = z.infer<typeof SuggestTransactionCategoriesOutputSchema>;

export async function suggestTransactionCategories(input: SuggestTransactionCategoriesInput): Promise<SuggestTransactionCategoriesOutput> {
  return suggestTransactionCategoriesFlow(input);
}

const suggestTransactionCategoriesPrompt = ai.definePrompt({
  name: 'suggestTransactionCategoriesPrompt',
  input: {schema: SuggestTransactionCategoriesInputSchema},
  output: {schema: SuggestTransactionCategoriesOutputSchema},
  prompt: `Suggest transaction categories for the following transaction description. Return a JSON array of strings.

Transaction Description: {{{$input}}}`, // Use {{$input}} to reference the entire input string
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
