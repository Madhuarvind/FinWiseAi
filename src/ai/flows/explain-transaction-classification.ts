'use server';

/**
 * @fileOverview Generates a human-like story for a transaction, explaining the context and user's likely behavior.
 *
 * - explainTransactionClassification - A function that handles the transaction story generation process.
 * - ExplainTransactionClassificationInput - The input type for the explainTransactionClassification function.
 * - ExplainTransactionClassificationOutput - The return type for the explainTransactionClassification function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainTransactionClassificationInputSchema = z.object({
  transactionDescription: z.string().describe('The description of the transaction to be classified.'),
  predictedCategory: z.string().describe('The category the transaction was predicted to belong to.'),
  confidenceScore: z.number().describe('The confidence score of the classification.'),
});

export type ExplainTransactionClassificationInput = z.infer<typeof ExplainTransactionClassificationInputSchema>;

const ExplainTransactionClassificationOutputSchema = z.object({
  explanation: z.string().describe('A short, 2-3 line story explaining the transaction in a human-like way.'),
});

export type ExplainTransactionClassificationOutput = z.infer<typeof ExplainTransactionClassificationOutputSchema>;

export async function explainTransactionClassification(input: ExplainTransactionClassificationInput): Promise<ExplainTransactionClassificationOutput> {
  return explainTransactionClassificationFlow(input);
}

const explainTransactionClassificationPrompt = ai.definePrompt({
  name: 'explainTransactionClassificationPrompt',
  input: {schema: ExplainTransactionClassificationInputSchema},
  output: {schema: ExplainTransactionClassificationOutputSchema},
  prompt: `You are an empathetic financial AI companion. Your goal is to explain a transaction to a user in the form of a short, 2-3 line story. Be personal and insightful, as if you understand their habits.

Transaction Description: "{{{transactionDescription}}}"
Category: "{{{predictedCategory}}}"

Use contextual clues. Is it a weekday morning? A weekend? Does the merchant suggest a routine (like coffee) or a one-off purchase?

Example Story 1:
"This looks like your usual morning coffee run. You seem to make this purchase on most weekday mornings, and the price is consistent with your typical order."

Example Story 2:
"This appears to be an online retail order. It's similar to your other festive-season purchases, and it looks like you bought it during a major sale event."

Your turn. Generate the transaction story.`, 
});

const explainTransactionClassificationFlow = ai.defineFlow(
  {
    name: 'explainTransactionClassificationFlow',
    inputSchema: ExplainTransactionClassificationInputSchema,
    outputSchema: ExplainTransactionClassificationOutputSchema,
  },
  async input => {
    const {output} = await explainTransactionClassificationPrompt(input);
    return output!;
  }
);
