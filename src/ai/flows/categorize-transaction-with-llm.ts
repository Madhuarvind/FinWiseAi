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
  output: {schema: CategorizeTransactionWithLLMOutputSchema},
  prompt: `You are a financial expert tasked with categorizing transactions.

  The following is the transaction description: {{{transactionDescription}}}
  The following are candidate categories and whether they are likely (the higher the number, the more likely):
  {{#each candidateCategories}}
  - {{{this}}}
  {{/each}}

  Based on the transaction description and the candidate categories, choose the most appropriate category. Justify your choice briefly. Return the category in the format specified in the output schema.
  `,
});

const categorizeTransactionWithLLMFlow = ai.defineFlow(
  {
    name: 'categorizeTransactionWithLLMFlow',
    inputSchema: CategorizeTransactionWithLLMInputSchema,
    outputSchema: CategorizeTransactionWithLLMOutputSchema,
  },
  async input => {
    const confidenceThreshold = 0.75; // Example threshold, can be adjusted

    if (input.confidenceScore < confidenceThreshold) {
      const {output} = await categorizeTransactionPrompt(input);
      return {
        category: output!.category,
        llmReRanked: true,
      };
    } else {
      return {
        category: input.candidateCategories[0] || 'Unknown',
        llmReRanked: false,
      };
    }
  }
);
