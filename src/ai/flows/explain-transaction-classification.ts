'use server';

/**
 * @fileOverview Explains transaction classifications using LLMs, highlighting the key factors and reasoning behind each decision.
 *
 * - explainTransactionClassification - A function that handles the transaction classification explanation process.
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
  explanation: z.string().describe('The explanation of why the transaction was classified as it was.'),
});

export type ExplainTransactionClassificationOutput = z.infer<typeof ExplainTransactionClassificationOutputSchema>;

export async function explainTransactionClassification(input: ExplainTransactionClassificationInput): Promise<ExplainTransactionClassificationOutput> {
  return explainTransactionClassificationFlow(input);
}

const explainTransactionClassificationPrompt = ai.definePrompt({
  name: 'explainTransactionClassificationPrompt',
  input: {schema: ExplainTransactionClassificationInputSchema},
  output: {schema: ExplainTransactionClassificationOutputSchema},
  prompt: `You are an expert financial analyst. You are responsible for explaining why a transaction was classified as a particular category.

Transaction Description: {{{transactionDescription}}}
Predicted Category: {{{predictedCategory}}}
Confidence Score: {{{confidenceScore}}}

Explain why the transaction was classified as {{{predictedCategory}}}, taking into account the transaction description and confidence score. Provide a concise and easy-to-understand explanation.`, 
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
