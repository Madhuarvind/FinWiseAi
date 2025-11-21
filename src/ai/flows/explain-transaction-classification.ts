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
  transactionDescription: z.string().describe('The description of the transaction to be classified. This may be a raw description or an anonymized vector representation.'),
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

If the description looks like an anonymized vector (e.g., "S-DNA=..."), explain what that vector represents in simple terms.

Transaction Description: "{{{transactionDescription}}}"
Category: "{{{predictedCategory}}}"

Example Story 1 (Normal Description):
"This looks like your usual morning coffee run. You seem to make this purchase on most weekday mornings, and the price is consistent with your typical order."

Example Story 2 (Anonymized Vector):
"This anonymized vector represents a low-value, routine purchase, likely from a coffee shop during a weekday morning. It fits the pattern of a daily habit."

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
