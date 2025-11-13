'use server';

/**
 * @fileOverview This file contains a Genkit flow for synthesizing financial transactions using an LLM.
 * This is useful for bootstrapping datasets when real data is unavailable.
 *
 * It exports:
 * - `synthesizeTransactions`: An async function that generates transaction data.
 * - `SynthesizeTransactionsInput`: The input type for the function.
 * - `SynthesizeTransactionsOutput`: The output type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const SynthesizeTransactionsInputSchema = z.object({
  count: z.number().describe('The number of transactions to generate.'),
  category: z.string().describe('The category for which to generate transactions.'),
});
export type SynthesizeTransactionsInput = z.infer<typeof SynthesizeTransactionsInputSchema>;


const SyntheticTransactionSchema = z.object({
  description: z.string().describe('A realistic, varied merchant description for the transaction.'),
  amount: z.number().describe('A realistic transaction amount, as a positive number.'),
});

const SynthesizeTransactionsOutputSchema = z.object({
    transactions: z.array(SyntheticTransactionSchema).describe('An array of generated synthetic transactions.')
});
export type SynthesizeTransactionsOutput = z.infer<typeof SynthesizeTransactionsOutputSchema>;

export async function synthesizeTransactions(
  input: SynthesizeTransactionsInput
): Promise<SynthesizeTransactionsOutput> {
  return synthesizeTransactionsFlow(input);
}

const synthesizeTransactionsPrompt = ai.definePrompt({
  name: 'synthesizeTransactionsPrompt',
  input: { schema: SynthesizeTransactionsInputSchema },
  output: { schema: SynthesizeTransactionsOutputSchema },
  prompt: `You are an expert in creating synthetic financial data.
  Your task is to generate {{count}} realistic but fictional transaction records for the category: "{{category}}".

  - Create diverse and creative merchant descriptions. Include common variations, store numbers, and different phrasings.
  - Generate varied but plausible amounts for each transaction.
  - Return the data in the specified JSON format.

  Example for category "Food & Drink":
  - "STARBUCKS #12345"
  - "The Corner Cafe"
  - "MCDONALD'S F123"
  - "DOORDASH*TACO BELL"

  Your turn. Generate {{count}} transactions for the category "{{category}}".
  `,
});

const synthesizeTransactionsFlow = ai.defineFlow(
  {
    name: 'synthesizeTransactionsFlow',
    inputSchema: SynthesizeTransactionsInputSchema,
    outputSchema: SynthesizeTransactionsOutputSchema,
  },
  async (input) => {
    const { output } = await synthesizeTransactionsPrompt(input);
    return output!;
  }
);
