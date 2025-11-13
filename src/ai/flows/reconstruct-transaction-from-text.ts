'use server';

/**
 * @fileOverview Parses unstructured text to extract structured transaction data.
 *
 * - reconstructTransactionFromText - A function that pulls details from a string.
 * - ReconstructTransactionInput - The input type (the unstructured text).
 * - ReconstructTransactionOutput - The output type (structured transaction object).
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const ReconstructTransactionInputSchema = z.string().describe('A piece of unstructured text describing a financial transaction.');
export type ReconstructTransactionInput = z.infer<typeof ReconstructTransactionInputSchema>;

const ReconstructTransactionOutputSchema = z.object({
  description: z.string().describe('The extracted merchant name or description.'),
  amount: z.number().describe('The extracted monetary amount.'),
  date: z.string().format('date-time').describe('The extracted date of the transaction in ISO 8601 format.'),
});
export type ReconstructTransactionOutput = z.infer<typeof ReconstructTransactionOutputSchema>;

export async function reconstructTransactionFromText(
  input: ReconstructTransactionInput
): Promise<ReconstructTransactionOutput> {
  return reconstructTransactionFlow(input);
}

const reconstructTransactionPrompt = ai.definePrompt({
  name: 'reconstructTransactionPrompt',
  input: { schema: ReconstructTransactionInputSchema },
  output: { schema: ReconstructTransactionOutputSchema },
  prompt: `You are an expert at parsing unstructured text into structured financial data.
  Analyze the following text and extract the transaction description, amount, and date.
  - The currency is INR (₹), but the text may not specify it.
  - The date might be relative (like 'yesterday' or 'last Tuesday'). Assume today's date is ${new Date().toISOString().split('T')[0]}.
  - Be precise.

  Example 1:
  Text: "Just paid back John for pizza, it was 450 on July 23rd"
  Output: { "description": "Pizza with John", "amount": 450, "date": "2024-07-23T00:00:00.000Z" }

  Example 2:
  Text: "Your order #1234 from AMAZON for a new book is confirmed. Total: 899. Will be delivered tomorrow."
  Output: { "description": "AMAZON book order", "amount": 899, "date": "${new Date(Date.now() - 86400000).toISOString()}" }
  
  Example 3:
  Text: "Movie tickets for this Friday night - 1200 rupees"
  Output: { "description": "Movie tickets", "amount": 1200, "date": "${new Date().toISOString()}" }

  Your turn. Parse the following text:
  "{{{$input}}}"
  `,
});

const reconstructTransactionFlow = ai.defineFlow(
  {
    name: 'reconstructTransactionFlow',
    inputSchema: ReconstructTransactionInputSchema,
    outputSchema: ReconstructTransactionOutputSchema,
  },
  async (input) => {
    const { output } = await reconstructTransactionPrompt(input);
    return output!;
  }
);
