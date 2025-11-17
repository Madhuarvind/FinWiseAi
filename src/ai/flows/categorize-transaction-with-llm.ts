'use server';
/**
 * @fileOverview This file contains a Genkit flow for categorizing financial transactions using an LLM.
 *
 * The flow takes a transaction description and a confidence score as input.
 * If the confidence score is below a threshold, it uses an LLM to re-rank the predicted categories.
 *
 * @interface CategorizeTransactionWithLLMInput - The input type for the categorizeTransactionWithLLM function.
 * @interface CategorizeTransactionWithLLMOutput - The output type for the categorizeTransactionWithLLM function.
 * @function categorizeTransactionWithLLM - The main function that categorizes transactions using the LLM re-ranker.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeTransactionWithLLMInputSchema = z.object({
  transactionDescription: z.string().describe('The description of the transaction.'),
  confidenceScore: z.number().describe('The confidence score from the rule-based system.'),
  candidateCategories: z.array(z.string()).describe('Candidate categories from the rule-based system.'),
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

Transaction Description:
"{{{transactionDescription}}}"
  
Available Categories:
{{#each candidateCategories}}
- {{{this}}}
{{/each}}

Example:
- Description: "Amazon Mktplace"
- Your output should be "Shopping".

Return only the single best category name from the list.`,
});

const categorizeTransactionWithLLMFlow = ai.defineFlow(
  {
    name: 'categorizeTransactionWithLLMFlow',
    inputSchema: CategorizeTransactionWithLLMInputSchema,
    outputSchema: CategorizeTransactionWithLLMOutputSchema,
  },
  async input => {
    // This simulates the threshold for the symbolic, rule-based engine.
    const confidenceThreshold = 0.95; 

    // If confidence is high, use the "Fast Path": the top candidate from the symbolic engine.
    if (input.confidenceScore >= confidenceThreshold) {
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
