'use server';
/**
 * @fileOverview This file contains a Genkit flow for categorizing financial transactions using an LLM.
 *
 * The flow takes a transaction description and a confidence score as input.
 * If the confidence score is below a threshold, it uses an LLM to re-rank the predicted categories.
 * Otherwise, it uses a simulated local, LLM-free classifier.
 *
 * @interface CategorizeTransactionWithLLMInput - The input type for the categorizeTransactionWithLLM function.
 * @interface CategorizeTransactionWithLLMOutput - The output type for the categorizeTransactionWithLLM function.
 * @function categorizeTransactionWithLLM - The main function that categorizes transactions using the LLM re-ranker.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeTransactionWithLLMInputSchema = z.object({
  transactionDescription: z.string().describe('The description of the transaction.'),
  confidenceScore: z.number().describe('The confidence score from the initial local classifier.'),
  candidateCategories: z.array(z.string()).describe('A list of candidate categories.'),
});

export type CategorizeTransactionWithLLMInput = z.infer<typeof CategorizeTransactionWithLLMInputSchema>;

const CategorizeTransactionWithLLMOutputSchema = z.object({
  category: z.string().describe('The final category assigned to the transaction.'),
  llmReRanked: z.boolean().describe('Whether the LLM re-ranked the categories.'),
});

export type CategorizeTransactionWithLLMOutput = z.infer<typeof CategorizeTransactionWithLLMOutputSchema>;

export async function categorizeTransactionWithLLM(
  input: CategorizeTransactionWithLLMInput
): Promise<CategorizeTransactionWithLLMOutput> {
  return categorizeTransactionWithLLMFlow(input);
}

const categorizeTransactionPrompt = ai.definePrompt({
  name: 'categorizeTransactionPrompt',
  input: {schema: CategorizeTransactionWithLLMInputSchema},
  output: {schema: z.object({ category: z.string() })},
  prompt: `You are a meticulous financial analyst. Your task is to categorize a transaction based on its description by choosing the most logical category from the provided list. Pay close attention to merchant names.

Think step-by-step:
1.  Analyze the transaction description: "{{transactionDescription}}".
2.  Review the list of available categories.
3.  Select the single most appropriate category from the list.
4.  Your output MUST be one of the exact category names from the list provided.

Available Categories:
{{#each candidateCategories}}
- {{{this}}}
{{/each}}

Example:
- Description: "Amazon Mktplace"
- Your output must be "Shopping".

Return only the single best category name from the list.`,
});

const categorizeTransactionWithLLMFlow = ai.defineFlow(
  {
    name: 'categorizeTransactionWithLLMFlow',
    inputSchema: CategorizeTransactionWithLLMInputSchema,
    outputSchema: CategorizeTransactionWithLLMOutputSchema,
  },
  async input => {
    // This simulates the confidence threshold for the local, non-LLM classifier.
    const confidenceThreshold = 0.95; 

    // If confidence is high, use the "Fast Path": the top candidate from the local classifier.
    // This demonstrates the LLM-free local inference capability.
    if (input.confidenceScore >= confidenceThreshold) {
      // In a real implementation, this would involve a local model (e.g., embeddings + SVM).
      // Here, we simulate its output by taking the first candidate.
      return {
        category: input.candidateCategories[0] || 'Unknown',
        llmReRanked: false,
      };
    } else {
      // If confidence is low, use the "Slow Path": fallback to the neural LLM to re-rank/decide.
      const {output} = await categorizeTransactionPrompt(input);
      return {
        category: output!.category,
        llmReRanked: true, // Mark that the LLM was used.
      };
    }
  }
);
