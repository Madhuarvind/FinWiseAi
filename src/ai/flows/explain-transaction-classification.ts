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
  prompt: `You are a Causal AI expert. Your task is to explain why a transaction was classified into a specific category by identifying the causal factors in its description.

Transaction Description: {{{transactionDescription}}}
Predicted Category: {{{predictedCategory}}}

Based on the description, explain what specific words or phrases *caused* the model to choose the "{{predictedCategory}}" category. Frame your answer in terms of causal impact, not just correlation. For example, "The presence of 'coffee' strongly caused this to be classified as Food & Drink."`, 
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
